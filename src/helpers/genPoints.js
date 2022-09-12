export default (arr, boundary, max, min, maxAmount) => {
  arr = arr.map((item) => (typeof item === "number" ? item : item.value));
  const minValue = min - 0.001;
  const gridX = (boundary.maxX - boundary.minX) / (maxAmount - 1);
  const gridY = (boundary.maxY - boundary.minY) / (max + 0.001 - minValue);

  return arr.map((value, index) => {
    return {
      x: index * gridX + boundary.minX,
      y:
        boundary.maxY -
        (value - minValue) * gridY +
        +(index === maxAmount - 1) * 0.00001 -
        +(index === 0) * 0.00001,
    };
  });
};
