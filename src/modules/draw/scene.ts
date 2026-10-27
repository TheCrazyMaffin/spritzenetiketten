import { Drawable } from "@/modules/draw/shape"

export class Scene {
    ctx: OffscreenCanvasRenderingContext2D

    constructor(width: number, height: number, scale: number = 1) {
        const canvas = new OffscreenCanvas(width, height)
        if (!canvas) throw new Error("[new Scene()] Couldnt create OffscreenCanvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) throw new Error("[new Scene()] Couldnt get 2d rendering context from canvas.")
        this.ctx = ctx
        this.ctx.setTransform(scale, 0, 0, scale, 0, 0)
    }

    draw(...drawables: Drawable[]) {
        drawables.forEach(drawable => {
            drawable.draw(this.ctx)
        })
    }
}