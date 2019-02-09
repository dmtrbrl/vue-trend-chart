import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import TrendChart from "vue-trend-chart";

import Home from "./home.vue";

Vue.use(VueAxios, axios);
Vue.use(TrendChart);

Vue.config.productionTip = false;

new Vue({
  render: h => h(Home)
}).$mount("#app");
