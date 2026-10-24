import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { createApp, h, nextTick, reactive, type App } from "vue";

import { TrendChart } from "../../src";

type Props = InstanceType<typeof TrendChart>["$props"];

const apps: App[] = [];
const hosts: HTMLElement[] = [];

afterEach(() => {
  apps.splice(0).forEach((app) => app.unmount());
  hosts.splice(0).forEach((host) => host.remove());
  document.head.querySelectorAll("style[data-test]").forEach((s) => s.remove());
});

// A rendering frame: ResizeObserver callbacks and Vue updates have run
const frame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => setTimeout(resolve, 0)),
  );

const settle = async () => {
  await nextTick();
  await frame();
  await frame();
};

const addStyle = (css: string) => {
  const style = document.createElement("style");
  style.dataset.test = "";
  style.textContent = css;
  document.head.append(style);
};

/**
 * Mounts a chart inside `outer > inner`. `outer` takes wrapper styles such as
 * transforms or zoom, `inner` is the chart's sized container.
 */
const mountChart = async (
  initialProps: Props,
  { inner = "width: 400px; height: 200px", outer = "" } = {},
) => {
  const outerEl = document.body.appendChild(document.createElement("div"));
  outerEl.style.cssText = `font: 12px sans-serif; ${outer}`;
  const innerEl = outerEl.appendChild(document.createElement("div"));
  innerEl.style.cssText = inner;
  hosts.push(outerEl);

  const props = reactive({ ...initialProps }) as Props;
  const events: unknown[] = [];
  const errors: unknown[] = [];
  const app = createApp({
    render: () =>
      h(TrendChart, { ...props, onMouseMove: (e: unknown) => events.push(e) }),
  });
  app.config.errorHandler = (err) => errors.push(err);
  app.config.warnHandler = (msg) => {
    if (/recursive/i.test(msg)) errors.push(msg);
  };
  app.mount(innerEl);
  apps.push(app);
  await settle();

  const svg = innerEl.querySelector("svg")!;
  return { svg, props, events, errors, outer: outerEl, inner: innerEl };
};

const labelsData: Props = {
  datasets: [
    { data: [10, 50, 20, 100, 40, 60, 80], fill: true, showPoints: true },
  ],
  grid: { verticalLines: true, horizontalLines: true },
  labels: {
    xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    yLabels: 5,
    yLabelsTextFormatter: (v: number) => "$" + Math.round(v * 1000),
  },
};

const rectOf = (el: Element) => el.getBoundingClientRect();

const expectInside = (inner: DOMRect, outer: DOMRect, tolerance = 1) => {
  expect(inner.left).toBeGreaterThanOrEqual(outer.left - tolerance);
  expect(inner.top).toBeGreaterThanOrEqual(outer.top - tolerance);
  expect(inner.right).toBeLessThanOrEqual(outer.right + tolerance);
  expect(inner.bottom).toBeLessThanOrEqual(outer.bottom + tolerance);
};

// Every coordinate the chart rendered, to catch runaway or NaN geometry
const coordinates = (svg: SVGSVGElement) =>
  [...svg.querySelectorAll("*")].flatMap((el) =>
    ["x", "y", "x1", "x2", "y1", "y2", "cx", "cy", "width", "height"]
      .map((name) => el.getAttribute(name))
      .filter((v): v is string => v !== null)
      .map(Number),
  );

const expectSaneGeometry = (svg: SVGSVGElement) => {
  const values = coordinates(svg);
  expect(values.every(Number.isFinite)).toBe(true);
  expect(Math.max(...values.map(Math.abs))).toBeLessThan(10_000);
};

describe("label fitting", () => {
  it("keeps labels inside the chart with padding", async () => {
    const { svg, errors } = await mountChart(labelsData);
    const labels = rectOf(svg.querySelector(".labels")!);
    const chart = rectOf(svg);
    expect(errors).toEqual([]);
    expectInside(labels, chart);
    // About the 5px padding; engines' text boxes differ by up to ~1px
    expect(labels.left - chart.left).toBeGreaterThanOrEqual(3);
    expect(chart.bottom - labels.bottom).toBeGreaterThanOrEqual(3);
  });

  it("fits labels that appear after mount", async () => {
    const { svg, props } = await mountChart({ datasets: [] });
    Object.assign(props, labelsData);
    await settle();
    expectInside(rectOf(svg.querySelector(".labels")!), rectOf(svg));
  });

  it.each([
    ["narrower than its labels", "width: 70px; height: 200px"],
    ["zero width", "width: 0; height: 200px"],
    ["very short", "width: 400px; height: 30px"],
  ])("stays stable when %s, then recovers", async (_, inner) => {
    const chart = await mountChart(labelsData, { inner });
    expect(chart.errors).toEqual([]);
    expectSaneGeometry(chart.svg);

    chart.inner.style.cssText = "width: 400px; height: 200px";
    await settle();
    expect(chart.errors).toEqual([]);
    expectInside(
      rectOf(chart.svg.querySelector(".labels")!),
      rectOf(chart.svg),
    );
  });

  it("stays stable inside a collapsed panel, then fits when expanded", async () => {
    const chart = await mountChart(labelsData, {
      outer: "height: 0; overflow: hidden",
    });
    expect(chart.errors).toEqual([]);
    expectSaneGeometry(chart.svg);

    chart.outer.style.height = "auto";
    await settle();
    expectInside(
      rectOf(chart.svg.querySelector(".labels")!),
      rectOf(chart.svg),
    );
  });

  it.each([
    ["CSS zoom", "zoom: 2"],
    ["a scale transform", "transform: scale(0.5); transform-origin: 0 0"],
  ])("fits labels under %s", async (_, outer) => {
    const { svg, errors } = await mountChart(labelsData, { outer });
    expect(errors).toEqual([]);
    expectInside(rectOf(svg.querySelector(".labels")!), rectOf(svg));
  });

  it("does not loop when user CSS moves labels", async () => {
    addStyle(".vtc .y-labels .label { transform: translateX(-4px); }");
    const { svg, errors } = await mountChart(labelsData);
    expect(errors).toEqual([]);
    expectSaneGeometry(svg);
  });

  it.each([
    ["CSS changes after render", "font-size: 24px"],
    [
      "longer label text from wider fonts",
      "font-family: monospace; font-size: 20px",
    ],
  ])("refits when %s", async (_, css) => {
    const { svg } = await mountChart(labelsData);
    // No resize, no text change and no font event: only the style changes
    addStyle(`.vtc text { ${css} }`);
    await settle();
    expectInside(rectOf(svg.querySelector(".labels")!), rectOf(svg));
  });
});

describe("resize observer", () => {
  it("does not trigger ResizeObserver loop errors while fitting labels", async () => {
    const loopErrors: string[] = [];
    const onError = (e: ErrorEvent) => {
      if (/ResizeObserver loop/.test(e.message)) loopErrors.push(e.message);
    };
    window.addEventListener("error", onError);
    try {
      const chart = await mountChart(labelsData);
      chart.inner.style.width = "600px";
      await settle();
      addStyle(".vtc text { font-size: 20px; }");
      await settle();
      await frame();
    } finally {
      window.removeEventListener("error", onError);
    }
    expect(loopErrors).toEqual([]);
  });
});

describe("sizing", () => {
  it("fills its container", async () => {
    const { svg } = await mountChart({ ...labelsData, labels: null });
    const lines = svg.querySelectorAll(".grid .vertical .line");
    expect(Number(lines[lines.length - 1].getAttribute("x1"))).toBe(395);
  });

  it("measures its own size, not its on-screen size, under transforms", async () => {
    const { svg, outer } = await mountChart(
      { ...labelsData, labels: null },
      { outer: "transform: scale(0.9); transform-origin: 0 0" },
    );
    // Like a modal finishing its enter animation
    outer.style.transform = "";
    await settle();
    const lines = svg.querySelectorAll(".grid .vertical .line");
    expect(Number(lines[lines.length - 1].getAttribute("x1"))).toBe(395);
  });

  it("uses the content box when the svg has border and padding", async () => {
    addStyle(
      ".vtc { border: 10px solid; padding: 15px; box-sizing: border-box; }",
    );
    const { svg } = await mountChart({ ...labelsData, labels: null });
    const lines = svg.querySelectorAll(".grid .vertical .line");
    // 400 - 2 * 10 - 2 * 15 = 350 wide content box, minus 5 padding
    expect(Number(lines[lines.length - 1].getAttribute("x1"))).toBe(345);
  });

  it("recovers after being mounted hidden", async () => {
    const chart = await mountChart(
      { ...labelsData, labels: null },
      { outer: "display: none" },
    );
    chart.outer.style.display = "";
    await settle();
    const lines = chart.svg.querySelectorAll(".grid .vertical .line");
    expect(Number(lines[lines.length - 1].getAttribute("x1"))).toBe(395);
  });

  it("keeps flat lines visible for gradient strokes on tall charts", async () => {
    const { svg } = await mountChart(
      { datasets: [{ data: [5, 5, 5] }] },
      { inner: "width: 400px; height: 1000px" },
    );
    const stroke = svg.querySelector<SVGPathElement>(".stroke")!;
    expect(stroke.getBBox().height).toBeGreaterThan(0);
  });
});

describe("pointer", () => {
  const data: Props = {
    datasets: [{ data: [1, 2, 3, 4, 5], showPoints: true }],
    padding: "0",
    interactive: true,
  };

  // Hover each point at its real on-screen position
  const hoverEachPoint = async (svg: SVGSVGElement, events: unknown[]) => {
    const overlay = svg.querySelector("rect")!;
    const points = [...svg.querySelectorAll(".point")];
    const picked: Array<number | null> = [];
    for (const point of points) {
      const box = rectOf(point);
      overlay.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          clientX: box.left + box.width / 2,
          clientY: box.top + box.height / 2,
        }),
      );
      await nextTick();
      const last = events.at(-1) as { index: number } | null | undefined;
      picked.push(last?.index ?? null);
    }
    return picked;
  };

  it.each([
    ["plain", "", ""],
    ["a scale transform", "transform: scale(0.5); transform-origin: 0 0", ""],
    ["CSS zoom", "zoom: 1.25", ""],
    [
      "svg border and padding",
      "",
      ".vtc { border: 10px solid; padding: 15px; box-sizing: border-box; }",
    ],
  ])("picks the hovered point under %s", async (_, outer, css) => {
    if (css) addStyle(css);
    const { svg, events } = await mountChart(data, { outer });
    expect(await hoverEachPoint(svg, events)).toEqual([0, 1, 2, 3, 4]);
  });

  it("works end to end with a real mouse", async () => {
    const { svg, events } = await mountChart(data);
    const overlay = svg.querySelector("rect")!;
    await page.elementLocator(overlay).hover({ position: { x: 300, y: 100 } });
    await settle();
    expect(events.at(-1)).toMatchObject({ index: 3 });
    const away = document.body.appendChild(document.createElement("div"));
    away.style.cssText =
      "position: fixed; right: 0; bottom: 0; width: 20px; height: 20px";
    hosts.push(away);
    await page.elementLocator(away).hover();
    await settle();
    expect(events.at(-1)).toBeNull();
  });
});
