import { TemplateProcessor } from "@/modules/draw/label-template";
import { Rect } from "../draw/rect";
import { fill } from "@/modules/template-processors/fill";

const background: TemplateProcessor = function* (composition, coords) {
  const baseRect = new Rect(coords.tl, coords.br, composition.roundedEdges);
  baseRect.fillStyle = "white";
  yield baseRect;
  if (!composition.backgroundFill) return;
  yield* fill(composition.backgroundFill, composition, coords, baseRect.path);
};

export default background;
