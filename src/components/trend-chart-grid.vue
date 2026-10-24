<script setup lang="ts">
import { computed } from "vue";

import getStep from "../helpers/getStep";
import type { Boundary } from "../types";

defineOptions({ name: "TrendChartGrid" });

const props = withDefaults(
  defineProps<{
    boundary: Boundary;
    verticalLines?: boolean;
    verticalLinesNumber?: number;
    horizontalLines?: boolean;
    horizontalLinesNumber?: number;
  }>(),
  {
    verticalLines: false,
    verticalLinesNumber: 0,
    horizontalLines: false,
    horizontalLinesNumber: 0,
  },
);

const verticalLinesParams = computed(() => {
  const { boundary, verticalLinesNumber } = props;
  const step = getStep(boundary.maxX - boundary.minX, verticalLinesNumber);
  return Array.from({ length: verticalLinesNumber }, (_, i) => {
    const x = boundary.minX + step * i;
    return { x1: x, x2: x, y1: boundary.minY, y2: boundary.maxY };
  });
});

const horizontalLinesParams = computed(() => {
  const { boundary, horizontalLinesNumber } = props;
  const step = getStep(boundary.maxY - boundary.minY, horizontalLinesNumber);
  return Array.from({ length: horizontalLinesNumber }, (_, i) => {
    const y = boundary.maxY - step * i;
    return { x1: boundary.minX, x2: boundary.maxX, y1: y, y2: y };
  });
});
</script>

<template>
  <g v-if="verticalLines || horizontalLines">
    <g v-if="verticalLines && verticalLinesNumber > 0" class="vertical">
      <line
        v-for="(line, i) in verticalLinesParams"
        :key="i"
        class="line"
        v-bind="line"
        stroke="rgba(0,0,0,0.1)"
      />
    </g>
    <g v-if="horizontalLines && horizontalLinesNumber > 0" class="horizontal">
      <line
        v-for="(line, i) in horizontalLinesParams"
        :key="i"
        class="line"
        v-bind="line"
        stroke="rgba(0,0,0,0.1)"
      />
    </g>
  </g>
</template>
