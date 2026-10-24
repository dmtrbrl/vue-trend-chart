<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/dmtrbrl/vue-trend-chart/main/media/logo-dark.svg">
    <img src="https://raw.githubusercontent.com/dmtrbrl/vue-trend-chart/main/media/logo.svg" width="320" alt="vue trend chart">
  </picture>
</p>

<p align="center">Simple SVG trend charts for Vue 3, styled with plain CSS.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vue-trend-chart"><img src="https://img.shields.io/npm/v/vue-trend-chart" alt="npm version" /></a>
  <a href="https://github.com/dmtrbrl/vue-trend-chart/actions/workflows/ci.yml"><img src="https://github.com/dmtrbrl/vue-trend-chart/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/vue-trend-chart" alt="MIT license" /></a>
</p>

<p align="center">
  <a href="https://dmtrbrl.github.io/vue-trend-chart/">Live Demo</a> · <a href="CHANGELOG.md">Changelog</a>
</p>

## Installation

```shell
npm i vue-trend-chart
```

Requires Vue `^3.3`. Type definitions are included.

For Vue 2, use the last release that supports it, `vue-trend-chart@0.15.3`. It's no longer
maintained.

## Usage

```vue
<script setup lang="ts">
import { TrendChart, type TrendChartDataset } from "vue-trend-chart";

const datasets: TrendChartDataset[] = [
  {
    data: [10, 50, 20, 80, 40, 60, 90],
    smooth: true,
    fill: true,
  },
];
</script>

<template>
  <TrendChart
    class="weekly-chart"
    aria-label="Weekly activity, rising from 10 to 90"
    :datasets="datasets"
    :grid="{ horizontalLines: true }"
    :labels="{
      xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yLabels: 5,
    }"
    :min="0"
  />
</template>

<style>
.weekly-chart {
  height: 240px;
}
.weekly-chart .stroke {
  stroke: #20815b;
  stroke-width: 2;
}
.weekly-chart .fill {
  fill: #20815b;
  fill-opacity: 0.12;
}
</style>
```

The chart is an `<svg>` that fills its container (`width` and `height` are `100%`), so give it
or its container a height.

To use `<TrendChart>` everywhere without importing it, register the plugin:

```ts
import { createApp } from "vue";
import VueTrendChart from "vue-trend-chart";
import App from "./App.vue";

createApp(App).use(VueTrendChart).mount("#app");
```

## Props

### `datasets`

**Required**  
Type: `TrendChartDataset[]`

_One object per line, with the [dataset props](#dataset-props)._

### `grid`

Type: `TrendChartGridOptions`

_[Grid props](#grid-props)._

### `labels`

Type: `TrendChartLabelsOptions`

_[Labels props](#labels-props)._

### `min`

Type: `number`  
Default: the lowest value in the datasets

_Extends the Y axis down to this value, e.g. `0` to start at zero. The axis always shows all
data, so a `min` above the lowest value has no effect._

### `max`

Type: `number`  
Default: the highest value in the datasets

_Extends the Y axis up to this value. The axis always shows all data, so a `max` below the
highest value has no effect.  
When there is no range to show (flat data), the axis is widened by 10% on the sides you
didn't set._

### `padding`

Type: `string | number`  
Default: `"5"`

_Space around the plot, in pixels. It keeps thick lines and large points from being cropped at
the edges. Works like the CSS `padding` property, without units:_

- `"5"` or `5`: all four sides
- `"5 10"`: vertical | horizontal
- `"5 15 10"`: top | horizontal | bottom
- `"5 10 15 20"`: top | right | bottom | left

### `interactive`

Type: `boolean`  
Default: `false`

_Enables hover interaction: the nearest point is highlighted and reported with
[`mouse-move`](#mouse-move). Works with mouse, pen and touch (press and drag to scrub; vertical
scrolling still works)._

## Events

### `mouse-move`

Payload: `TrendChartMouseMoveEvent | null`

_Emitted when the active point changes in `interactive` mode.  
Receives `{ index, data }`, where `data` holds each dataset's item at `index` (`undefined` for
datasets that are shorter).  
Receives `null` when the pointer leaves the chart, the touch ends, the active point disappears
from the data, or `interactive` is turned off.  
Also emitted again when the data at the active index changes, so tooltips stay current._

```vue
<TrendChart :datasets="datasets" interactive @mouse-move="active = $event" />
```

The [live demo](https://dmtrbrl.github.io/vue-trend-chart/) has a complete tooltip example.

## Dataset props

### `data`

**Required**  
Type: `DataPoint[]`

_The values to plot, one per X position: `[70, 100, 400, 180, 100]`.  
Items can also be objects, `{ value: 70 }`, with any other fields you need in a
[`mouse-move`](#mouse-move) handler.  
`null`, `undefined` and non-finite values (`NaN`, `Infinity`) are drawn as gaps in the line.
Numeric strings are read as numbers._

### `className`

Type: `string`

_Adds a class to this dataset's `<g class="curve">` group, to style it separately from the
other lines._

### `smooth`

Type: `boolean`  
Default: `false`

_Draws a smooth curve through the points instead of straight segments._

### `stroke`

Type: `boolean`  
Default: `true`

_Draws the line. Set to `false` to show only the fill or the points._

### `fill`

Type: `boolean`  
Default: `false`

_Fills the area under the line._

### `showPoints`

Type: `boolean`  
Default: `false`

_Draws a circle at each point.  
A value on its own (a dataset with one value, or a value with gaps on both sides) has no line
to draw, so it's only visible with `showPoints: true`._

## Grid props

### `verticalLines`

Type: `boolean`  
Default: `false`

_Shows vertical gridlines._

### `verticalLinesNumber`

Type: `number`  
Default: one line per `xLabels` item, or per data point without `xLabels`

_Sets how many vertical gridlines to draw, spread evenly across the chart. `0` draws none.  
Has no effect unless `verticalLines` is `true`._

### `horizontalLines`

Type: `boolean`  
Default: `false`

_Shows horizontal gridlines._

### `horizontalLinesNumber`

Type: `number`  
Default: the number of `yLabels`, so the lines line up with them

_Sets how many horizontal gridlines to draw, spread evenly across the chart. `0` draws none.  
Has no effect unless `horizontalLines` is `true`._

## Labels props

### `xLabels`

Type: `(string | number)[]`

_X axis labels. Label `i` is drawn under data point `i`. If there are more labels than data
points, the extra labels reserve room for data that isn't there yet.  
Example: `["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]`_

### `yLabels`

Type: `number`

_How many Y axis labels to draw, evenly spaced from the bottom of the axis to the top. Each
shows the axis value at its position._

### `yLabelsTextFormatter`

Type: `(value: number) => string | number`  
Default: rounds to the precision of the step between labels (`0.9`, not `0.8999999999999999`)

_Formats the Y axis labels. Receives the unrounded value.  
Example: `(value) => "$" + value.toFixed(2)`  
Has no effect without `yLabels`._

## Styling

Style the chart with CSS. Lines, fills, points and gridlines have neutral default colors set as
SVG attributes, which any CSS rule overrides.

With `<style scoped>`, rules only reach the chart's root `<svg>`, so wrap selectors for its
inner elements in `:deep()`:

```css
.weekly-chart :deep(.stroke) {
  stroke: #20815b;
}
```

Labels always fit: the plot area shrinks to make room for them, and refits when their size
changes (text, fonts or CSS).

_The chart's structure and class names:_

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

  <!-- one per dataset; `className` is added here -->
  <g class="curve">
    <path class="fill"></path>
    <path class="stroke"></path>
    <g class="points">
      <circle class="point"></circle>
      <!-- `is-active` only with `interactive` -->
      <circle class="point is-active"></circle>
      ...
    </g>
  </g>
  ...

  <!-- only with `interactive`: transparent area that tracks the pointer -->
  <rect></rect>
</svg>
```

**Tip:** for gradient strokes or fills on lines that can be flat, use
`gradientUnits="userSpaceOnUse"`. Gradients with the default `objectBoundingBox` units can't be
drawn on a perfectly flat line, so the chart nudges the line's end points by 0.01 px to keep
them visible.

## Accessibility

The chart is exposed to assistive technology as a single image (`role="img"`). Give it a text
alternative with `aria-label` (or `aria-labelledby`); attributes are passed through to the
`<svg>`:

```vue
<TrendChart
  aria-label="Downloads per day, rising from 70 to 500"
  :datasets="datasets"
/>
```

## TypeScript

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

`<TrendChart>` is also declared as a global component, so templates that rely on the plugin
instead of an import still get its props checked.

## Development

Requires Node.js `^22.12`, `^24` or `>=26`. Browser tests run in Chromium, Firefox and WebKit
via Playwright; install them once with `npx playwright install chromium firefox webkit`.

```shell
npm install
npm run dev           # demo with hot reload
npm test              # all tests (unit + real browser)
npm run test:unit     # fast unit tests (happy-dom)
npm run test:browser  # layout-dependent tests in headless Chromium, Firefox and WebKit
npm run test:coverage
npm run typecheck     # type-check library, demo and tests
npm run format        # format with Prettier (CI runs format:check)
npm run lib:build     # build dist/ (ESM, UMD and type definitions)
```

Releases are published to npm from CI: see [RELEASING.md](RELEASING.md).

## Contributing

Pull requests are welcome! CI checks formatting, types, both builds and the tests; run
`npm run format` before committing. For user-facing changes, add a line under
`## [Unreleased]` in [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE)
