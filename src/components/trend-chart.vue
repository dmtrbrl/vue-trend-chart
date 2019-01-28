<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    class="trend-chart"
    ref="chart"
  >
    <trend-chart-grid class="trend-chart-grid" v-if="grid" v-bind="grid"></trend-chart-grid>
    <trend-chart-labels class="trend-chart-labels" v-if="labels" v-bind="labels" ref="chart-labels"></trend-chart-labels>
    <trend-chart-curve
      v-for="(dataset, i) in datasets"
      :key="i"
      v-bind="dataset"
      class="trend-chart-curve"
    ></trend-chart-curve>
  </svg>
</template>

<script>
import validatePadding from "../helpers/validatePadding";
import getPadding from "../helpers/getPadding";

import TrendChartGrid from "./trend-chart-grid.vue";
import TrendChartLabels from "./trend-chart-labels.vue";
import TrendChartCurve from "./trend-chart-curve.vue";
import { setTimeout } from "timers";

export default {
  name: "TrendChart",
  components: { TrendChartGrid, TrendChartLabels, TrendChartCurve },
  props: {
    datasets: {
      required: true,
      type: Array
    },
    grid: {
      default: null,
      type: Object
    },
    labels: {
      default: null,
      type: Object
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
      type: Number
    },
    min: {
      type: Number
    },
    padding: {
      default: "5",
      type: String,
      validator(val) {
        return validatePadding(val);
      }
    }
  },
  data() {
    return {
      labelsOverflowObject: { top: 0, right: 0, bottom: 0, left: 0 }
    };
  },
  computed: {
    paddingObject() {
      if (!this.padding) return getPadding("0");
      return getPadding(this.padding);
    },
    gridPaddingObject() {
      if (!this.grid || !this.grid.padding) return getPadding("0");
      return getPadding(this.grid.padding);
    },
    boundary() {
      const {
        width,
        height,
        paddingObject,
        gridPaddingObject,
        labelsOverflowObject
      } = this;
      const boundary = {
        minX:
          paddingObject.left +
          gridPaddingObject.left +
          labelsOverflowObject.left,
        minY:
          paddingObject.top + gridPaddingObject.top + labelsOverflowObject.top,
        maxX:
          width -
          paddingObject.right -
          gridPaddingObject.right -
          labelsOverflowObject.right,
        maxY:
          height -
          paddingObject.bottom -
          gridPaddingObject.bottom -
          labelsOverflowObject.bottom
      };
      return boundary;
    },
    params() {
      let maxValue = -Infinity;
      let minValue = Infinity;
      let maxAmount = 0;
      this.datasets.forEach(dataset => {
        let dataArr = dataset.data.map(item =>
          typeof item === "number" ? item : item.value
        );

        let max = Math.max(...dataArr);
        if (max > maxValue) maxValue = max;

        let min = Math.min(...dataArr);
        if (min < minValue) minValue = min;

        if (dataArr.length > maxAmount) maxAmount = dataArr.length;
      });
      if (this.max !== undefined && this.max > maxValue) maxValue = this.max;
      if (this.min !== undefined && this.min < minValue) minValue = this.min;
      return { maxValue, minValue, maxAmount };
    }
  },
  methods: {
    fitLabels() {
      const chart = this.$refs["chart"];
      const chartLabels = this.$refs["chart-labels"];
      if (
        chartLabels &&
        ((chartLabels.xLabels && chartLabels.xLabels.length) ||
          chartLabels.yLabelsAmount > 0)
      ) {
        const chartParams = chart.getBoundingClientRect();
        const chartLabelsParams = chartLabels.$el.getBoundingClientRect();
        const xScaleK = this.width / chartParams.width;
        const yScaleK = this.height / chartParams.height;

        const top =
          chartParams.top * yScaleK -
          chartLabelsParams.top * yScaleK +
          this.paddingObject.top;
        const right =
          chartLabelsParams.right * xScaleK -
          chartParams.right * xScaleK +
          this.paddingObject.right;
        const bottom =
          chartLabelsParams.bottom * yScaleK -
          chartParams.bottom * yScaleK +
          this.paddingObject.bottom;
        const left =
          this.paddingObject.left -
          chartLabelsParams.left * xScaleK +
          chartParams.left * xScaleK;
        this.labelsOverflowObject = {
          top: top > 0 ? top : 0,
          right: right > 0 ? right : 0,
          bottom: bottom > 0 ? bottom : 0,
          left: left > 0 ? left : 0
        };
      } else {
        this.labelsOverflowObject = { top: 0, right: 0, bottom: 0, left: 0 };
      }
    }
  },
  mounted() {
    this.fitLabels();
  }
};
</script>
