<template>
  <div class="bitcoin-price">
    <svg style="width:0; height:0; position:absolute;" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="btcFill" x1="1" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f69119"></stop>
          <stop offset="100%" stop-color="#ffffff"></stop>
        </linearGradient>
      </defs>
    </svg>
    <trend-chart
      v-if="dataset.length"
      :datasets="[{data: dataset, fill: true, className: 'curve-btc'}]"
      :labels="labels"
      :min="0"
      :grid="{xAxes: true, xAxesLines: 1, yAxes: true, yAxesLines: 1}"
    />
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      dataset: [],
      labels: {
        xLabels: [],
        yLabels: 5,
        yLabelsTextFormatter: val => "$" + Math.round(val * 100) / 100
      }
    };
  },
  mounted() {
    this.$http
      .get(
        "https://api.coindesk.com/v1/bpi/historical/close.json?start=2018-11-01&end=2018-11-30"
      )
      .then(res => {
        const data = res.data.bpi;
        for (let key in data) {
          this.dataset.push(data[key]);
          this.labels.xLabels.push(moment(key).format("MM/DD"));
        }
      });
  }
};
</script>

<style lang="scss">
.bitcoin-price {
  .vtc {
    height: 250px;
    font-size: 12px;
    @media (min-width: 699px) {
      height: 350px;
    }
  }
  .vtc-grid,
  .vtc-labels {
    line {
      stroke: rgba(#f69119, 0.5);
    }
  }
  .vtc-labels-x {
    .vtc-label-x {
      text {
        display: none;
      }
      line {
        opacity: 0.3;
      }
      &:nth-child(5n),
      &:first-child {
        text {
          display: block;
        }
        line {
          opacity: 1;
        }
      }
    }
  }
  .curve-btc {
    .vtc-curve-stroke {
      stroke: #f69119;
      stroke-width: 2;
    }
    .vtc-curve-fill {
      fill: url(#btcFill);
      fill-opacity: 0.5;
    }
  }
}
</style>


