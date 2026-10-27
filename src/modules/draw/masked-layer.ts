import { Drawable } from "@/modules/draw/shape";
import { RenderingContext2D } from "@/modules/util";

/**
 * Draws `content` only where `mask` is opaque. E.g. mask = text, content = fill shapes -> the fill clipped to the text.
 *
 * Compositing has to happen on a separate, transparent layer. On the target canvas the label background
 * is already drawn, so "source-in" would match the whole label instead of only the mask.
 */
export class MaskedLayer implements Drawable {
    mask: Drawable[]
    content: Drawable[]

    constructor(mask: Drawable[], content: Drawable[]) {
        this.mask = mask
        this.content = content
    }

    draw(ctx: RenderingContext2D) {
        // Create new canvas that mimics all dimensions of the actual canvas but doesnt have any content -> Virtual empty "layer"
        const layer = new OffscreenCanvas(ctx.canvas.width, ctx.canvas.height)
        const layerCtx = layer.getContext("2d")
        if (!layerCtx) throw new Error("Cannot get 2d rendering context of masked layer")
        // Copy transform of the actual canvas.
        layerCtx.setTransform(ctx.getTransform())

        // First draw all mask drawables and fill them with any color.
        layerCtx.fillStyle = "black"
        this.mask.forEach(drawable => drawable.draw(layerCtx))
        // For drawing content switch to source-in composite operation meaning the new drawables are "clipped" to existing filled areas.
        // Drawing on background without fill does not show.
        layerCtx.globalCompositeOperation = "source-atop"
        this.content.forEach(drawable => drawable.draw(layerCtx))

        // Layer and target have the same pixel size, so copy it 1:1 without the target's transform.
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.drawImage(layer, 0, 0)
        ctx.restore()
    }
}
