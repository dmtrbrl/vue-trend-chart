import type { Boundary, DataPoint, Point } from "../types";
import getStep from "./getStep";
import getValue from "./getValue";

export default (
  data: DataPoint[],
  boundary: Boundary,
  max: number,
  min: number,
  maxAmount: number,
): Point[] => {
  // Small offsets keep flat lines from having a zero-height bounding box,
  // which would break gradient fills/strokes
  const minValue = min - 0.001;
  const gridX = getStep(boundary.maxX - boundary.minX, maxAmount);
  const gridY = (boundary.maxY - boundary.minY) / (max + 0.001 - minValue);

  return data.map(getValue).map((value, index) => ({
    x: index * gridX + boundary.minX,
    y:
      boundary.maxY -
      (value - minValue) * gridY +
      (index === maxAmount - 1 ? 0.00001 : 0) -
      (index === 0 ? 0.00001 : 0),
  }));
};
