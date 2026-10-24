import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "vue";
import { flushPromises, mount } from "@vue/test-utils";

import VueTrendChart, { TrendChart, type TrendChartDataset } from "../src";

const WIDTH = 300;
const HEIGHT = 150;

const rect = (left: number, top: number, right: number, bottom: number) =>
  ({
    x: left,
    y: top,
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
    toJSON: () => ({}),
  }) as DOMRect;

const translate = (el: Element | null) =>
  (el?.getAttribute("transform")?.match(/[-\d.]+/g) ?? []).map(Number);

// Simulated label size around the chart's boundary
const LABELS_OVERFLOW = { top: 6, right: 12, bottom: 20, left: 30 };

// happy-dom does no layout: the svg gets a fixed size, and the labels group a
// box that follows the boundary (read back from label positions) like a browser
const mockLayout = ({ hiddenLabels = false } = {}) =>
  vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      if (this.tagName === "svg") return rect(0, 0, WIDTH, HEIGHT);
      if (!this.classList.contains("labels") || hiddenLabels)
        return rect(0, 0, 0, 0);
      const xLabels = this.querySelectorAll(".x-labels .label");
      const [minX, maxY] = translate(xLabels[0]);
      const [maxX] = translate(xLabels[xLabels.length - 1]);
      const [, minY] = translate(
        this.querySelector(".y-labels .label:last-child"),
      );
      return rect(
        minX - LABELS_OVERFLOW.left,
        minY - LABELS_OVERFLOW.top,
        maxX + LABELS_OVERFLOW.right,
        maxY + LABELS_OVERFLOW.bottom,
      );
    });

beforeEach(() => {
  mockLayout();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TrendChart", () => {
  it("renders the documented class structure", async () => {
    const wrapper = mount(TrendChart, {
      props: {
        datasets: [
          {
            data: [10, 50, 20],
            className: "curve1",
            smooth: true,
            fill: true,
            showPoints: true,
          },
          { data: [{ value: 5 }, { value: 15 }], stroke: false },
        ],
        grid: { verticalLines: true, horizontalLines: true },
        labels: {
          xLabels: ["Mon", "Tue", "Wed"],
          yLabels: 4,
          yLabelsTextFormatter: (val: number) => `$${val}`,
        },
        min: 0,
      },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.element.tagName).toBe("svg");
    expect(wrapper.classes()).toContain("vtc");
    expect(wrapper.findAll(".grid .vertical .line")).toHaveLength(3);
    expect(wrapper.findAll(".grid .horizontal .line")).toHaveLength(4);
    expect(
      wrapper.findAll(".labels .x-labels .label text").map((t) => t.text()),
    ).toEqual(["Mon", "Tue", "Wed"]);
    expect(
      wrapper.findAll(".labels .y-labels .label text").map((t) => t.text()),
    ).toEqual(["$0", "$16.666666666666668", "$33.333333333333336", "$50"]);

    const curves = wrapper.findAll("g.curve");
    expect(curves).toHaveLength(2);
    expect(curves[0].classes()).toContain("curve1");
    expect(curves[0].find("path.fill").exists()).toBe(true);
    expect(curves[0].find("path.stroke").exists()).toBe(true);
    expect(curves[0].findAll(".points circle.point")).toHaveLength(3);
    expect(curves[1].find("path.stroke").exists()).toBe(false);
    expect(wrapper.find(".active-line").exists()).toBe(false);
    expect(wrapper.html()).not.toContain("NaN");
  });

  it("emits mouse-move with the nearest index and data", async () => {
    const wrapper = mount(TrendChart, {
      props: {
        datasets: [
          { data: [1, 2, 3], showPoints: true },
          { data: [{ value: 4, extra: "a" }, { value: 5 }] },
        ],
        padding: "0",
        interactive: true,
      },
    });
    await wrapper.vm.$nextTick();
    const overlay = wrapper.find("rect");

    // x = 0 is the first point and must still activate it
    await overlay.trigger("mousemove", { clientX: 0 });
    await overlay.trigger("mousemove", { clientX: 140 });
    await overlay.trigger("mousemove", { clientX: 280 });

    expect(wrapper.emitted("mouse-move")).toEqual([
      [{ index: 0, data: [1, { value: 4, extra: "a" }] }],
      [{ index: 1, data: [2, { value: 5 }] }],
      [{ index: 2, data: [3, undefined] }],
    ]);
    const activeLine = wrapper.find(".active-line");
    expect(activeLine.attributes("visibility")).toBe("visible");
    expect(activeLine.attributes("x1")).toBe(String(WIDTH));
    expect(wrapper.findAll(".point.is-active")).toHaveLength(1);

    await overlay.trigger("mouseout");
    expect(wrapper.emitted("mouse-move")?.at(-1)).toEqual([null]);
    expect(activeLine.attributes("visibility")).toBe("hidden");
    expect(wrapper.find(".point.is-active").exists()).toBe(false);
  });

  it("accepts user-defined interfaces as data points", () => {
    interface Download {
      value: number;
      day: string;
    }
    const data: Download[] = [{ value: 1, day: "2026-01-01" }];
    const datasets: TrendChartDataset[] = [{ data }];
    expect(
      mount(TrendChart, { props: { datasets } }).find(".curve").exists(),
    ).toBe(true);
  });

  it("fits the boundary around labels", async () => {
    const wrapper = mount(TrendChart, {
      props: {
        datasets: [{ data: [1, 2, 3] }],
        grid: { verticalLines: true },
        labels: { xLabels: ["a", "b", "c"], yLabels: 3 },
      },
    });
    await flushPromises();

    const padding = 5;
    const lines = wrapper.findAll(".grid .vertical .line");
    expect(lines[0].attributes("x1")).toBe(
      String(padding + LABELS_OVERFLOW.left),
    );
    expect(lines[0].attributes("y1")).toBe(
      String(padding + LABELS_OVERFLOW.top),
    );
    expect(lines[0].attributes("y2")).toBe(
      String(HEIGHT - padding - LABELS_OVERFLOW.bottom),
    );
    expect(lines[2].attributes("x1")).toBe(
      String(WIDTH - padding - LABELS_OVERFLOW.right),
    );

    // Refits (without growing further) when labels change
    await wrapper.setProps({
      labels: { xLabels: ["a", "b", "c", "d"], yLabels: 3 },
    });
    await flushPromises();
    expect(lines[0].attributes("x1")).toBe(
      String(padding + LABELS_OVERFLOW.left),
    );
  });

  it("ignores labels hidden with CSS", async () => {
    vi.restoreAllMocks();
    mockLayout({ hiddenLabels: true });
    const wrapper = mount(TrendChart, {
      props: {
        datasets: [{ data: [1, 2, 3] }],
        grid: { verticalLines: true },
        labels: { xLabels: ["a", "b", "c"], yLabels: 3 },
      },
    });
    await flushPromises();
    expect(wrapper.find(".grid .line").attributes("x1")).toBe("5");
  });

  it("does not render NaN for empty or single-point datasets", async () => {
    const wrapper = mount(TrendChart, {
      props: {
        datasets: [{ data: [] }, { data: [3], fill: true, showPoints: true }],
        grid: { verticalLines: true },
        labels: { xLabels: ["Only"], yLabels: 1 },
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).not.toContain("NaN");
  });

  it("warns about invalid padding", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    mount(TrendChart, {
      props: { datasets: [{ data: [1, 2] }], padding: "x" },
    });
    expect(warn.mock.calls[0][0]).toContain(
      'Invalid prop: custom validator check failed for prop "padding"',
    );
  });

  it("cleans up its resize listener on unmount", () => {
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect = disconnect;
      },
    );
    const wrapper = mount(TrendChart, { props: { datasets: [{ data: [1] }] } });
    wrapper.unmount();
    expect(disconnect).toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe("plugin", () => {
  it("registers the TrendChart component globally", () => {
    const app = createApp({});
    app.use(VueTrendChart);
    expect(app.component("TrendChart")).toBe(TrendChart);
  });
});
