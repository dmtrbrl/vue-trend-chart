import type { Domain, TrendChartDataset } from "../types";
import getValue from "./getValue";

const isSet = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value);

// The value range of the y axis. It always contains all data, so nothing is
// cut off; `min`/`max` can only extend it (e.g. `min: 0` to start at zero).
export default (
  datasets: TrendChartDataset[],
  min?: number | null,
  max?: number | null,
): Domain => {
  let dataMin = Infinity;
  let dataMax = -Infinity;
  for (const { data } of datasets) {
    for (const item of data) {
      const value = getValue(item);
      if (!Number.isFinite(value)) continue;
      if (value < dataMin) dataMin = value;
      if (value > dataMax) dataMax = value;
    }
  }
  const hasData = dataMin <= dataMax;

  // Whether the user's bound is the one in effect
  const minSet = isSet(min) && (!hasData || min <= dataMin);
  const maxSet = isSet(max) && (!hasData || max >= dataMax);
  let lower = minSet ? min : hasData ? dataMin : 0;
  let upper = maxSet ? max : hasData ? dataMax : 1;
  if (lower > upper && minSet && maxSet) [lower, upper] = [upper, lower];

  // Nothing to span (flat data, or bounds without data): widen the sides the
  // user didn't set
  if (lower >= upper) {
    const delta = Math.abs(minSet ? lower : upper) * 0.1 || 1;
    if (minSet && !maxSet) upper = lower + delta;
    else if (maxSet && !minSet) lower = upper - delta;
    else {
      lower -= delta;
      upper += delta;
    }
  }

  return { min: lower, max: upper };
};
