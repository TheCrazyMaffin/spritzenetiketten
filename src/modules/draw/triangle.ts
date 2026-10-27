import { Point } from "@/modules/draw/coords";
import { Shape } from "@/modules/draw/shape";


export class Triangle extends Shape {
    constructor(p1: Point, p2: Point, p3: Point) {
        const path = new Path2D();
        path.moveTo(p1.x, p1.y);
        path.lineTo(p2.x, p2.y);
        path.lineTo(p3.x, p3.y);
        path.closePath();
        super(path);
    }
}
