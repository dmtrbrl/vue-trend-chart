export default (padding: string | number): number[] =>
  String(padding)
    .split(" ")
    .filter((item) => item !== "")
    .map((item) => Number.parseInt(item, 10));
