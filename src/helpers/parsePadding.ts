export default (padding: string): number[] =>
  padding
    .split(" ")
    .filter((item) => item !== "")
    .map((item) => Number.parseInt(item, 10));
