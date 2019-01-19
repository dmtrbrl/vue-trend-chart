<template>
  <g>
    <path v-if="d" :d="d" fill="none" :stroke="stroke" :stroke-dasharray="strokeDasharray"></path>
  </g>
</template>

<script>
import { genPoints, genPath } from "../helpers/path";

export default {
  name: "trend-chart-curve",
  props: {
    data: {
      required: true,
      type: Array
    },
    radius: {
      default: 15,
      type: Number
    },
    smooth: Boolean,
    stroke: {
      default: "black",
      type: String
    },
    strokeDasharray: {
      type: String
    }
  },
  computed: {
    max() {
      const { max, maxDataValue } = this.$parent;
      return max || maxDataValue || -Infinity;
    },
    min() {
      const { min, minDataValue } = this.$parent;
      return min || minDataValue || Infinity;
    },
    boundary() {
      const { width, height, padding } = this.$parent;
      return {
        minX: padding,
        minY: padding,
        maxX: width - padding,
        maxY: height - padding
      };
    },
    points() {
      return genPoints(this.data, this.boundary, this.max, this.min);
    },
    d() {
      return genPath(this.points, this.smooth ? this.radius : 0);
    }
  }
};
</script>

