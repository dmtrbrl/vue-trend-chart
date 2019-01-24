<template>
  <section class="docs">
    <h1 class="docs-heading heading">Vue Trend Chart</h1>
    <div class="docs-subheading">Simple and elegant trend charts for Vue.js</div>
    <div class="docs-content">
      <trend-chart
        :datasets="datasets"
        :grid="grid"
        :height="200"
        :width="500"
        :min="0"
        :max="600"
        padding="5"
      ></trend-chart>
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
          data: [70, 100, 400, 180, 100, 300, 500],
          className: "dataChart3",
          smooth: true,
          strokeColor: "#a6c0fe",
          strokeWidth: 2,
          fill: true,
          fillColor: "#a6c0fe",
          fillOpacity: 0.1
        },
        {
          data: [150, 300, 350, 100, 350, 100, 15],
          className: "dataChart1",
          smooth: true,
          strokeGradient: ["#a8edea", "#fed6e3"],
          strokeWidth: 2,
          strokeDasharray: "5"
        },
        {
          data: [50, 150, 200, 50, 120, 250, 200],
          className: "dataChart2",
          smooth: true,
          strokeGradient: ["#fccb90", "#d57eeb"],
          strokeWidth: 2
        }
      ],
      grid: {
        padding: "0 0 10 10",
        xAxes: true,
        xAxesStrokeColor: "#eee",
        yAxes: true,
        yAxesLines: 13,
        yAxesStrokeColor: "#eee"
      }
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


