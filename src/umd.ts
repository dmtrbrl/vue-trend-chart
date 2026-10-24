// UMD/CommonJS entry: the plugin is the module value itself, with the
// component attached so `require("vue-trend-chart").TrendChart` also works
import VueTrendChart, { TrendChart } from "./index";

export default { ...VueTrendChart, TrendChart };
