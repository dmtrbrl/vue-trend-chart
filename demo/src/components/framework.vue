<template>
  <section class="framework" :class="slug" v-if="data">
    <header class="framework__header">
      <strong class="framework__name">{{ name }}</strong>
    </header>
    <div class="framework__data">
      <div class="framework__data-info">
        <div class="framework__period">
          <svg viewBox="0 0 7.22 11.76" class="framework__period-icon">
            <path
              d="M4.59 4.94V0H2.62v4.94H0l3.28 4.59 3.94-4.59H4.59zM.11 10.76h7v1h-7z"
            />
          </svg>
          <span class="framework__period-text">{{ info.label }}</span>
        </div>
        <strong class="framework__downloads">{{ info.value }}</strong>
      </div>
      <trend-chart
        :datasets="[dataset]"
        :min="0"
        padding="5 5 0"
        :interactive="true"
        @mouse-move="onMouseMove"
      ></trend-chart>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import dayjs from "dayjs";
import type {
  TrendChartDataset,
  TrendChartMouseMoveEvent,
} from "vue-trend-chart";

export interface DownloadsPoint {
  value: number;
  day: string;
}

const props = defineProps<{
  data: DownloadsPoint[];
  slug: string;
}>();

const currentInfo = ref<{ label: string; value: string } | null>(null);

const numberWithSpaces = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const name = computed(() => props.slug[0].toUpperCase() + props.slug.slice(1));

const weeklyDownloads = computed(() =>
  numberWithSpaces(props.data.reduce((a, c) => a + c.value, 0)),
);

const dataset = computed<TrendChartDataset>(() => ({
  data: props.data,
  showPoints: true,
  fill: true,
  className: `curve-${props.slug}`,
}));

const info = computed(() => ({
  label: currentInfo.value?.label ?? "weekly downloads",
  value: currentInfo.value?.value ?? weeklyDownloads.value,
}));

const onMouseMove = (params: TrendChartMouseMoveEvent | null) => {
  const point = params?.data[0] as DownloadsPoint | undefined;
  currentInfo.value = point
    ? {
        label: dayjs(point.day).format("DD MMM YYYY"),
        value: numberWithSpaces(point.value),
      }
    : null;
};
</script>
