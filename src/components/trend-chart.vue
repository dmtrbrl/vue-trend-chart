<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
    class="trend-chart"
  >
    <trend-chart-grid class="trend-chart-grid" v-if="grid" v-bind="grid"></trend-chart-grid>
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
import TrendChartCurve from "./trend-chart-curve.vue";

export default {
  name: "TrendChart",
  components: { TrendChartGrid, TrendChartCurve },
  props: {
    datasets: {
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
    },
    grid: {
      default: null,
      type: Object
    }
  },
  computed: {
    paddingObject() {
      return getPadding(this.padding);
    },
    gridPaddingObject() {
      return getPadding(this.grid.padding || "0");
    },
    boundary() {
      const { width, height, paddingObject, gridPaddingObject } = this;
      return {
        minX: paddingObject.left + gridPaddingObject.left,
        minY: paddingObject.top + gridPaddingObject.top,
        maxX: width - paddingObject.right - gridPaddingObject.right,
        maxY: height - paddingObject.bottom - gridPaddingObject.bottom
      };
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
  }
};
</script>
