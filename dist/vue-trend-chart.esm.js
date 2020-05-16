function validatePadding (padding) {
  var arr = padding
    .split(" ")
    .filter(function (item) { return item !== ""; })
    .map(function (item) { return parseInt(item); });
  if (arr.length < 1 || arr.length > 4) { return false; }
  return arr.every(function (item) { return typeof item == "number" && item >= 0; });
}

function getPadding (padding) {
  var arr = padding
    .split(" ")
    .filter(function (item) { return item !== ""; })
    .map(function (item) { return parseInt(item); });
  switch (arr.length) {
    case 4:
      return { top: arr[0], right: arr[1], bottom: arr[2], left: arr[3] };
    case 3:
      return { top: arr[0], right: arr[1], bottom: arr[2], left: arr[1] };
    case 2:
      return { top: arr[0], right: arr[1], bottom: arr[0], left: arr[1] };
    default:
      return { top: arr[0], right: arr[0], bottom: arr[0], left: arr[0] };
  }
}

var TrendChartGrid = {
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
    setVerticalLinesParams: function setVerticalLinesParams(n) {
      var ref = this;
      var boundary = ref.boundary;
      var verticalLinesNumber = ref.verticalLinesNumber;
      var step =
        verticalLinesNumber > 1
          ? (boundary.maxX - boundary.minX) / (verticalLinesNumber - 1)
          : 0;
      var x = boundary.minX + step * (n - 1);
      var y1 = boundary.minY;
      var y2 = boundary.maxY;
      return {
        x1: x,
        x2: x,
        y1: y1,
        y2: y2,
        stroke: "rgba(0,0,0,0.1)"
      };
    },
    setHorizontalLinesParams: function setHorizontalLinesParams(n) {
      var ref = this;
      var boundary = ref.boundary;
      var horizontalLinesNumber = ref.horizontalLinesNumber;
      var step =
        horizontalLinesNumber > 1
          ? (boundary.maxY - boundary.minY) / (horizontalLinesNumber - 1)
          : 0;
      var y = boundary.maxY - step * (n - 1);
      var x1 = boundary.minX;
      var x2 = boundary.maxX;
      return {
        x1: x1,
        x2: x2,
        y1: y,
        y2: y,
        stroke: "rgba(0,0,0,0.1)"
      };
    }
  },
  render: function render(h) {
    if (!this.verticalLines && !this.horizontalLines) { return; }

    var children = [];

    // Vertical Lines
    if (this.verticalLines && this.verticalLinesNumber > 0) {
      var lines = [];
      for (var i = 1; i <= this.verticalLinesNumber; i++) {
        lines.push(
          h("line", {
            class: "line",
            attrs: Object.assign({}, this.setVerticalLinesParams(i))
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
      var lines$1 = [];
      for (var i$1 = 1; i$1 <= this.horizontalLinesNumber; i$1++) {
        lines$1.push(
          h("line", {
            class: "line",
            attrs: Object.assign({}, this.setHorizontalLinesParams(i$1))
          })
        );
      }
      children.push(
        h(
          "g",
          {
            class: "horizontal"
          },
          lines$1
        )
      );
    }

    // Render component
    return h("g", children);
  }
};

var TrendChartLabels = {
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
      default: function (value) { return value; },
      type: Function
    }
  },
  data: function data() {
    return {
      xLabelHeight: null,
      yLabelHeight: null
    };
  },
  methods: {
    setXLabelsParams: function setXLabelsParams(n) {
      var ref = this;
      var boundary = ref.boundary;
      var xLabels = ref.xLabels;
      var step = (boundary.maxX - boundary.minX) / (xLabels.length - 1);
      var x = boundary.minX + step * n;
      var y = boundary.maxY;
      return { transform: ("translate(" + x + ", " + y + ")") };
    },
    setYLabelsParams: function setYLabelsParams(n) {
      var ref = this;
      var boundary = ref.boundary;
      var yLabels = ref.yLabels;
      var step = (boundary.maxY - boundary.minY) / (yLabels - 1);
      var x = boundary.minX;
      var y = boundary.maxY - step * n;
      return { transform: ("translate(" + x + ", " + y + ")") };
    }
  },
  mounted: function mounted() {
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
  render: function render(h) {
    var this$1 = this;

    if (
      !(this.xLabels && this.xLabels.length) &&
      !(this.yLabels && this.yLabels > 0)
    )
      { return; }

    var children = [];

    // x labels
    if (this.xLabels && this.xLabels.length) {
      children.push(
        h(
          "g",
          {
            class: "x-labels",
            ref: "xLabels"
          },
          this.xLabels.map(function (label, i) {
            return h(
              "g",
              {
                class: "label",
                attrs: Object.assign({}, this$1.setXLabelsParams(i))
              },
              [
                h(
                  "text",
                  {
                    attrs: {
                      dy: this$1.xLabelHeight + 5,
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
      var labels = [];
      for (var i = 0; i < this.yLabels; i++) {
        labels.push(
          h(
            "g",
            {
              class: "label",
              attrs: Object.assign({}, this.setYLabelsParams(i))
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

function genPoints (arr, ref, max, min, maxAmount) {
  var minX = ref.minX;
  var minY = ref.minY;
  var maxX = ref.maxX;
  var maxY = ref.maxY;

  arr = arr.map(function (item) { return (typeof item === "number" ? item : item.value); });
  var minValue = min - 0.001;
  var gridX = (maxX - minX) / (maxAmount - 1);
  var gridY = (maxY - minY) / (max + 0.001 - minValue);

  return arr.map(function (value, index) {
    return {
      x: index * gridX + minX,
      y:
        maxY -
        (value - minValue) * gridY +
        +(index === maxAmount - 1) * 0.00001 -
        +(index === 0) * 0.00001
    };
  });
}

function genPath (pnts, smooth, ref) {
  var maxY = ref.maxY;

  var points = [].concat( pnts );
  var start = points.shift();
  var end = points[points.length - 1];
  var distance = points[0].x - start.x;
  var bezierX = distance / 2;

  // Create Line Path
  var linePath = "M " + (start.x) + "," + (start.y);
  points.forEach(function (point, index) {
    if (!smooth) { linePath += " L" + (point.x) + "," + (point.y); }
    else {
      var prev = points[index - 1] || start;
      linePath += " C " + (bezierX + prev.x) + "," + (prev.y) + " " + (bezierX + prev.x) + "," + (point.y) + " " + (point.x) + "," + (point.y);
    }
  });

  // Create Fill Path
  var fillPath = linePath;
  if (end.Y !== maxY) { fillPath += " L" + (end.x) + "," + maxY; }
  if (start.Y !== maxY) { fillPath += " L" + (start.x) + "," + maxY; }
  fillPath += " Z";

  return { linePath: linePath, fillPath: fillPath };
}

var TrendChartCurve = {
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
    points: function points() {
      return genPoints(
        this.data,
        this.boundary,
        this.maxValue,
        this.minValue,
        this.maxAmount
      );
    },
    paths: function paths() {
      return genPath(this.points, this.smooth, this.boundary);
    }
  },
  render: function render(h) {
    var this$1 = this;

    var children = [];
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
          this.points.map(function (point, i) { return h("circle", {
              class: {
                point: true,
                "is-active":
                  this$1.activeLineParams && this$1.activeLineParams.index === i
              },
              attrs: {
                cx: point.x,
                cy: point.y,
                r: 2,
                stroke: "#000000",
                "stroke-width": 1
              }
            }); }
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

var TrendChart = {
  name: "TrendChart",
  components: { TrendChartGrid: TrendChartGrid, TrendChartLabels: TrendChartLabels, TrendChartCurve: TrendChartCurve },
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
      validator: function validator(val) {
        return validatePadding(val);
      }
    },
    interactive: {
      default: false,
      type: Boolean
    }
  },
  data: function data() {
    return {
      width: null,
      height: null,
      labelsOverflowObject: { top: 0, right: 0, bottom: 0, left: 0 },
      activeLine: null,
      activeLineParams: null
    };
  },
  computed: {
    paddingObject: function paddingObject() {
      if (!this.padding) { return getPadding("0"); }
      return getPadding(this.padding);
    },
    boundary: function boundary() {
      var ref = this;
      var width = ref.width;
      var height = ref.height;
      var paddingObject = ref.paddingObject;
      var labelsOverflowObject = ref.labelsOverflowObject;
      var boundary = {
        minX: paddingObject.left + labelsOverflowObject.left,
        minY: paddingObject.top + labelsOverflowObject.top,
        maxX: width - paddingObject.right - labelsOverflowObject.right,
        maxY: height - paddingObject.bottom - labelsOverflowObject.bottom
      };
      return boundary;
    },
    params: function params() {
      var maxValue = -Infinity;
      var minValue = Infinity;
      var maxAmount = 0;
      this.datasets.forEach(function (dataset) {
        var dataArr = dataset.data.map(function (item) { return typeof item === "number" ? item : item.value; }
        );

        var max = Math.max.apply(Math, dataArr);
        if (max > maxValue) { maxValue = max; }

        var min = Math.min.apply(Math, dataArr);
        if (min < minValue) { minValue = min; }

        if (dataArr.length > maxAmount) { maxAmount = dataArr.length; }
      });
      if (this.max !== undefined && this.max > maxValue) { maxValue = this.max; }
      if (this.min !== undefined && this.min < minValue) { minValue = this.min; }
      return { maxValue: maxValue, minValue: minValue, maxAmount: maxAmount };
    },
    chartOverlayParams: function chartOverlayParams() {
      var ref = this;
      var boundary = ref.boundary;
      var width = boundary.maxX - boundary.minX;
      var height = boundary.maxY - boundary.minY;
      return {
        x: boundary.minX,
        y: boundary.minY,
        width: width > 0 ? width : 0,
        height: height > 0 ? height : 0,
        opacity: 0
      };
    },
    chartAxesXCoords: function chartAxesXCoords() {
      var axes = [];
      var step =
        (this.boundary.maxX - this.boundary.minX) / (this.params.maxAmount - 1);
      for (var i = 0; i < this.params.maxAmount; i++) {
        axes.push(step * i + this.boundary.minX);
      }
      return axes;
    }
  },
  methods: {
    setSize: function setSize() {
      var params = this.$refs["chart"].getBoundingClientRect();
      this.width = params.width;
      this.height = params.height;
    },
    fitLabels: function fitLabels() {
      var chart = this.$refs["chart"];
      var chartLabels = this.$refs["labels"];
      if (
        chartLabels &&
        ((chartLabels.xLabels && chartLabels.xLabels.length) ||
          chartLabels.yLabels > 0)
      ) {
        var chartClientRect = chart.getBoundingClientRect();
        var chartLabelsClientRect = chartLabels.$el.getBoundingClientRect();

        var top =
          chartClientRect.top -
          chartLabelsClientRect.top +
          this.paddingObject.top;
        var right =
          chartLabelsClientRect.right -
          chartClientRect.right +
          this.paddingObject.right;
        var bottom =
          chartLabelsClientRect.bottom -
          chartClientRect.bottom +
          this.paddingObject.bottom;
        var left =
          this.paddingObject.left -
          chartLabelsClientRect.left +
          chartClientRect.left;

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
    init: function init() {
      var this$1 = this;

      this.setSize();
      this.$nextTick(function () {
        this$1.fitLabels();
      });
    },
    getNearestCoordinate: function getNearestCoordinate(val) {
      return (
        this.chartAxesXCoords.reduce(
          function (p, n) { return (Math.abs(p) > Math.abs(n - val) ? n - val : p); },
          Infinity
        ) + val
      );
    },
    mouseMove: function mouseMove(e) {
      var rect = this.$refs.chart.getBoundingClientRect();
      this.activeLine = this.getNearestCoordinate(e.clientX - rect.left);
    },
    mouseOut: function mouseOut() {
      this.activeLine = null;
      this.activeLineParams = null;
    },
    onWindowResize: function onWindowResize() {
      this.setSize();
    }
  },
  watch: {
    activeLine: function activeLine(val) {
      var this$1 = this;

      var data = [];
      if (val) {
        this.activeLineParams = {
          index: this.chartAxesXCoords.indexOf(this.activeLine)
        };
        this.datasets.forEach(function (dataset) {
          data.push(dataset.data[this$1.activeLineParams.index]);
        });
      }

      this.$emit(
        "mouse-move",
        this.activeLineParams ? Object.assign({}, this.activeLineParams, {data: data}) : null
      );
    },
    labels: {
      handler: function handler() {
        var this$1 = this;

        // Reset labels rect overflow
        this.labelsOverflowObject = { top: 0, right: 0, bottom: 0, left: 0 };
        // Calculate new labels rect overflow
        this.$nextTick(function () {
          this$1.fitLabels();
        });
      },
      deep: true
    }
  },
  mounted: function mounted() {
    this.init();
    window.addEventListener("resize", this.onWindowResize);
  },
  destroyed: function destroyed() {
    window.removeEventListener("resize", this.onWindowResize);
  },
  render: function render(h) {
    var this$1 = this;

    var children = [];

    // Grid
    if (this.grid) {
      children.push(
        h(TrendChartGrid, {
          class: "grid",
          attrs: {
            verticalLines: this.grid.verticalLines,
            verticalLinesNumber:
              this.grid.verticalLinesNumber || this.params.maxAmount,
            horizontalLines: this.grid.horizontalLines,
            horizontalLinesNumber:
              this.grid.horizontalLinesNumber ||
              (this.labels && this.labels.yLabels) ||
              0,
            boundary: this.boundary
          }
        })
      );
    }

    // Chart active line
    if (this.interactive && this.chartOverlayParams) {
      children.push(
        h("line", {
          class: "active-line",
          ref: "active-line",
          attrs: {
            x1: this.activeLine || this.boundary.minX,
            x2: this.activeLine || this.boundary.minX,
            y1: this.boundary.minY,
            y2: this.boundary.maxY,
            stroke: "black",
            visibility: this.activeLine ? "visible" : "hidden"
          }
        })
      );
    }

    // Labels
    if (this.labels) {
      children.push(
        h(TrendChartLabels, {
          class: "labels",
          ref: "labels",
          attrs: Object.assign({}, this.labels,
            {boundary: this.boundary,
            minValue: this.params.minValue,
            maxValue: this.params.maxValue})
        })
      );
    }

    // Curves
    this.datasets.map(function (dataset) {
      children.push(
        h(TrendChartCurve, {
          class: "curve",
          attrs: Object.assign({}, dataset,
            {boundary: this$1.boundary,
            minValue: this$1.params.minValue,
            maxValue: this$1.params.maxValue,
            maxAmount: this$1.params.maxAmount,
            activeLineParams: this$1.activeLineParams})
        })
      );
    });

    // Chart overlay
    if (this.interactive && this.chartOverlayParams) {
      children.push(
        h("rect", {
          ref: "interactive-area",
          attrs: Object.assign({}, this.chartOverlayParams),
          on: {
            mousemove: function (e) { return this$1.mouseMove(e); },
            mouseout: function () { return this$1.mouseOut(); }
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

TrendChart.install = function(Vue) {
  Vue.component(TrendChart.name, TrendChart);
};

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(TrendChart);
}

export default TrendChart;
