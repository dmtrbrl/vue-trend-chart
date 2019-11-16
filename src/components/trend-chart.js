import validatePadding from "../helpers/validatePadding";
import getPadding from "../helpers/getPadding";

import TrendChartGrid from "./trend-chart-grid";
import TrendChartLabels from "./trend-chart-labels";
import TrendChartCurve from "./trend-chart-curve";

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
    interactive: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      width: null,
      height: null,
      labelsOverflowObject: { top: 0, right: 0, bottom: 0, left: 0 },
      activeLine: null,
      activeLineParams: null
    };
  },
  computed: {
    paddingObject() {
      if (!this.padding) return getPadding("0");
      return getPadding(this.padding);
    },
    boundary() {
      const { width, height, paddingObject, labelsOverflowObject } = this;
      const boundary = {
        minX: paddingObject.left + labelsOverflowObject.left,
        minY: paddingObject.top + labelsOverflowObject.top,
        maxX: width - paddingObject.right - labelsOverflowObject.right,
        maxY: height - paddingObject.bottom - labelsOverflowObject.bottom
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
    },
    chartOverlayParams() {
      const { boundary } = this;
      const width = boundary.maxX - boundary.minX;
      const height = boundary.maxY - boundary.minY;
      return {
        x: boundary.minX,
        y: boundary.minY,
        width: width > 0 ? width : 0,
        height: height > 0 ? height : 0,
        opacity: 0
      };
    },
    chartAxesXCoords() {
      const axes = [];
      const step =
        (this.boundary.maxX - this.boundary.minX) / (this.params.maxAmount - 1);
      for (let i = 0; i < this.params.maxAmount; i++) {
        axes.push(step * i + this.boundary.minX);
      }
      return axes;
    }
  },
  methods: {
    setSize() {
      const params = this.$refs["chart"].getBoundingClientRect();
      this.width = params.width;
      this.height = params.height;
    },
    fitLabels() {
      const chart = this.$refs["chart"];
      const chartLabels = this.$refs["labels"];
      if (
        chartLabels &&
        ((chartLabels.xLabels && chartLabels.xLabels.length) ||
          chartLabels.yLabels > 0)
      ) {
        const chartClientRect = chart.getBoundingClientRect();
        const chartLabelsClientRect = chartLabels.$el.getBoundingClientRect();

        const top =
          chartClientRect.top -
          chartLabelsClientRect.top +
          this.paddingObject.top;
        const right =
          chartLabelsClientRect.right -
          chartClientRect.right +
          this.paddingObject.right;
        const bottom =
          chartLabelsClientRect.bottom -
          chartClientRect.bottom +
          this.paddingObject.bottom;
        const left =
          this.paddingObject.left -
          chartLabelsClientRect.left +
          chartClientRect.left;

        this.labelsOverflowObject = {
          top: top > 0 ? top : 0,
          right: right > 0 ? right : 0,
          bottom: bottom > 0 ? bottom : 0,
          left: left > 0 ? left : 0
        };
      } else {
        this.labelsOverflowObject = { top: 0, right: 0, bottom: 0, left: 0 };
      }
    },
    init() {
      this.setSize();
      this.$nextTick(() => {
        this.fitLabels();
      });
    },
    getNearestCoordinate(val) {
      return (
        this.chartAxesXCoords.reduce(
          (p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p),
          Infinity
        ) + val
      );
    },
    mouseMove(e) {
      const rect = this.$refs.chart.getBoundingClientRect();
      this.activeLine = this.getNearestCoordinate(e.clientX - rect.left);
    },
    mouseOut() {
      this.activeLine = null;
      this.activeLineParams = null;
    },
    onWindowResize() {
      this.setSize();
    }
  },
  watch: {
    activeLine(val) {
      const data = [];
      if (val) {
        this.activeLineParams = {
          index: this.chartAxesXCoords.indexOf(this.activeLine)
        };
        this.datasets.forEach(dataset => {
          data.push(dataset.data[this.activeLineParams.index]);
        });
      }

      this.$emit(
        "mouse-move",
        this.activeLineParams ? { ...this.activeLineParams, data } : null
      );
    },
    labels: {
      handler() {
        // Reset labels rect overflow
        this.labelsOverflowObject = { top: 0, right: 0, bottom: 0, left: 0 };
        // Calculate new labels rect overflow
        this.$nextTick(() => {
          this.fitLabels();
        });
      },
      deep: true
    }
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.onWindowResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  render(h) {
    const children = [];

    // Grid
    if (this.grid) {
      children.push(
        h(TrendChartGrid, {
          class: "grid",
          attrs: {
            verticalLines: this.grid.verticalLines,
            verticalLinesNumber:
              this.grid.verticalLinesNumber || this.params.maxAmount,
            horizontalLines: this.grid.horizontalLines,
            horizontalLinesNumber:
              this.grid.horizontalLinesNumber ||
              (this.labels && this.labels.yLabels) ||
              0,
            boundary: this.boundary
          }
        })
      );
    }

    // Chart active line
    if (this.interactive && this.chartOverlayParams) {
      children.push(
        h("line", {
          class: "active-line",
          ref: "active-line",
          attrs: {
            x1: this.activeLine || this.boundary.minX,
            x2: this.activeLine || this.boundary.minX,
            y1: this.boundary.minY,
            y2: this.boundary.maxY,
            stroke: "black",
            visibility: this.activeLine ? "visible" : "hidden"
          }
        })
      );
    }

    // Labels
    if (this.labels) {
      children.push(
        h(TrendChartLabels, {
          class: "labels",
          ref: "labels",
          attrs: {
            ...this.labels,
            boundary: this.boundary,
            minValue: this.params.minValue,
            maxValue: this.params.maxValue
          }
        })
      );
    }

    // Curves
    this.datasets.map(dataset => {
      children.push(
        h(TrendChartCurve, {
          class: "curve",
          attrs: {
            ...dataset,
            boundary: this.boundary,
            minValue: this.params.minValue,
            maxValue: this.params.maxValue,
            maxAmount: this.params.maxAmount,
            activeLineParams: this.activeLineParams
          }
        })
      );
    });

    // Chart overlay
    if (this.interactive && this.chartOverlayParams) {
      children.push(
        h("rect", {
          ref: "interactive-area",
          attrs: {
            ...this.chartOverlayParams
          },
          on: {
            mousemove: e => this.mouseMove(e),
            mouseout: () => this.mouseOut()
          }
        })
      );
    }

    // Render component
    return h(
      "svg",
      {
        class: "vtc",
        ref: "chart",
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          width: "100%",
          height: "100%"
        }
      },
      children
    );
  }
};
