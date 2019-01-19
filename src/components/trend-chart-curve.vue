<template>
  <g>
    <path v-if="d" :d="d" fill="none" :stroke="stroke" :stroke-width="strokeWidth"></path>
  </g>
</template>

<script>
import genPoints from "../helpers/genPoints";
import genPath from "../helpers/genPath";

export default {
  name: "trend-chart-curve",
  props: {
    data: {
      required: true,
      type: Array
    },
    smooth: {
      default: false,
      type: Boolean
    },
    stroke: {
      default: "black",
      type: String
    },
    strokeWidth: {
      default: 1,
      type: Number
    },
    max: {
      required: true,
      type: Number
    },
    min: {
      required: true,
      type: Number
    },
    maxAmount: {
      required: true,
      type: Number
    }
  },
  computed: {
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
      return genPoints(
        this.data,
        this.boundary,
        this.max,
        this.min,
        this.maxAmount
      );
    },
    d() {
      return genPath(this.points, this.smooth);
    }
  }
};
</script>

