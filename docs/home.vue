<template>
  <section class="docs">
    <h1 class="docs-heading heading">Vue Trend Chart</h1>
    <div class="docs-subheading">Simple and elegant trend charts for Vue.js</div>
    <div class="docs-content">
      <trend-chart
        :datasets="datasets"
        :height="150"
        :width="400"
        :min="0"
        :padding="5"
        stroke-dasharray="2"
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
          data: [
            { value: 150 },
            { value: 300 },
            { value: 350 },
            { value: 100 },
            { value: 350 },
            { value: 100 },
            { value: 15 }
          ],
          smooth: true,
          strokeGradient: ["#a8edea", "#fed6e3"],
          strokeWidth: 3,
          fill: true,
          fillColor: "#fed6e3",
          fillOpacity: 0.2
        },
        {
          data: [50, 150, 200, 50, 120, 250, 200],
          smooth: true,
          strokeGradient: ["#fccb90", "#d57eeb"],
          strokeGradientDirection: "to right",
          strokeWidth: 2
        },
        {
          data: [70, 100, 400, 180, 100, 300, 500],
          smooth: true,
          strokeGradient: ["#84fab0", "#8fd3f4"],
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


