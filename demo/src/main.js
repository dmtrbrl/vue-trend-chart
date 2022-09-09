import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import TrendChart from "vue-trend-chart";

import App from "./App.vue";

const app = createApp(App);
app.use(VueAxios, axios);
app.use(TrendChart);
app.mount("#app");
