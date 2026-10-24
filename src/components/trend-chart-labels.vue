<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import roundToStep from "../helpers/roundToStep";
import type { Boundary, LabelBox, YTick } from "../types";

defineOptions({ name: "TrendChartLabels" });

const props = defineProps<{
  boundary: Boundary;
  // Positions of all x slots; label i is drawn at slot i
  xCoords: number[];
  yTicks: YTick[];
  xLabels?: Array<string | number>;
  yLabelsTextFormatter?: (value: number) => string | number;
}>();

const emit = defineEmits<{
  // Each label's box around its anchor; the chart makes room for them
  measure: [boxes: { x: LabelBox[]; y: LabelBox[] }];
}>();

const root = ref<SVGGElement | null>(null);

const xLabels = computed(() =>
  (props.xLabels ?? []).slice(0, props.xCoords.length).map((text, i) => ({
    text,
    transform: `translate(${props.xCoords[i]}, ${props.boundary.maxY})`,
  })),
);

const yLabels = computed(() => {
  const { yTicks, yLabelsTextFormatter } = props;
  const step = yTicks.length > 1 ? yTicks[1].value - yTicks[0].value : 0;
  const format = yLabelsTextFormatter ?? roundToStep(step);
  return yTicks.map(({ y, value }) => ({
    text: format(value),
    transform: `translate(${props.boundary.minX}, ${y})`,
  }));
});

// Label sizes only depend on their text (and CSS), not on where they are
const textKey = computed(() =>
  [...xLabels.value, ...yLabels.value].map((l) => l.text).join("\u0000"),
);

const getBox = (el: Element) => {
  try {
    return (el as SVGGraphicsElement).getBBox();
  } catch {
    // Firefox throws for elements that aren't rendered
    return null;
  }
};

let measured = "";

// Each label is measured in its own coordinates, around its anchor. Unlike
// its position, that doesn't depend on the boundary, so fitting the
// boundary to it can't feed back into the next measurement.
const measure = () => {
  const boxesOf = (selector: string) =>
    [...(root.value?.querySelectorAll(selector) ?? [])].map((el) => {
      const { x, y, width, height } = getBox(el) ?? {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
      return { x, y, width, height };
    });
  const boxes = {
    x: boxesOf(".x-labels .label"),
    y: boxesOf(".y-labels .label"),
  };
  // Only report changes, ignoring sub-pixel noise
  const key = JSON.stringify(boxes, (_, value) =>
    typeof value === "number" ? Math.round(value * 2) / 2 : value,
  );
  if (key === measured) return;
  measured = key;
  emit("measure", boxes);
};

// Labels also change size without changing text: CSS updates, web fonts
// loading late, zoom. Each label is observed on its own: its size doesn't
// change when the boundary moves it, so refitting can't notify again.
let resizeObserver: ResizeObserver | null = null;
const observed = new Set<Element>();

const observeLabels = () => {
  if (!resizeObserver) return;
  const labels = new Set(root.value?.querySelectorAll(".label") ?? []);
  observed.forEach((el) => {
    if (labels.has(el)) return;
    resizeObserver!.unobserve(el);
    observed.delete(el);
  });
  labels.forEach((el) => {
    if (observed.has(el)) return;
    resizeObserver!.observe(el);
    observed.add(el);
  });
};

watch(
  textKey,
  () => {
    observeLabels();
    measure();
  },
  { flush: "post" },
);

onMounted(() => {
  if (typeof ResizeObserver === "undefined") return measure();
  // Its first callback does the initial measurement
  resizeObserver = new ResizeObserver(() => measure());
  observeLabels();
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <g v-if="xLabels.length || yLabels.length" ref="root">
    <g v-if="xLabels.length" class="x-labels">
      <g
        v-for="(label, i) in xLabels"
        :key="i"
        class="label"
        :transform="label.transform"
      >
        <text y="5" dy="1.2em" text-anchor="middle">{{ label.text }}</text>
        <line stroke="rgba(0,0,0,0.1)" y2="5" shape-rendering="crispEdges" />
      </g>
    </g>
    <g v-if="yLabels.length" class="y-labels">
      <g
        v-for="(label, i) in yLabels"
        :key="i"
        class="label"
        :transform="label.transform"
      >
        <text dx="-10" dy="0.32em" text-anchor="end">{{ label.text }}</text>
        <line
          stroke="rgba(0,0,0,0.1)"
          x1="0"
          x2="-5"
          shape-rendering="crispEdges"
        />
      </g>
    </g>
  </g>
</template>
