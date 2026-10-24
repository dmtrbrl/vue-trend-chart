export const quickstartCode = `<script setup lang="ts">
import { TrendChart, type TrendChartDataset } from "vue-trend-chart";

const datasets: TrendChartDataset[] = [{
  data: [10, 50, 20, 80, 40, 60, 90],
  smooth: true,
  fill: true,
}];
</script>

<template>
  <TrendChart
    class="weekly-chart"
    aria-label="Weekly activity, rising from 10 to 90"
    :datasets="datasets"
    :labels="{ xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }"
    :min="0"
  />
</template>

<style>
.weekly-chart { height: 240px; }
.weekly-chart .stroke { stroke: #20815b; stroke-width: 2; }
.weekly-chart .fill { fill: #20815b; fill-opacity: 0.12; }
.weekly-chart .labels { font: 12px system-ui; fill: #63735d; }
</style>`;

export const comparisonCode = `<script setup lang="ts">
import { ref, watch } from "vue";
import {
  TrendChart,
  type DataPoint,
  type TrendChartMouseMoveEvent,
} from "vue-trend-chart";

const active = ref<TrendChartMouseMoveEvent | null>(null);
const container = ref<HTMLElement | null>(null);
const tooltipX = ref(0);
watch(container, (element, _, onCleanup) => {
  if (!element) return;
  const update = () => {
    const line = element.querySelector<SVGLineElement>(".active-line");
    const bounds = element.getBoundingClientRect();
    if (line && bounds.width) {
      tooltipX.value = (line.getBoundingClientRect().left - bounds.left)
        * element.clientWidth / bounds.width;
    }
  };
  const observer = new MutationObserver(update);
  observer.observe(element, {
    subtree: true, childList: true,
    attributes: true, attributeFilter: ["x1"],
  });
  update();
  onCleanup(() => observer.disconnect());
}, { flush: "post" });
const days = ["Mon", "Tue", "Wed"];
const datasets = [
  {
    data: [
      { value: 34, day: "Mon" },
      { value: 48, day: "Tue" },
      { value: 42, day: "Wed" },
    ],
    className: "organic", smooth: true, showPoints: true,
  },
  { data: [22, 30], className: "referral", smooth: true, showPoints: true },
];
const valueOf = (point: DataPoint) =>
  (point !== null && typeof point === "object" ? point.value : point) ?? "—";
</script>

<template>
  <div ref="container" class="comparison">
    <TrendChart
      style="height: 200px"
      aria-label="Organic and referral traffic"
      :datasets="datasets"
      :labels="{ xLabels: days, yLabels: 3 }"
      interactive
      @mouse-move="active = $event"
    />
    <div
      v-if="active"
      class="tooltip"
      :style="{ left: 'clamp(65px, ' + tooltipX + 'px, calc(100% - 65px))' }"
    >
      <strong>{{ days[active.index] }}</strong>
      <div>Organic: {{ valueOf(active.data[0]) }}</div>
      <div>Referral: {{ valueOf(active.data[1]) }}</div>
    </div>
  </div>
</template>

<style>
.comparison { position: relative; }
.comparison .organic .stroke, .comparison .organic .point { stroke: #20815b; }
.comparison .referral .stroke, .comparison .referral .point { stroke: #b08a50; }
.comparison .stroke { stroke-width: 2; }
.comparison .tooltip {
  position: absolute; top: 10px; transform: translateX(-50%);
  background: #263d32; color: white; border-radius: 6px;
  padding: 10px; font: 12px/1.6 system-ui; pointer-events: none;
}
</style>`;

export const streamCode = `<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { TrendChart } from "vue-trend-chart";

const values = ref([44, 48, 46, 58, 52, 61]);
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    // Replace this sample with a value from your own source.
    const sample = Math.round(40 + Math.random() * 40);
    values.value = [...values.value.slice(-17), sample];
  }, 1200);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <TrendChart
    style="height: 200px"
    aria-label="The latest 18 samples"
    :datasets="[{ data: values, smooth: true, fill: true }]"
    :labels="{ yLabels: 3 }"
    :min="0"
    :max="100"
  />
</template>`;

export const styledCode = (
  color: string,
  width: number,
) => `<script setup lang="ts">
import { TrendChart } from "vue-trend-chart";
</script>

<template>
  <div class="branded-surface">
    <svg width="0" height="0" aria-hidden="true" style="position: absolute">
      <defs>
        <linearGradient id="my-fill" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="180">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.4" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
    <TrendChart
      class="branded-chart"
      aria-label="Trend with a custom gradient"
      :datasets="[{ data: [20, 35, 30, 55, 42, 68, 60], smooth: true, fill: true }]"
    />
  </div>
</template>

<style>
.branded-surface { background: #263d32; padding: 16px; border-radius: 8px; }
.branded-chart { height: 180px; }
.branded-chart .stroke { stroke: ${color}; stroke-width: ${width}; }
.branded-chart .fill { fill: url(#my-fill); }
</style>`;

export const dataShapeCode = (
  literal: string,
  label: string,
) => `<script setup lang="ts">
import { TrendChart, type TrendChartDataset } from "vue-trend-chart";

const datasets: TrendChartDataset[] = [{
  data: ${literal},
  showPoints: true,
}];
</script>

<template>
  <TrendChart
    style="height: 200px"
    aria-label="${label} example"
    :datasets="datasets"
    :labels="{ xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], yLabels: 3 }"
  />
</template>`;

export const responsiveCode = `<script setup lang="ts">
import { TrendChart } from "vue-trend-chart";
</script>

<template>
  <div class="chart-container">
    <TrendChart
      aria-label="Quarterly progress, with April reserved for the next value"
      :datasets="[{ data: [24, 58, 44], fill: true, smooth: true }]"
      :labels="{ xLabels: ['Jan', 'Feb', 'Mar', 'Apr'], yLabels: 3 }"
      padding="8 12"
    />
  </div>
</template>

<style>
.chart-container { width: 100%; height: 180px; }
</style>`;
