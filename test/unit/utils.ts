import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { vi } from "vitest";

import { TrendChart } from "../../src";

export const WIDTH = 300;
export const HEIGHT = 150;

type ChartProps = InstanceType<typeof TrendChart>["$props"];
type LabelBox = { x: number; y: number; width: number; height: number };

// happy-dom does no layout. Report the chart size through both
// ResizeObserver and getBoundingClientRect, and let tests resize it.
export const stubLayout = (width = WIDTH, height = HEIGHT) => {
  const size = { width, height };
  const fire: Array<() => void> = [];
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function (this: Element) {
      const [w, h] =
        this.tagName === "svg" ? [size.width, size.height] : [0, 0];
      return {
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        right: w,
        bottom: h,
        width: w,
        height: h,
        toJSON: () => ({}),
      } as DOMRect;
    },
  );
  // Like browsers, deliver all pending targets in one callback per observer
  vi.stubGlobal(
    "ResizeObserver",
    class {
      private targets = new Set<Element>();
      private pending = new Set<Element>();
      constructor(private callback: ResizeObserverCallback) {}
      private schedule(targets: Iterable<Element>) {
        const wasEmpty = !this.pending.size;
        for (const target of targets) this.pending.add(target);
        if (!wasEmpty || !this.pending.size) return;
        queueMicrotask(() => {
          const entries = [...this.pending].map(
            (target) =>
              ({
                target,
                contentRect: { width: size.width, height: size.height },
                contentBoxSize: [
                  { inlineSize: size.width, blockSize: size.height },
                ],
              }) as unknown as ResizeObserverEntry,
          );
          this.pending.clear();
          this.callback(entries, this as unknown as ResizeObserver);
        });
      }
      observe(target: Element) {
        this.targets.add(target);
        this.schedule([target]);
        fire.push(() => this.schedule(this.targets));
      }
      unobserve(target: Element) {
        this.targets.delete(target);
        this.pending.delete(target);
      }
      disconnect() {
        this.targets.clear();
        this.pending.clear();
      }
    },
  );
  return {
    resize: async (w: number, h: number) => {
      size.width = w;
      size.height = h;
      fire.forEach((notify) => notify());
      await flushPromises();
    },
  };
};

// Give every rendered label a fixed size, relative to its own anchor
export const stubLabelBoxes = (boxes: { x?: LabelBox; y?: LabelBox }) =>
  vi
    .spyOn(SVGGraphicsElement.prototype, "getBBox")
    .mockImplementation(function (this: SVGGraphicsElement) {
      const box = this.closest(".x-labels")
        ? boxes.x
        : this.closest(".y-labels")
          ? boxes.y
          : undefined;
      return (box ?? { x: 0, y: 0, width: 0, height: 0 }) as DOMRect;
    });

export const mountChart = async (
  props: ChartProps,
  { attrs }: { attrs?: Record<string, unknown> } = {},
) => {
  const wrapper = mount(TrendChart, {
    props,
    attrs,
    attachTo: document.body,
  });
  await flushPromises();
  return wrapper;
};

const num = (value: string | undefined) => Number(value);

export const pointsOf = (wrapper: VueWrapper, curve = 0) =>
  wrapper
    .findAll("g.curve")
    [curve].findAll("circle")
    .map((c) => ({ x: num(c.attributes("cx")), y: num(c.attributes("cy")) }));

export const translates = (wrapper: VueWrapper, selector: string) =>
  wrapper.findAll(selector).map((el) => {
    const [x, y] = (el.attributes("transform") ?? "")
      .match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)!
      .map(Number);
    return { x, y };
  });

export const lineXs = (wrapper: VueWrapper, selector: string) =>
  wrapper.findAll(selector).map((l) => num(l.attributes("x1")));

export const lineYs = (wrapper: VueWrapper, selector: string) =>
  wrapper.findAll(selector).map((l) => num(l.attributes("y1")));

export const texts = (wrapper: VueWrapper, selector: string) =>
  wrapper.findAll(selector).map((t) => t.text());

// The interactive overlay covers exactly the plot boundary
export const boundaryOf = (wrapper: VueWrapper) => {
  const rect = wrapper.find("rect");
  const [x, y, width, height] = ["x", "y", "width", "height"].map((a) =>
    num(rect.attributes(a)),
  );
  return { minX: x, minY: y, maxX: x + width, maxY: y + height };
};

export const pointer = async (
  wrapper: VueWrapper,
  type: string,
  clientX = 0,
  pointerType = "mouse",
) => {
  wrapper.find("rect").element.dispatchEvent(
    new PointerEvent(type, {
      clientX,
      clientY: 10,
      pointerType,
      bubbles: true,
    }),
  );
  await flushPromises();
};
