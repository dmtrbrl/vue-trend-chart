import { describe, expect, it } from "vitest";

import genPath from "../../src/helpers/genPath";
import fitLabels from "../../src/helpers/fitLabels";
import genPoints from "../../src/helpers/genPoints";
import getDomain from "../../src/helpers/getDomain";
import getEvenlySpaced from "../../src/helpers/getEvenlySpaced";
import getPadding from "../../src/helpers/getPadding";
import getValue from "../../src/helpers/getValue";
import roundToStep from "../../src/helpers/roundToStep";
import toCount from "../../src/helpers/toCount";
import validatePadding from "../../src/helpers/validatePadding";
import type { DataPoint } from "../../src/types";

const boundary = { minX: 0, minY: 0, maxX: 100, maxY: 50 };

describe("getPadding", () => {
  it("expands CSS-like shorthand", () => {
    expect(getPadding("5")).toEqual({ top: 5, right: 5, bottom: 5, left: 5 });
    expect(getPadding(5)).toEqual({ top: 5, right: 5, bottom: 5, left: 5 });
    expect(getPadding("5 10")).toEqual({
      top: 5,
      right: 10,
      bottom: 5,
      left: 10,
    });
    expect(getPadding("5 15 10")).toEqual({
      top: 5,
      right: 15,
      bottom: 10,
      left: 15,
    });
    expect(getPadding(" 5  10 15 20 ")).toEqual({
      top: 5,
      right: 10,
      bottom: 15,
      left: 20,
    });
  });
});

describe("validatePadding", () => {
  it.each(["0", "5", 5, "5 10", "5 15 10", "5 10 15 20"])(
    "accepts %j",
    (value) => expect(validatePadding(value)).toBe(true),
  );

  it.each(["", "abc", "-1", -1, "1 2 3 4 5", "5 x"])("rejects %j", (value) =>
    expect(validatePadding(value)).toBe(false),
  );
});

describe("getValue", () => {
  it.each([
    [5, 5],
    [{ value: 5 }, 5],
    ["5", 5],
    [{ value: "5" }, 5],
    [-0.5, -0.5],
  ])("reads %j as %d", (item, expected) =>
    expect(getValue(item as DataPoint)).toBe(expected),
  );

  it.each([null, undefined, NaN, "", " ", "abc", { value: null }, {}, true])(
    "reads %j as a gap",
    (item) => expect(getValue(item as DataPoint)).toBeNaN(),
  );
});

describe("getDomain", () => {
  const datasets = (...data: DataPoint[][]) => data.map((d) => ({ data: d }));

  it("spans all datasets", () => {
    expect(getDomain(datasets([1, 5], [-2, 3]))).toEqual({ min: -2, max: 5 });
  });

  it("ignores gaps and non-finite values", () => {
    expect(getDomain(datasets([1, null, NaN, Infinity, -Infinity, 3]))).toEqual(
      { min: 1, max: 3 },
    );
  });

  it("falls back to 0..1 without data", () => {
    expect(getDomain([])).toEqual({ min: 0, max: 1 });
    expect(getDomain(datasets([], [null]))).toEqual({ min: 0, max: 1 });
  });

  it("lets min and max extend the range but never cut data off", () => {
    const data = datasets([500, 1000]);
    expect(getDomain(data, 0, 2000)).toEqual({ min: 0, max: 2000 });
    expect(getDomain(data, 700, 800)).toEqual({ min: 500, max: 1000 });
    expect(getDomain(data, 2000)).toEqual({ min: 500, max: 1000 });
    expect(getDomain(data, undefined, 100)).toEqual({ min: 500, max: 1000 });
  });

  it("treats null bounds as unset", () => {
    expect(getDomain(datasets([1, 2]), null, null)).toEqual({ min: 1, max: 2 });
  });

  it("widens empty ranges on the sides the user didn't set", () => {
    expect(getDomain(datasets([7, 7]))).toEqual({ min: 6.3, max: 7.7 });
    expect(getDomain(datasets([0, 0]))).toEqual({ min: -1, max: 1 });
    expect(getDomain(datasets([0, 0]), 0)).toEqual({ min: 0, max: 1 });
    expect(getDomain(datasets([1]), 1, 1)).toEqual({ min: 0.9, max: 1.1 });
    expect(getDomain([], 5)).toEqual({ min: 5, max: 5.5 });
    expect(getDomain([], undefined, -5)).toEqual({ min: -5.5, max: -5 });
  });

  it("swaps inverted user bounds without data", () => {
    expect(getDomain([], 800, 600)).toEqual({ min: 600, max: 800 });
  });

  it("handles datasets too large to spread into Math.max", () => {
    const data = Array.from({ length: 1_000_000 }, (_, i) => i);
    expect(getDomain([{ data }])).toEqual({ min: 0, max: 999_999 });
  });
});

describe("getEvenlySpaced", () => {
  it.each([
    [0, 100, 3, [0, 50, 100]],
    [100, 0, 3, [100, 50, 0]],
    [10, 20, 1, [10]],
    [10, 20, 0, []],
  ])("spreads %d..%d over %d values", (start, end, count, expected) =>
    expect(getEvenlySpaced(start, end, count)).toEqual(expected),
  );
});

describe("toCount", () => {
  it.each([
    [3, 3],
    [2.9, 2],
    [0, 0],
    [-1, 0],
    [NaN, 0],
    [Infinity, 0],
    [null, 0],
    [undefined, 0],
  ])("reads %j as %d", (value, expected) =>
    expect(toCount(value)).toBe(expected),
  );
});

describe("roundToStep", () => {
  it.each([
    [0.3, 0.8999999999999999, 0.9],
    [0.1, 0.30000000000000004, 0.3],
    [0.25, 0.75, 0.75],
    [500, 1000.0000001, 1000],
    [0.0001, 1.0813000000000001, 1.0813],
    [1, -0.0000001, 0],
  ])("with step %d formats %d as %d", (step, value, expected) =>
    expect(roundToStep(step)(value)).toBe(expected),
  );

  it("removes float noise without a step", () => {
    expect(roundToStep(0)(0.30000000000000004)).toBe(0.3);
  });
});

describe("genPoints", () => {
  const domain = { min: 0, max: 100 };

  it("maps values onto the boundary", () => {
    const points = genPoints([0, 50, 100], [0, 50, 100], domain, boundary);
    expect(points.map((p) => p!.x)).toEqual([0, 50, 100]);
    expect(points[0]!.y).toBeCloseTo(50, 1);
    expect(points[1]!.y).toBe(25);
    expect(points[2]!.y).toBeCloseTo(0, 1);
  });

  it("returns null for gaps", () => {
    expect(
      genPoints([1, null, 3], [0, 50, 100], domain, boundary)[1],
    ).toBeNull();
  });

  it("nudges the first and last drawn points, not the array ends", () => {
    const points = genPoints(
      [null, 5, 5, null],
      [0, 1, 2, 3],
      domain,
      boundary,
    );
    expect(points[1]!.y).toBeLessThan(points[2]!.y);
  });

  it("keeps flat lines non-degenerate in float32", () => {
    const points = genPoints(
      [5, 5, 5],
      [0, 1, 2],
      { min: 0, max: 10 },
      {
        ...boundary,
        maxY: 1000,
      },
    );
    // Browsers store SVG geometry as float32
    expect(Math.fround(points[0]!.y)).not.toBe(Math.fround(points[2]!.y));
  });
});

describe("fitLabels", () => {
  it("leaves no room when labels fit inside the plot", () => {
    expect(fitLabels([{ at: 0.5, before: 20, after: 20 }], 100)).toEqual({
      start: 0,
      end: 0,
    });
  });

  it("makes room for labels at the edges", () => {
    expect(
      fitLabels(
        [
          { at: 0, before: 30, after: 5 },
          { at: 1, before: 5, after: 10 },
        ],
        100,
      ),
    ).toEqual({ start: 30, end: 10 });
  });

  it("makes room for a wide label inside the plot", () => {
    // Anchored at 2/3 of the plot, reaching 75 past it: the plot must end at
    // least 75 after the anchor once it has shrunk
    const { start, end } = fitLabels(
      [{ at: 2 / 3, before: 75, after: 75 }],
      190,
    );
    const plot = 190 - start - end;
    expect(start + (2 / 3) * plot + 75).toBeLessThanOrEqual(190 + 0.5);
    expect(start + (2 / 3) * plot - 75).toBeGreaterThanOrEqual(-0.5);
    expect(end).toBeCloseTo(17.5, 0);
  });

  it("gives labels too big for the axis all of it, without running away", () => {
    const { start, end } = fitLabels(
      [{ at: 0.5, before: 100, after: 100 }],
      150,
    );
    expect(start + end).toBeCloseTo(150);
    expect(start).toBeCloseTo(end);
  });

  it("ignores labels that reach inwards", () => {
    expect(fitLabels([{ at: 0, before: -10, after: -5 }], 100)).toEqual({
      start: 0,
      end: 0,
    });
  });
});

describe("genPath", () => {
  const points = [
    { x: 0, y: 40 },
    { x: 50, y: 10 },
    { x: 100, y: 20 },
  ];

  it("builds straight line and closed fill paths", () => {
    expect(genPath(points, false, boundary)).toEqual({
      linePath: "M 0,40 L50,10 L100,20",
      fillPath: "M 0,40 L50,10 L100,20 L100,50 L0,50 Z",
    });
  });

  it("builds smooth bezier paths", () => {
    expect(genPath(points, true, boundary)?.linePath).toBe(
      "M 0,40 C 25,40 25,10 50,10 C 75,10 75,20 100,20",
    );
  });

  it("breaks lines and fills at gaps", () => {
    expect(
      genPath([points[0], null, points[1], points[2]], false, boundary),
    ).toEqual({
      linePath: "M 0,40 M 50,10 L100,20",
      fillPath: "M 0,40 L0,50 L0,50 Z M 50,10 L100,20 L100,50 L50,50 Z",
    });
  });

  it("returns null without points and handles a single point", () => {
    expect(genPath([], false, boundary)).toBeNull();
    expect(genPath([null, null], false, boundary)).toBeNull();
    expect(genPath([{ x: 0, y: 10 }], true, boundary)).toEqual({
      linePath: "M 0,10",
      fillPath: "M 0,10 L0,50 L0,50 Z",
    });
  });
});
