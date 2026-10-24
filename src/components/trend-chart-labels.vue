<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from "vue";

import getStep from "../helpers/getStep";
import type { Boundary } from "../types";

defineOptions({ name: "TrendChartLabels" });

const props = withDefaults(
  defineProps<{
    boundary: Boundary;
    minValue?: number;
    maxValue?: number;
    xLabels?: Array<string | number>;
    yLabels?: number;
    yLabelsTextFormatter?: (value: number) => string | number;
  }>(),
  {
    minValue: 0,
    maxValue: 0,
    yLabelsTextFormatter: (value: number) => value,
  },
);

const emit = defineEmits<{
  render: [el: SVGGElement];
}>();

const root = ref<SVGGElement | null>(null);
const xLabelsEl = ref<SVGGElement | null>(null);
const yLabelsEl = ref<SVGGElement | null>(null);
const xLabelHeight = ref(0);
const yLabelHeight = ref(0);

const hasXLabels = computed(() => !!props.xLabels?.length);
const hasYLabels = computed(() => !!props.yLabels && props.yLabels > 0);

const xLabelsParams = computed(() => {
  const { boundary, xLabels = [] } = props;
  const step = getStep(boundary.maxX - boundary.minX, xLabels.length);
  return xLabels.map((label, i) => ({
    text: label,
    transform: `translate(${boundary.minX + step * i}, ${boundary.maxY})`,
  }));
});

const yLabelsParams = computed(() => {
  const { boundary, minValue, maxValue, yLabels = 0 } = props;
  const step = getStep(boundary.maxY - boundary.minY, yLabels);
  const valueStep = getStep(maxValue - minValue, yLabels);
  return Array.from({ length: yLabels }, (_, i) => ({
    text: props.yLabelsTextFormatter(minValue + valueStep * i),
    transform: `translate(${boundary.minX}, ${boundary.maxY - step * i})`,
  }));
});

// Label text height depends on the user's CSS, so measure the rendered text
const measureLabels = () => {
  const measure = (el: SVGGElement | null) =>
    el?.querySelector("text")?.getBoundingClientRect().height ?? 0;
  xLabelHeight.value = measure(xLabelsEl.value);
  yLabelHeight.value = measure(yLabelsEl.value);
};

// Let the chart fit its boundary around the rendered labels
const onRender = () => {
  measureLabels();
  if (root.value) emit("render", root.value);
};

onMounted(onRender);
onUpdated(onRender);
</script>

<template>
  <g v-if="hasXLabels || hasYLabels" ref="root">
    <g v-if="hasXLabels" ref="xLabelsEl" class="x-labels">
      <g
        v-for="(label, i) in xLabelsParams"
        :key="i"
        class="label"
        :transform="label.transform"
      >
        <text :dy="xLabelHeight + 5" text-anchor="middle">{{
          label.text
        }}</text>
        <line stroke="rgba(0,0,0,0.1)" y2="5" />
      </g>
    </g>
    <g v-if="hasYLabels" ref="yLabelsEl" class="y-labels">
      <g
        v-for="(label, i) in yLabelsParams"
        :key="i"
        class="label"
        :transform="label.transform"
      >
        <text dx="-10" :dy="yLabelHeight / 4" text-anchor="end">
          {{ label.text }}
        </text>
        <line stroke="rgba(0,0,0,0.1)" x1="0" x2="-5" />
      </g>
    </g>
  </g>
</template>
