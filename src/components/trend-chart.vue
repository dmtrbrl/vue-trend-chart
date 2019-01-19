<template>
  <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
    <trend-chart-curve v-for="(dataset, i) in datasets" :key="i" v-bind="dataset"></trend-chart-curve>
  </svg>
</template>

<script>
import TrendChartCurve from "./trend-chart-curve.vue";
import { log } from "util";

export default {
  name: "TrendChart",
  components: { TrendChartCurve },
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
      default: 10,
      type: Number
    }
  },
  computed: {
    maxDataValue() {
      let maxValue = -Infinity;
      this.datasets.forEach(dataset => {
        let max = Math.max(...dataset.data);
        if (max > maxValue) maxValue = max;
      });
      return maxValue;
    },
    minDataValue() {
      let minValue = Infinity;
      this.datasets.forEach(dataset => {
        let min = Math.min(...dataset.data);
        if (min < minValue) minValue = min;
      });
      return minValue;
    }
  }
};
</script>
