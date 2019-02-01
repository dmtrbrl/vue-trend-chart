(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['vue-trend-chart'] = factory());
}(this, function () { 'use strict';

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
        break;
      case 3:
        return { top: arr[0], right: arr[1], bottom: arr[2], left: arr[1] };
        break;
      case 2:
        return { top: arr[0], right: arr[1], bottom: arr[0], left: arr[1] };
        break;
      default:
        return { top: arr[0], right: arr[0], bottom: arr[0], left: arr[0] };
        break;
    }
  }

  var TrendChartGrid = {
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
      xLines: function xLines() {
        return this.xAxesLines || this.$parent.params.maxAmount;
      },
      boundary: function boundary() {
        return this.$parent.boundary;
      }
    },
    methods: {
      setXLineParams: function setXLineParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var xLines = ref.xLines;
        var step =
          xLines > 1 ? (boundary.maxX - boundary.minX) / (xLines - 1) : 0;
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
      setYLineParams: function setYLineParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var yAxesLines = ref.yAxesLines;
        var step =
          yAxesLines > 1 ? (boundary.maxY - boundary.minY) / (yAxesLines - 1) : 0;
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
      if (!this.xAxes || !this.yAxes) { return; }

      var children = [];

      // x axes
      if (this.xAxes && this.xLines > 0) {
        var lines = [];
        for (var i = 1; i <= this.xLines; i++) {
          lines.push(
            h("line", {
              class: "vtc-axis-x",
              attrs: Object.assign({}, this.setXLineParams(i))
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
      if (this.yAxes && this.yAxesLines > 0) {
        var lines$1 = [];
        for (var i$1 = 1; i$1 <= this.yAxesLines; i$1++) {
          lines$1.push(
            h("line", {
              class: "vtc-axis-y",
              attrs: Object.assign({}, this.setYLineParams(i$1))
            })
          );
        }
        children.push(
          h(
            "g",
            {
              class: "vtc-axes-y"
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
        default: function (value) { return value; },
        type: Function
      }
    },
    computed: {
      boundary: function boundary() {
        return this.$parent.boundary;
      }
    },
    methods: {
      setXLabelsParams: function setXLabelsParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var xLabels = ref.xLabels;
        var xLabelsOffset = ref.xLabelsOffset;
        var step = (boundary.maxX - boundary.minX) / (xLabels.length - 1);
        var x = boundary.minX + step * n;
        var y = boundary.maxY + xLabelsOffset;
        return { transform: ("translate(" + x + ", " + y + ")") };
      },
      setYLabelsParams: function setYLabelsParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var yLabelsAmount = ref.yLabelsAmount;
        var yLabelsOffset = ref.yLabelsOffset;
        var step = (boundary.maxY - boundary.minY) / (yLabelsAmount - 1);
        var x = boundary.minX - yLabelsOffset;
        var y = boundary.maxY - step * n;
        return { transform: ("translate(" + x + ", " + y + ")") };
      }
    },
    render: function render(h) {
      var this$1 = this;

      if (
        !(this.xLabels && this.xLabels.length) ||
        !(this.yLabelsAmount && this.yLabelsAmount > 0)
      )
        { return; }

      var children = [];

      // x labels
      if (this.xLabels && this.xLabels.length) {
        children.push(
          h(
            "g",
            {
              class: "vtc-labels-x"
            },
            this.xLabels.map(function (label, i) {
              return h(
                "g",
                {
                  class: "vtc-label-x",
                  attrs: Object.assign({}, this$1.setXLabelsParams(i))
                },
                [
                  h("line", { attrs: { stroke: "black", y2: 5 } }),
                  h(
                    "text",
                    {
                      attrs: {
                        dy: 10,
                        "text-anchor": "middle",
                        "dominant-baseline": "text-before-edge"
                      }
                    },
                    label
                  )
                ]
              );
            })
          )
        );
      }

      // y labels
      if (this.yLabelsAmount && this.yLabelsAmount > 0) {
        var labels = [];
        for (var i = 0; i < this.yLabelsAmount; i++) {
          labels.push(
            h(
              "g",
              {
                class: "vtc-label-y",
                attrs: Object.assign({}, this.setYLabelsParams(i))
              },
              [
                h(
                  "text",
                  {
                    attrs: {
                      dx: -10,
                      "text-anchor": "end",
                      "dominant-baseline": "middle"
                    }
                  },
                  this.yLabelsTextFormatter(
                    this.$parent.params.minValue +
                      ((this.$parent.params.maxValue -
                        this.$parent.params.minValue) /
                        (this.yLabelsAmount - 1)) *
                        i
                  )
                ),
                h("line", { attrs: { stroke: "black", x1: 0, x2: -5 } })
              ]
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
          this.$parent.boundary,
          this.$parent.params.maxValue,
          this.$parent.params.minValue,
          this.$parent.params.maxAmount
        );
      },
      paths: function paths() {
        return genPath(this.points, this.smooth, this.$parent.boundary);
      }
    },
    render: function render(h) {
      var children = [];
      // Fill path
      if (this.fill && this.paths && this.paths.fillPath) {
        children.push(
          h("path", {
            class: "vtc-curve-fill",
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
            class: "vtc-curve-stroke",
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
              class: "vtc-points"
            },
            this.points.map(function (point) { return h("circle", {
                class: "vtc-point",
                attrs: {
                  cx: point.x,
                  cy: point.y,
                  r: 3
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
      hoverable: {
        default: false,
        type: Boolean
      }
    },
    data: function data() {
      return {
        width: null,
        height: null,
        labelsOverflowObject: { top: 0, right: 0, bottom: 0, left: 0 },
        hovered: null,
        hoveredParams: null
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
        var chartLabels = this.$refs["chart-labels"];
        if (
          chartLabels &&
          ((chartLabels.xLabels && chartLabels.xLabels.length) ||
            chartLabels.yLabelsAmount > 0)
        ) {
          var chartParams = chart.getBoundingClientRect();
          var chartLabelsParams = chartLabels.$el.getBoundingClientRect();

          var top =
            chartParams.top - chartLabelsParams.top + this.paddingObject.top;
          var right =
            chartLabelsParams.right -
            chartParams.right +
            this.paddingObject.right;
          var bottom =
            chartLabelsParams.bottom -
            chartParams.bottom +
            this.paddingObject.bottom;
          var left =
            this.paddingObject.left - chartLabelsParams.left + chartParams.left;

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
      onWindowResize: function onWindowResize() {
        this.setSize();
      },
      onMouseMove: function onMouseMove(e) {
        var this$1 = this;

        var nearest = function (val) { return this$1.chartAxesXCoords.reduce(
            function (p, n) { return (Math.abs(p) > Math.abs(n - val) ? n - val : p); },
            Infinity
          ) + val; };
        this.hovered = nearest(e.offsetX);
        this.hoveredParams = {
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          x: e.x,
          y: e.y,
          height: this.boundary.maxY - this.boundary.minY,
          index: this.chartAxesXCoords.indexOf(this.hovered)
        };
      },
      onMouseOut: function onMouseOut() {
        this.hovered = null;
        this.hoveredParams = null;
      }
    },
    watch: {
      hovered: function hovered() {
        var this$1 = this;

        var data = [];
        if (this.hoveredParams) {
          this.datasets.forEach(function (dataset) {
            data.push(dataset.data[this$1.hoveredParams.index]);
          });
        }

        this.$emit(
          "onAxisHover",
          this.hoveredParams ? Object.assign({}, this.hoveredParams, {data: data}) : null
        );
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
            class: "vtc-grid",
            attrs: Object.assign({}, this.grid)
          })
        );
      }

      // Chart active axis
      if (this.hoverable && this.chartOverlayParams && this.hovered) {
        children.push(
          h("line", {
            class: "vtc-active-x",
            attrs: {
              x1: this.hovered,
              x2: this.hovered,
              y1: this.boundary.minY,
              y2: this.boundary.maxY,
              stroke: "black"
            }
          })
        );
      }

      // Labels
      if (this.labels) {
        children.push(
          h(TrendChartLabels, {
            class: "vtc-labels",
            ref: "chart-labels",
            attrs: Object.assign({}, this.labels)
          })
        );
      }

      // Curves
      this.datasets.map(function (dataset) {
        children.push(
          h(TrendChartCurve, {
            class: "vtc-curve",
            attrs: Object.assign({}, dataset)
          })
        );
      });

      // Chart overlay
      if (this.hoverable && this.chartOverlayParams) {
        children.push(
          h("rect", {
            attrs: Object.assign({}, this.chartOverlayParams),
            on: {
              mousemove: function (e) { return this$1.onMouseMove(e); },
              mouseout: function () { return this$1.onMouseOut(); }
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

  return TrendChart;

}));
