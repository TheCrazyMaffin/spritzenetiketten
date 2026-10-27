import { LabelText } from "@/modules/data-schema/text"
import { defaultFontSize } from "@/modules/draw/text"
import Quill, { Delta, Parchment } from "quill/core"
import { ColorStyle } from "quill/formats/color"

/**
 * Inline style attributor whose value is a number in the label data but a CSS string in the DOM.
 */
class NumberStyleAttributor extends Parchment.StyleAttributor {
  toCss: (value: number) => string
  fromCss: (value: string) => number

  constructor(attrName: string, keyName: string, toCss: (value: number) => string, fromCss: (value: string) => number) {
    super(attrName, keyName, { scope: Parchment.Scope.INLINE })
    this.toCss = toCss
    this.fromCss = fromCss
  }

  add(node: HTMLElement, value: unknown) {
    const number = typeof value === "number" ? value : parseFloat(String(value))
    if (!Number.isFinite(number)) return false
    return super.add(node, this.toCss(number))
  }

  value(node: HTMLElement) {
    const number = this.fromCss(super.value(node))
    return Number.isFinite(number) ? number : undefined
  }
}

/** The text attributes the label renderer understands (see Text in draw/text.ts). */
export const labelTextFormats = ["size", "weight", "vertical-align", "color"]

Quill.register({
  // Sizes are relative to the default size, so they are displayed relative to the editor's font size.
  // The difference is halved (default = 1em, half size = 0.75em), otherwise small sizes would be unreadable in the editor.
  "formats/size": new NumberStyleAttributor(
    "size",
    "font-size",
    value => `${0.5 + value / defaultFontSize / 2}em`,
    css => css.endsWith("em") ? Math.round((parseFloat(css) - 0.5) * 2 * defaultFontSize * 100) / 100 : NaN,
  ),
  "formats/weight": new NumberStyleAttributor("weight", "font-weight", value => String(value), css => parseInt(css)),
  "formats/vertical-align": new Parchment.StyleAttributor("vertical-align", "vertical-align", {
    scope: Parchment.Scope.INLINE,
    whitelist: ["top", "bottom"],
  }),
  "formats/color": ColorStyle,
}, true)

export function labelTextToDelta(text: LabelText) {
  return new Delta(text ?? [])
}

export function deltaToLabelText(delta: Delta): LabelText {
  const text: NonNullable<LabelText> = []
  for (const op of delta.ops) {
    if (typeof op.insert !== "string") continue
    const part: NonNullable<LabelText>[number] = { insert: op.insert }
    if (op.attributes && Object.keys(op.attributes).length > 0) {
      part.attributes = op.attributes as NonNullable<LabelText>[number]["attributes"]
    }
    text.push(part)
  }
  // Quill always ends the document with a newline. For labels it would add an empty line.
  const last = text.at(-1)
  if (last?.insert.endsWith("\n")) {
    last.insert = last.insert.slice(0, -1)
    if (last.insert === "") text.pop()
  }
  return text.length > 0 ? text : undefined
}

export { Quill, Delta }
