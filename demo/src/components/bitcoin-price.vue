<template>
  <div class="bitcoin-price">
    <svg
      style="width: 0; height: 0; position: absolute"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="btcFill" x1="1" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f69119"></stop>
          <stop offset="100%" stop-color="#ffffff"></stop>
        </linearGradient>
      </defs>
    </svg>
    <trend-chart
      v-if="dataset.length"
      :datasets="[{ data: dataset, fill: true, className: 'curve-btc' }]"
      :labels="labels"
      :min="0"
      :grid="grid"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import dayjs from "dayjs";
import type {
  TrendChartGridOptions,
  TrendChartLabelsOptions,
} from "vue-trend-chart";

import fetchJson from "../fetch-json";

interface MarketChart {
  prices: Array<[timestamp: number, price: number]>;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dataset = ref<number[]>([]);
const xLabels = ref<string[]>([]);
const labels = computed<TrendChartLabelsOptions>(() => ({
  xLabels: xLabels.value,
  yLabels: 5,
  yLabelsTextFormatter: (val) => usd.format(val),
}));
const grid: TrendChartGridOptions = {
  verticalLines: true,
  verticalLinesNumber: 1,
  horizontalLines: true,
  horizontalLinesNumber: 1,
};

onMounted(async () => {
  try {
    const { prices } = await fetchJson<MarketChart>(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily",
    );
    dataset.value = prices.map(([, price]) => price);
    xLabels.value = prices.map(([timestamp]) =>
      dayjs(timestamp).format("MM/DD"),
    );
  } catch (error) {
    console.error(error);
  }
});
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
  .grid,
  .labels {
    line {
      stroke: rgba(#f69119, 0.5);
    }
  }
  .x-labels {
    .label {
      text {
        display: none;
      }
      line {
        opacity: 0.3;
      }
      &:nth-child(6n + 1),
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
    .stroke {
      stroke: #f69119;
      stroke-width: 2;
    }
    .fill {
      fill: url(#btcFill);
      fill-opacity: 0.5;
    }
  }
}
</style>
