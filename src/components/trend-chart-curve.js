import genPoints from "../helpers/genPoints";
import genPath from "../helpers/genPath";

export default {
  name: "TrendChartCurve",
  props: {
    data: {
      required: true,
      type: Array
    },
    className: {
      type: String
    },
    smooth: {
      default: false,
      type: Boolean
    },
    stroke: {
      default: true,
      type: Boolean
    },
    fill: {
      default: false,
      type: Boolean
    },
    showPoints: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    points() {
      return genPoints(
        this.data,
        this.$parent.boundary,
        this.$parent.params.maxValue,
        this.$parent.params.minValue,
        this.$parent.params.maxAmount
      );
    },
    paths() {
      return genPath(this.points, this.smooth, this.$parent.boundary);
    }
  },
  render(h) {
    const children = [];
    // Fill path
    if (this.fill && this.paths && this.paths.fillPath) {
      children.push(
        h("path", {
          class: "trend-chart-fill",
          attrs: {
            d: this.paths.fillPath,
            fill: "rgba(0,0,0,0.15)"
          }
        })
      );
    }
    // Stroke path
    if (this.stroke && this.paths && this.paths.linePath) {
      children.push(
        h("path", {
          class: "trend-chart-fill",
          attrs: {
            d: this.paths.linePath,
            fill: "none",
            stroke: "#000000"
          }
        })
      );
    }
    // Points
    if (this.showPoints) {
      children.push(
        h(
          "g",
          {
            class: "trend-chart-points"
          },
          this.points.map(point =>
            h("circle", {
              class: "trend-chart-point",
              attrs: {
                cx: point.x,
                cy: point.y,
                r: 3
              }
            })
          )
        )
      );
    }

    // Render component
    return h(
      "g",
      {
        class: this.className
      },
      children
    );
  }
};
