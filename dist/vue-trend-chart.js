(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['vue-trend-chart'] = factory());
}(this, function () { 'use strict';

  var TrendChart = {
    render: function (createElement) {
      return createElement("h1", "Test");
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
