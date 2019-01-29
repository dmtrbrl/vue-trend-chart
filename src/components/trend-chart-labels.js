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
  },
  render(h) {
    if (
      !(this.xLabels && this.xLabels.length) ||
      !(this.yLabelsAmount && this.yLabelsAmount > 0)
    )
      return;

    const children = [];

    // x labels
    if (this.xLabels && this.xLabels.length) {
      children.push(
        h(
          "g",
          {
            class: "vtc-labels-x"
          },
          this.xLabels.map((label, i) => {
            return h(
              "text",
              {
                class: "vtc-label-x",
                attrs: {
                  ...this.setXLabelsParams(i),
                  "text-anchor": "middle",
                  "dominant-baseline":
                    this.xLabelsPosition == "bottom"
                      ? "text-before-edge"
                      : "text-after-edge"
                }
              },
              label
            );
          })
        )
      );
    }

    // y labels
    if (this.yLabelsAmount && this.yLabelsAmount > 0) {
      const labels = [];
      for (let i = 0; i < this.yLabelsAmount; i++) {
        labels.push(
          h(
            "text",
            {
              class: "vtc-label-y",
              attrs: {
                ...this.setYLabelsParams(i),
                "text-anchor": this.yLabelsPosition == "left" ? "end" : "start",
                "dominant-baseline": "middle"
              }
            },
            this.yLabelsTextFormatter(
              this.$parent.params.minValue +
                ((this.$parent.params.maxValue - this.$parent.params.minValue) /
                  (this.yLabelsAmount - 1)) *
                  i
            )
          )
        );
      }
      children.push(
        h(
          "g",
          {
            class: "vtc-labels-y"
          },
          labels
        )
      );
    }

    // Render component
    return h("g", children);
  }
};
