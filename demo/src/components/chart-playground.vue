<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  TrendChart,
  type TrendChartDataset,
  type TrendChartMouseMoveEvent,
} from "vue-trend-chart";
import CodeBlock from "./code-block.vue";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const palettes = [
  { name: "Forest", color: "#20815b" },
  { name: "Blue", color: "#496bd5" },
  { name: "Terracotta", color: "#bd633e" },
];
const initial = {
  smooth: true,
  fill: true,
  showPoints: false,
  stroke: true,
  interactive: true,
  xLabels: true,
  yLabels: true,
  horizontalLines: true,
  verticalLines: false,
  horizontalCount: 4,
  verticalCount: 7,
  yCount: 4,
  padding: 10,
  min: "0" as string | number,
  max: "" as string | number,
  formatter: "number",
  palette: 0,
};
const options = reactive({ ...initial });
const preset = ref("week");
const view = ref("preview");
const active = ref<TrendChartMouseMoveEvent | null>(null);
const controls = ref("style");
const presets = [
  { value: "week", label: "Weekly activity" },
  { value: "multiple", label: "Multiple series" },
  { value: "gaps", label: "Missing values" },
  { value: "objects", label: "Object data" },
  { value: "flat", label: "Flat values" },
  { value: "single", label: "A single point" },
  { value: "empty", label: "Empty dataset" },
];
const rawData = computed<TrendChartDataset[]>(() => {
  switch (preset.value) {
    case "multiple":
      return [
        { data: [28, 45, 38, 72, 55, 86, 78] },
        { data: [18, 32, 27, 48, 40, 56, 50] },
      ];
    case "gaps":
      return [{ data: [28, 45, null, 72, 55, undefined, 78] }];
    case "objects":
      return [
        {
          data: days.map((day, i) => ({
            value: [28, 45, 38, 72, 55, 86, 78][i],
            day,
          })),
        },
      ];
    case "flat":
      return [{ data: [50, 50, 50, 50, 50, 50, 50] }];
    case "single":
      return [{ data: [50] }];
    case "empty":
      return [{ data: [] }];
    default:
      return [{ data: [28, 45, 38, 72, 55, 86, 78] }];
  }
});
const datasets = computed(() =>
  rawData.value.map((dataset, i) => ({
    ...dataset,
    smooth: options.smooth,
    fill: options.fill,
    stroke: options.stroke,
    showPoints: options.showPoints,
    className: i === 0 ? "series-primary" : "series-secondary",
  })),
);
const formatValue = (value: number) =>
  options.formatter === "currency"
    ? `$${Math.round(value)}`
    : options.formatter === "percent"
      ? `${Math.round(value)}%`
      : Math.round(value * 10) / 10;
const labels = computed(() => ({
  xLabels: options.xLabels
    ? preset.value === "single"
      ? ["Today"]
      : days
    : [],
  yLabels: options.yLabels ? options.yCount : 0,
  yLabelsTextFormatter: formatValue,
}));
const grid = computed(() => ({
  horizontalLines: options.horizontalLines,
  verticalLines: options.verticalLines,
  horizontalLinesNumber: options.horizontalCount,
  verticalLinesNumber: options.verticalCount,
}));
const bound = (value: string | number) =>
  value === "" || !Number.isFinite(Number(value)) ? undefined : Number(value);
const selectedColor = computed(() => palettes[options.palette].color);
const pointValue = (point: unknown): string => {
  const value =
    point && typeof point === "object" && "value" in point
      ? point.value
      : point;
  return value == null ? "No data" : String(formatValue(Number(value)));
};
const currentValue = computed(() =>
  active.value
    ? pointValue(active.value.data[0])
    : rawData.value[0].data.length
      ? pointValue(rawData.value[0].data.at(-1))
      : "—",
);
const hint = computed(() => {
  if (preset.value === "single" && !options.showPoints)
    return "Enable Points to show a single value.";
  if (preset.value === "empty")
    return "Empty dataset. Axes and labels remain visible.";
  if (!options.stroke && !options.fill && !options.showPoints)
    return "Enable a line, area fill, or points to draw the data.";
  if (!options.interactive) return "Interaction is off.";
  return "Hover or drag to inspect.";
});
const payload = computed(() =>
  active.value ? JSON.stringify(active.value, null, 2) : "null",
);
const dataLiteral = (data: TrendChartDataset["data"]) =>
  `[${data.map((v) => (v === undefined ? "undefined" : JSON.stringify(v))).join(", ")}]`;
const generatedCode = computed(() => {
  const data = datasets.value
    .map(
      (dataset) =>
        `  {\n    data: ${dataLiteral(dataset.data)},\n    smooth: ${dataset.smooth}, fill: ${dataset.fill},\n    stroke: ${dataset.stroke}, showPoints: ${dataset.showPoints},\n    className: "${dataset.className}",\n  }`,
    )
    .join(",\n");
  const formatter =
    options.formatter === "currency"
      ? '(value: number) => "$" + Math.round(value)'
      : options.formatter === "percent"
        ? '(value: number) => Math.round(value) + "%"'
        : "(value: number) => Math.round(value * 10) / 10";
  const bounds = `${options.min !== "" ? `\n    :min="${Number(options.min)}"` : ""}${options.max !== "" ? `\n    :max="${Number(options.max)}"` : ""}`;
  return `<script setup lang="ts">\nimport { TrendChart, type TrendChartDataset${options.interactive ? ", type TrendChartMouseMoveEvent" : ""} } from "vue-trend-chart";\n\nconst datasets: TrendChartDataset[] = [\n${data}\n];\nconst labels = {\n  xLabels: ${JSON.stringify(labels.value.xLabels)},\n  yLabels: ${labels.value.yLabels},\n  yLabelsTextFormatter: ${formatter},\n};\nconst grid = ${JSON.stringify(grid.value, null, 2)};${options.interactive ? "\nconst onMove = (event: TrendChartMouseMoveEvent | null) => {\n  // Use event.index and event.data to build your own tooltip.\n  console.log(event);\n};" : ""}\n<\/script>\n\n<template>\n  <TrendChart\n    class="my-chart"\n    aria-label="Weekly activity"\n    :datasets="datasets"\n    :labels="labels"\n    :grid="grid"\n    :padding="${options.padding}"${bounds}${options.interactive ? '\n    interactive\n    @mouse-move="onMove"' : ""}\n  />\n</template>\n\n<style>\n.my-chart { width: 100%; height: 300px; }\n.my-chart .series-primary { color: ${selectedColor.value}; }\n.my-chart .series-secondary { color: #b08a50; }\n.my-chart .stroke { stroke: currentColor; stroke-width: 2.5; }\n.my-chart .fill { fill: currentColor; fill-opacity: 0.12; }\n.my-chart .point { fill: white; stroke: currentColor; }\n.my-chart .point.is-active { r: 4; fill: currentColor; }\n.my-chart .labels { font: 12px system-ui; fill: #66766d; }\n.my-chart .active-line { stroke: #9aa99f; stroke-dasharray: 4; }\n</style>`;
});
const reset = () => {
  Object.assign(options, initial);
  preset.value = "week";
  active.value = null;
};
</script>

<template>
  <section
    id="playground"
    class="section playground-section"
    aria-labelledby="playground-title"
  >
    <div class="section-heading">
      <div>
        <h2 id="playground-title">Playground</h2>
      </div>
      <p>Adjust settings. Copy the code.</p>
    </div>
    <div class="playground-shell">
      <div class="playground-toolbar">
        <div class="view-switch" aria-label="Playground view">
          <button
            type="button"
            :aria-pressed="view === 'preview'"
            @click="view = 'preview'"
          >
            Preview
          </button>
          <button
            type="button"
            :aria-pressed="view === 'code'"
            @click="view = 'code'"
          >
            &lt;/&gt; Code
          </button>
        </div>
        <div class="toolbar-actions">
          <label class="sr-only" for="data-preset">Dataset</label>
          <select id="data-preset" v-model="preset" @change="active = null">
            <option
              v-for="item in presets"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
          <button type="button" class="text-button reset-button" @click="reset">
            <span aria-hidden="true">↺</span> Reset
          </button>
        </div>
      </div>
      <div class="playground-body">
        <div
          class="playground-preview"
          :style="{ '--chart-color': selectedColor }"
        >
          <template v-if="view === 'preview'">
            <div class="preview-heading">
              <div>
                <p class="chart-overline">
                  {{ presets.find((p) => p.value === preset)?.label }}
                </p>
                <div class="preview-value">
                  {{ currentValue }}
                  <span>{{
                    active
                      ? (labels.xLabels[active.index] ??
                        `Point ${active.index + 1}`)
                      : "latest value"
                  }}</span>
                </div>
              </div>
              <span class="sample-label">SAMPLE DATA</span>
            </div>
            <div class="playground-chart">
              <TrendChart
                class="styled-chart"
                aria-label="Configurable chart preview using sample data"
                :datasets="datasets"
                :labels="labels"
                :grid="grid"
                :padding="options.padding"
                :min="bound(options.min)"
                :max="bound(options.max)"
                :interactive="options.interactive"
                @mouse-move="active = $event"
              />
            </div>
            <div class="chart-bottom-row">
              <span class="chart-hint">{{ hint }}</span
              ><span class="legend" v-if="preset === 'multiple'"
                ><span><i class="legend-dot primary-dot"></i>Visits</span
                ><span
                  ><i class="legend-dot secondary-dot"></i>Signups</span
                ></span
              >
            </div>
            <details class="event-inspector">
              <summary>
                <span class="mono">@mouse-move</span
                ><span
                  >Inspect the event <span aria-hidden="true">↗</span></span
                >
              </summary>
              <pre>{{ payload }}</pre>
              <p>
                Nearest index and original data; null when interaction ends.
              </p>
            </details>
          </template>
          <CodeBlock v-else :code="generatedCode" filename="MyChart.vue" />
        </div>
        <aside class="playground-controls" aria-label="Chart settings">
          <div class="control-tabs" aria-label="Settings group">
            <button
              v-for="tab in ['style', 'axes', 'behavior']"
              :key="tab"
              type="button"
              :aria-pressed="controls === tab"
              @click="controls = tab"
            >
              {{ tab }}
            </button>
          </div>
          <div v-if="controls === 'style'" class="control-panel">
            <label class="toggle-row"
              ><span>Smooth curves</span
              ><input
                v-model="options.smooth"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="toggle-row"
              ><span>Area fill</span
              ><input
                v-model="options.fill"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="toggle-row"
              ><span>Points</span
              ><input
                v-model="options.showPoints"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="toggle-row"
              ><span>Line stroke</span
              ><input
                v-model="options.stroke"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <div class="palette-control">
              <p>Color</p>
              <div class="swatches">
                <button
                  v-for="(palette, i) in palettes"
                  :key="palette.name"
                  type="button"
                  :aria-label="palette.name"
                  :aria-pressed="options.palette === i"
                  :style="{ '--swatch': palette.color }"
                  @click="options.palette = i"
                >
                  <span v-if="options.palette === i" aria-hidden="true"
                    >✓</span
                  ></button
                ><span>{{ palettes[options.palette].name }}</span>
              </div>
            </div>
          </div>
          <div
            v-else-if="controls === 'axes'"
            class="control-panel axes-controls"
          >
            <label class="toggle-row"
              ><span>X labels</span
              ><input
                v-model="options.xLabels"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="toggle-row"
              ><span>Y labels</span
              ><input
                v-model="options.yLabels"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="field-row"
              ><span>Y label count</span
              ><input
                v-model.number="options.yCount"
                type="range"
                min="1"
                max="8"
                :disabled="!options.yLabels"
              /><output>{{ options.yCount }}</output></label
            >
            <label class="field-stack"
              ><span>Value format</span
              ><select v-model="options.formatter">
                <option value="number">Number · 50</option>
                <option value="currency">Currency · $50</option>
                <option value="percent">Percentage · 50%</option>
              </select></label
            >
            <label class="toggle-row"
              ><span>Horizontal grid</span
              ><input
                v-model="options.horizontalLines"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="field-row"
              ><span>Grid rows</span
              ><input
                v-model.number="options.horizontalCount"
                type="range"
                min="0"
                max="10"
                :disabled="!options.horizontalLines"
              /><output>{{ options.horizontalCount }}</output></label
            >
            <label class="toggle-row"
              ><span>Vertical grid</span
              ><input
                v-model="options.verticalLines"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="field-row"
              ><span>Grid columns</span
              ><input
                v-model.number="options.verticalCount"
                type="range"
                min="0"
                max="10"
                :disabled="!options.verticalLines"
              /><output>{{ options.verticalCount }}</output></label
            >
          </div>
          <div v-else class="control-panel">
            <label class="toggle-row"
              ><span>Interactive<small>Mouse, pen, and touch</small></span
              ><input
                v-model="options.interactive"
                type="checkbox"
                role="switch" /><span
                class="switch-track"
                aria-hidden="true"
              ></span
            ></label>
            <label class="field-stack"
              ><span
                >Padding <output>{{ options.padding }} px</output></span
              ><input
                v-model.number="options.padding"
                type="range"
                aria-label="Chart padding"
                min="0"
                max="40"
            /></label>
            <p class="control-eyebrow">Y AXIS BOUNDS</p>
            <div class="bounds-fields">
              <label class="field-stack"
                ><span>Minimum</span
                ><input
                  v-model="options.min"
                  type="number"
                  placeholder="Auto" /></label
              ><label class="field-stack"
                ><span>Maximum</span
                ><input v-model="options.max" type="number" placeholder="Auto"
              /></label>
            </div>
            <p class="control-note">
              Blank = auto. Bounds extend the axis without clipping data.
            </p>
            <p class="control-note">
              Also accepts padding shorthand:
              <code>"5 15 10 20"</code>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
