<template>
  <section class="docs">
    <h1 class="docs-heading heading">Vue Trend Chart</h1>
    <div class="docs-subheading">Simple trend charts for Vue.js</div>
    <div class="docs-content">
      <!-- <svg style="width:0; height:0; position:absolute;" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="vtc2" x2="1" y2="1">
            <stop offset="0%" stop-color="#a8edea"></stop>
            <stop offset="100%" stop-color="#fed6e3"></stop>
          </linearGradient>
          <linearGradient id="vtc3" x2="1" y2="1">
            <stop offset="0%" stop-color="#9795f0"></stop>
            <stop offset="100%" stop-color="#fbc8d4"></stop>
          </linearGradient>
        </defs>
      </svg>-->
      <trend-chart
        :datasets="datasets"
        :grid="grid"
        :labels="labels"
        :min="0"
        :max="500"
        :hoverable="true"
        @onMouseMove="onMouseMove"
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
          smooth: true,
          showPoints: true,
          fill: true,
          className: "vtc1"
        },
        {
          data: [150, 300, 350, 100, 350, 100, 15],
          smooth: true,
          showPoints: true,
          className: "vtc2"
        },
        {
          data: [50, 150, 200, 50, 120, 250, 200],
          smooth: true,
          showPoints: true,
          className: "vtc3"
        }
      ],
      grid: {
        yAxes: true,
        yAxesLines: 5
      },
      labels: {
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabelsAmount: 5,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100
      }
    };
  },
  methods: {
    onMouseMove(params) {
      console.log(params);
    }
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
  color: #333;
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
.vtc-axis-x,
.vtc-axis-y {
  stroke: rgba(0, 0, 0, 0.05);
}
.vtc-active-line {
  stroke: rgba(0, 0, 0, 0.2);
}
.vtc .vtc-point {
  stroke-width: 2;
  transition: stroke-width 0.2s;
}
.vtc .vtc-point.is-active {
  stroke-width: 5;
}
.vtc1 .vtc-curve-stroke {
  stroke: #fbac91;
  stroke-width: 2;
}
.vtc1 .vtc-curve-fill {
  fill: #fbac91;
  opacity: 0.05;
}
.vtc1 .vtc-point {
  fill: #fbac91;
  stroke: #fbac91;
}
.vtc2 .vtc-curve-stroke {
  stroke: #fbe1b6;
  stroke-width: 2;
}
.vtc2 .vtc-point {
  fill: #fbe1b6;
  stroke: #fbe1b6;
}
.vtc3 .vtc-curve-stroke {
  stroke: #7fdfd4;
  stroke-width: 2;
}
.vtc3 .vtc-point {
  fill: #7fdfd4;
  stroke: #7fdfd4;
}
.vtc-labels line {
  stroke: rgba(0, 0, 0, 0.05);
}
</style>


