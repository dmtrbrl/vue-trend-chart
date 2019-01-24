<template>
  <g class="trend-chart-grid" v-if="xAxes || yAxes">
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
export default {
  name: "trend-chart-grid",
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
    }
  },
  computed: {
    xLines() {
      return this.xAxesLines || this.$parent.params.maxAmount;
    },
    boundary() {
      return this.$parent.boundary;
    }
  },
  methods: {
    setXLineParams(n) {
      const step =
        (this.boundary.maxX - this.boundary.minX) / (this.xLines - 1);
      const x = this.boundary.minX + step * (n - 1);
      const x1 = x;
      const x2 = x;
      const y1 = this.boundary.minY;
      const y2 = this.boundary.maxY;
      return {
        x1,
        x2,
        y1,
        y2,
        stroke: this.xAxesStrokeColor,
        "stroke-width": this.xAxesStrokeWidth,
        "stroke-dasharray": this.xAxesStrokeDasharray
      };
    },
    setYLineParams(n) {
      const step =
        (this.boundary.maxY - this.boundary.minY) / (this.yAxesLines - 1);
      const y = this.boundary.minY + step * (n - 1);
      const x1 = this.boundary.minX;
      const x2 = this.boundary.maxX;
      const y1 = y;
      const y2 = y;
      return {
        x1,
        x2,
        y1,
        y2,
        stroke: this.yAxesStrokeColor,
        "stroke-width": this.yAxesStrokeWidth,
        "stroke-dasharray": this.yAxesStrokeDasharray
      };
    }
  }
};
</script>

