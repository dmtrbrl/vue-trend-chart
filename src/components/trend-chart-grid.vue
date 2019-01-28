<template>
  <g v-if="xAxes || yAxes">
    <g class="trend-chart-grid-x" v-if="xAxes && xLines > 0">
      <line
        class="trend-chart-grid-x-axis"
        v-for="(n, i) in xLines"
        :key="i"
        v-bind="setXLineParams(n)"
      ></line>
    </g>
    <g class="trend-chart-grid-y" v-if="yAxes && yAxesLines > 0">
      <line
        class="trend-chart-grid-y-axis"
        v-for="(n, i) in yAxesLines"
        :key="i"
        v-bind="setYLineParams(n)"
      ></line>
    </g>
  </g>
</template>
<script>
import validatePadding from "../helpers/validatePadding";

export default {
  name: "TrendChartGrid",
  props: {
    xAxes: {
      default: false,
      type: Boolean
    },
    xAxesLines: {
      type: Number
    },
    xAxesStrokeWidth: {
      default: 1,
      type: Number
    },
    xAxesStrokeColor: {
      default: "black",
      type: String
    },
    xAxesStrokeDasharray: {
      default: null,
      type: String
    },
    yAxes: {
      default: false,
      type: Boolean
    },
    yAxesLines: {
      type: Number
    },
    yAxesStrokeWidth: {
      default: 1,
      type: Number
    },
    yAxesStrokeColor: {
      default: "black",
      type: String
    },
    yAxesStrokeDasharray: {
      default: null,
      type: String
    },
    padding: {
      default: "0",
      type: String,
      validator(value) {
        return validatePadding(value);
      }
    }
  },
  computed: {
    xLines() {
      return this.xAxesLines || this.$parent.params.maxAmount;
    },
    boundary() {
      return this.$parent.boundary;
    },
    gridPaddingObject() {
      return this.$parent.gridPaddingObject;
    }
  },
  methods: {
    setXLineParams(n) {
      const {
        boundary,
        xLines,
        gridPaddingObject,
        xAxesStrokeColor,
        xAxesStrokeWidth,
        xAxesStrokeDasharray
      } = this;
      const step = (boundary.maxX - boundary.minX) / (xLines - 1);
      const x = boundary.minX + step * (n - 1);
      const x1 = x;
      const x2 = x;
      const y1 = boundary.minY - gridPaddingObject.top;
      const y2 = boundary.maxY + gridPaddingObject.bottom;
      return {
        x1,
        x2,
        y1,
        y2,
        stroke: xAxesStrokeColor,
        "stroke-width": xAxesStrokeWidth,
        "stroke-dasharray": xAxesStrokeDasharray
      };
    },
    setYLineParams(n) {
      const {
        boundary,
        yAxesLines,
        gridPaddingObject,
        yAxesStrokeColor,
        yAxesStrokeWidth,
        yAxesStrokeDasharray
      } = this;
      const step = (boundary.maxY - boundary.minY) / (yAxesLines - 1);
      const y = boundary.minY + step * (n - 1);
      const x1 = boundary.minX - gridPaddingObject.left;
      const x2 = boundary.maxX + gridPaddingObject.right;
      const y1 = y;
      const y2 = y;
      return {
        x1,
        x2,
        y1,
        y2,
        stroke: yAxesStrokeColor,
        "stroke-width": yAxesStrokeWidth,
        "stroke-dasharray": yAxesStrokeDasharray
      };
    }
  }
};
</script>

