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

  //

  var script = {
    name: "TrendChartGrid",
    props: {
      padding: {
        default: "0",
        type: String,
        validator: function validator(value) {
          return validatePadding(value);
        }
      },
      xAxes: {
        default: false,
        type: Boolean
      },
      xAxesLines: {
        type: Number
      },
      xAxesStrokeWidth: {
        default: 1,
        type: Number
      },
      xAxesStrokeColor: {
        default: "black",
        type: String
      },
      xAxesStrokeDasharray: {
        default: null,
        type: String
      },
      yAxes: {
        default: false,
        type: Boolean
      },
      yAxesLines: {
        type: Number
      },
      yAxesStrokeWidth: {
        default: 1,
        type: Number
      },
      yAxesStrokeColor: {
        default: "black",
        type: String
      },
      yAxesStrokeDasharray: {
        default: null,
        type: String
      }
    },
    computed: {
      xLines: function xLines() {
        return this.xAxesLines || this.$parent.params.maxAmount;
      },
      boundary: function boundary() {
        return this.$parent.boundary;
      },
      paddingObject: function paddingObject() {
        return this.$parent.gridPaddingObject;
      }
    },
    methods: {
      setXLineParams: function setXLineParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var xLines = ref.xLines;
        var paddingObject = ref.paddingObject;
        var xAxesStrokeColor = ref.xAxesStrokeColor;
        var xAxesStrokeWidth = ref.xAxesStrokeWidth;
        var xAxesStrokeDasharray = ref.xAxesStrokeDasharray;
        var step = (boundary.maxX - boundary.minX) / (xLines - 1);
        var x = boundary.minX + step * (n - 1);
        var x1 = x;
        var x2 = x;
        var y1 = boundary.minY - paddingObject.top;
        var y2 = boundary.maxY + paddingObject.bottom;
        return {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2,
          stroke: xAxesStrokeColor,
          "stroke-width": xAxesStrokeWidth,
          "stroke-dasharray": xAxesStrokeDasharray
        };
      },
      setYLineParams: function setYLineParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var yAxesLines = ref.yAxesLines;
        var paddingObject = ref.paddingObject;
        var yAxesStrokeColor = ref.yAxesStrokeColor;
        var yAxesStrokeWidth = ref.yAxesStrokeWidth;
        var yAxesStrokeDasharray = ref.yAxesStrokeDasharray;
        var step = (boundary.maxY - boundary.minY) / (yAxesLines - 1);
        var y = boundary.minY + step * (n - 1);
        var x1 = boundary.minX - paddingObject.left;
        var x2 = boundary.maxX + paddingObject.right;
        var y1 = y;
        var y2 = y;
        return {
          x1: x1,
          x2: x2,
          y1: y1,
          y2: y2,
          stroke: yAxesStrokeColor,
          "stroke-width": yAxesStrokeWidth,
          "stroke-dasharray": yAxesStrokeDasharray
        };
      }
    }
  };

  function normalizeComponent(compiledTemplate, injectStyle, defaultExport, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, isShadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof isShadowMode === 'function') {
          createInjectorSSR = createInjector;
          createInjector = isShadowMode;
          isShadowMode = false;
      }
      // Vue.extend constructor export interop
      var options = typeof defaultExport === 'function' ? defaultExport.options : defaultExport;
      // render functions
      if (compiledTemplate && compiledTemplate.render) {
          options.render = compiledTemplate.render;
          options.staticRenderFns = compiledTemplate.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (injectStyle) {
                  injectStyle.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (injectStyle) {
          hook = isShadowMode
              ? function () {
                  injectStyle.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
              }
              : function (context) {
                  injectStyle.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return defaultExport;
  }

  /* script */
  var __vue_script__ = script;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script.__file = "/Users/dmytrobarylo/Desktop/vue-trend-chart/src/components/trend-chart-grid.vue";

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _vm.xAxes || _vm.yAxes
      ? _c("g", [
          _vm.xAxes && _vm.xLines > 0
            ? _c(
                "g",
                { staticClass: "trend-chart-grid-x" },
                _vm._l(_vm.xLines, function(n, i) {
                  return _c(
                    "line",
                    _vm._b(
                      { key: i, staticClass: "trend-chart-grid-x-axis" },
                      "line",
                      _vm.setXLineParams(n),
                      false
                    )
                  )
                }),
                0
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.yAxes && _vm.yAxesLines > 0
            ? _c(
                "g",
                { staticClass: "trend-chart-grid-y" },
                _vm._l(_vm.yAxesLines, function(n, i) {
                  return _c(
                    "line",
                    _vm._b(
                      { key: i, staticClass: "trend-chart-grid-y-axis" },
                      "line",
                      _vm.setYLineParams(n),
                      false
                    )
                  )
                }),
                0
              )
            : _vm._e()
        ])
      : _vm._e()
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = undefined;
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var TrendChartGrid = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$1 = {
    name: "TrendChartLabels",
    props: {
      xLabels: {
        type: Array
      },
      xLabelsPosition: {
        default: "bottom",
        type: String,
        validator: function validator(value) {
          return ["top", "bottom"].indexOf(value) !== -1;
        }
      },
      xLabelsOffset: {
        default: 10,
        type: Number
      },
      yLabelsAmount: {
        type: Number
      },
      yLabelsPosition: {
        default: "left",
        type: String,
        validator: function validator(value) {
          return ["left", "right"].indexOf(value) !== -1;
        }
      },
      yLabelsOffset: {
        default: 10,
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
        var xLabelsPosition = ref.xLabelsPosition;
        var xLabelsOffset = ref.xLabelsOffset;
        var step = (boundary.maxX - boundary.minX) / (xLabels.length - 1);
        var x = boundary.minX + step * n;
        var y =
          xLabelsPosition == "bottom"
            ? boundary.maxY + xLabelsOffset
            : boundary.minY - xLabelsOffset;
        return { x: x, y: y };
      },
      setYLabelsParams: function setYLabelsParams(n) {
        var ref = this;
        var boundary = ref.boundary;
        var yLabelsAmount = ref.yLabelsAmount;
        var yLabelsPosition = ref.yLabelsPosition;
        var yLabelsOffset = ref.yLabelsOffset;
        var step = (boundary.maxY - boundary.minY) / (yLabelsAmount - 1);
        var x =
          yLabelsPosition == "left"
            ? boundary.minX - yLabelsOffset
            : boundary.maxY + yLabelsOffset;
        var y = boundary.maxY - step * n;
        return { x: x, y: y };
      }
    }
  };

  /* script */
  var __vue_script__$1 = script$1;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$1.__file = "/Users/dmytrobarylo/Desktop/vue-trend-chart/src/components/trend-chart-labels.vue";

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _vm.xLabels && _vm.xLabels.length
      ? _c("g", [
          _vm.xLabels && _vm.xLabels.length
            ? _c(
                "g",
                { staticClass: "trend-chart-labels-x" },
                _vm._l(_vm.xLabels, function(label, i) {
                  return _c(
                    "text",
                    _vm._b(
                      {
                        key: i,
                        staticClass: "trend-chart-label-x",
                        attrs: {
                          "text-anchor": "middle",
                          "alignment-baseline":
                            _vm.xLabelsPosition == "bottom"
                              ? "before-edge"
                              : "after-edge"
                        }
                      },
                      "text",
                      _vm.setXLabelsParams(i),
                      false
                    ),
                    [_vm._v(_vm._s(label))]
                  )
                }),
                0
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.yLabelsAmount && _vm.yLabelsAmount > 0
            ? _c(
                "g",
                { staticClass: "trend-chart-labels-y" },
                _vm._l(_vm.yLabelsAmount, function(n, i) {
                  return _c(
                    "text",
                    _vm._b(
                      {
                        key: i,
                        staticClass: "trend-chart-label-y",
                        attrs: {
                          "text-anchor":
                            _vm.yLabelsPosition == "left" ? "end" : "start",
                          "alignment-baseline": "middle"
                        },
                        domProps: {
                          textContent: _vm._s(
                            _vm.yLabelsTextFormatter(
                              _vm.$parent.params.minValue +
                                ((_vm.$parent.params.maxValue -
                                  _vm.$parent.params.minValue) /
                                  (_vm.yLabelsAmount - 1)) *
                                  (n - 1)
                            )
                          )
                        }
                      },
                      "text",
                      _vm.setYLabelsParams(i),
                      false
                    )
                  )
                }),
                0
              )
            : _vm._e()
        ])
      : _vm._e()
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    var __vue_inject_styles__$1 = undefined;
    /* scoped */
    var __vue_scope_id__$1 = undefined;
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var TrendChartLabels = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      undefined,
      undefined
    );

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
    var linePath =
      "M " + (start.x) + "," + (start.y) +
      points.map(function (point, index) {
        if (!smooth) { return (" L" + (point.x) + "," + (point.y)); }

        var prev = points[index - 1] || start;

        return (" C " + (bezierX + prev.x) + "," + (prev.y) + " " + (bezierX + prev.x) + "," + (point.y) + " " + (point.x) + "," + (point.y));
      });

    // Create Fill Path
    var fillPath = linePath;
    if (end.Y !== maxY) { fillPath += " L" + (end.x) + "," + maxY; }
    if (start.Y !== maxY) { fillPath += " L" + (start.x) + "," + maxY; }
    fillPath += " Z";

    return { linePath: linePath, fillPath: fillPath };
  }

  //

  var script$2 = {
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
        validator: function validator(value) {
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
        validator: function validator(value) {
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
      },
      strokeGradientId: function strokeGradientId() {
        return ("vueTrendStrokeGradient" + (this._uid));
      },
      fillGradientId: function fillGradientId() {
        return ("vueTrendFillGradient" + (this._uid));
      }
    },
    methods: {
      getGradientDirection: function getGradientDirection(ref) {
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
    }
  };

  /* script */
  var __vue_script__$2 = script$2;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$2.__file = "/Users/dmytrobarylo/Desktop/vue-trend-chart/src/components/trend-chart-curve.vue";

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("g", { class: _vm.className }, [
      _vm.fill && _vm.paths && _vm.paths.fillPath
        ? _c("path", {
            staticClass: "trend-chart-fill",
            attrs: {
              d: _vm.paths.fillPath,
              fill: _vm.fillGradient
                ? "url(#" + _vm.fillGradientId + ")"
                : _vm.fillColor,
              opacity: _vm.fillOpacity
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _vm.stroke && _vm.paths && _vm.paths.linePath
        ? _c("path", {
            staticClass: "trend-chart-stroke",
            attrs: {
              d: _vm.paths.linePath,
              fill: "none",
              stroke: _vm.strokeGradient
                ? "url(#" + _vm.strokeGradientId + ")"
                : _vm.strokeColor,
              "stroke-width": _vm.strokeWidth,
              "stroke-dasharray": _vm.strokeDasharray
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _vm.showPoints
        ? _c(
            "g",
            { staticClass: "trend-chart-points" },
            _vm._l(_vm.points, function(point, i) {
              return _c("circle", {
                key: i,
                staticClass: "trend-chart-point",
                attrs: {
                  cx: point.x,
                  cy: point.y,
                  r: _vm.pointsRadius,
                  fill: _vm.pointsFill,
                  stroke: _vm.pointsStrokeColor,
                  "stroke-width": _vm.pointsStrokeWidth
                }
              })
            }),
            0
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.strokeGradient || _vm.fillGradient
        ? _c(
            "defs",
            [
              _vm.strokeGradient
                ? _c(
                    "linearGradient",
                    _vm._b(
                      { attrs: { id: _vm.strokeGradientId } },
                      "linearGradient",
                      _vm.getGradientDirection(_vm.strokeGradientDirection),
                      false
                    ),
                    _vm._l(_vm.strokeGradient, function(color, i) {
                      return _c("stop", {
                        key: i,
                        attrs: {
                          offset: i / _vm.strokeGradient.length,
                          "stop-color": color
                        }
                      })
                    }),
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.fillGradient
                ? _c(
                    "linearGradient",
                    _vm._b(
                      { attrs: { id: _vm.fillGradientId } },
                      "linearGradient",
                      _vm.getGradientDirection(_vm.fillGradientDirection),
                      false
                    ),
                    _vm._l(_vm.fillGradient, function(color, i) {
                      return _c("stop", {
                        key: i,
                        attrs: {
                          offset: i / _vm.fillGradient.length,
                          "stop-color": color
                        }
                      })
                    }),
                    1
                  )
                : _vm._e()
            ],
            1
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    var __vue_inject_styles__$2 = undefined;
    /* scoped */
    var __vue_scope_id__$2 = undefined;
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var TrendChartCurve = normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      undefined,
      undefined
    );

  //

  var script$3 = {
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
      width: {
        default: 300,
        type: Number
      },
      height: {
        default: 75,
        type: Number
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
      }
    },
    computed: {
      paddingObject: function paddingObject() {
        return getPadding(this.padding);
      },
      gridPaddingObject: function gridPaddingObject() {
        if (!this.grid || !this.grid.padding) { return getPadding("0"); }
        return getPadding(this.grid.padding);
      },
      boundary: function boundary() {
        var ref = this;
        var width = ref.width;
        var height = ref.height;
        var paddingObject = ref.paddingObject;
        var gridPaddingObject = ref.gridPaddingObject;
        return {
          minX: paddingObject.left + gridPaddingObject.left,
          minY: paddingObject.top + gridPaddingObject.top,
          maxX: width - paddingObject.right - gridPaddingObject.right,
          maxY: height - paddingObject.bottom - gridPaddingObject.bottom
        };
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
      }
    }
  };

  /* script */
  var __vue_script__$3 = script$3;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$3.__file = "/Users/dmytrobarylo/Desktop/vue-trend-chart/src/components/trend-chart.vue";

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "svg",
      {
        staticClass: "trend-chart",
        attrs: {
          viewBox: "0 0 " + _vm.width + " " + _vm.height,
          width: _vm.width,
          height: _vm.height,
          xmlns: "http://www.w3.org/2000/svg"
        }
      },
      [
        _vm.grid
          ? _c(
              "trend-chart-grid",
              _vm._b(
                { staticClass: "trend-chart-grid" },
                "trend-chart-grid",
                _vm.grid,
                false
              )
            )
          : _vm._e(),
        _vm._v(" "),
        _vm.labels
          ? _c(
              "trend-chart-labels",
              _vm._b(
                { staticClass: "trend-chart-labels" },
                "trend-chart-labels",
                _vm.labels,
                false
              )
            )
          : _vm._e(),
        _vm._v(" "),
        _vm._l(_vm.datasets, function(dataset, i) {
          return _c(
            "trend-chart-curve",
            _vm._b(
              { key: i, staticClass: "trend-chart-curve" },
              "trend-chart-curve",
              dataset,
              false
            )
          )
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    var __vue_inject_styles__$3 = undefined;
    /* scoped */
    var __vue_scope_id__$3 = undefined;
    /* module identifier */
    var __vue_module_identifier__$3 = undefined;
    /* functional template */
    var __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var TrendChart = normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );

  TrendChart.install = function(Vue) {
    Vue.component(TrendChart.name, TrendChart);
  };

  if (typeof window !== "undefined" && window.Vue) {
    window.Vue.use(TrendChart);
  }

  return TrendChart;

}));
