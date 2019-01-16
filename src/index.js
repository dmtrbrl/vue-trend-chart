import TrendChart from "./components/trend-chart.vue";

TrendChart.install = function(Vue) {
  Vue.component(TrendChart.name, TrendChart);
};

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(TrendChart);
}

export default TrendChart;
