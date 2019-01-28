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
    strokeWidth: {
      default: 1,
      type: Number
    },
    strokeColor: {
      default: "black",
      type: String
    },
    strokeGradient: {
      type: Array
    },
    strokeGradientDirection: {
      default: "to top",
      type: String,
      validator(value) {
        return (
          ["to top", "to left", "to bottom", "to right"].indexOf(value) !== -1
        );
      }
    },
    strokeDasharray: {
      default: "none",
      type: String
    },
    fill: {
      default: false,
      type: Boolean
    },
    fillColor: {
      default: "black",
      type: String
    },
    fillGradient: {
      type: Array
    },
    fillGradientDirection: {
      default: "to top",
      type: String,
      validator(value) {
        return (
          ["to top", "to left", "to bottom", "to right"].indexOf(value) !== -1
        );
      }
    },
    fillOpacity: {
      default: 1,
      type: Number
    },
    showPoints: {
      default: false,
      type: Boolean
    },
    pointsRadius: {
      default: 2,
      type: Number
    },
    pointsFill: {
      default: "black",
      type: String
    },
    pointsStrokeWidth: {
      type: Number
    },
    pointsStrokeColor: {
      type: String
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
    },
    strokeGradientId() {
      return `vtsg${this._uid}`;
    },
    fillGradientId() {
      return `vtfg${this._uid}`;
    }
  },
  methods: {
    getGradientDirection(ref) {
      switch (ref) {
        case "to left":
          return { x1: 0, y1: 0, x2: 1, y2: 0 };
          break;
        case "to bottom":
          return { x1: 0, y1: 0, x2: 0, y2: 1 };
          break;
        case "to right":
          return { x1: 1, y1: 0, x2: 0, y2: 0 };
          break;
        default:
          return { x1: 0, y1: 1, x2: 0, y2: 0 };
          break;
      }
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
            fill: this.fillGradient
              ? `url(#${this.fillGradientId})`
              : this.fillColor,
            opacity: this.fillOpacity
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
            stroke: this.strokeGradient
              ? `url(#${this.strokeGradientId})`
              : this.strokeColor,
            "stroke-width": this.strokeWidth,
            "stroke-dasharray": this.strokeDasharray
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
                r: this.pointsRadius,
                fill: this.pointsFill,
                stroke: this.pointsStrokeColor,
                "stroke-width": this.pointsStrokeWidth
              }
            })
          )
        )
      );
    }
    // Gradients
    if (this.strokeGradient || this.fillGradient) {
      const gradients = [];
      // Stroke Gradient
      if (this.strokeGradient) {
        gradients.push(
          h(
            "linearGradient",
            {
              attrs: {
                id: this.strokeGradientId,
                ...this.getGradientDirection(this.strokeGradientDirection)
              }
            },
            this.strokeGradient.map((color, i) => {
              return h("stop", {
                attrs: {
                  offset: i / this.strokeGradient.length,
                  "stop-color": color
                }
              });
            })
          )
        );
      }
      // Fill Gradient
      if (this.fillGradient) {
        gradients.push(
          h(
            "linearGradient",
            {
              attrs: {
                id: this.fillGradientId,
                ...this.getGradientDirection(this.fillGradientDirection)
              }
            },
            this.fillGradient.map((color, i) => {
              return h("stop", {
                attrs: {
                  offset: i / this.fillGradient.length,
                  "stop-color": color
                }
              });
            })
          )
        );
      }

      children.push(h("defs", gradients));
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
