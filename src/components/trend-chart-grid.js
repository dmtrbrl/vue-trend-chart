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
    yAxes: {
      default: false,
      type: Boolean
    },
    yAxesLines: {
      type: Number
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
      const { boundary, xLines, gridPaddingObject } = this;
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
        stroke: "rgba(0,0,0,0.1)"
      };
    },
    setYLineParams(n) {
      const { boundary, yAxesLines, gridPaddingObject } = this;
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
        stroke: "rgba(0,0,0,0.1)"
      };
    }
  },
  render(h) {
    if (!this.xAxes || !this.yAxes) return;

    const children = [];

    // x axes
    if (this.xAxes && this.xLines > 0) {
      const lines = [];
      for (let i = 1; i <= this.xLines; i++) {
        lines.push(
          h("line", {
            class: "trend-chart-grid-x-axis",
            attrs: {
              ...this.setXLineParams(i)
            }
          })
        );
      }
      children.push(
        h(
          "g",
          {
            class: "trend-chart-grid-x"
          },
          lines
        )
      );
    }
    // y axes
    if (this.yAxes && this.yAxesLines > 0) {
      const lines = [];
      for (let i = 1; i <= this.yAxesLines; i++) {
        lines.push(
          h("line", {
            class: "trend-chart-grid-y-axis",
            attrs: {
              ...this.setYLineParams(i)
            }
          })
        );
      }
      children.push(
        h(
          "g",
          {
            class: "trend-chart-grid-y"
          },
          lines
        )
      );
    }

    // Render component
    return h("g", children);
  }
};
