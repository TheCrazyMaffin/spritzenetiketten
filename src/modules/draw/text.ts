import { LabelText } from "@/modules/data-schema/text";
import { Coords } from "@/modules/draw/coords";
import { Drawable } from "@/modules/draw/shape";
import { RenderingContext2D } from "@/modules/util";

type TextPart = NonNullable<LabelText>[number]

/** Used for parts without a size attribute. Sizes are relative since every line is scaled to fit its space. */
export const defaultFontSize = 50
/** Used for parts without a weight attribute. */
export const defaultFontWeight = 500
/** Registered by @fontsource-variable/roboto-condensed. Variable font, so every weight comes from the same file. */
export const fontFamily = "Roboto Condensed Variable"

/**
 * Parts with an explicit color attribute are painted in that color and ignore the textBackgroundFill.
 */
export function hasOwnColor(part: TextPart) {
    return typeof part.attributes?.["color"] === "string"
}

export class Text implements Drawable {
    lines: NonNullable<LabelText>[] = [[]]
    coords: Coords
    textAlign: 'center' | 'left' | 'right' = 'center'

    constructor(text: NonNullable<LabelText>, coords: Coords) {
        this.coords = coords
        text.forEach(part => {
            const lineSplit = part.insert.split("\n")
            /*
            Will always have at least one element. Even an empty strings yields one empty string as split result.
            However if string is empty theres nothing to draw so dont add it. Might also be a \n at the start of the string.
            */
            const first = lineSplit.shift()!
            if (first !== "") {
                this.lines[this.lines.length - 1].push({
                    ...part,
                    insert: first,
                })
            }
            /* All remaining elements are a new line each. */
            lineSplit.forEach(line => {
                this.lines.push([])
                /* ...but if the \n is at the end of the string there will be an empty string as last element. Start a new line and dont add anything to it in that case. */
                if (line !== "") {
                    this.lines[this.lines.length - 1].push({
                        ...part,
                        insert: line,
                    })
                }
            })
        })
    }

    _setAttributes(ctx: RenderingContext2D, attr: NonNullable<LabelText>[number]["attributes"]) {
        const fontSize = typeof attr?.["size"] === "number" ? attr["size"] : defaultFontSize
        const fontWeight = typeof attr?.["weight"] === "number" ? attr["weight"] : defaultFontWeight
        ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}"`
    }

    /**
     * Vertical offset of a part relative to the line's baseline.
     * "top" / "bottom" move the part so its top / bottom edge touches the top / bottom edge of the line.
     * Anything else (including unset) is treated as "baseline" and keeps the part on the line's baseline.
     */
    _verticalAlignOffset(part: { attributes?: TextPart["attributes"], ascent: number, descent: number }, total: { ascent: number, descent: number }) {
        switch (part.attributes?.["vertical-align"]) {
            case "top":
                // Negative, moves the part up until its ascent matches the line's ascent.
                return part.ascent - total.ascent
            case "bottom":
                // Positive, moves the part down until its descent matches the line's descent.
                return total.descent - part.descent
            default:
                return 0
        }
    }

    _measureLine(ctx: RenderingContext2D, text: NonNullable<LabelText>) {
        /*
        Baseline alphabetic is required because this way the same y coordinate can be used to draw the text parts,
        even if theres differences in ascenders and descenders.
        Example: With baseline bottom and text parts "hello", "queue" the bottom part of the hello would be aligned with the bottom of the q descender
        */
        ctx.textBaseline = "alphabetic"
        ctx.textAlign = "start"
        const totalMeasurements = {
            width: 0,
            height: 0,
            ascent: 0,
            descent: 0,
        }
        const measured = text.map(part => {
            this._setAttributes(ctx, part.attributes)
            const measurement = ctx.measureText(part.insert)
            const width = measurement.width
            /*
            See mdn docs: For italic characters using boxLeft + boxRight might be better but that excludes the spacing around letters so it leads to letters next to each other without spacing.
            */
            // const width = measurement.actualBoundingBoxLeft + measurement.actualBoundingBoxRight
            const ascent = measurement.actualBoundingBoxAscent // * 1.05
            const descent = measurement.actualBoundingBoxDescent // * 1.05
            /*
            The text measurements used to be slightly incorrect (or some other culprit) which caused visible clipping. Thats where the + 5 % comes from but in current testing does not seem to be needed.
            Maybe also a old chromium problem?
            */
            const height = ascent + descent
            if (totalMeasurements.descent < descent) {
                totalMeasurements.descent = descent
            }
            if (totalMeasurements.ascent < ascent) {
                totalMeasurements.ascent = ascent
            }
            totalMeasurements.width += width
            return {
                ...part,
                ascent,
                descent,
                height,
                width,
                xOffset: totalMeasurements.width - width,
            }
        })
        totalMeasurements.height = totalMeasurements.ascent + totalMeasurements.descent
        return {
            total: totalMeasurements,
            parts: measured
        }
    }

    /**
     * @param partFilter Only parts matching it are drawn. All parts are still measured, so the layout stays the same
     * no matter which parts are drawn. Allows drawing a text in multiple passes (e.g. masked and unmasked parts).
     */
    draw(ctx: RenderingContext2D, partFilter: (part: TextPart) => boolean = () => true) {
        const numLines = this.lines.length
        const lineSpacing = 1
        const heightPerLine = (this.coords.height - lineSpacing * (numLines - 1)) / numLines
        this.lines.forEach((line, lineIndex) => {
            const lineMeasurements = this._measureLine(ctx, line)
            const yScale = (heightPerLine / lineMeasurements.total.height)
            const xScale = Math.min(this.coords.width / lineMeasurements.total.width, yScale)
            const yOffset = lineIndex * (heightPerLine + lineSpacing)
            const freeSpaceWidth = this.coords.width - lineMeasurements.total.width * xScale
            const xOffset = this.textAlign === 'left' ? 0 : this.textAlign === 'right' ? freeSpaceWidth : freeSpaceWidth / 2
            // Draw directly onto ctx instead of an intermediate canvas. That canvas would be rasterized in unscaled
            // coordinate units and then upscaled by the scene transform, which makes the text blurry.
            const defaultFillStyle = ctx.fillStyle
            ctx.save()
            ctx.translate(xOffset + this.coords.tl.x, yOffset + this.coords.tl.y)
            ctx.scale(xScale, yScale)
            ctx.textBaseline = "alphabetic"
            ctx.textAlign = "start"
            lineMeasurements.parts.filter(partFilter).forEach(part => {
                this._setAttributes(ctx, part.attributes)
                ctx.fillStyle = hasOwnColor(part) ? part.attributes!["color"] as string : defaultFillStyle
                const y = lineMeasurements.total.ascent + this._verticalAlignOffset(part, lineMeasurements.total)
                ctx.fillText(part.insert, part.xOffset, y)
            })
            ctx.restore()
        })
    }
}