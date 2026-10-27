import { LabelTemplate, TemplateProcessor } from "@/modules/draw/label-template"
import { hasOwnColor, Text } from "@/modules/draw/text"
import { RenderingContext2D } from "@/modules/util"
import { MaskedLayer } from "@/modules/draw/masked-layer"
import { fill } from "@/modules/template-processors/fill"

const text: TemplateProcessor = function* (composition, coords) {
    let withinBorderCoords = coords.withPadding(LabelTemplate.borderPadding(composition)).withPadding(2)
    let titleAlign: Text['textAlign'] = 'center'
    let contentAlign: Text['textAlign'] = 'center'
    if (composition.layout === "line") {
        // Half width + 1 padding like on the other sides. Dont need to accout for a border because the border runs along the full width.
        withinBorderCoords = withinBorderCoords.withPadding({ right: withinBorderCoords.width / 2 + 1 })
    }

    let titleCoords = withinBorderCoords.clone()
    let contentCoords = withinBorderCoords.clone()
    if (composition.layout === "small" || composition.layout === "line") {
        // Title spans the upper half, content the bottom half. If label is with midline add more space in between for it.
        const space = composition.midline ? 2 : 1
        titleCoords = titleCoords.withPadding({ bottom: titleCoords.height / 2 + space })
        contentCoords = contentCoords.withPadding({ top: contentCoords.height / 2 + space })
    }
    if (composition.layout === "large") {
        const space = composition.midline ? 2 : 1
        titleCoords = titleCoords.withPadding({ bottom: titleCoords.height * 2 / 3 + space })
        contentCoords = contentCoords.withPadding({ top: contentCoords.height / 3 + space, right: contentCoords.width / 2 + 1 })
        contentAlign = 'left'

        let staticContentCoords = withinBorderCoords.clone()
        staticContentCoords = staticContentCoords.withPadding({ top: staticContentCoords.height / 3 + space, left: staticContentCoords.width / 2 + 1 })
        const staticContent = new Text([
            { insert: "Herstellung:\n", attributes: { color: "black" } },
            { insert: "\n", attributes: { color: "black" } },
            { insert: "█", attributes: { color: "transparent" } },
            { insert: "........................................\n", attributes: { color: "#00000050" } },
            { insert: "Datum, Uhrzeit, Hz", attributes: { color: "black" } },
        ], staticContentCoords)
        staticContent.textAlign = "right"
        yield staticContent

    }
    if (composition.layout === "add-on") {
        const space = composition.midline ? 2 : 1
        titleCoords = titleCoords.withPadding({ bottom: titleCoords.height * 2 / 3 + space })
        contentCoords = contentCoords.withPadding({ top: contentCoords.height / 3 + space, left: contentCoords.width / 2 + 1 })
        titleAlign = 'right'
        contentAlign = 'right'

        let staticContentCoords = withinBorderCoords.clone()
        staticContentCoords = staticContentCoords.withPadding({ top: staticContentCoords.height / 3 + space, right: staticContentCoords.width / 2 + 1 })
        const staticContent = new Text([
            { insert: "PLUS", attributes: { color: "black" } },
        ], staticContentCoords)
        staticContent.textAlign = "right"
        yield staticContent
    }
    const textSections: Text[] = []
    if (composition.text?.title) {
        const title = new Text(composition.text.title, titleCoords)
        title.textAlign = titleAlign
        textSections.push(title)
    }
    if (composition.text?.content) {
        const content = new Text(composition.text.content, contentCoords)
        content.textAlign = contentAlign
        textSections.push(content)
    }
    // These drawables result in a fill just like the background but are "clipped" to the text using MaskedLayer
    // -> The fill is only drawn where text is.
    const fillDrawables = [...fill(composition.textBackgroundFill, composition, coords)]
    yield new MaskedLayer(
        textSections.map(text => ({ draw: (ctx: RenderingContext2D) => text.draw(ctx, part => !hasOwnColor(part)) })),
        fillDrawables,
    )
    // Parts with their own color are drawn on top, unaffected by the fill.
    yield* textSections.map(text => ({ draw: (ctx: RenderingContext2D) => text.draw(ctx, hasOwnColor) }))
}

export default text