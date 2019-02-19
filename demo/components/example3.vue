<template>
  <div class="example3">
    <trend-chart
      :datasets="datasets"
      :grid="grid"
      :labels="labels"
      :min="0"
      :max="500"
      padding="5"
      :hoverable="true"
      @onMouseMove="onMouseMove"
    ></trend-chart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datasets: [
        {
          data: [70, 100, 400, 180, 100, 300, 500],
          smooth: true,
          showPoints: true,
          fill: true,
          className: "curve1"
        },
        {
          data: [150, 300, 350, 100, 350, 100, 15],
          smooth: true,
          showPoints: true,
          className: "curve2"
        },
        {
          data: [50, 150, 200, 50, 120, 250, 200],
          smooth: true,
          showPoints: true,
          className: "curve3"
        }
      ],
      grid: {
        verticalLines: true,
        horizontalLines: true
      },
      labels: {
        xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        yLabels: 5,
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

<style lang="scss">
.example3 {
  width: 100%;
  .vtc {
    height: 250px;
    font-size: 12px;
    @media (min-width: 699px) {
      height: 320px;
    }
  }
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
  .curve1 .vtc-curve-stroke {
    stroke: #fbac91;
    stroke-width: 2;
  }
  .curve1 .vtc-curve-fill {
    fill: #fbac91;
    opacity: 0.05;
  }
  .curve1 .vtc-point {
    fill: #fbac91;
    stroke: #fbac91;
  }
  .curve2 .vtc-curve-stroke {
    stroke: #fbe1b6;
    stroke-width: 2;
  }
  .curve2 .vtc-point {
    fill: #fbe1b6;
    stroke: #fbe1b6;
  }
  .curve3 .vtc-curve-stroke {
    stroke: #7fdfd4;
    stroke-width: 2;
  }
  .curve3 .vtc-point {
    fill: #7fdfd4;
    stroke: #7fdfd4;
  }
  .vtc-labels line {
    stroke: rgba(0, 0, 0, 0.05);
  }
}
</style>

