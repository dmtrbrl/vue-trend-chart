import Home from "./home.vue";
import Vue from "vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(Home)
}).$mount("#app");
