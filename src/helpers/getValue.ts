import type { DataPoint } from "../types";

export default (item: DataPoint): number =>
  typeof item === "number" ? item : item.value;
