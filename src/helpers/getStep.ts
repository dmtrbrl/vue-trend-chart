// Distance between `count` evenly spaced items spanning `length`
export default (length: number, count: number): number =>
  count > 1 ? length / (count - 1) : 0;
