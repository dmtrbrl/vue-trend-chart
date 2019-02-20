export default {
  name: "TrendChartLabels",
  props: {
    boundary: {
      required: true,
      type: Object
    },
    minValue: {
      type: Number
    },
    maxValue: {
      type: Number
    },
    xLabels: {
      type: Array
    },
    yLabels: {
      type: Number
    },
    yLabelsTextFormatter: {
      default: value => value,
      type: Function
    }
  },
  data() {
    return {
      xLabelHeight: null,
      yLabelHeight: null
    };
  },
  methods: {
    setXLabelsParams(n) {
      const { boundary, xLabels } = this;
      const step = (boundary.maxX - boundary.minX) / (xLabels.length - 1);
      const x = boundary.minX + step * n;
      const y = boundary.maxY;
      return { transform: `translate(${x}, ${y})` };
    },
    setYLabelsParams(n) {
      const { boundary, yLabels } = this;
      const step = (boundary.maxY - boundary.minY) / (yLabels - 1);
      const x = boundary.minX;
      const y = boundary.maxY - step * n;
      return { transform: `translate(${x}, ${y})` };
    }
  },
  mounted() {
    if (this.xLabels && this.xLabels.length) {
      this.xLabelHeight = this.$refs.xLabels
        .querySelector("text")
        .getBoundingClientRect().height;
    }
    if (this.yLabels && this.yLabels > 0) {
      this.yLabelHeight = this.$refs.yLabels
        .querySelector("text")
        .getBoundingClientRect().height;
    }
  },
  render(h) {
    if (
      !(this.xLabels && this.xLabels.length) &&
      !(this.yLabels && this.yLabels > 0)
    )
      return;

    const children = [];

    // x labels
    if (this.xLabels && this.xLabels.length) {
      children.push(
        h(
          "g",
          {
            class: "x-labels",
            ref: "xLabels"
          },
          this.xLabels.map((label, i) => {
            return h(
              "g",
              {
                class: "label",
                attrs: {
                  ...this.setXLabelsParams(i)
                }
              },
              [
                h(
                  "text",
                  {
                    attrs: {
                      dy: this.xLabelHeight + 5,
                      "text-anchor": "middle"
                    }
                  },
                  label
                ),
                h("line", { attrs: { stroke: "rgba(0,0,0,0.1)", y2: 5 } })
              ]
            );
          })
        )
      );
    }

    // y labels
    if (this.yLabels && this.yLabels > 0) {
      const labels = [];
      for (let i = 0; i < this.yLabels; i++) {
        labels.push(
          h(
            "g",
            {
              class: "label",
              attrs: {
                ...this.setYLabelsParams(i)
              }
            },
            [
              h(
                "text",
                {
                  attrs: {
                    dx: -10,
                    dy: this.yLabelHeight / 4,
                    "text-anchor": "end"
                  }
                },
                this.yLabelsTextFormatter(
                  this.minValue +
                    ((this.maxValue - this.minValue) / (this.yLabels - 1)) * i
                )
              ),
              h("line", { attrs: { stroke: "rgba(0,0,0,0.1)", x1: 0, x2: -5 } })
            ]
          )
        );
      }
      children.push(
        h(
          "g",
          {
            class: "y-labels",
            ref: "yLabels"
          },
          labels
        )
      );
    }

    // Render component
    return h("g", children);
  }
};
