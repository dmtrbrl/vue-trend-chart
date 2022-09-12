<template>
  <div class="vtc-downloads">
    <div class="vtc-downloads-controls">
      <div class="vtc-downloads-control">
        <strong>Select date range:</strong>
        <select v-model="selectedDateRange">
          <option
            v-for="(range, i) in dateRanges"
            :key="i"
            :value="range"
          >{{ range.from }} - {{ range.to }}</option>
        </select>
      </div>
      <div class="vtc-downloads-control">
        <strong>Date format:</strong>
        <select v-model="dateFormat">
          <option value="MM/DD">MM/DD</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
        </select>
      </div>
    </div>
    <trend-chart
      v-if="dataset"
      :datasets="[{data: dataset}]"
      :labels="{
        xLabels: xLabels,
        yLabels: 3
      }"
      :min="0"
      :grid="{
        verticalLines: true,
        verticalLinesNumber: 1,
        horizontalLines: true,
        horizontalLinesNumber: 1
      }"
    />
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      downloads: null,
      dateRanges: [
        {
          from: "2019-08-26",
          to: "2019-08-31"
        },
        {
          from: "2019-08-19",
          to: "2019-08-25"
        },
        {
          from: "2019-08-12",
          to: "2019-08-18"
        },
        {
          from: "2019-08-05",
          to: "2019-08-11"
        },
        {
          from: "2019-08-01",
          to: "2019-08-04"
        }
      ],
      selectedDateRange: null,
      dateFormat: "MM/DD"
    };
  },
  computed: {
    dataset() {
      return this.downloads && this.downloads.length
        ? this.downloads.map(d => d.downloads)
        : null;
    },
    xLabels() {
      return this.downloads && this.downloads.length
        ? this.downloads.map(d => dayjs(d.day).format(this.dateFormat))
        : [];
    }
  },
  methods: {
    onRangeChange() {
      this.fetchData();
    },
    fetchData() {
      this.$http
        .get(
          `https://api.npmjs.org/downloads/range/${this.selectedDateRange.from}:${this.selectedDateRange.to}/vue-trend-chart`
        )
        .then(res => {
          const { downloads } = res.data;
          this.downloads = downloads;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {
    selectedDateRange() {
      this.fetchData();
    }
  },
  mounted() {
    this.selectedDateRange = this.dateRanges[0];
    this.fetchData();
  }
};
</script>

<style lang="scss">
.vtc-downloads {
  &-controls {
    @media (min-width: 699px) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    select {
      margin-left: 10px;
      font-size: 14px;
      border: 1px solid rgba(#000, 0.2);
      background: transparent;
    }
  }
  &-control {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    @media (max-width: 698px) {
      justify-content: space-between;
    }
  }

  .vtc {
    height: 250px;
    font-size: 12px;
    .stroke {
      stroke: #39af77;
      stroke-width: 2;
    }
  }
}
</style>


