export default padding => {
  const arr = padding
    .split(" ")
    .filter(item => item !== "")
    .map(item => parseInt(item));
  if (arr.length < 1 || arr.length > 4) return false;
  return arr.every(item => typeof item == "number" && item >= 0);
};
