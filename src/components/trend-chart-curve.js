import genPoints from "../helpers/genPoints";
import genPath from "../helpers/genPath";

export default {
  name: "TrendChartCurve",
  props: {
    boundary: {
      required: true,
      type: Object
    },
    minValue: {
      required: true,
      type: Number
    },
    maxValue: {
      required: true,
      type: Number
    },
    maxAmount: {
      required: true,
      type: Number
    },
    activeLineParams: {
      type: Object
    },
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
        this.boundary,
        this.maxValue,
        this.minValue,
        this.maxAmount
      );
    },
    paths() {
      return genPath(this.points, this.smooth, this.boundary);
    }
  },
  render(h) {
    const children = [];
    // Fill path
    if (this.fill && this.paths && this.paths.fillPath) {
      children.push(
        h("path", {
          class: "fill",
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
          class: "stroke",
          attrs: {
            d: this.paths.linePath,
            fill: "none",
            stroke: "black"
          }
        })
      );
    }
    // Points
    if (this.showPoints && this.points) {
      children.push(
        h(
          "g",
          {
            class: "points"
          },
          this.points.map((point, i) =>
            h("circle", {
              class: {
                point: true,
                "is-active":
                  this.activeLineParams && this.activeLineParams.index === i
              },
              attrs: {
                cx: point.x,
                cy: point.y,
                r: 2,
                stroke: "#000000",
                "stroke-width": 1
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
