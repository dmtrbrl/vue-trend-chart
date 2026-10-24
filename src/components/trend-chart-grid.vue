<script setup lang="ts">
import type { Boundary } from "../types";

defineOptions({ name: "TrendChartGrid" });

defineProps<{
  boundary: Boundary;
  // Positions of vertical and horizontal lines
  xCoords: number[];
  yCoords: number[];
}>();
</script>

<template>
  <g v-if="xCoords.length || yCoords.length" shape-rendering="crispEdges">
    <g v-if="xCoords.length" class="vertical">
      <line
        v-for="(x, i) in xCoords"
        :key="i"
        class="line"
        :x1="x"
        :x2="x"
        :y1="boundary.minY"
        :y2="boundary.maxY"
        stroke="rgba(0,0,0,0.1)"
      />
    </g>
    <g v-if="yCoords.length" class="horizontal">
      <line
        v-for="(y, i) in yCoords"
        :key="i"
        class="line"
        :x1="boundary.minX"
        :x2="boundary.maxX"
        :y1="y"
        :y2="y"
        stroke="rgba(0,0,0,0.1)"
      />
    </g>
  </g>
</template>
