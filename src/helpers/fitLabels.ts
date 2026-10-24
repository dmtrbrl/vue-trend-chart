import type { LabelReach } from "../types";

// How much room to leave at the start and end of an axis of `length` pixels
// so that every label stays inside it. Labels sit at a fraction of the plot,
// so shrinking the plot moves them, which can call for more room: repeat
// until the margins settle. Each round only grows them, and they're capped
// at `length`, so this always ends.
export default (labels: LabelReach[], length: number) => {
  let start = 0;
  let end = 0;
  for (let round = 0; round < 50; round++) {
    const plot = Math.max(length - start - end, 0);
    let nextStart = 0;
    let nextEnd = 0;
    for (const { at, before, after } of labels) {
      nextStart = Math.max(nextStart, before - at * plot);
      nextEnd = Math.max(nextEnd, after - (1 - at) * plot);
    }
    // Labels too big for the axis: give them all of it
    if (nextStart + nextEnd >= length) {
      const total = nextStart + nextEnd;
      return total > 0
        ? {
            start: (length * nextStart) / total,
            end: (length * nextEnd) / total,
          }
        : { start: 0, end: 0 };
    }
    const settled =
      Math.abs(nextStart - start) < 0.1 && Math.abs(nextEnd - end) < 0.1;
    start = nextStart;
    end = nextEnd;
    if (settled) break;
  }
  return { start, end };
};
