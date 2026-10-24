<template>
  <div class="vtc-downloads">
    <div class="vtc-downloads-controls">
      <div class="vtc-downloads-control">
        <strong>Select date range:</strong>
        <select v-model="selectedDateRange">
          <option v-for="(range, i) in dateRanges" :key="i" :value="range">
            {{ range.from }} - {{ range.to }}
          </option>
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
      :datasets="[{ data: dataset }]"
      :labels="{
        xLabels: xLabels,
        yLabels: 3,
      }"
      :min="0"
      :grid="{
        verticalLines: true,
        verticalLinesNumber: 1,
        horizontalLines: true,
        horizontalLinesNumber: 1,
      }"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";

import fetchJson from "../fetch-json";

interface DateRange {
  from: string;
  to: string;
}

interface NpmDownloads {
  downloads: Array<{ downloads: number; day: string }>;
}

// Last five full weeks (Monday to Sunday)
const currentWeekStart = dayjs().subtract((dayjs().day() + 6) % 7, "day");
const dateRanges: DateRange[] = Array.from({ length: 5 }, (_, i) => {
  const from = currentWeekStart.subtract(i + 1, "week");
  return {
    from: from.format("YYYY-MM-DD"),
    to: from.add(6, "day").format("YYYY-MM-DD"),
  };
});

const downloads = ref<NpmDownloads["downloads"]>([]);
const selectedDateRange = ref(dateRanges[0]);
const dateFormat = ref("MM/DD");

const dataset = computed(() =>
  downloads.value.length ? downloads.value.map((d) => d.downloads) : null,
);
const xLabels = computed(() =>
  downloads.value.map((d) => dayjs(d.day).format(dateFormat.value)),
);

watch(
  selectedDateRange,
  async ({ from, to }) => {
    try {
      ({ downloads: downloads.value } = await fetchJson<NpmDownloads>(
        `https://api.npmjs.org/downloads/range/${from}:${to}/vue-trend-chart`,
      ));
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true },
);
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
