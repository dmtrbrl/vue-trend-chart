<template>
  <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
    <path
      v-if="d"
      :d="d"
      fill="none"
      :stroke="stroke"
      :stroke-dasharray="strokeDashArray"
      ref="path"
    ></path>
  </svg>
</template>

<script>
import { genPoints, genPath } from "../helpers/path";

export default {
  name: "TrendChart",
  props: {
    data: {
      required: true,
      type: Array
    },
    width: {
      default: 300,
      type: Number
    },
    height: {
      default: 75,
      type: Number
    },
    max: {
      default: -Infinity,
      type: Number
    },
    min: {
      default: Infinity,
      type: Number
    },
    padding: {
      default: 10,
      type: Number
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
    strokeDashArray: {
      type: String
    }
  },
  computed: {
    boundary() {
      return {
        minX: this.padding,
        minY: this.padding,
        maxX: this.width - this.padding,
        maxY: this.height - this.padding
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
