export default {
  name: "TrendChartGrid",
  props: {
    boundary: {
      required: true,
      type: Object
    },
    verticalLines: {
      default: false,
      type: Boolean
    },
    verticalLinesNumber: {
      default: 0,
      type: Number
    },
    horizontalLines: {
      default: false,
      type: Boolean
    },
    horizontalLinesNumber: {
      default: 0,
      type: Number
    }
  },
  methods: {
    setVerticalLinesParams(n) {
      const { boundary, verticalLinesNumber } = this;
      const step =
        verticalLinesNumber > 1
          ? (boundary.maxX - boundary.minX) / (verticalLinesNumber - 1)
          : 0;
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
    setHorizontalLinesParams(n) {
      const { boundary, horizontalLinesNumber } = this;
      const step =
        horizontalLinesNumber > 1
          ? (boundary.maxY - boundary.minY) / (horizontalLinesNumber - 1)
          : 0;
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
    if (!this.verticalLines && !this.horizontalLines) return;

    const children = [];

    // Vertical Lines
    if (this.verticalLines && this.verticalLinesNumber > 0) {
      const lines = [];
      for (let i = 1; i <= this.verticalLinesNumber; i++) {
        lines.push(
          h("line", {
            class: "line",
            attrs: {
              ...this.setVerticalLinesParams(i)
            }
          })
        );
      }
      children.push(
        h(
          "g",
          {
            class: "vertical"
          },
          lines
        )
      );
    }
    // Horizontal Lines
    if (this.horizontalLines && this.horizontalLinesNumber > 0) {
      const lines = [];
      for (let i = 1; i <= this.horizontalLinesNumber; i++) {
        lines.push(
          h("line", {
            class: "line",
            attrs: {
              ...this.setHorizontalLinesParams(i)
            }
          })
        );
      }
      children.push(
        h(
          "g",
          {
            class: "horizontal"
          },
          lines
        )
      );
    }

    // Render component
    return h("g", children);
  }
};
