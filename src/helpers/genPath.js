export default (pnts, smooth) => {
  const points = [...pnts];
  const start = points.shift();

  return (
    `M ${start.x},${start.y}` +
    points.map((point, index) => {
      if (!smooth) return ` L${point.x},${point.y}`;

      const prev = points[index - 1] || start;
      const distance = points[0].x - start.x;
      const bezierX = distance / 2;
      return ` C ${bezierX + prev.x},${prev.y} ${bezierX + prev.x},${point.y} ${
        point.x
      },${point.y}`;
    })
  );
};
