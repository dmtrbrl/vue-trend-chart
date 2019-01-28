<template>
  <g v-if="(xLabels && xLabels.length) || (yLabelsAmount && yLabelsAmount > 0)">
    <g class="trend-chart-labels-x" v-if="xLabels && xLabels.length">
      <text
        class="trend-chart-label-x"
        v-for="(label, i) in xLabels"
        :key="i"
        v-bind="setXLabelsParams(i)"
        text-anchor="middle"
        :dominant-baseline="xLabelsPosition == 'bottom' ? 'text-before-edge' : 'text-after-edge'"
      >{{label}}</text>
    </g>
    <g class="trend-chart-labels-y" v-if="yLabelsAmount && yLabelsAmount > 0">
      <text
        class="trend-chart-label-y"
        v-for="(n, i) in yLabelsAmount"
        :key="i"
        v-bind="setYLabelsParams(i)"
        :text-anchor="yLabelsPosition == 'left' ? 'end' : 'start'"
        dominant-baseline="middle"
        v-text="yLabelsTextFormatter($parent.params.minValue + (($parent.params.maxValue - $parent.params.minValue)/(yLabelsAmount - 1)*(n - 1)))"
      ></text>
    </g>
  </g>
</template>
<script>
export default {
  name: "TrendChartLabels",
  props: {
    xLabels: {
      type: Array
    },
    xLabelsPosition: {
      default: "bottom",
      type: String,
      validator(value) {
        return ["top", "bottom"].indexOf(value) !== -1;
      }
    },
    xLabelsOffset: {
      default: 5,
      type: Number
    },
    yLabelsAmount: {
      type: Number
    },
    yLabelsPosition: {
      default: "left",
      type: String,
      validator(value) {
        return ["left", "right"].indexOf(value) !== -1;
      }
    },
    yLabelsOffset: {
      default: 5,
      type: Number
    },
    yLabelsTextFormatter: {
      default: value => value,
      type: Function
    }
  },
  computed: {
    boundary() {
      return this.$parent.boundary;
    },
    gridPaddingObject() {
      return this.$parent.gridPaddingObject;
    }
  },
  methods: {
    setXLabelsParams(n) {
      const {
        boundary,
        gridPaddingObject,
        xLabels,
        xLabelsPosition,
        xLabelsOffset
      } = this;
      const step = (boundary.maxX - boundary.minX) / (xLabels.length - 1);
      const x = boundary.minX + step * n;
      const y =
        xLabelsPosition == "bottom"
          ? boundary.maxY + gridPaddingObject.bottom + xLabelsOffset
          : boundary.minY - gridPaddingObject.top - xLabelsOffset;
      return { x, y };
    },
    setYLabelsParams(n) {
      const {
        boundary,
        gridPaddingObject,
        yLabelsAmount,
        yLabelsPosition,
        yLabelsOffset
      } = this;
      const step = (boundary.maxY - boundary.minY) / (yLabelsAmount - 1);
      const x =
        yLabelsPosition == "left"
          ? boundary.minX - gridPaddingObject.left - yLabelsOffset
          : boundary.maxX + gridPaddingObject.right + yLabelsOffset;
      const y = boundary.maxY - step * n;
      return { x, y };
    }
  }
};
</script>

