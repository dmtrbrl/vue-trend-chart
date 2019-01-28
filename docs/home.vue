<template>
  <section class="docs">
    <h1 class="docs-heading heading">Vue Trend Chart</h1>
    <div class="docs-subheading">Simple and elegant trend charts for Vue.js</div>
    <div class="docs-content">
      <trend-chart :datasets="datasets" :grid="grid" :labels="labels" :min="0"></trend-chart>
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
          smooth: true,
          showPoints: true
        },
        {
          data: [150, 300, 350, 100, 350, 100, 15],
          smooth: true
        },
        {
          data: [50, 150, 200, 50, 120, 250, 200],
          smooth: true,
          fill: true
        }
      ],
      grid: {
        xAxes: true,
        yAxes: true,
        yAxesLines: 7,
        padding: "0 0 5 5"
      },
      labels: {
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        xLabelsOffset: 10,
        yLabelsAmount: 3,
        yLabelsOffset: 7,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100
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
  min-height: 250px;
  margin: 0 auto;
  font-size: 12px;
}

/* Trend chart styling */
/* .trend-chart-grid-x-axis,
.trend-chart-grid-y-axis {
  stroke: #eeeeee;
  stroke-dasharray: 2;
} */
</style>


