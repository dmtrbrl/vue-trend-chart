import { describe, expect, it } from "vitest";

import genPath from "../src/helpers/genPath";
import genPoints from "../src/helpers/genPoints";
import getPadding from "../src/helpers/getPadding";
import validatePadding from "../src/helpers/validatePadding";

const boundary = { minX: 0, minY: 0, maxX: 100, maxY: 50 };

describe("getPadding", () => {
  it("expands CSS-like shorthand", () => {
    expect(getPadding("5")).toEqual({ top: 5, right: 5, bottom: 5, left: 5 });
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
  it.each(["0", "5", "5 10", "5 15 10", "5 10 15 20"])("accepts %j", (value) =>
    expect(validatePadding(value)).toBe(true),
  );

  it.each(["", "abc", "-1", "1 2 3 4 5", "5 x"])("rejects %j", (value) =>
    expect(validatePadding(value)).toBe(false),
  );
});

describe("genPoints", () => {
  it("spreads points across the boundary", () => {
    const points = genPoints([0, 50, 100], boundary, 100, 0, 3);
    expect(points.map((p) => p.x)).toEqual([0, 50, 100]);
    expect(points[0].y).toBeCloseTo(50);
    expect(points[1].y).toBeCloseTo(25);
    expect(points[2].y).toBeCloseTo(0);
  });

  it("accepts object data points", () => {
    expect(
      genPoints([{ value: 0 }, { value: 100 }], boundary, 100, 0, 2),
    ).toEqual(genPoints([0, 100], boundary, 100, 0, 2));
  });

  it("handles a single point and flat data without NaN", () => {
    const [point] = genPoints([7], boundary, 7, 7, 1);
    expect(Number.isFinite(point.x)).toBe(true);
    expect(Number.isFinite(point.y)).toBe(true);
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

  it("returns null for empty data and handles a single point", () => {
    expect(genPath([], false, boundary)).toBeNull();
    expect(genPath([{ x: 0, y: 10 }], true, boundary)).toEqual({
      linePath: "M 0,10",
      fillPath: "M 0,10 L0,50 L0,50 Z",
    });
  });
});
