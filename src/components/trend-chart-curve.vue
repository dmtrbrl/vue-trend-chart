<template>
  <g :class="className">
    <path
      v-if="fill && paths && paths.fillPath"
      :d="paths.fillPath"
      :fill="fillGradient ? `url(#${fillGradientId})` : fillColor"
      :opacity="fillOpacity"
      class="trend-chart-fill"
    ></path>
    <path
      v-if="stroke && paths && paths.linePath"
      :d="paths.linePath"
      fill="none"
      :stroke="strokeGradient ? `url(#${strokeGradientId})` : strokeColor"
      :stroke-width="strokeWidth"
      :opacity="strokeOpacity"
      class="trend-chart-stroke"
    ></path>
    <g class="trend-chart-points" v-if="showPoints">
      <circle
        v-for="(point, i) in points"
        :key="i"
        class="trend-chart-point"
        :cx="point.x"
        :cy="point.y"
        :r="pointsRadius"
        :fill="pointsFill"
        :stroke="pointsStrokeColor"
        :stroke-width="pointsStrokeWidth"
      ></circle>
    </g>
    <defs v-if="strokeGradient || fillGradient">
      <linearGradient
        v-if="strokeGradient"
        :id="strokeGradientId"
        v-bind="getGradientDirection(strokeGradientDirection)"
      >
        <stop
          v-for="(color, i) in strokeGradient"
          :key="i"
          :offset="i / strokeGradient.length"
          :stop-color="color"
        ></stop>
      </linearGradient>
      <linearGradient
        v-if="fillGradient"
        :id="fillGradientId"
        v-bind="getGradientDirection(fillGradientDirection)"
      >
        <stop
          v-for="(color, i) in fillGradient"
          :key="i"
          :offset="i / fillGradient.length"
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
    className: {
      type: String
    },
    smooth: {
      default: false,
      type: Boolean
    },
    stroke: {
      default: true,
      type: Boolean
    },
    strokeWidth: {
      default: 1,
      type: Number
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
    strokeOpacity: {
      default: 1,
      type: Number
    },
    fill: {
      default: false,
      type: Boolean
    },
    fillColor: {
      default: "black",
      type: String
    },
    fillGradient: {
      type: Array
    },
    fillGradientDirection: {
      type: String,
      default: "to top"
    },
    fillOpacity: {
      default: 1,
      type: Number
    },
    showPoints: {
      default: false,
      type: Boolean
    },
    pointsRadius: {
      default: 2,
      type: Number
    },
    pointsFill: {
      default: "black",
      type: String
    },
    pointsStrokeWidth: {
      type: Number
    },
    pointsStrokeColor: {
      type: String
    }
  },
  computed: {
    points() {
      return genPoints(
        this.data,
        this.$parent.boundary,
        this.$parent.params.maxValue,
        this.$parent.params.minValue,
        this.$parent.params.maxAmount
      );
    },
    paths() {
      return genPath(
        this.points,
        this.smooth,
        this.$parent.boundary,
        this.strokeWidth
      );
    },
    strokeGradientId() {
      return `vueTrendStrokeGradient${this._uid}`;
    },
    fillGradientId() {
      return `vueTrendFillGradient${this._uid}`;
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

