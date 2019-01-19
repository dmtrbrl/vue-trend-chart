(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['vue-trend-chart'] = factory());
}(this, function () { 'use strict';

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

  function genPath (points, smooth) {
    var start = points.shift();

    return (
      "M " + (start.x) + "," + (start.y) +
      points.map(function (point, index) {
        if (!smooth) { return (" L" + (point.x) + "," + (point.y)); }

        var next = points[index + 1];
        var prev = points[index - 1] || start;
        var distance = (points[0].x - start.x) / 2;
        if (index == 0) {
          return (" C " + (prev.x) + "," + (prev.y) + " " + (distance + prev.x) + "," + (point.y) + " " + (point.x) + "," + (point.y));
        } else if (next) {
          return (" C " + (distance + prev.x) + "," + (prev.y) + " " + (distance + prev.x) + "," + (point.y) + " " + (point.x) + "," + (point.y));
        } else {
          return (" C " + (distance + prev.x) + "," + (prev.y) + " " + (point.x) + "," + (point.y) + " " + (point.x) + "," + (point.y));
        }
      })
    );
  }

  //

  var script = {
    name: "trend-chart-curve",
    props: {
      data: {
        required: true,
        type: Array
      },
      smooth: {
        default: false,
        type: Boolean
      },
      stroke: {
        default: "black",
        type: String
      },
      strokeWidth: {
        default: 1,
        type: Number
      },
      max: {
        required: true,
        type: Number
      },
      min: {
        required: true,
        type: Number
      },
      maxAmount: {
        required: true,
        type: Number
      }
    },
    computed: {
      boundary: function boundary() {
        var ref = this.$parent;
        var width = ref.width;
        var height = ref.height;
        var padding = ref.padding;
        return {
          minX: padding,
          minY: padding,
          maxX: width - padding,
          maxY: height - padding
        };
      },
      points: function points() {
        return genPoints(
          this.data,
          this.boundary,
          this.max,
          this.min,
          this.maxAmount
        );
      },
      d: function d() {
        return genPath(this.points, this.smooth);
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
  script.__file = "/Users/dmytrobarylo/Desktop/vue-trend-chart/src/components/trend-chart-curve.vue";

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("g", [
      _vm.d
        ? _c("path", {
            attrs: {
              d: _vm.d,
              fill: "none",
              stroke: _vm.stroke,
              "stroke-width": _vm.strokeWidth
            }
          })
        : _vm._e()
    ])
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
    

    
    var TrendChartCurve = normalizeComponent(
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

  var script$1 = {
    name: "TrendChart",
    components: { TrendChartCurve: TrendChartCurve },
    props: {
      datasets: {
        required: true,
        type: Array
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
        default: 10,
        type: Number
      }
    },
    computed: {
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
  var __vue_script__$1 = script$1;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$1.__file = "/Users/dmytrobarylo/Desktop/vue-trend-chart/src/components/trend-chart.vue";

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "svg",
      {
        attrs: {
          viewBox: "0 0 " + _vm.width + " " + _vm.height,
          xmlns: "http://www.w3.org/2000/svg"
        }
      },
      _vm._l(_vm.datasets, function(dataset, i) {
        return _c(
          "trend-chart-curve",
          _vm._b(
            {
              key: i,
              attrs: {
                max: _vm.params.maxValue,
                min: _vm.params.minValue,
                maxAmount: _vm.params.maxAmount
              }
            },
            "trend-chart-curve",
            dataset,
            false
          )
        )
      }),
      1
    )
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
    

    
    var TrendChart = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
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
