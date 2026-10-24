import type { Boundary, DataPoint, Domain, Point } from "../types";
import getValue from "./getValue";

// Nudging the first and last drawn points keeps a flat line's bounding box
// from having zero height, which would hide gradient strokes/fills. Large
// enough to survive the float32 precision browsers use for SVG geometry.
const FLAT_NUDGE = 0.01;

export default (
  data: DataPoint[],
  xCoords: number[],
  domain: Domain,
  { minY, maxY }: Boundary,
): Array<Point | null> => {
  const scale = (maxY - minY) / (domain.max - domain.min);
  const values = data.map(getValue);
  let first = -1;
  let last = -1;
  values.forEach((value, index) => {
    if (!Number.isFinite(value)) return;
    if (first === -1) first = index;
    last = index;
  });
  return values.map((value, index) => {
    if (!Number.isFinite(value)) return null;
    const nudge =
      index === first ? -FLAT_NUDGE : index === last ? FLAT_NUDGE : 0;
    return {
      x: xCoords[index],
      y: maxY - (value - domain.min) * scale + nudge,
    };
  });
};
