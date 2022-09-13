import TrendChart from "./components/trend-chart";

export default {
  install: (app, options) => {
    app.component("TrendChart", TrendChart);
  },
};
