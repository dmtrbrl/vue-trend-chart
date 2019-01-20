<template>
  <g>
    <path
      v-if="d"
      :d="d"
      fill="none"
      :stroke="strokeGradient ? `url(#${strokeGradientId})` : strokeColor"
      :stroke-width="strokeWidth"
    ></path>
    <defs v-if="strokeGradient">
      <linearGradient :id="strokeGradientId" v-bind="getGradientDirection(strokeGradientDirection)">
        <stop
          v-for="(color, i) in strokeGradient"
          :key="i"
          :offset="i / strokeGradient.length"
          :stop-color="color"
        ></stop>
      </linearGradient>
    </defs>
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
    strokeColor: {
      default: "black",
      type: String
    },
    strokeGradient: {
      type: Array
    },
    strokeGradientDirection: {
      type: String,
      default: "to top"
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
    },
    strokeGradientId() {
      return `vueTrendStrokeGradient${this._uid}`;
    }
  },
  methods: {
    getGradientDirection(ref) {
      switch (ref) {
        case "to left":
          return { x1: 0, y1: 0, x2: 1, y2: 0 };
          break;
        case "to bottom":
          return { x1: 0, y1: 0, x2: 0, y2: 1 };
          break;
        case "to right":
          return { x1: 1, y1: 0, x2: 0, y2: 0 };
          break;
        default:
          return { x1: 0, y1: 1, x2: 0, y2: 0 };
          break;
      }
    }
  }
};
</script>

