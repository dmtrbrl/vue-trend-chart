<script setup lang="ts">
import { computed } from "vue";

import genPoints from "../helpers/genPoints";
import genPath from "../helpers/genPath";
import type { ActiveLineParams, Boundary, DataPoint } from "../types";

defineOptions({ name: "TrendChartCurve" });

const props = withDefaults(
  defineProps<{
    boundary: Boundary;
    minValue: number;
    maxValue: number;
    maxAmount: number;
    activeLineParams?: ActiveLineParams | null;
    data: DataPoint[];
    className?: string;
    smooth?: boolean;
    stroke?: boolean;
    fill?: boolean;
    showPoints?: boolean;
  }>(),
  {
    activeLineParams: null,
    smooth: false,
    stroke: true,
    fill: false,
    showPoints: false,
  },
);

const points = computed(() =>
  genPoints(
    props.data,
    props.boundary,
    props.maxValue,
    props.minValue,
    props.maxAmount,
  ),
);

const paths = computed(() =>
  genPath(points.value, props.smooth, props.boundary),
);
</script>

<template>
  <g :class="className">
    <path
      v-if="fill && paths"
      class="fill"
      :d="paths.fillPath"
      fill="rgba(0,0,0,0.15)"
    />
    <path
      v-if="stroke && paths"
      class="stroke"
      :d="paths.linePath"
      fill="none"
      stroke="black"
    />
    <g v-if="showPoints" class="points">
      <circle
        v-for="(point, i) in points"
        :key="i"
        class="point"
        :class="{ 'is-active': activeLineParams?.index === i }"
        :cx="point.x"
        :cy="point.y"
        r="2"
        stroke="#000000"
        stroke-width="1"
      />
    </g>
  </g>
</template>
