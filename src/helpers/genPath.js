export default (points, smooth) => {
  const start = points.shift();

  return (
    `M ${start.x},${start.y}` +
    points.map((point, index) => {
      if (!smooth) return ` L${point.x},${point.y}`;

      const next = points[index + 1];
      const prev = points[index - 1] || start;
      const distance = (points[0].x - start.x) / 2;
      if (index == 0) {
        return ` C ${prev.x},${prev.y} ${distance + prev.x},${point.y} ${
          point.x
        },${point.y}`;
      } else if (next) {
        return ` C ${distance + prev.x},${prev.y} ${distance + prev.x},${
          point.y
        } ${point.x},${point.y}`;
      } else {
        return ` C ${distance + prev.x},${prev.y} ${point.x},${point.y} ${
          point.x
        },${point.y}`;
      }
    })
  );
};
