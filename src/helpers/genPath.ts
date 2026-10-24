import type { Boundary, Point } from "../types";

// Splits points into runs without gaps
const toSegments = (points: Array<Point | null>) => {
  const segments: Point[][] = [[]];
  points.forEach((point) => {
    if (point) segments[segments.length - 1].push(point);
    else if (segments[segments.length - 1].length) segments.push([]);
  });
  return segments.filter((segment) => segment.length);
};

const linePathOf = ([start, ...rest]: Point[], smooth: boolean) => {
  let path = `M ${start.x},${start.y}`;
  rest.forEach((point, index) => {
    if (!smooth) path += ` L${point.x},${point.y}`;
    else {
      const prev = rest[index - 1] || start;
      const controlX = prev.x + (point.x - prev.x) / 2;
      path += ` C ${controlX},${prev.y} ${controlX},${point.y} ${point.x},${point.y}`;
    }
  });
  return path;
};

export default (
  points: Array<Point | null>,
  smooth: boolean,
  { maxY }: Boundary,
): { linePath: string; fillPath: string } | null => {
  const segments = toSegments(points);
  if (!segments.length) return null;

  const linePaths = segments.map((segment) => linePathOf(segment, smooth));
  const fillPaths = segments.map((segment, i) => {
    const start = segment[0];
    const end = segment[segment.length - 1];
    let fillPath = linePaths[i];
    if (end.y !== maxY) fillPath += ` L${end.x},${maxY}`;
    if (start.y !== maxY) fillPath += ` L${start.x},${maxY}`;
    return fillPath + " Z";
  });

  return { linePath: linePaths.join(" "), fillPath: fillPaths.join(" ") };
};
