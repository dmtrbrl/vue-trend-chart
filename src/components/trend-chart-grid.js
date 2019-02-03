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
    }
  },
  computed: {
    xLines() {
      return this.xAxesLines || this.$parent.params.maxAmount;
    },
    yLines() {
      return this.yAxesLines || this.$parent.labels.yLabelsAmount;
    },
    boundary() {
      return this.$parent.boundary;
    }
  },
  methods: {
    setXLineParams(n) {
      const { boundary, xLines } = this;
      const step =
        xLines > 1 ? (boundary.maxX - boundary.minX) / (xLines - 1) : 0;
      const x = boundary.minX + step * (n - 1);
      const y1 = boundary.minY;
      const y2 = boundary.maxY;
      return {
        x1: x,
        x2: x,
        y1,
        y2,
        stroke: "rgba(0,0,0,0.1)"
      };
    },
    setYLineParams(n) {
      const { boundary, yLines } = this;
      const step =
        yLines > 1 ? (boundary.maxY - boundary.minY) / (yLines - 1) : 0;
      const y = boundary.maxY - step * (n - 1);
      const x1 = boundary.minX;
      const x2 = boundary.maxX;
      return {
        x1,
        x2,
        y1: y,
        y2: y,
        stroke: "rgba(0,0,0,0.1)"
      };
    }
  },
  render(h) {
    if (!this.xAxes && !this.yAxes) return;

    const children = [];

    // x axes
    if (this.xAxes && this.xLines > 0) {
      const lines = [];
      for (let i = 1; i <= this.xLines; i++) {
        lines.push(
          h("line", {
            class: "vtc-axis-x",
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
            class: "vtc-axes-x"
          },
          lines
        )
      );
    }
    // y axes
    if (this.yAxes && this.yLines > 0) {
      const lines = [];
      for (let i = 1; i <= this.yLines; i++) {
        lines.push(
          h("line", {
            class: "vtc-axis-y",
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
            class: "vtc-axes-y"
          },
          lines
        )
      );
    }

    // Render component
    return h("g", children);
  }
};
