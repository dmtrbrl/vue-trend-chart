<template>
  <section class="docs">
    <h1 class="docs-heading heading">Vue Trend Chart</h1>
    <div class="docs-subheading">Simple and elegant trend charts for Vue.js</div>
    <div class="docs-content">
      <trend-chart :datasets="datasets" :height="150" :width="400"></trend-chart>
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
          data: [
            { value: -50 },
            { value: -300 },
            { value: -30 },
            { value: 0 },
            { value: 20 },
            { value: -200 },
            { value: -15 }
          ],
          smooth: true,
          stroke: "#6a2c70",
          strokeWidth: 2
        },
        {
          data: [100, 30, 200, 150, 20, 420, 500],
          smooth: true,
          stroke: "#b83b5e",
          strokeWidth: 2
        },
        {
          data: [20, 100, 400, 180, 20, 300, 500],
          smooth: true,
          stroke: "#f08a5d",
          strokeWidth: 2
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
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
</style>


