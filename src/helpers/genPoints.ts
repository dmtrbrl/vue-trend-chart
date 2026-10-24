import type { Boundary, DataPoint, Domain, Point } from "../types";
import getValue from "./getValue";

// Nudging the end points keeps a flat line's bounding box from having zero
// height, which would hide gradient strokes/fills. Large enough to survive
// the float32 precision browsers use for SVG geometry.
const FLAT_NUDGE = 0.01;

export default (
  data: DataPoint[],
  xCoords: number[],
  domain: Domain,
  { minY, maxY }: Boundary,
): Array<Point | null> => {
  const scale = (maxY - minY) / (domain.max - domain.min);
  const last = data.length - 1;
  return data.map((item, index) => {
    const value = getValue(item);
    if (!Number.isFinite(value)) return null;
    const nudge = index === 0 ? -FLAT_NUDGE : index === last ? FLAT_NUDGE : 0;
    return {
      x: xCoords[index],
      y: maxY - (value - domain.min) * scale + nudge,
    };
  });
};
