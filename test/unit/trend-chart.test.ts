import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  onTestFinished,
  vi,
} from "vitest";
import { createApp } from "vue";
import { enableAutoUnmount, flushPromises } from "@vue/test-utils";

import VueTrendChart, { TrendChart, type TrendChartDataset } from "../../src";
import {
  HEIGHT,
  WIDTH,
  boundaryOf,
  lineXs,
  lineYs,
  mountChart,
  pointer,
  pointsOf,
  stubLabelBoxes,
  stubLayout,
  texts,
  translates,
} from "./utils";

enableAutoUnmount(afterEach);

let layout: ReturnType<typeof stubLayout>;
let warn: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  layout = stubLayout();
  warn = vi.spyOn(console, "warn");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const xs = (points: Array<{ x: number }>) => points.map((p) => p.x);
const ys = (points: Array<{ y: number }>) => points.map((p) => p.y);

describe("structure", () => {
  it("renders the documented class tree in order", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2] }, { data: [2, 1] }],
      grid: { verticalLines: true },
      labels: { xLabels: ["a", "b"], yLabels: 2 },
      interactive: true,
    });
    const children = [...wrapper.element.children].map(
      (el) =>
        el.tagName +
        (el.classList.length ? "." + [...el.classList].join(".") : ""),
    );
    expect(children).toEqual([
      "g.grid",
      "line.active-line",
      "g.labels",
      "g.curve",
      "g.curve",
      "rect",
    ]);
    expect(wrapper.classes()).toContain("vtc");
  });

  it("is exposed to assistive technology as an image", async () => {
    const wrapper = await mountChart(
      { datasets: [{ data: [1, 2] }] },
      { attrs: { "aria-label": "Weekly downloads" } },
    );
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Weekly downloads");
  });

  it("lets users override the role", async () => {
    const wrapper = await mountChart(
      { datasets: [{ data: [1, 2] }] },
      { attrs: { role: "figure" } },
    );
    expect(wrapper.attributes("role")).toBe("figure");
  });
});

describe("datasets", () => {
  it("accepts numbers and { value } objects alike", async () => {
    const a = await mountChart({
      datasets: [{ data: [1, 5, 3], showPoints: true }],
    });
    const b = await mountChart({
      datasets: [
        { data: [{ value: 1 }, { value: 5 }, { value: 3 }], showPoints: true },
      ],
    });
    expect(pointsOf(b)).toEqual(pointsOf(a));
  });

  it("accepts user-defined interfaces as data points", async () => {
    interface Download {
      value: number;
      day: string;
    }
    const data: Download[] = [{ value: 1, day: "2026-01-01" }];
    const datasets: TrendChartDataset[] = [{ data }];
    expect((await mountChart({ datasets })).find(".curve").exists()).toBe(true);
  });

  it("applies dataset options", async () => {
    const wrapper = await mountChart({
      datasets: [
        {
          data: [1, 2, 3],
          className: "curve1",
          smooth: true,
          fill: true,
          showPoints: true,
        },
        { data: [3, 2, 1], stroke: false },
      ],
    });
    const [first, second] = wrapper.findAll("g.curve");
    expect(first.classes()).toEqual(
      expect.arrayContaining(["curve", "curve1"]),
    );
    expect(first.find("path.fill").exists()).toBe(true);
    expect(first.find("path.stroke").attributes("d")).toContain("C");
    expect(first.findAll(".points circle.point")).toHaveLength(3);
    expect(second.find("path.stroke").exists()).toBe(false);
    expect(second.find("path.fill").exists()).toBe(false);
    expect(second.find(".points").exists()).toBe(false);
  });

  it("treats null, undefined and non-finite values as gaps", async () => {
    const wrapper = await mountChart({
      datasets: [
        {
          data: [1, null, 3, undefined, 5, NaN, Infinity, 2],
          showPoints: true,
        },
        { data: [1, 2], showPoints: true },
      ] as unknown as TrendChartDataset[],
      labels: { yLabels: 3 },
    });
    expect(wrapper.html()).not.toMatch(/NaN|Infinity/);
    const stroke = wrapper.find("g.curve path.stroke").attributes("d")!;
    expect(stroke.match(/M/g)).toHaveLength(4);
    expect(pointsOf(wrapper)).toHaveLength(4);
    expect(texts(wrapper, ".y-labels text")).toEqual(["1", "3", "5"]);
  });

  it("closes the fill under each segment separately", async () => {
    const wrapper = await mountChart({
      datasets: [
        { data: [1, 2, null, 3, 4], fill: true },
      ] as unknown as TrendChartDataset[],
      padding: "0",
    });
    const fill = wrapper.find("path.fill").attributes("d")!;
    expect(fill.match(/Z/g)).toHaveLength(2);
  });

  it("accepts numeric strings consistently", async () => {
    const numbers = await mountChart({
      datasets: [{ data: [1, 2, 3], showPoints: true }],
    });
    const strings = await mountChart({
      datasets: [{ data: ["1", "2", { value: "3" }], showPoints: true }],
    } as never);
    expect(pointsOf(strings)).toEqual(pointsOf(numbers));
  });

  it("renders empty datasets without NaN", async () => {
    for (const datasets of [[], [{ data: [] }]]) {
      const wrapper = await mountChart({ datasets, labels: { yLabels: 3 } });
      expect(wrapper.html()).not.toContain("NaN");
      expect(texts(wrapper, ".y-labels text")).toEqual(["0", "0.5", "1"]);
    }
  });

  it("aligns datasets of different lengths on the same x positions", async () => {
    const wrapper = await mountChart({
      datasets: [
        { data: [1, 2, 3], showPoints: true },
        { data: [1, 2], showPoints: true },
      ],
      padding: "0",
    });
    expect(xs(pointsOf(wrapper, 0))).toEqual([0, 150, 300]);
    expect(xs(pointsOf(wrapper, 1))).toEqual([0, 150]);
  });

  it("handles very large datasets", async () => {
    const data = Array.from({ length: 300_000 }, (_, i) => i % 100);
    await expect(mountChart({ datasets: [{ data }] })).resolves.toBeTruthy();
  });
});

describe("value scale", () => {
  it("uses the full plot height", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [0, 50, 100], showPoints: true }],
      padding: "0",
    });
    const [low, mid, high] = ys(pointsOf(wrapper));
    expect(low).toBeCloseTo(HEIGHT, 1);
    expect(mid).toBeCloseTo(HEIGHT / 2, 1);
    expect(high).toBeCloseTo(0, 1);
  });

  it("does not squash small value ranges", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [1.0812, 1.0815], showPoints: true }],
      padding: "0",
    });
    const [low, high] = ys(pointsOf(wrapper));
    expect(low).toBeCloseTo(HEIGHT, 1);
    expect(high).toBeCloseTo(0, 1);
  });

  it("keeps y labels on the same scale as the curve", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [1.0812, 1.0815], showPoints: true }],
      labels: { yLabels: 2 },
      padding: "0",
    });
    expect(texts(wrapper, ".y-labels text")).toEqual(["1.0812", "1.0815"]);
    const labelYs = translates(wrapper, ".y-labels .label").map((t) => t.y);
    const [low, high] = ys(pointsOf(wrapper));
    expect(low).toBeCloseTo(labelYs[0], 1);
    expect(high).toBeCloseTo(labelYs[1], 1);
  });

  it("centres flat data and labels an honest range around it", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [7, 7, 7], showPoints: true }],
      labels: { yLabels: 3 },
      padding: "0",
    });
    expect(texts(wrapper, ".y-labels text")).toEqual(["6.3", "7", "7.7"]);
    ys(pointsOf(wrapper)).forEach((y) => expect(y).toBeCloseTo(HEIGHT / 2, 1));
  });

  it("never cuts data off: min and max can only extend the axis", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [500, 1000], showPoints: true }],
      labels: { yLabels: 2 },
      min: 700,
      max: 800,
      padding: "0",
    });
    expect(texts(wrapper, ".y-labels text")).toEqual(["500", "1000"]);
    ys(pointsOf(wrapper)).forEach((y) => {
      expect(y).toBeGreaterThanOrEqual(-0.1);
      expect(y).toBeLessThanOrEqual(HEIGHT + 0.1);
    });
    expect(wrapper.find("svg svg").exists()).toBe(false);
  });

  it.each([
    [{ min: 0 }, ["0", "1000"]],
    [{ max: 2000 }, ["500", "2000"]],
    [{ min: 0, max: 2000 }, ["0", "2000"]],
    [{ min: 2000 }, ["500", "1000"]],
    [{ max: 100 }, ["500", "1000"]],
    [{ min: 800, max: 600 }, ["500", "1000"]],
    [{ min: null, max: null }, ["500", "1000"]],
  ])("resolves the axis range for %j", async (range, expected) => {
    const wrapper = await mountChart({
      datasets: [{ data: [500, 1000] }],
      labels: { yLabels: 2 },
      ...(range as object),
    });
    expect(texts(wrapper, ".y-labels text")).toEqual(expected);
    expect(warn).not.toHaveBeenCalled();
  });

  it("keeps a user min when data is flat", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [0, 0], showPoints: true }],
      labels: { yLabels: 2 },
      min: 0,
      padding: "0",
    });
    expect(texts(wrapper, ".y-labels text")).toEqual(["0", "1"]);
    ys(pointsOf(wrapper)).forEach((y) => expect(y).toBeCloseTo(HEIGHT, 1));
  });
});

describe("x positions and labels", () => {
  it("places label i under data point i", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2, 3, 4, 5, 6, 7], showPoints: true }],
      labels: { xLabels: ["a", "b", "c", "d", "e"] },
      padding: "0",
    });
    expect(xs(pointsOf(wrapper))).toEqual([0, 50, 100, 150, 200, 250, 300]);
    expect(translates(wrapper, ".x-labels .label").map((t) => t.x)).toEqual([
      0, 50, 100, 150, 200,
    ]);
  });

  it("reserves slots for labels beyond the data", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2, 3], showPoints: true }],
      labels: { xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
      padding: "0",
    });
    expect(xs(pointsOf(wrapper))).toEqual([0, 75, 150]);
    expect(translates(wrapper, ".x-labels .label").map((t) => t.x)).toEqual([
      0, 75, 150, 225, 300,
    ]);
  });

  it("renders a single point and label without NaN", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [3], fill: true, showPoints: true }],
      grid: { verticalLines: true, horizontalLines: true },
      labels: { xLabels: ["Only"], yLabels: 1 },
    });
    expect(wrapper.html()).not.toContain("NaN");
  });
});

describe("grid", () => {
  const data = [1, 2, 3, 4, 5, 6, 7];

  it("draws one vertical line per x label by default", async () => {
    const wrapper = await mountChart({
      datasets: [{ data }],
      grid: { verticalLines: true },
      labels: { xLabels: ["a", "b", "c", "d", "e"] },
      padding: "0",
    });
    expect(lineXs(wrapper, ".grid .vertical .line")).toEqual([
      0, 50, 100, 150, 200,
    ]);
  });

  it("draws one vertical line per data point without x labels", async () => {
    const wrapper = await mountChart({
      datasets: [{ data }],
      grid: { verticalLines: true },
      padding: "0",
    });
    expect(lineXs(wrapper, ".grid .vertical .line")).toEqual([
      0, 50, 100, 150, 200, 250, 300,
    ]);
  });

  it("spreads an explicit number of lines evenly", async () => {
    const wrapper = await mountChart({
      datasets: [{ data }],
      grid: {
        verticalLines: true,
        verticalLinesNumber: 3,
        horizontalLines: true,
        horizontalLinesNumber: 2,
      },
      padding: "0",
    });
    expect(lineXs(wrapper, ".grid .vertical .line")).toEqual([0, 150, 300]);
    expect(lineYs(wrapper, ".grid .horizontal .line")).toEqual([HEIGHT, 0]);
  });

  it("aligns horizontal lines with y labels by default", async () => {
    const wrapper = await mountChart({
      datasets: [{ data }],
      grid: { horizontalLines: true },
      labels: { yLabels: 3 },
      padding: "0",
    });
    expect(lineYs(wrapper, ".grid .horizontal .line")).toEqual([150, 75, 0]);
    expect(translates(wrapper, ".y-labels .label").map((t) => t.y)).toEqual([
      150, 75, 0,
    ]);
  });

  it("respects an explicit count of 0", async () => {
    const wrapper = await mountChart({
      datasets: [{ data }],
      grid: {
        verticalLines: true,
        verticalLinesNumber: 0,
        horizontalLines: true,
        horizontalLinesNumber: 0,
      },
      labels: { xLabels: ["a", "b"], yLabels: 3 },
    });
    expect(wrapper.findAll(".grid .line")).toHaveLength(0);
  });

  it("rounds non-integer counts down", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [0, 10] }],
      grid: {
        verticalLines: true,
        verticalLinesNumber: 2.5,
        horizontalLines: true,
      },
      labels: { yLabels: 2.5 },
      padding: "0",
    });
    expect(lineXs(wrapper, ".grid .vertical .line")).toEqual([0, 300]);
    expect(translates(wrapper, ".y-labels .label").map((t) => t.y)).toEqual([
      150, 0,
    ]);
    expect(texts(wrapper, ".y-labels text")).toEqual(["0", "10"]);
  });

  it("renders crisp grid lines", async () => {
    const wrapper = await mountChart({
      datasets: [{ data }],
      grid: { verticalLines: true },
    });
    expect(wrapper.find(".grid").attributes("shape-rendering")).toBe(
      "crispEdges",
    );
  });
});

describe("y label formatting", () => {
  it.each([
    [[0, 0.9], 4, ["0", "0.3", "0.6", "0.9"]],
    [[0, 1], 5, ["0", "0.25", "0.5", "0.75", "1"]],
    [
      [0, 1],
      11,
      ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1"],
    ],
    [[0, 1000], 3, ["0", "500", "1000"]],
    [[1.0812, 1.0815], 4, ["1.0812", "1.0813", "1.0814", "1.0815"]],
    [[-1, 1], 3, ["-1", "0", "1"]],
  ])(
    "rounds %j with %i labels to the tick step",
    async (data, yLabels, expected) => {
      const wrapper = await mountChart({
        datasets: [{ data }],
        labels: { yLabels },
      });
      expect(texts(wrapper, ".y-labels text")).toEqual(expected);
    },
  );

  it("passes raw values to a custom formatter", async () => {
    const formatter = vi.fn((value: number) => `$${value.toFixed(2)}`);
    const wrapper = await mountChart({
      datasets: [{ data: [0, 0.9] }],
      labels: { yLabels: 4, yLabelsTextFormatter: formatter },
    });
    const values =
      formatter.mock.lastCall && formatter.mock.calls.slice(-4).map(([v]) => v);
    [0, 0.3, 0.6, 0.9].forEach((v, i) => expect(values![i]).toBeCloseTo(v, 10));
    expect(texts(wrapper, ".y-labels text")).toEqual([
      "$0.00",
      "$0.30",
      "$0.60",
      "$0.90",
    ]);
  });
});

describe("padding and label fitting", () => {
  it.each([
    ["5", { minX: 5, minY: 5, maxX: 295, maxY: 145 }],
    ["5 10", { minX: 10, minY: 5, maxX: 290, maxY: 145 }],
    ["5 15 10", { minX: 15, minY: 5, maxX: 285, maxY: 140 }],
    ["5 10 15 20", { minX: 20, minY: 5, maxX: 290, maxY: 135 }],
    [10, { minX: 10, minY: 10, maxX: 290, maxY: 140 }],
  ])("applies padding %j", async (padding, expected) => {
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2] }],
      padding: padding as string,
      interactive: true,
    });
    expect(boundaryOf(wrapper)).toEqual(expected);
  });

  it("warns about invalid padding", async () => {
    warn.mockImplementation(() => {});
    await mountChart({ datasets: [{ data: [1, 2] }], padding: "x" });
    expect(warn.mock.calls[0][0]).toContain(
      'Invalid prop: custom validator check failed for prop "padding"',
    );
  });

  it("grows the boundary by how far labels reach past their anchors", async () => {
    stubLabelBoxes({
      x: { x: -10, y: 0, width: 20, height: 20 },
      y: { x: -30, y: -6, width: 30, height: 12 },
    });
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2, 3] }],
      labels: { xLabels: ["a", "b", "c"], yLabels: 3 },
      interactive: true,
    });
    expect(boundaryOf(wrapper)).toEqual({
      minX: 35,
      minY: 11,
      maxX: 285,
      maxY: 125,
    });
  });

  it("ignores x labels that are not at the right edge", async () => {
    stubLabelBoxes({ x: { x: -10, y: 0, width: 20, height: 20 } });
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2, 3, 4] }],
      labels: { xLabels: ["a", "b"] },
      interactive: true,
    });
    expect(boundaryOf(wrapper)).toEqual({
      minX: 15,
      minY: 5,
      maxX: 295,
      maxY: 125,
    });
  });

  it("gives the space back when labels are removed", async () => {
    stubLabelBoxes({ y: { x: -30, y: -6, width: 30, height: 12 } });
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2, 3] }],
      labels: { yLabels: 3 },
      interactive: true,
    });
    expect(boundaryOf(wrapper).minX).toBe(35);
    await wrapper.setProps({ labels: null });
    expect(boundaryOf(wrapper)).toEqual({
      minX: 5,
      minY: 5,
      maxX: 295,
      maxY: 145,
    });
  });

  it("never produces an inverted boundary on tiny charts", async () => {
    stubLabelBoxes({ y: { x: -60, y: -6, width: 60, height: 12 } });
    await layout.resize(40, 20);
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2, 3], showPoints: true }],
      labels: { yLabels: 3 },
      interactive: true,
    });
    const { minX, maxX, minY, maxY } = boundaryOf(wrapper);
    expect(maxX).toBeGreaterThanOrEqual(minX);
    expect(maxY).toBeGreaterThanOrEqual(minY);
    expect(wrapper.html()).not.toContain("NaN");
  });

  it("measures labels a bounded number of times and not on hover", async () => {
    const getBBox = stubLabelBoxes({
      y: { x: -30, y: -6, width: 30, height: 12 },
    });
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2, 3] }],
      labels: { xLabels: ["a", "b", "c"], yLabels: 3 },
      interactive: true,
    });
    expect(getBBox.mock.calls.length).toBeLessThan(20);
    const before = getBBox.mock.calls.length;
    for (let x = 0; x < WIDTH; x += 10)
      await pointer(wrapper, "pointermove", x);
    expect(getBBox.mock.calls.length).toBe(before);
  });
});

describe("interactive", () => {
  const datasets = [
    { data: [1, 2, 3], showPoints: true },
    { data: [{ value: 4, extra: "a" }, { value: 5 }], showPoints: true },
  ];

  it("emits the nearest point on pointer move, including x = 0", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    await pointer(wrapper, "pointermove", 0);
    await pointer(wrapper, "pointermove", 140);
    await pointer(wrapper, "pointermove", 280);
    expect(wrapper.emitted("mouse-move")).toEqual([
      [{ index: 0, data: [1, { value: 4, extra: "a" }] }],
      [{ index: 1, data: [2, { value: 5 }] }],
      [{ index: 2, data: [3, undefined] }],
    ]);
  });

  it("shows the active line and points", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    const line = wrapper.find(".active-line");
    expect(line.attributes("visibility")).toBe("hidden");
    await pointer(wrapper, "pointermove", 160);
    expect(line.attributes("visibility")).toBe("visible");
    expect(line.attributes("x1")).toBe("150");
    expect(wrapper.findAll(".point.is-active")).toHaveLength(2);
  });

  it("clears on pointer leave", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    await pointer(wrapper, "pointermove", 150);
    await pointer(wrapper, "pointerleave");
    expect(wrapper.emitted("mouse-move")?.at(-1)).toEqual([null]);
    expect(wrapper.find(".active-line").attributes("visibility")).toBe(
      "hidden",
    );
    expect(wrapper.find(".point.is-active").exists()).toBe(false);
  });

  it("supports touch: press to select, cancel to clear", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    await pointer(wrapper, "pointerdown", 150, "touch");
    expect(wrapper.emitted("mouse-move")?.at(-1)?.[0]).toMatchObject({
      index: 1,
    });
    await pointer(wrapper, "pointercancel", 150, "touch");
    expect(wrapper.emitted("mouse-move")?.at(-1)).toEqual([null]);
  });

  it("lets touch users scrub horizontally while still scrolling vertically", async () => {
    const wrapper = await mountChart({ datasets, interactive: true });
    expect(wrapper.find("rect").attributes("style")).toContain(
      "touch-action: pan-y",
    );
  });

  it("clears the active point when interactive is turned off", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    await pointer(wrapper, "pointermove", 150);
    await wrapper.setProps({ interactive: false });
    expect(wrapper.find(".point.is-active").exists()).toBe(false);
    expect(wrapper.emitted("mouse-move")?.at(-1)).toEqual([null]);
    await wrapper.setProps({ interactive: true });
    expect(wrapper.find(".active-line").attributes("visibility")).toBe(
      "hidden",
    );
  });

  it("does not re-emit when the hovered data is replaced by equal data", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    await pointer(wrapper, "pointermove", 150);
    await wrapper.setProps({ datasets: [...datasets] });
    expect(wrapper.emitted("mouse-move")).toHaveLength(1);
  });

  it("re-emits when the hovered data changes", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    await pointer(wrapper, "pointermove", 150);
    await wrapper.setProps({ datasets: [{ data: [10, 20, 30] }] });
    expect(wrapper.emitted("mouse-move")?.at(-1)).toEqual([
      { index: 1, data: [20] },
    ]);
  });

  it("clears when the hovered point disappears", async () => {
    const wrapper = await mountChart({
      datasets,
      padding: "0",
      interactive: true,
    });
    await pointer(wrapper, "pointermove", 300);
    await wrapper.setProps({ datasets: [{ data: [1, 2] }] });
    expect(wrapper.emitted("mouse-move")?.at(-1)).toEqual([null]);
    expect(wrapper.find(".active-line").attributes("visibility")).toBe(
      "hidden",
    );
  });
});

describe("lifecycle", () => {
  it("follows container resizes", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2] }],
      padding: "0",
      interactive: true,
    });
    await layout.resize(600, 300);
    expect(boundaryOf(wrapper)).toEqual({
      minX: 0,
      minY: 0,
      maxX: 600,
      maxY: 300,
    });
  });

  it("keeps its last size while hidden", async () => {
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2] }],
      padding: "0",
      interactive: true,
    });
    await layout.resize(0, 0);
    expect(boundaryOf(wrapper)).toEqual({
      minX: 0,
      minY: 0,
      maxX: WIDTH,
      maxY: HEIGHT,
    });
  });

  it("falls back to window resize events without ResizeObserver", async () => {
    vi.stubGlobal("ResizeObserver", undefined);
    const size = { width: 400, height: 200 };
    // happy-dom doesn't implement clientWidth/clientHeight for SVG
    const proto = SVGSVGElement.prototype;
    Object.defineProperty(proto, "clientWidth", {
      configurable: true,
      get: () => size.width,
    });
    Object.defineProperty(proto, "clientHeight", {
      configurable: true,
      get: () => size.height,
    });
    onTestFinished(() => {
      Reflect.deleteProperty(proto, "clientWidth");
      Reflect.deleteProperty(proto, "clientHeight");
    });
    const wrapper = await mountChart({
      datasets: [{ data: [1, 2] }],
      padding: "0",
      interactive: true,
    });
    expect(boundaryOf(wrapper)).toEqual({
      minX: 0,
      minY: 0,
      maxX: 400,
      maxY: 200,
    });

    size.width = 500;
    window.dispatchEvent(new Event("resize"));
    await flushPromises();
    expect(boundaryOf(wrapper).maxX).toBe(500);

    const removeListener = vi.spyOn(window, "removeEventListener");
    wrapper.unmount();
    expect(removeListener).toHaveBeenCalledWith("resize", expect.any(Function));
  });

  it("disconnects its ResizeObserver on unmount", async () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect = disconnect;
      },
    );
    const wrapper = await mountChart({ datasets: [{ data: [1] }] });
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});

describe("plugin", () => {
  it("registers the TrendChart component globally", () => {
    const app = createApp({});
    app.use(VueTrendChart);
    expect(app.component("TrendChart")).toBe(TrendChart);
  });
});
