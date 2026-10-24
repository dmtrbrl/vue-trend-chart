<div align="center">
  <img src="https://raw.githubusercontent.com/dmtrbrl/vue-trend-chart/main/media/vtc-logo.png" width="230" alt="Vue Trend">
</div>

---

<div align="center">
  <a href="https://www.npmjs.com/package/vue-trend-chart"><img src="https://img.shields.io/npm/v/vue-trend-chart.svg" alt="npm version" /></a>
  <a href="https://github.com/dmtrbrl/vue-trend-chart/actions/workflows/ci.yml"><img src="https://github.com/dmtrbrl/vue-trend-chart/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <img src="https://img.shields.io/badge/Vue%203-v1.x-green.svg" alt="Vue 3: v1.x" /> <img src="https://img.shields.io/badge/Vue%202-v0.15.3-green.svg" alt="Vue 2: v0.15.3" />
</div>
<br/>
<div align="center">
  <a href="https://dmtrbrl.github.io/vue-trend-chart/">Live Demo</a> · <a href="CHANGELOG.md">Changelog</a>
</div>

## :cd: Installation

```shell
npm i vue-trend-chart
```

Requires Vue `^3.3`. Type definitions are included.

## :rocket: Usage

Register the component globally with the plugin:

```js
import VueTrendChart from "vue-trend-chart";

app.use(VueTrendChart);
```

Or import it where you need it:

```vue
<script setup lang="ts">
import { TrendChart, type TrendChartDataset } from "vue-trend-chart";

const datasets: TrendChartDataset[] = [{ data: [10, 50, 20], smooth: true }];
</script>
```

_Example:_

```html
<TrendChart
  :datasets="[
    {
      data: [10, 50, 20, 100, 40, 60, 80],
      smooth: true,
      fill: true
    }
  ]"
  :grid="{
     verticalLines: true,
     horizontalLines: true
  }"
  :labels="{
     xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
     yLabels: 5
  }"
  :min="0"
>
</TrendChart>
```

## :wrench: Props

### **`datasets`**

**Required**  
Type: **Array**

_Array of objects with [properties for each dataset](#chart_with_upwards_trend-dataset-props)._

### **`grid`**

Type: **Object**

_[Grid properties](#hash-grid-props)_

### **`labels`**

Type: **Object**

_[Labels properties](#abc-labels-props)_

### **`min`**

Type: **Number**  
Default: min value from datasets

_Extends the Y axis down to this value, e.g. `0` to start at zero. The axis always shows all data, so a `min` above the lowest value has no effect._

### **`max`**

Type: **Number**  
Default: max value from datasets

_Extends the Y axis up to this value. The axis always shows all data, so a `max` below the highest value has no effect.  
When there is no range to show (flat data), the axis is widened by 10% on the sides you didn't set._

### **`padding`**

Type: **String|Number**  
Default: "5"

_If you set a large *stroke-width* on your lines, you may notice that it gets "cropped" towards the edges. It's similar to "padding" CSS property but without specifying units._

Examples:  
`"5"` apply to all four sides  
`"5 10"` vertical | horizontal  
`"5 15 10"` top | horizontal | bottom  
`"5 10 15 20"` top | right | bottom | left

### **`interactive`**

Type: **Boolean**  
Default: **false**

_Enables hover interaction: the nearest point is highlighted and reported via [`mouse-move`](#mouse-move). Works with mouse, pen and touch (press and drag to scrub; vertical scrolling still works). Set to `true` to enable._

## :zap: Events

### **`mouse-move`**

_Emitted when the active point changes in `interactive` mode.  
Receives `{ index: Number, data: Array }`, where `data` holds each dataset's item at `index` (`undefined` for datasets that are shorter).  
Receives `null` when the pointer leaves the chart, the touch ends, the active point disappears from the data, or `interactive` is turned off.  
Also emitted again when the data at the active index changes, so tooltips stay current._

## :chart_with_upwards_trend: Dataset Props

Chart line (curve) properties

### **`data`**

Type: **Array** of **Number|Object|null**

_Example: `[70, 100, 400, 180, 100]` or `[{ value: 70 }, { value: 100 }, { value: 400 }, { value: 180 }, { value: 100 }]`  
For object type you can also add other properties to use them in `interactive` mode.  
`null`, `undefined` and non-finite values (`NaN`, `Infinity`) are drawn as gaps in the line. Numeric strings are read as numbers._

### **`className`**

Type: **String**

_Allows to append custom class to chart line for future styling._

### **`smooth`**

Type: **Boolean**  
Default: **false**

_Allows the peaks to be 'rounded' out._

### **`stroke`**

Type: **Boolean**  
Default: **true**

_If `false`, the line is not drawn for this dataset._

### **`fill`**

Type: **Boolean**  
Default: **false**

_Allows to fill the area under the line. Set to `true` to enable._

### **`showPoints`**

Type: **Boolean**  
Default: **false**

_Allows to show points. Set to `true` to enable._

## :hash: Grid Props

### **`verticalLines`**

Type: **Boolean**  
Default: false

_Allows to show vertical gridlines. Set to `true` to enable._

### **`verticalLinesNumber`**

Type: **Number**  
Default: one line per `xLabels` item, or per data point without `xLabels`

_Allows to set custom number of vertical gridlines, spread evenly across the chart. `0` draws none.  
This prop has no effect if `verticalLines` isn't set to `true`._

### **`horizontalLines`**

Type: **Boolean**  
Default: false

_Allows to show horizontal gridlines. Set to `true` to enable._

### **`horizontalLinesNumber`**

Type: **Number**  
Default: number of `yLabels` (aligned with them)

_Allows to set custom number of horizontal gridlines, spread evenly across the chart. `0` draws none.  
This prop has no effect if `horizontalLines` isn't set to `true`._

## :abc: Labels Props

### **`xLabels`**

Type: **Array**

_X axis labels. Label `i` is drawn under data point `i`. If there are more labels than data points, the extra labels reserve room for data that isn't there yet.  
Example: `["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]`_

### **`yLabels`**

Type: **Number**

_Number of Y axis labels, evenly spaced from `min` to `max`. Labels text is based on data values._

### **`yLabelsTextFormatter`**

Type: **Function**

Default: rounds to the precision of the step between labels (`0.9`, not `0.8999999999999999`)

_Allows to format Y axis labels text. Receives the unrounded value.  
Example: `val => "$" + Math.round(val * 100) / 100`.  
This function has no effect if `yLabels` prop has no value._

## :art: Styling

Just use CSS to style your charts. Labels always fit: the plot area shrinks to make room for them, and refits when their size changes (text, fonts or CSS).

_Here is an example of a tree structure with available class names:_

```html
<svg class="vtc" role="img">
  <g class="grid">
    <g class="vertical">
      <line class="line"></line>
      ...
    </g>
    <g class="horizontal">
      <line class="line"></line>
      ...
    </g>
  </g>

  <!-- only with `interactive` -->
  <line class="active-line"></line>

  <g class="labels">
    <g class="x-labels">
      <g class="label">
        <text></text>
        <line></line>
        <!-- tick -->
      </g>
      ...
    </g>
    <g class="y-labels">
      <g class="label">
        <text></text>
        <line></line>
        <!-- tick -->
      </g>
      ...
    </g>
  </g>

  <g class="curve">
    <path class="fill"></path>
    <path class="stroke"></path>
    <g class="points">
      <circle class="point"></circle>
      <circle class="point is-active"></circle>
      <!-- with `interactive` -->
      ...
    </g>
  </g>
  ...

  <!-- only with `interactive`: transparent area that tracks the pointer -->
  <rect></rect>
</svg>
```

**Tip:** for gradient strokes or fills on lines that can be flat, use `gradientUnits="userSpaceOnUse"`. Gradients with the default `objectBoundingBox` units can't be drawn on a perfectly flat line, so the chart nudges the line's end points by 0.01 px to keep them visible.

## :wheelchair: Accessibility

The chart is exposed to assistive technology as a single image (`role="img"`). Give it a text alternative with `aria-label` (or `aria-labelledby`); attributes are passed through to the `<svg>`:

```html
<TrendChart
  aria-label="Downloads per day, rising from 70 to 500"
  :datasets="datasets"
/>
```

## :label: TypeScript

The package exports types for its props and events:

```ts
import type {
  DataPoint,
  TrendChartDataset,
  TrendChartGridOptions,
  TrendChartLabelsOptions,
  TrendChartMouseMoveEvent,
} from "vue-trend-chart";
```

## :hammer: Development

Requires Node.js `^20.19` or `>=22.12`. Browser tests run in Chromium, Firefox and WebKit via Playwright; install them once with `npx playwright install chromium firefox webkit`.

```shell
npm install
npm run dev        # demo with hot reload
npm test           # all tests (unit + real browser)
npm run test:unit  # fast unit tests (happy-dom)
npm run test:browser  # layout-dependent tests in headless Chromium, Firefox and WebKit
npm run test:coverage
npm run typecheck  # type-check library, demo and tests
npm run format     # format with Prettier (CI runs format:check)
npm run lib:build  # build dist/ (ESM, UMD and type definitions)
```

Releases are published to npm from CI: see [RELEASING.md](RELEASING.md).

## :two_hearts: Contributing

Pull requests are welcome! CI checks formatting, types, both builds and the tests; run `npm run format` before committing. For user-facing changes, add a line under `## [Unreleased]` in [CHANGELOG.md](CHANGELOG.md).

## :lock: License

MIT
