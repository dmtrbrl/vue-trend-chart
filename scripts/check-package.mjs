// Checks the packed package the way users get it: run from a clean project
// that has the tarball, vue and typescript installed (see ci.yml).
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { createSSRApp, h, version } from "vue";
import { renderToString } from "vue/server-renderer";
import VueTrendChart, { TrendChart } from "vue-trend-chart";

// ESM: plugin and named component, rendered on the server
const app = createSSRApp({
  render: () =>
    h(TrendChart, {
      datasets: [{ data: [1, 5, 3], smooth: true, fill: true }],
      grid: { verticalLines: true },
      labels: { xLabels: ["a", "b", "c"], yLabels: 3 },
    }),
});
app.use(VueTrendChart);
const html = await renderToString(app);
assert.match(html, /class="vtc"/);
assert.match(html, /class="curve"/);
assert.doesNotMatch(html, /NaN/);
assert.equal(app.component("TrendChart"), TrendChart);

// CommonJS: require() returns the plugin, with the component attached
const plugin = createRequire(import.meta.url)("vue-trend-chart");
assert.equal(typeof plugin.install, "function");
assert.equal(plugin.TrendChart.name, "TrendChart");

// Types resolve, and catch a wrong prop
writeFileSync(
  "types-check.ts",
  `import VueTrendChart, { TrendChart, type TrendChartDataset } from "vue-trend-chart";
const datasets: TrendChartDataset[] = [
  { data: [1, null, undefined, "3", { value: 2 }, { value: "4", day: "Mon" }], fill: true },
];
// @ts-expect-error data must be an array
const invalid: TrendChartDataset = { data: 5 };
export { VueTrendChart, TrendChart, datasets, invalid };
`,
);
execFileSync(
  "npx",
  [
    "tsc",
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "--module",
    "nodenext",
    "types-check.ts",
  ],
  { stdio: "inherit" },
);

console.log(`vue-trend-chart works with vue ${version}`);
