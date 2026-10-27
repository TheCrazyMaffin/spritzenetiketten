import { LabelComposition } from "@/modules/data-schema/directory"
import { Coords } from "@/modules/draw/coords"
import { Scene } from "@/modules/draw/scene"
import { Drawable } from "@/modules/draw/shape"
import background from "@/modules/template-processors/background"
import border from "@/modules/template-processors/border"
import divider from "@/modules/template-processors/divider"
import text from "@/modules/template-processors/text"
import { MakeRequired } from "@/modules/util"

export type LabelCompositionWithDefaults = MakeRequired<LabelComposition, "aspectRatio" | "borderSize" | "layout" | "roundedEdges" | "textBackgroundFill">

/**
 * Takes a label composition (the raw label data) 
 * and turns it into a label template (specific drawing instructions) 
 * using template processors. (For destructuring the drawing process into small parts.)
 * 
 */
export class LabelTemplate {
  static templateProcessors: TemplateProcessor[] = [
    background,
    border,
    divider,
    text
  ]
  /** Values used for properties the composition doesn't define. */
  static readonly defaults: Pick<LabelCompositionWithDefaults, "aspectRatio" | "borderSize" | "layout" | "roundedEdges" | "textBackgroundFill"> = {
    aspectRatio: 2.5,
    borderSize: 0,
    layout: 'small',
    roundedEdges: 2,
    textBackgroundFill: { solid: 'black' },
  }
  readonly composition: LabelCompositionWithDefaults
  readonly drawables: Drawable[] = []
  readonly coords: Coords

  constructor(composition: LabelComposition) {
    // Defaults are applied after spreading so keys that exist but are undefined still get a default.
    const compositionWithDefaults = {
      ...composition,
      aspectRatio: composition.aspectRatio ?? LabelTemplate.defaults.aspectRatio,
      borderSize: composition.borderSize ?? LabelTemplate.defaults.borderSize,
      layout: composition.layout ?? LabelTemplate.defaults.layout,
      roundedEdges: composition.roundedEdges ?? LabelTemplate.defaults.roundedEdges,
      textBackgroundFill: composition.textBackgroundFill ?? LabelTemplate.defaults.textBackgroundFill,
    }
    this.composition = compositionWithDefaults
    // This sets the default size which all components are relative to!
    // borderSize: 2 is 2% out of 100. If this is changed sizes WILL change!
    this.coords = new Coords({
      width: 100,
      height: 100 / this.composition.aspectRatio
    })
    LabelTemplate.templateProcessors.forEach(processor => {
      for (const shape of processor(this.composition, this.coords)) {
        this.drawables.push(shape)
      }
    })
  }

  static borderPadding(composition: LabelCompositionWithDefaults) {
    return {
      left: composition.borderSides?.left ? composition.borderSize : 0,
      top: composition.borderSides?.top ? composition.borderSize : 0,
      right: composition.borderSides?.right ? composition.borderSize : 0,
      bottom: composition.borderSides?.bottom ? composition.borderSize : 0,
    };
  }

  get borderPadding() {
    return LabelTemplate.borderPadding(this.composition)
  }

  /** Pixel size of the canvas toCanvas(width) returns. Lets the size be reserved before the label is drawn. */
  static canvasSize(aspectRatio: number, width: number) {
    return { width, height: Math.round(width / aspectRatio) }
  }

  toCanvas(width = 100) {
    const size = LabelTemplate.canvasSize(this.composition.aspectRatio, width)
    const scene = new Scene(size.width, size.height, width / this.coords.width)
    scene.draw(...this.drawables)
    return scene.ctx.canvas
  }
}

export type TemplateProcessor = (composition: LabelCompositionWithDefaults, coords: Coords) => Iterable<Drawable>