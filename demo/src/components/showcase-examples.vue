<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import {
  TrendChart,
  type DataPoint,
  type TrendChartMouseMoveEvent,
} from "vue-trend-chart";
import CodeBlock from "./code-block.vue";
import {
  comparisonCode,
  streamCode,
  styledCode,
  dataShapeCode,
  responsiveCode,
} from "../snippets";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const organic = [34, 48, 42, 68, 56, 89, 76];
const referral = [22, 30, 25, 45, 39];
const organicVisible = ref(true);
const referralVisible = ref(true);
const inspectedDay = ref(6);
const comparisonHovered = ref(false);
const comparisonData = computed(() => [
  ...(organicVisible.value
    ? [
        {
          data: organic.map((value, i) => ({
            value,
            day: days[i],
            channel: "Organic",
          })),
          className: "series-primary",
          smooth: true,
          showPoints: true,
        },
      ]
    : []),
  ...(referralVisible.value
    ? [
        {
          data: referral,
          className: "series-secondary",
          smooth: true,
          showPoints: true,
        },
      ]
    : []),
]);
const inspectComparison = (event: TrendChartMouseMoveEvent | null) => {
  comparisonHovered.value = event !== null;
  if (event) inspectedDay.value = event.index;
};
const initialSamples = [
  44, 48, 46, 58, 52, 61, 56, 48, 56, 69, 62, 73, 67, 71, 59, 66, 72, 68,
];
const samples = ref([...initialSamples]);
const sampleIndex = ref(initialSamples.length);
const playing = ref(false);
let interval: ReturnType<typeof setInterval> | undefined;
const addPoint = () => {
  sampleIndex.value++;
  const next = Math.round(
    59 +
      Math.sin(sampleIndex.value * 0.82) * 15 +
      Math.cos(sampleIndex.value * 1.61) * 7,
  );
  samples.value = [...samples.value.slice(-17), next];
};
const resetStream = () => {
  playing.value = false;
  samples.value = [...initialSamples];
  sampleIndex.value = initialSamples.length;
};
watch(playing, (value) => {
  clearInterval(interval);
  if (value) interval = setInterval(addPoint, 1200);
});
onBeforeUnmount(() => clearInterval(interval));
const styleColor = ref("#a3e5bd");
const strokeWidth = ref(3);
const styleCode = computed(() =>
  styledCode(styleColor.value, strokeWidth.value),
);

const edgeCase = ref("gaps");
const edgeCases: Record<
  string,
  { label: string; data: DataPoint[]; literal: string; description: string }
> = {
  gaps: {
    label: "Gaps",
    data: [20, 45, null, 38, 65, undefined, 52],
    literal: "[20, 45, null, 38, 65, undefined, 52]",
    description: "Null, undefined, NaN, and Infinity create gaps.",
  },
  flat: {
    label: "Flat",
    data: [40, 40, 40, 40, 40, 40, 40],
    literal: "[40, 40, 40, 40, 40, 40, 40]",
    description: "The axis automatically expands around a constant value.",
  },
  single: {
    label: "One point",
    data: [40],
    literal: "[40]",
    description: "Use showPoints to display a single value.",
  },
  empty: {
    label: "Empty",
    data: [],
    literal: "[]",
    description: "Empty datasets render safely. Add your own empty state.",
  },
  strings: {
    label: "Strings",
    data: ["20", "45", "30", "38", "65", "48", "52"],
    literal: '["20", "45", "30", "38", "65", "48", "52"]',
    description: "Numeric strings are parsed, including object values.",
  },
};
const currentCase = computed(() => edgeCases[edgeCase.value]);
const edgeCode = computed(() =>
  dataShapeCode(currentCase.value.literal, currentCase.value.label),
);

const chartWidth = ref(100);
</script>

<template>
  <section id="examples" class="section" aria-labelledby="examples-title">
    <div class="section-heading">
      <div>
        <h2 id="examples-title">Examples</h2>
      </div>
    </div>
    <div class="examples-grid">
      <article class="example-card">
        <div class="example-heading">
          <h3>Multiple series</h3>
          <p>Custom legends and tooltips from original point data.</p>
        </div>
        <div class="comparison-readout">
          <span>{{ days[inspectedDay] }}</span
          ><span v-if="organicVisible"
            ><i class="legend-dot primary-dot"></i>Organic
            <strong>{{ organic[inspectedDay] }}</strong></span
          ><span v-if="referralVisible"
            ><i class="legend-dot secondary-dot"></i>Referral
            <strong>{{ referral[inspectedDay] ?? "—" }}</strong></span
          >
        </div>
        <div class="example-chart comparison-chart">
          <TrendChart
            class="styled-chart"
            aria-label="Sample organic and referral traffic by day"
            :datasets="comparisonData"
            :labels="{ xLabels: days, yLabels: 3 }"
            :grid="{ horizontalLines: true }"
            interactive
            @mouse-move="inspectComparison"
          />
          <div
            v-if="comparisonHovered"
            class="comparison-tooltip"
            :style="{
              left: `clamp(70px, ${(inspectedDay / 6) * 100}%, calc(100% - 70px))`,
            }"
            aria-hidden="true"
          >
            <strong>{{ days[inspectedDay] }}</strong>
            <span v-if="organicVisible"
              >Organic <b>{{ organic[inspectedDay] }}</b></span
            >
            <span v-if="referralVisible"
              >Referral <b>{{ referral[inspectedDay] ?? "—" }}</b></span
            >
          </div>
        </div>
        <div class="example-actions comparison-actions">
          <div class="legend-buttons">
            <button
              type="button"
              :aria-pressed="organicVisible"
              @click="organicVisible = !organicVisible"
            >
              <i class="legend-dot primary-dot"></i>Organic</button
            ><button
              type="button"
              :aria-pressed="referralVisible"
              @click="referralVisible = !referralVisible"
            >
              <i class="legend-dot secondary-dot"></i>Referral
            </button>
          </div>
          <label class="inspect-day"
            >Inspect day
            <select v-model.number="inspectedDay">
              <option v-for="(day, i) in days" :key="day" :value="i">
                {{ day }}
              </option>
            </select></label
          >
        </div>
        <p class="example-footnote">
          Unequal datasets share the same timeline.
        </p>
        <details class="example-source">
          <summary>
            View example code <span aria-hidden="true">＋</span>
          </summary>
          <CodeBlock :code="comparisonCode" filename="CompareSeries.vue" />
        </details>
      </article>

      <article class="example-card">
        <div class="example-heading">
          <h3>Live updates</h3>
          <p>Update the array. The chart redraws automatically.</p>
        </div>
        <div class="stream-readout">
          <div>
            <strong>{{ samples.at(-1) }}</strong
            ><span>current sample</span>
          </div>
          <span class="stream-status" :class="{ 'is-playing': playing }"
            ><i></i>{{ playing ? "Streaming" : "Paused" }}</span
          >
        </div>
        <div class="example-chart">
          <TrendChart
            class="styled-chart stream-chart"
            aria-label="Simulated live data, showing the most recent 18 samples"
            :datasets="[
              {
                data: samples,
                smooth: true,
                fill: true,
                className: 'series-primary',
              },
            ]"
            :labels="{ yLabels: 3 }"
            :grid="{ horizontalLines: true }"
            :min="0"
            :max="100"
          />
        </div>
        <div class="example-actions">
          <button
            type="button"
            class="small-button"
            :aria-pressed="playing"
            @click="playing = !playing"
          >
            <span aria-hidden="true">{{ playing ? "Ⅱ" : "▶" }}</span>
            {{ playing ? "Pause stream" : "Play stream" }}</button
          ><button type="button" class="text-button" @click="addPoint">
            Add a point <span aria-hidden="true">＋</span></button
          ><button type="button" class="text-button" @click="resetStream">
            Reset
          </button>
        </div>
        <p class="example-footnote">
          Simulated data · one update every 1.2 seconds · latest 18 samples.
        </p>
        <details class="example-source">
          <summary>
            View example code <span aria-hidden="true">＋</span>
          </summary>
          <CodeBlock :code="streamCode" filename="LiveChart.vue" />
        </details>
      </article>

      <article class="example-card style-example">
        <div class="example-heading">
          <h3>CSS & gradients</h3>
          <p>Style colors, strokes, and fills with CSS and SVG.</p>
        </div>
        <div
          class="style-preview"
          :style="{
            '--style-accent': styleColor,
            '--stroke-width': strokeWidth,
          }"
        >
          <div class="style-preview-heading">
            <span>Monthly momentum</span
            ><strong>+28.6% <span aria-hidden="true">↗</span></strong>
          </div>
          <svg class="svg-definitions" aria-hidden="true" width="0" height="0">
            <defs>
              <linearGradient
                id="demo-style-fill"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2="150"
              >
                <stop offset="0%" :stop-color="styleColor" stop-opacity="0.4" />
                <stop offset="100%" :stop-color="styleColor" stop-opacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div class="style-chart">
            <TrendChart
              class="styled-chart gradient-demo"
              aria-label="Sample trend styled with a custom color and gradient"
              :datasets="[
                {
                  data: [20, 35, 30, 55, 42, 68, 60],
                  smooth: true,
                  fill: true,
                },
              ]"
              :padding="6"
            />
          </div>
        </div>
        <div class="example-actions style-actions">
          <div class="swatches">
            <button
              v-for="color in [
                { value: '#a3e5bd', name: 'Mint' },
                { value: '#a8c7fa', name: 'Sky' },
                { value: '#f4bd92', name: 'Peach' },
              ]"
              :key="color.name"
              type="button"
              :aria-label="`${color.name} gradient`"
              :aria-pressed="styleColor === color.value"
              :style="{ '--swatch': color.value }"
              @click="styleColor = color.value"
            >
              <span v-if="styleColor === color.value" aria-hidden="true"
                >✓</span
              >
            </button>
          </div>
          <label class="stroke-control"
            >Line weight<input
              v-model.number="strokeWidth"
              type="range"
              aria-label="Line weight"
              min="1"
              max="6"
            /><output>{{ strokeWidth }} px</output></label
          >
        </div>
        <details class="example-source">
          <summary>
            View example code <span aria-hidden="true">＋</span>
          </summary>
          <CodeBlock :code="styleCode" filename="StyledChart.vue" />
        </details>
      </article>

      <article class="example-card">
        <div class="example-heading">
          <h3>Data edge cases</h3>
          <p>Missing, flat, single-point, and empty datasets.</p>
        </div>
        <div class="case-switch" role="group" aria-label="Data edge case">
          <button
            v-for="(item, key) in edgeCases"
            :key="key"
            type="button"
            :aria-pressed="edgeCase === key"
            @click="edgeCase = String(key)"
          >
            {{ item.label }}
          </button>
        </div>
        <div class="example-chart edge-chart">
          <TrendChart
            class="styled-chart"
            :aria-label="`${currentCase.label} data example`"
            :datasets="[
              {
                data: currentCase.data,
                className: 'series-primary',
                showPoints: true,
              },
            ]"
            :labels="{ xLabels: days, yLabels: 3 }"
            :grid="{ horizontalLines: true }"
          />
          <div v-if="edgeCase === 'empty'" class="empty-chart-message">
            <span>No observations yet</span>
          </div>
        </div>
        <div class="data-literal">
          <code>{{ currentCase.literal }}</code>
        </div>
        <p class="example-footnote case-description">
          {{ currentCase.description }}
        </p>
        <details class="example-source">
          <summary>
            View example code <span aria-hidden="true">＋</span>
          </summary>
          <CodeBlock :code="edgeCode" filename="DataShapes.vue" />
        </details>
      </article>
    </div>

    <article class="responsive-example">
      <div class="responsive-copy">
        <h3>Responsive sizing</h3>
        <p>
          Width follows the container. Extra labels reserve space for future
          data.
        </p>
        <label class="resize-control"
          >Container width <output>{{ chartWidth }}%</output
          ><input
            v-model.number="chartWidth"
            type="range"
            aria-label="Chart container width"
            min="50"
            max="100"
        /></label>
        <details class="responsive-source">
          <summary>View example code</summary>
          <CodeBlock :code="responsiveCode" filename="ResponsiveChart.vue" />
        </details>
      </div>
      <div class="resize-stage">
        <div class="resizable-chart" :style="{ width: `${chartWidth}%` }">
          <div class="resize-caption">
            <span>Quarterly progress</span><span aria-hidden="true">↔</span>
          </div>
          <div class="responsive-chart">
            <TrendChart
              class="styled-chart"
              aria-label="Quarterly progress with April reserved for future data"
              :datasets="[
                {
                  data: [24, 58, 44],
                  fill: true,
                  smooth: true,
                  className: 'series-primary',
                },
              ]"
              :labels="{ xLabels: ['Jan', 'Feb', 'Mar', 'Apr'], yLabels: 3 }"
              :grid="{ horizontalLines: true }"
              padding="8 12"
            />
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
