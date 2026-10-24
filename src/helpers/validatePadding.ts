import parsePadding from "./parsePadding";

export default (padding: string | number): boolean => {
  const arr = parsePadding(padding);
  if (arr.length < 1 || arr.length > 4) return false;
  // NaN (non-numeric input) fails this check too
  return arr.every((item) => item >= 0);
};
