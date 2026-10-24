<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
} from "vue";

import validatePadding from "../helpers/validatePadding";
import getPadding from "../helpers/getPadding";
import getStep from "../helpers/getStep";
import getValue from "../helpers/getValue";
import type {
  ActiveLineParams,
  Padding,
  TrendChartDataset,
  TrendChartGridOptions,
  TrendChartLabelsOptions,
  TrendChartMouseMoveEvent,
} from "../types";

import TrendChartGrid from "./trend-chart-grid.vue";
import TrendChartLabels from "./trend-chart-labels.vue";
import TrendChartCurve from "./trend-chart-curve.vue";

defineOptions({ name: "TrendChart" });

const props = defineProps({
  datasets: {
    required: true,
    type: Array as PropType<TrendChartDataset[]>,
  },
  grid: {
    default: null,
    type: Object as PropType<TrendChartGridOptions | null>,
  },
  labels: {
    default: null,
    type: Object as PropType<TrendChartLabelsOptions | null>,
  },
  max: {
    type: Number,
  },
  min: {
    type: Number,
  },
  padding: {
    default: "5",
    type: String,
    validator: (value: string) => validatePadding(value),
  },
  interactive: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits<{
  "mouse-move": [event: TrendChartMouseMoveEvent | null];
}>();

const noOverflow = (): Padding => ({ top: 0, right: 0, bottom: 0, left: 0 });

const chart = ref<SVGSVGElement | null>(null);
const width = ref(0);
const height = ref(0);
const labelsOverflow = ref<Padding>(noOverflow());
const activeIndex = ref<number | null>(null);

const paddingObject = computed(() => getPadding(props.padding || "0"));

const boundary = computed(() => {
  const padding = paddingObject.value;
  const overflow = labelsOverflow.value;
  return {
    minX: padding.left + overflow.left,
    minY: padding.top + overflow.top,
    maxX: width.value - padding.right - overflow.right,
    maxY: height.value - padding.bottom - overflow.bottom,
  };
});

const params = computed(() => {
  let maxValue = -Infinity;
  let minValue = Infinity;
  let maxAmount = 0;
  props.datasets.forEach((dataset) => {
    const values = dataset.data.map(getValue);
    if (!values.length) return;
    maxValue = Math.max(maxValue, ...values);
    minValue = Math.min(minValue, ...values);
    maxAmount = Math.max(maxAmount, values.length);
  });
  if (props.max !== undefined && props.max > maxValue) maxValue = props.max;
  if (props.min !== undefined && props.min < minValue) minValue = props.min;
  return { maxValue, minValue, maxAmount };
});

const chartOverlayParams = computed(() => {
  const { minX, minY, maxX, maxY } = boundary.value;
  return {
    x: minX,
    y: minY,
    width: Math.max(maxX - minX, 0),
    height: Math.max(maxY - minY, 0),
    opacity: 0,
  };
});

const chartAxesXCoords = computed(() => {
  const { minX, maxX } = boundary.value;
  const { maxAmount } = params.value;
  const step = getStep(maxX - minX, maxAmount);
  return Array.from({ length: maxAmount }, (_, i) => step * i + minX);
});

const activeLineParams = computed<ActiveLineParams | null>(() =>
  activeIndex.value === null ? null : { index: activeIndex.value },
);

const activeLineX = computed(() =>
  activeIndex.value === null
    ? null
    : (chartAxesXCoords.value[activeIndex.value] ?? null),
);

const hasLabels = computed(
  () =>
    !!props.labels &&
    (!!props.labels.xLabels?.length || (props.labels.yLabels ?? 0) > 0),
);

const setSize = () => {
  if (!chart.value) return;
  const rect = chart.value.getBoundingClientRect();
  width.value = rect.width;
  height.value = rect.height;
};

// Grow the boundary so that labels drawn outside of it stay inside the svg.
// Called after every labels render. How far labels stick out of the boundary
// doesn't depend on the overflow itself, so repeated calls converge.
const fitLabels = (labelsEl: SVGGElement) => {
  if (!chart.value) return;
  const chartRect = chart.value.getBoundingClientRect();
  const labelsRect = labelsEl.getBoundingClientRect();
  const { minX, minY, maxX, maxY } = boundary.value;
  const prev = labelsOverflow.value;
  // Labels hidden with CSS have an empty rect that doesn't follow the boundary
  const isRendered = labelsRect.width > 0 || labelsRect.height > 0;
  const next = isRendered
    ? {
        top: Math.max(chartRect.top + minY - labelsRect.top, 0),
        right: Math.max(labelsRect.right - chartRect.left - maxX, 0),
        bottom: Math.max(labelsRect.bottom - chartRect.top - maxY, 0),
        left: Math.max(chartRect.left + minX - labelsRect.left, 0),
      }
    : noOverflow();
  // Ignore sub-pixel noise to avoid render loops
  const changed = (Object.keys(next) as Array<keyof Padding>).some(
    (side) => Math.abs(next[side] - prev[side]) > 0.5,
  );
  if (changed) labelsOverflow.value = next;
};

const getNearestIndex = (x: number) =>
  chartAxesXCoords.value.reduce<number | null>(
    (nearest, coord, i, coords) =>
      nearest === null || Math.abs(coord - x) < Math.abs(coords[nearest] - x)
        ? i
        : nearest,
    null,
  );

const onMouseMove = (e: MouseEvent) => {
  if (!chart.value) return;
  const rect = chart.value.getBoundingClientRect();
  activeIndex.value = getNearestIndex(e.clientX - rect.left);
};

const onMouseOut = () => {
  activeIndex.value = null;
};

watch(activeIndex, (index) => {
  emit(
    "mouse-move",
    index === null
      ? null
      : { index, data: props.datasets.map((dataset) => dataset.data[index]) },
  );
});

watch(hasLabels, (value) => {
  if (!value) labelsOverflow.value = noOverflow();
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  setSize();
  if (typeof ResizeObserver !== "undefined" && chart.value) {
    resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(chart.value);
  } else {
    window.addEventListener("resize", setSize);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", setSize);
});
</script>

<template>
  <svg
    ref="chart"
    class="vtc"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <TrendChartGrid
      v-if="grid"
      class="grid"
      :vertical-lines="grid.verticalLines"
      :vertical-lines-number="grid.verticalLinesNumber || params.maxAmount"
      :horizontal-lines="grid.horizontalLines"
      :horizontal-lines-number="
        grid.horizontalLinesNumber || labels?.yLabels || 0
      "
      :boundary="boundary"
    />
    <line
      v-if="interactive"
      class="active-line"
      :x1="activeLineX ?? boundary.minX"
      :x2="activeLineX ?? boundary.minX"
      :y1="boundary.minY"
      :y2="boundary.maxY"
      stroke="black"
      :visibility="activeLineX === null ? 'hidden' : 'visible'"
    />
    <TrendChartLabels
      v-if="labels"
      class="labels"
      v-bind="labels"
      :boundary="boundary"
      :min-value="params.minValue"
      :max-value="params.maxValue"
      @render="fitLabels"
    />
    <TrendChartCurve
      v-for="(dataset, i) in datasets"
      :key="i"
      class="curve"
      v-bind="dataset"
      :boundary="boundary"
      :min-value="params.minValue"
      :max-value="params.maxValue"
      :max-amount="params.maxAmount"
      :active-line-params="activeLineParams"
    />
    <rect
      v-if="interactive"
      v-bind="chartOverlayParams"
      @mousemove="onMouseMove"
      @mouseout="onMouseOut"
    />
  </svg>
</template>
