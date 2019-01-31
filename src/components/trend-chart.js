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
    hoverable: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      width: null,
      height: null,
      labelsOverflowObject: { top: 0, right: 0, bottom: 0, left: 0 },
      hovered: null,
      hoveredParams: null
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
    },
    chartOverlayParams() {
      const { boundary, gridPaddingObject } = this;
      const width =
        boundary.maxX -
        boundary.minX +
        gridPaddingObject.left +
        gridPaddingObject.right;
      const height =
        boundary.maxY -
        boundary.minY +
        gridPaddingObject.top +
        gridPaddingObject.bottom;
      return {
        x: boundary.minX - gridPaddingObject.left,
        y: boundary.minY - gridPaddingObject.top,
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
      const chartLabels = this.$refs["chart-labels"];
      if (
        chartLabels &&
        ((chartLabels.xLabels && chartLabels.xLabels.length) ||
          chartLabels.yLabelsAmount > 0)
      ) {
        const chartParams = chart.getBoundingClientRect();
        const chartLabelsParams = chartLabels.$el.getBoundingClientRect();

        const top =
          chartParams.top - chartLabelsParams.top + this.paddingObject.top;
        const right =
          chartLabelsParams.right -
          chartParams.right +
          this.paddingObject.right;
        const bottom =
          chartLabelsParams.bottom -
          chartParams.bottom +
          this.paddingObject.bottom;
        const left =
          this.paddingObject.left - chartLabelsParams.left + chartParams.left;

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
    getNearestXAxisValue(val) {
      return (
        this.chartAxesXCoords.reduce(
          (p, n) => (Math.abs(p) > Math.abs(n - val) ? n - val : p),
          Infinity
        ) + val
      );
    },
    onWindowResize() {
      this.setSize();
    },
    onMouseMove(e) {
      this.hovered = this.getNearestXAxisValue(e.offsetX);
      this.hoveredParams = {
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        x: e.clientX,
        y: e.clientY,
        height: this.boundary.maxY - this.boundary.minY,
        index: this.chartAxesXCoords.indexOf(this.hovered)
      };
    },
    onTouchMove(e) {
      const { clientX, clientY } = e.touches[0];
      const overlayParams = this.$refs["vtc-overlay"].getBoundingClientRect();
      const offsetX = clientX - overlayParams.left;
      const offsetY = clientX - overlayParams.top;
      this.hovered = this.getNearestXAxisValue(offsetX);
      this.hoveredParams = {
        offsetX: offsetX,
        offsetY: offsetY,
        x: clientX,
        y: clientY,
        height: this.boundary.maxY - this.boundary.minY,
        index: this.chartAxesXCoords.indexOf(this.hovered)
      };
    }
  },
  watch: {
    hovered() {
      const data = [];
      if (this.hoveredParams) {
        this.datasets.forEach(dataset => {
          data.push({
            name: dataset.name,
            value: dataset.data[this.hoveredParams.index]
          });
        });
      }

      this.$emit(
        "onAxisHover",
        this.hoveredParams ? { ...this.hoveredParams, data } : null
      );
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
          class: "vtc-grid",
          attrs: { ...this.grid }
        })
      );
    }

    // Chart active axis
    if (this.hoverable && this.chartOverlayParams && this.hovered) {
      children.push(
        h("line", {
          class: "vtc-active-x",
          attrs: {
            x1: this.hovered,
            x2: this.hovered,
            y1: this.boundary.minY,
            y2: this.boundary.maxY,
            stroke: "black"
          }
        })
      );
    }

    // Labels
    if (this.labels) {
      children.push(
        h(TrendChartLabels, {
          class: "vtc-labels",
          ref: "chart-labels",
          attrs: { ...this.labels }
        })
      );
    }

    // Curves
    this.datasets.map(dataset => {
      children.push(
        h(TrendChartCurve, {
          class: "vtc-curve",
          attrs: { ...dataset }
        })
      );
    });

    // Chart overlay
    if (this.hoverable && this.chartOverlayParams) {
      children.push(
        h("rect", {
          ref: "vtc-overlay",
          attrs: {
            ...this.chartOverlayParams
          },
          on: {
            mousemove: e => this.onMouseMove(e),
            touchmove: e => this.onTouchMove(e),
            mouseout: () => {
              this.hovered = null;
              this.hoveredParams = null;
            }
            // touchend: () => {
            //   this.hovered = null;
            //   this.hoveredParams = null;
            // }
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
