export default {
  name: "TrendChartLabels",
  props: {
    xLabels: {
      type: Array
    },
    xLabelsOffset: {
      default: 5,
      type: Number
    },
    yLabelsAmount: {
      type: Number
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
    }
  },
  methods: {
    setXLabelsParams(n) {
      const { boundary, xLabels, xLabelsOffset } = this;
      const step = (boundary.maxX - boundary.minX) / (xLabels.length - 1);
      const x = boundary.minX + step * n;
      const y = boundary.maxY + xLabelsOffset;
      return { x, y };
    },
    setYLabelsParams(n) {
      const { boundary, yLabelsAmount, yLabelsOffset } = this;
      const step = (boundary.maxY - boundary.minY) / (yLabelsAmount - 1);
      const x = boundary.minX - yLabelsOffset;
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
                  "dominant-baseline": "text-before-edge"
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
                "text-anchor": "end",
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
