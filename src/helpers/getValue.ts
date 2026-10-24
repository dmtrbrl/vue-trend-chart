import type { DataPoint } from "../types";

// NaN for missing or invalid values, which are drawn as gaps. Numeric strings
// are accepted, since data often comes from JSON APIs as text.
export default (item: DataPoint | undefined): number => {
  const value: unknown =
    item !== null && typeof item === "object" ? item.value : item;
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return NaN;
};
