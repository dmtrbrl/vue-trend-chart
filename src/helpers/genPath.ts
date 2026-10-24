import type { Boundary, Point } from "../types";

export default (
  points: Point[],
  smooth: boolean,
  { maxY }: Boundary,
): { linePath: string; fillPath: string } | null => {
  if (!points.length) return null;

  const [start, ...rest] = points;
  const end = points[points.length - 1];
  const bezierX = rest.length ? (rest[0].x - start.x) / 2 : 0;

  // Create Line Path
  let linePath = `M ${start.x},${start.y}`;
  rest.forEach((point, index) => {
    if (!smooth) linePath += ` L${point.x},${point.y}`;
    else {
      const prev = rest[index - 1] || start;
      linePath += ` C ${bezierX + prev.x},${prev.y} ${bezierX + prev.x},${point.y} ${point.x},${point.y}`;
    }
  });

  // Create Fill Path
  let fillPath = linePath;
  if (end.y !== maxY) fillPath += ` L${end.x},${maxY}`;
  if (start.y !== maxY) fillPath += ` L${start.x},${maxY}`;
  fillPath += " Z";

  return { linePath, fillPath };
};
