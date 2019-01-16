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

export default TrendChart;
