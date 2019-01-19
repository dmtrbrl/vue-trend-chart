<template>
  <section class="docs">
    <h1 class="docs-heading heading">Vue Trend Chart</h1>
    <div class="docs-subheading">Simple and elegant trend charts for Vue.js</div>
    <div class="docs-content">
      <trend-chart :datasets="datasets" :height="100"></trend-chart>
    </div>
  </section>
</template>

<script>
import TrendChart from "vue-trend-chart";
export default {
  name: "home",
  components: { TrendChart },
  data() {
    return {
      datasets: [
        {
          data: [-50, -300, -30, 0, 20, -8, -15],
          // smooth: true,
          stroke: "#6a2c70",
          strokeDasharray: "1"
        },
        {
          data: [100, 30, 200, 150, 20, 420, 500],
          // smooth: true,
          stroke: "#b83b5e"
        },
        {
          data: [20, 200, 400, 180, 20, 220, 300],
          // smooth: true,
          stroke: "#f08a5d"
        }
      ]
    };
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:700|Source+Sans+Pro:400,600");
* {
  box-sizing: border-box;
}
body {
  padding: 0;
  margin: 0;
  font-family: "Source Sans Pro", sans-serif;
  color: #222;
}
.heading {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
}
.docs {
  max-width: 600px;
  padding: 20px;
  margin: 0 auto;
}
.docs-heading {
  font-size: 24px;
  text-align: center;
  margin: 20px 0 10px;
}
.docs-subheading {
  display: block;
  text-align: center;
}
.docs-content {
  padding-top: 30px;
}
.docs-content svg {
  width: 100%;
  height: auto;
}
</style>


