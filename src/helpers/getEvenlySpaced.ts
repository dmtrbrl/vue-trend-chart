// `count` evenly spaced values from `start` to `end` (inclusive)
export default (start: number, end: number, count: number): number[] =>
  Array.from({ length: count }, (_, i) =>
    count > 1 ? start + ((end - start) * i) / (count - 1) : start,
  );
