<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import roundToStep from "../helpers/roundToStep";
import type { Boundary, Padding, YTick } from "../types";

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
  // How far labels reach beyond the boundary on each side
  measure: [overflow: Padding];
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

let measured: Padding = { top: 0, right: 0, bottom: 0, left: 0 };

// Each label is measured in its own coordinates, relative to its anchor on
// the boundary. The result never depends on the boundary itself, so fitting
// the boundary to it can't feed back into the next measurement.
const measure = () => {
  const overflow: Padding = { top: 0, right: 0, bottom: 0, left: 0 };
  const reach = (side: keyof Padding, value: number) => {
    if (value > overflow[side]) overflow[side] = value;
  };

  const lastSlot = props.xCoords.length - 1;
  root.value?.querySelectorAll(".x-labels .label").forEach((el, i) => {
    const box = getBox(el);
    if (!box) return;
    reach("bottom", box.y + box.height);
    if (i === 0) reach("left", -box.x);
    if (i === lastSlot) reach("right", box.x + box.width);
  });

  const yEls = root.value?.querySelectorAll(".y-labels .label") ?? [];
  yEls.forEach((el, i) => {
    const box = getBox(el);
    if (!box) return;
    reach("left", -box.x);
    if (i === 0) reach("bottom", box.y + box.height);
    if (i === yEls.length - 1) reach("top", -box.y);
  });

  // Ignore sub-pixel noise
  const changed = (Object.keys(overflow) as Array<keyof Padding>).some(
    (side) => Math.abs(overflow[side] - measured[side]) > 0.5,
  );
  if (!changed) return;
  measured = overflow;
  emit("measure", overflow);
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
