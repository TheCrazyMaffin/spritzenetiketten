export class Coords {
  /**
   * The relative XY = (0, 0) point.
   * @example
   * With origin (5, 10), the point (2, 3)
   * yields the absolute position of (7, 13).
   *
   * +------>
   * |      x
   * v y
   */
  origin: Point = new Point(0, 0);
  width: number;
  height: number;

  constructor(opts: { width: number; height: number; origin?: Point }) {
    this.width = opts.width;
    this.height = opts.height;
    if (opts.origin) this.origin = opts.origin;
  }

  /**
   * Top Left
   */
  get tl() {
    return this.origin;
  }

  /**
   * Top Right
   */
  get tr() {
    return this.origin.move(new Point(this.width, 0));
  }

  /**
   * Bottom Right
   */
  get br() {
    return this.origin.move(new Point(this.width, this.height));
  }

  /**
   * Bottom Left
   */
  get bl() {
    return this.origin.move(new Point(0, this.height));
  }

  clone() {
    return new Coords({
      width: this.width,
      height: this.height,
      origin: this.tl
    })
  }

  withPadding(pad: number): Coords;
  withPadding(
    pad: Partial<{
      left: number;
      top: number;
      right: number;
      bottom: number;
    }>,
  ): Coords;
  withPadding(
    pad:
      | number
      | Partial<{
        left: number;
        top: number;
        right: number;
        bottom: number;
      }>,
  ): Coords {
    if (typeof pad === "number") {
      pad = {
        left: pad,
        top: pad,
        right: pad,
        bottom: pad,
      };
    }
    pad.left ??= 0;
    pad.top ??= 0;
    pad.right ??= 0;
    pad.bottom ??= 0;
    return new Coords({
      width: this.width - pad.left - pad.right,
      height: this.height - pad.top - pad.bottom,
      origin: this.origin.move(new Point(pad.left, pad.top)),
    });
  }
}

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Move this point by {@param point} and return a new {@link Point}
   */
  move(point: Point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  /**
   * Get the vector from this point to {@param point}.
   */
  vector(point: Point) {
    return new Point(point.x - this.x, point.y - this.y);
  }

  /**
   * Get the center point in between two points.
   */
  static center(p1: Point, p2: Point) {
    const vector = p1.vector(p2);
    return new Point(p1.x + vector.x / 2, p1.y + vector.y / 2);
  }
}
