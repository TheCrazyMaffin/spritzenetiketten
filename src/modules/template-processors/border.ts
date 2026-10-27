import { Point } from "@/modules/draw/coords";
import { LabelTemplate, TemplateProcessor } from "@/modules/draw/label-template";
import { Triangle } from "../draw/triangle";
import { Rect } from "../draw/rect";

const border: TemplateProcessor = function* (composition, coords) {
  if (!composition.borderFill) return
  const borderShape = new Rect(coords.tl, coords.br, composition.roundedEdges);
  const borderPad = LabelTemplate.borderPadding(composition)
  const innerCoords = coords.withPadding(borderPad);
  const innerRect = new Rect(
    innerCoords.tl,
    innerCoords.br,
    Math.max(0, composition.roundedEdges - composition.borderSize),
  );
  borderShape.path.addPath(innerRect.path)

  if (composition.borderFill.solid) {
    const rect = new Rect(coords.tl, coords.br)
    rect.clip = borderShape.path
    rect.fillRule = "evenodd"
    rect.fillStyle = composition.borderFill.solid
    yield rect
  }
  if (composition.borderFill.bottomHalf) {
    const cl = Point.center(coords.tl, coords.bl)
    const rect = new Rect(cl, coords.br)
    rect.clip = borderShape.path
    rect.fillRule = "evenodd"
    rect.fillStyle = composition.borderFill.bottomHalf
    yield rect
  }
  if (composition.borderFill.topHalf) {
    const cl = Point.center(coords.tl, coords.bl)
    const rect = new Rect(cl, coords.tr)
    rect.clip = borderShape.path
    rect.fillRule = "evenodd"
    rect.fillStyle = composition.borderFill.topHalf
    yield rect
  }
  if (composition.borderFill.bottomLeftHalf) {
    const triangle = new Triangle(coords.tl, coords.br, coords.bl)
    triangle.clip = borderShape.path
    triangle.fillRule = "evenodd"
    triangle.fillStyle = composition.borderFill.bottomLeftHalf
    yield triangle
  }
  if (composition.borderFill.topRightHalf) {
    const triangle = new Triangle(coords.tl, coords.br, coords.tr)
    triangle.clip = borderShape.path
    triangle.fillRule = "evenodd"
    triangle.fillStyle = composition.borderFill.topRightHalf
    yield triangle
  }
  if (composition.borderFill.hatch135deg) {
    const offscreenCanvas = new OffscreenCanvas(coords.width, coords.height);
    const offscreenCtx = offscreenCanvas.getContext("2d");
    if (!offscreenCtx)
      throw new Error("Couldnt create a offscreen canvas for hatch fill.");
    const maxDimension = Math.max(coords.height, coords.width);
    const gradient = offscreenCtx.createLinearGradient(
      0,
      0,
      maxDimension,
      maxDimension,
    );
    const stops = Math.round(coords.width / 3);
    const step = 1 / stops;
    for (let i = 0; i < stops; i++) {
      const color =
        i % 2 === 1 ? composition.borderFill.hatch135deg : "transparent";
      gradient.addColorStop(step * i, color);
      gradient.addColorStop(step * (i + 1), color);
    }
    const rect = new Rect(coords.tl, coords.br);
    rect.fillStyle = gradient;
    rect.clip = borderShape.path;
    rect.fillRule = "evenodd"
    yield rect;
  }
};

export default border;
