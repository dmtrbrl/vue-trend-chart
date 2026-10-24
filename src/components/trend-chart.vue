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
import getDomain from "../helpers/getDomain";
import getEvenlySpaced from "../helpers/getEvenlySpaced";
import toCount from "../helpers/toCount";
import type {
  Boundary,
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
    type: Number as PropType<number | null>,
  },
  min: {
    type: Number as PropType<number | null>,
  },
  padding: {
    default: "5",
    type: [String, Number],
    validator: (value: string | number) => validatePadding(value),
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
// The default size of an svg, used until measured (e.g. when rendered on the
// server) so the chart never draws inverted geometry
const width = ref(300);
const height = ref(150);
const labelsOverflow = ref<Padding>(noOverflow());
const activeIndex = ref<number | null>(null);

const paddingObject = computed(() => getPadding(props.padding || "0"));

const boundary = computed<Boundary>(() => {
  const padding = paddingObject.value;
  const overflow = labelsOverflow.value;
  const minX = padding.left + overflow.left;
  const minY = padding.top + overflow.top;
  return {
    minX,
    minY,
    // Small charts collapse to a line instead of turning inside out
    maxX: Math.max(minX, width.value - padding.right - overflow.right),
    maxY: Math.max(minY, height.value - padding.bottom - overflow.bottom),
  };
});

const domain = computed(() => getDomain(props.datasets, props.min, props.max));

const maxAmount = computed(() =>
  props.datasets.reduce((max, { data }) => Math.max(max, data.length), 0),
);

const xLabelsCount = computed(() => props.labels?.xLabels?.length ?? 0);

// Evenly spaced x positions. Point i and x label i share slot i; labels can
// reserve slots for data that isn't there yet.
const slotXs = computed(() => {
  const { minX, maxX } = boundary.value;
  return getEvenlySpaced(
    minX,
    maxX,
    Math.max(maxAmount.value, xLabelsCount.value),
  );
});

const yTicks = computed(() => {
  const { minY, maxY } = boundary.value;
  const count = toCount(props.labels?.yLabels);
  const ys = getEvenlySpaced(maxY, minY, count);
  const values = getEvenlySpaced(domain.value.min, domain.value.max, count);
  return ys.map((y, i) => ({ y, value: values[i] }));
});

const gridXs = computed(() => {
  const { verticalLines, verticalLinesNumber } = props.grid ?? {};
  if (!verticalLines) return [];
  if (verticalLinesNumber != null) {
    const { minX, maxX } = boundary.value;
    return getEvenlySpaced(minX, maxX, toCount(verticalLinesNumber));
  }
  return xLabelsCount.value
    ? slotXs.value.slice(0, xLabelsCount.value)
    : slotXs.value;
});

const gridYs = computed(() => {
  const { horizontalLines, horizontalLinesNumber } = props.grid ?? {};
  if (!horizontalLines) return [];
  if (horizontalLinesNumber == null) return yTicks.value.map(({ y }) => y);
  const { minY, maxY } = boundary.value;
  return getEvenlySpaced(maxY, minY, toCount(horizontalLinesNumber));
});

const curveProps = (dataset: TrendChartDataset) => ({
  ...dataset,
  boundary: boundary.value,
  domain: domain.value,
  xCoords: slotXs.value,
  activeIndex: activeEvent.value?.index ?? null,
});

const chartOverlayParams = computed(() => {
  const { minX, minY, maxX, maxY } = boundary.value;
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    opacity: 0,
  };
});

const hasLabels = computed(
  () =>
    !!props.labels &&
    (!!xLabelsCount.value || toCount(props.labels.yLabels) > 0),
);

const onLabelsMeasure = (overflow: Padding) => {
  labelsOverflow.value = overflow;
};

watch(hasLabels, (value) => {
  if (!value) labelsOverflow.value = noOverflow();
});

// Size comes from the svg's own content box: unlike getBoundingClientRect it
// isn't affected by transforms, zoom, borders or padding
const setSize = (newWidth: number, newHeight: number) => {
  // Hidden charts keep their last size
  if (!newWidth || !newHeight) return;
  width.value = newWidth;
  height.value = newHeight;
};

const measureSize = () => {
  if (!chart.value) return;
  const style = getComputedStyle(chart.value);
  const px = (value: string) => Number.parseFloat(value) || 0;
  setSize(
    chart.value.clientWidth - px(style.paddingLeft) - px(style.paddingRight),
    chart.value.clientHeight - px(style.paddingTop) - px(style.paddingBottom),
  );
};

// Maps a pointer position to chart coordinates. Uses the svg's on-screen box
// rather than getScreenCTM(), which ignores CSS zoom in Firefox.
const toChartX = (e: PointerEvent) => {
  const svg = chart.value;
  if (!svg) return null;
  const rect = svg.getBoundingClientRect();
  const style = getComputedStyle(svg);
  const px = (value: string) => Number.parseFloat(value) || 0;
  const borderLeft = px(style.borderLeftWidth);
  // Scale from transforms and zoom: on-screen width vs. own CSS width
  const ownWidth =
    (svg.clientWidth || 0) + borderLeft + px(style.borderRightWidth);
  const scale = ownWidth ? rect.width / ownWidth : 1;
  return (e.clientX - rect.left) / scale - borderLeft - px(style.paddingLeft);
};

const getNearestIndex = (x: number) =>
  slotXs.value
    .slice(0, maxAmount.value)
    .reduce<number | null>(
      (nearest, coord, i, coords) =>
        nearest === null || Math.abs(coord - x) < Math.abs(coords[nearest] - x)
          ? i
          : nearest,
      null,
    );

const onPointerMove = (e: PointerEvent) => {
  const x = toChartX(e);
  if (x !== null) activeIndex.value = getNearestIndex(x);
};

const onPointerLeave = () => {
  activeIndex.value = null;
};

watch(
  () => props.interactive,
  (interactive) => {
    if (!interactive) activeIndex.value = null;
  },
);

// What `mouse-move` reports; recomputed when the hovered data changes too
const activeEvent = computed<TrendChartMouseMoveEvent | null>(() => {
  const index = activeIndex.value;
  if (index === null || index >= maxAmount.value) return null;
  return { index, data: props.datasets.map((dataset) => dataset.data[index]) };
});

const isSameEvent = (
  a: TrendChartMouseMoveEvent | null,
  b: TrendChartMouseMoveEvent | null | undefined,
) =>
  a === b ||
  (!!a &&
    !!b &&
    a.index === b.index &&
    a.data.length === b.data.length &&
    a.data.every((item, i) => item === b.data[i]));

watch(activeEvent, (event, prev) => {
  if (!isSameEvent(event, prev)) emit("mouse-move", event);
});

const activeLineX = computed(() =>
  activeEvent.value ? slotXs.value[activeEvent.value.index] : null,
);

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (typeof ResizeObserver !== "undefined" && chart.value) {
    resizeObserver = new ResizeObserver(([entry]) =>
      setSize(entry.contentRect.width, entry.contentRect.height),
    );
    resizeObserver.observe(chart.value);
  } else {
    measureSize();
    window.addEventListener("resize", measureSize);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", measureSize);
});
</script>

<template>
  <svg
    ref="chart"
    class="vtc"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <TrendChartGrid
      v-if="grid"
      class="grid"
      :x-coords="gridXs"
      :y-coords="gridYs"
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
      shape-rendering="crispEdges"
      :visibility="activeLineX === null ? 'hidden' : 'visible'"
    />
    <TrendChartLabels
      v-if="labels"
      class="labels"
      :x-labels="labels.xLabels"
      :y-labels-text-formatter="labels.yLabelsTextFormatter"
      :x-coords="slotXs"
      :y-ticks="yTicks"
      :boundary="boundary"
      @measure="onLabelsMeasure"
    />
    <TrendChartCurve
      v-for="(dataset, i) in datasets"
      :key="i"
      class="curve"
      v-bind="curveProps(dataset)"
    />
    <rect
      v-if="interactive"
      v-bind="chartOverlayParams"
      style="touch-action: pan-y"
      @pointermove="onPointerMove"
      @pointerdown="onPointerMove"
      @pointerleave="onPointerLeave"
      @pointercancel="onPointerLeave"
    />
  </svg>
</template>
