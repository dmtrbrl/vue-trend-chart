<template>
  <section class="docs">
    <h1 class="docs-heading heading">Vue Trend Chart</h1>
    <div class="docs-subheading">Simple trend charts for Vue.js</div>
    <div class="docs-content">
      <svg style="width:0; height:0; position:absolute;" aria-hidden="true" focusable="false">
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
      </svg>
      <trend-chart
        :datasets="datasets"
        :grid="grid"
        :labels="labels"
        :min="0"
        :hoverable="true"
        @onAxisHover="onAxisHover"
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
          name: "Data1",
          data: [70, 100, 400, 180, 100, 300, 500],
          smooth: true,
          showPoints: true,
          fill: true,
          className: "vtc1"
        },
        {
          name: "Data2",
          data: [150, 300, 350, 100, 350, 100, 15],
          smooth: true,
          className: "vtc2"
        },
        {
          name: "Data3",
          data: [50, 150, 200, 50, 120, 250, 200],
          smooth: true,
          className: "vtc3"
        }
      ],
      grid: {
        xAxes: true,
        yAxes: true,
        yAxesLines: 7,
        padding: "10"
      },
      labels: {
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabelsAmount: 3,
        yLabelsOffset: 7,
        yLabelsTextFormatter: val => Math.round(val * 100) / 100
      }
    };
  },
  methods: {
    onAxisHover(params) {
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
.vtc-axis-x,
.vtc-axis-y {
  stroke: #eeeeee;
  stroke-dasharray: 2;
}
.vtc1 .vtc-curve-stroke {
  stroke: #a6c0fe;
  stroke-width: 2;
}
.vtc1 .vtc-curve-fill {
  fill: #a6c0fe;
  opacity: 0.1;
}
.vtc1 .vtc-point {
  fill: #ffffff;
  stroke: #a6c0fe;
  stroke-width: 2;
}
.vtc2 .vtc-curve-stroke {
  stroke: url(#vtc2);
  stroke-width: 2;
}
.vtc3 .vtc-curve-stroke {
  stroke: url(#vtc3);
  stroke-width: 2;
}
</style>


