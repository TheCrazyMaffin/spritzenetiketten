import { Point } from "@/modules/draw/coords";
import { Shape } from "@/modules/draw/shape";


export class Rect extends Shape {
    /**
     *
     * @param p1 First corner of the rect
     * @param p2 Second corner of the rect
     */
    constructor(p1: Point, p2: Point, cornerRadius?: Parameters<Path2D['roundRect']>['4']) {
        const path = new Path2D();
        const vect = p1.vector(p2);
        path.roundRect(p1.x, p1.y, vect.x, vect.y, cornerRadius);
        super(path);
    }
}
