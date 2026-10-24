import type { App, Plugin } from "vue";

import TrendChart from "./components/trend-chart.vue";

export { TrendChart };
export type {
  DataPoint,
  TrendChartDataset,
  TrendChartGridOptions,
  TrendChartLabelsOptions,
  TrendChartMouseMoveEvent,
} from "./types";

const VueTrendChart: Plugin = {
  install: (app: App) => {
    app.component("TrendChart", TrendChart);
  },
};

export default VueTrendChart;

declare module "vue" {
  export interface GlobalComponents {
    TrendChart: typeof TrendChart;
  }
}
