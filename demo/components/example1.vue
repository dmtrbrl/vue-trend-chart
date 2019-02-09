<template>
  <div class="example1">
    <trend-chart v-if="datasets[0].data.length" :datasets="datasets" :min="0" :max="600"></trend-chart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datasets: [
        {
          data: [],
          fill: true,
          smooth: true,
          className: "curve1"
        }
      ]
    };
  },
  methods: {
    fetchData() {
      this.$http
        .get("https://api.npmjs.org/downloads/range/last-week/vue")
        .then(res => {
          this.datasets[0].data = res.data
            ? res.data.downloads.map(d => d.downloads)
            : null;
        });
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss">
.example1 {
  min-height: 250px;
  font-size: 12px;
  .vtc-curve-stroke {
    stroke: red;
    stroke-width: 2;
  }
  .vtc-curve-fill {
    fill: #fbe1b6;
  }
}
</style>

