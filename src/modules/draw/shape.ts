import { RenderingContext2D } from "@/modules/util"


export interface Drawable {
    draw: (ctx: RenderingContext2D) => void
}

export class Shape implements Drawable {
    path: Path2D
    fillRule: CanvasFillRule = 'nonzero'
    fillStyle: RenderingContext2D["fillStyle"] = "white"
    clip?: Path2D

    constructor(path: Path2D) {
        this.path = path
    }

    draw(ctx: RenderingContext2D) {
        if (this.clip) {
            ctx.save()
            ctx.clip(this.clip, this.fillRule)
        }
        ctx.fillStyle = this.fillStyle
        ctx.fill(this.path, this.fillRule)
        if (this.clip) {
            ctx.restore()
        }
    }
}


