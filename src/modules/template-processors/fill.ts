import { LabelFillStyle } from "@/modules/data-schema/style";
import { Coords } from "@/modules/draw/coords";
import { LabelCompositionWithDefaults, LabelTemplate } from "@/modules/draw/label-template";
import { Rect } from "@/modules/draw/rect";
import { Shape } from "@/modules/draw/shape";
import { Triangle } from "@/modules/draw/triangle";

/**
 * Turns a fill style (backgroundFill, textBackgroundFill, ...) into the shapes that paint it across the label.
 * @param clip Path every shape is clipped to, usually the (rounded) outline of the label.
 */
export function* fill(
  fill: LabelFillStyle,
  composition: LabelCompositionWithDefaults,
  coords: Coords,
  clip?: Path2D,
): Generator<Shape> {
  if (fill.solid) {
    let fillCoords = coords;
    if (composition.layout === "line") {
      fillCoords = fillCoords.withPadding({
        right: fillCoords.width * 0.4,
      });
    }
    const rect = new Rect(fillCoords.tl, fillCoords.br);
    rect.fillStyle = fill.solid;
    rect.clip = clip;
    yield rect;
  }

  if (fill.bottomHalf) {
    let fillCoords = coords;
    if (composition.layout === "line") {
      fillCoords = fillCoords.withPadding({
        right: coords.width * 0.4,
      });
    }
    if (composition.layout === "large" || composition.layout === "add-on") {
      fillCoords = fillCoords.withPadding(LabelTemplate.borderPadding(composition));
      fillCoords = fillCoords.withPadding({ top: fillCoords.height / 3 });
    } else {
      fillCoords = fillCoords.withPadding({ top: fillCoords.height / 2 });
    }
    const rect = new Rect(fillCoords.tl, fillCoords.br);
    rect.fillStyle = fill.bottomHalf;
    rect.clip = clip;
    yield rect;
  }

  if (fill.topHalf) {
    let fillCoords = coords;
    if (composition.layout === "line") {
      fillCoords = coords.withPadding({
        right: coords.width * 0.4,
      });
    }
    if (composition.layout === "large" || composition.layout === "add-on") {
      fillCoords = fillCoords.withPadding(LabelTemplate.borderPadding(composition));
      fillCoords = fillCoords.withPadding({
        bottom: (fillCoords.height * 2) / 3,
      });
    } else {
      fillCoords = fillCoords.withPadding({ bottom: fillCoords.height / 2 });
    }
    const rect = new Rect(fillCoords.tl, fillCoords.br);
    rect.fillStyle = fill.topHalf;
    rect.clip = clip;
    yield rect;
  }

  if (fill.topRightHalf) {
    let fillCoords = coords;
    if (composition.layout === "line") {
      fillCoords = coords.withPadding({
        right: coords.width * 0.4,
      });
    }
    if (composition.layout === "large" || composition.layout === "add-on") {
      fillCoords = fillCoords.withPadding(LabelTemplate.borderPadding(composition));
      fillCoords = fillCoords.withPadding({
        bottom: (fillCoords.height * 2) / 3,
      });
    }
    const triangle = new Triangle(fillCoords.tl, fillCoords.br, fillCoords.tr);
    triangle.fillStyle = fill.topRightHalf;
    triangle.clip = clip;
    yield triangle;
  }

  if (fill.bottomLeftHalf) {
    let fillCoords = coords;
    if (composition.layout === "line") {
      fillCoords = coords.withPadding({
        right: coords.width * 0.4,
      });
    }
    if (composition.layout === "large" || composition.layout === "add-on") {
      fillCoords = fillCoords.withPadding(LabelTemplate.borderPadding(composition));
      fillCoords = fillCoords.withPadding({
        bottom: (fillCoords.height * 2) / 3,
      });
    }
    const triangle = new Triangle(fillCoords.tl, fillCoords.br, fillCoords.bl);
    triangle.fillStyle = fill.bottomLeftHalf;
    triangle.clip = clip;
    yield triangle;
  }

  if (fill.hatch135deg) {
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
        i % 2 === 1 ? fill.hatch135deg : "transparent";
      gradient.addColorStop(step * i, color);
      gradient.addColorStop(step * (i + 1), color);
    }
    let fillCoords = coords;
    if (composition.layout === "line") {
      fillCoords = fillCoords.withPadding({
        right: fillCoords.width * 0.4,
      });
    }
    const rect = new Rect(fillCoords.tl, fillCoords.br);
    rect.fillStyle = gradient;
    rect.clip = clip;
    yield rect;
  }
};