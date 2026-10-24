// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";

import { TrendChart } from "../../src";

describe("server-side rendering", () => {
  it("renders a sensible chart before it can be measured", async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(TrendChart, {
            datasets: [{ data: [1, 5, 3], fill: true, showPoints: true }],
            grid: { verticalLines: true, horizontalLines: true },
            labels: { xLabels: ["a", "b", "c"], yLabels: 3 },
            interactive: true,
          }),
      }),
    );
    expect(html).toContain('class="vtc"');
    expect(html).not.toContain("NaN");
    // Grid, points and overlay fit the default 300x150 svg instead of
    // turning inside out (label ticks use local coordinates, so skip them)
    const elements =
      html.match(/<(?:line class="line"|circle|rect)[^>]*>/g) ?? [];
    const coordinates = elements.flatMap((el) =>
      [
        ...el.matchAll(/ (?:x1|x2|y1|y2|cx|cy|x|y|width|height)="(-?[\d.]+)"/g),
      ].map(([, value]) => Number(value)),
    );
    expect(coordinates.length).toBeGreaterThan(10);
    coordinates.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(300);
    });
  });
});
