<script setup lang="ts">
import { computed } from "vue";

import genPoints from "../helpers/genPoints";
import genPath from "../helpers/genPath";
import type { Boundary, DataPoint, Domain } from "../types";

defineOptions({ name: "TrendChartCurve" });

const props = withDefaults(
  defineProps<{
    boundary: Boundary;
    domain: Domain;
    xCoords: number[];
    activeIndex?: number | null;
    data: DataPoint[];
    className?: string;
    smooth?: boolean;
    stroke?: boolean;
    fill?: boolean;
    showPoints?: boolean;
  }>(),
  {
    activeIndex: null,
    smooth: false,
    stroke: true,
    fill: false,
    showPoints: false,
  },
);

const points = computed(() =>
  genPoints(props.data, props.xCoords, props.domain, props.boundary),
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
      <template v-for="(point, i) in points" :key="i">
        <circle
          v-if="point"
          class="point"
          :class="{ 'is-active': activeIndex === i }"
          :cx="point.x"
          :cy="point.y"
          r="2"
          stroke="#000000"
          stroke-width="1"
        />
      </template>
    </g>
  </g>
</template>
