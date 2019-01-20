<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <trend-chart-curve
      v-for="(dataset, i) in datasets"
      :key="i"
      :max="params.maxValue"
      :min="params.minValue"
      :maxAmount="params.maxAmount"
      v-bind="dataset"
      stroke-dasharray="none"
      class="trend-chart-curve"
    ></trend-chart-curve>
  </svg>
</template>

<script>
import TrendChartCurve from "./trend-chart-curve.vue";

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
      default: 5,
      type: Number
    }
  },
  computed: {
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
