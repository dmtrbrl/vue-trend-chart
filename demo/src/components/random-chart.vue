<template>
  <div ref="root" class="random">
    <trend-chart
      :datasets="datasets"
      :grid="grid"
      :labels="labels"
      :min="0"
      padding="5"
      :interactive="true"
      @mouse-move="onMouseMove"
      class="random-chart"
      v-if="datasets.length"
    ></trend-chart>
    <div
      id="pop"
      role="tooltip"
      ref="tooltip"
      class="tooltip"
      :class="{ 'is-active': tooltipData }"
    >
      <div class="tooltip-container" v-if="tooltipData">
        <strong>{{ labels.xLabels[tooltipData.index] }}</strong>
        <div class="tooltip-data">
          <div class="tooltip-data-item tooltip-data-item--1">
            {{ tooltipData.data[0] }}
          </div>
          <div class="tooltip-data-item tooltip-data-item--2">
            {{ tooltipData.data[1] }}
          </div>
          <div class="tooltip-data-item tooltip-data-item--3">
            {{ tooltipData.data[2] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";
import type {
  TrendChartDataset,
  TrendChartGridOptions,
  TrendChartLabelsOptions,
  TrendChartMouseMoveEvent,
} from "vue-trend-chart";

const datasets: TrendChartDataset[] = [
  {
    data: [70, 100, 400, 180, 100, 300, 500],
    smooth: true,
    showPoints: true,
    fill: true,
    className: "curve1",
  },
  {
    data: [150, 300, 350, 100, 350, 100, 15],
    smooth: true,
    showPoints: true,
    className: "curve2",
  },
  {
    data: [50, 150, 200, 50, 120, 250, 200],
    smooth: true,
    showPoints: true,
    className: "curve3",
  },
];
const grid: TrendChartGridOptions = {
  verticalLines: true,
  horizontalLines: true,
};
const labels = {
  xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  yLabels: 5,
  yLabelsTextFormatter: (val) => Math.round(val * 100) / 100,
} satisfies TrendChartLabelsOptions;

const root = useTemplateRef<HTMLDivElement>("root");
const tooltip = useTemplateRef<HTMLDivElement>("tooltip");
const tooltipData = ref<TrendChartMouseMoveEvent | null>(null);

let chart: SVGSVGElement | null | undefined;
let activeLine: SVGLineElement | null | undefined;
let stopAutoUpdate: (() => void) | undefined;

const updatePosition = async () => {
  const floating = tooltip.value;
  if (!chart || !activeLine || !floating) return;
  const { x, y } = await computePosition(activeLine, floating, {
    placement: "right",
    middleware: [offset(10), flip(), shift({ boundary: chart })],
  });
  Object.assign(floating.style, { left: `${x}px`, top: `${y}px` });
};

onMounted(() => {
  chart = root.value?.querySelector<SVGSVGElement>(".random-chart");
  activeLine = chart?.querySelector<SVGLineElement>(".active-line");
  if (activeLine && tooltip.value)
    stopAutoUpdate = autoUpdate(activeLine, tooltip.value, updatePosition);
});

onBeforeUnmount(() => stopAutoUpdate?.());

// The active line moves via SVG attributes, which autoUpdate doesn't observe
const onMouseMove = async (params: TrendChartMouseMoveEvent | null) => {
  tooltipData.value = params;
  await nextTick();
  updatePosition();
};
</script>

<style lang="scss">
.random {
  width: 100%;
  .vtc {
    height: 250px;
    font-size: 12px;
    @media (min-width: 699px) {
      height: 320px;
    }
  }
  .labels {
    stroke: rgba(0, 0, 0, 0.05);
  }
  .active-line {
    stroke: rgba(0, 0, 0, 0.2);
  }
  .point {
    stroke-width: 2;
    transition: stroke-width 0.2s;
  }
  .point.is-active {
    stroke-width: 5;
  }
  .curve1 {
    .stroke {
      stroke: #fbac91;
      stroke-width: 2;
    }
    .fill {
      fill: #fbac91;
      opacity: 0.05;
    }
    .point {
      fill: #fbac91;
      stroke: #fbac91;
    }
  }
  .curve2 {
    .stroke {
      stroke: #fbe1b6;
      stroke-width: 2;
    }
    .point {
      fill: #fbe1b6;
      stroke: #fbe1b6;
    }
  }
  .curve3 {
    .stroke {
      stroke: #7fdfd4;
      stroke-width: 2;
    }
    .point {
      fill: #7fdfd4;
      stroke: #7fdfd4;
    }
  }

  .tooltip {
    position: absolute;
    top: 0;
    left: 0;
    &:not(.is-active) {
      display: none;
    }
    padding: 10px;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    &-data {
      display: flex;
      &-item {
        display: flex;
        align-items: center;
        &:not(:first-child) {
          margin-left: 20px;
        }
        &:before {
          content: "";
          display: block;
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }
        &--1:before {
          background: #fbac91;
        }
        &--2:before {
          background: #fbe1b6;
        }
        &--3:before {
          background: #7fdfd4;
        }
      }
    }
  }
}
</style>
