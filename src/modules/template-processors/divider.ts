import { Point } from "@/modules/draw/coords"
import { LabelTemplate, TemplateProcessor } from "@/modules/draw/label-template"
import { Rect } from "../draw/rect"

const divider: TemplateProcessor = function* (composition, coords) {
    const baseRect = new Rect(coords.tl, coords.br, composition.roundedEdges)
    if (composition.layout === "line") {
        const tc = Point.center(coords.tl, coords.tr)
        const bc = Point.center(coords.bl, coords.br)
        const divider = new Rect(tc.move(new Point(-0.5, 0)), bc.move(new Point(0.5, 0)))
        divider.fillStyle = "black"
        divider.clip = baseRect.path
        yield divider
    }
    if (composition.midline) {
        let innerCoords = coords.withPadding(LabelTemplate.borderPadding(composition))
        innerCoords = innerCoords.withPadding({ left: 2, right: 2 })
        const lc = composition.layout === "large" || composition.layout === "add-on"
            ? innerCoords.tl.move(new Point(0, innerCoords.height * 1 / 3))
            : innerCoords.tl.move(new Point(0, innerCoords.height / 2))
        const rc = composition.layout === "large" || composition.layout === "add-on"
            ? innerCoords.tr.move(new Point(0, innerCoords.height * 1 / 3))
            : innerCoords.tr.move(new Point(0, innerCoords.height / 2))
        const midline = new Rect(lc.move(new Point(0, -0.5)), rc.move(new Point(0, 0.5)))
        midline.fillStyle = composition.midline
        yield midline
    }
}

export default divider