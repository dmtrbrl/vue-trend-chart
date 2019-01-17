<template>
  <section class="demo">
    <h1 class="demo-heading heading">Vue Trend Chart</h1>
    <div class="demo-subheading">Simple and elegant trend charts for Vue.js</div>
    <div class="demo-content">
      <trend-chart></trend-chart>
    </div>
  </section>
</template>

<script>
import TrendChart from "vue-trend-chart";
export default {
  components: { TrendChart }
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
.demo {
  max-width: 600px;
  padding: 20px;
  margin: 0 auto;
}
.demo-heading {
  font-size: 24px;
  text-align: center;
  margin: 20px 0 10px;
}
.demo-subheading {
  display: block;
  text-align: center;
}
.demo-content {
  padding-top: 30px;
}
</style>


