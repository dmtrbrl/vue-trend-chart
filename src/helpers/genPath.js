export default (pnts, smooth, { maxY }) => {
  const points = [...pnts];
  const start = points.shift();
  const end = points[points.length - 1];
  const distance = points[0].x - start.x;
  const bezierX = distance / 2;

  // Create Line Path
  let linePath = `M ${start.x},${start.y}`;
  points.forEach((point, index) => {
    if (!smooth) linePath += ` L${point.x},${point.y}`;
    else {
      const prev = points[index - 1] || start;
      linePath += ` C ${bezierX + prev.x},${prev.y} ${bezierX + prev.x},${
        point.y
      } ${point.x},${point.y}`;
    }
  });

  // Create Fill Path
  let fillPath = linePath;
  if (end.Y !== maxY) fillPath += ` L${end.x},${maxY}`;
  if (start.Y !== maxY) fillPath += ` L${start.x},${maxY}`;
  fillPath += " Z";

  return { linePath, fillPath };
};
