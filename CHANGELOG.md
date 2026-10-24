# Changelog

All notable changes to this package. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.1]

### Changed

- README: the new logo, and notes on sizing the chart, styling it from `<style scoped>` and
  showing values that stand alone.

## [1.0.0]

The library is rewritten in TypeScript and the way charts are drawn was audited and fixed.
Props, events and CSS class names are the same as in 0.17, but some charts look different:
see **Changed**.

### Added

- TypeScript types for the props and the `mouse-move` event: `TrendChartDataset`,
  `TrendChartGridOptions`, `TrendChartLabelsOptions`, `TrendChartMouseMoveEvent` and
  `DataPoint`.
- `TrendChart` as a named export, to use the component without registering the plugin.
- Gaps: `null`, `undefined`, `NaN` and `Infinity` values break the line instead of crashing the
  chart or breaking every dataset. Numeric strings are read as numbers.
- Touch and pen support in `interactive` mode: press and drag to scrub. Vertical scrolling
  still works.
- `role="img"` on the chart. Pass `aria-label` to describe it.
- `padding` accepts numbers as well as strings.

### Changed

- Requires Vue 3.3 or newer (0.17 allowed 3.2), and `vue` is the only peer dependency. 0.17
  also required `axios`, `vue-axios`, `dayjs` and `popper.js`, which only its demo used.
- X label `i` sits under data point `i`. Before, labels were spread evenly across the width, so
  with fewer labels than points they didn't line up with the data. More labels than points
  reserve room for data that isn't there yet.
- Vertical grid lines default to one per x label, as the README always said, or one per data
  point without x labels.
- Y labels are rounded to the step between them by default (`0.9`, not
  `0.8999999999999999`). A custom `yLabelsTextFormatter` still receives the unrounded value.
- Small value ranges use the full height of the chart. Before, a fixed 0.001 margin squashed
  data like 1.0812 to 1.0815 into a thin band, away from its own y labels.
- Flat data gets a y axis 10% either side of its value instead of the same label repeated.
- `mouse-move` is also emitted when the data at the active point changes, and with `null` when
  the active point disappears from the data or `interactive` is turned off.
- Hover uses pointer events instead of mouse events.
- Label text is positioned in font-relative units instead of measured pixels, so labels can
  move by about a pixel.
- The package has an `exports` map. `import`, `require()` and the UMD build work as before, and
  imports from `vue-trend-chart/dist/*` still resolve.

### Fixed

- Labels always fit inside the chart. They refit when their size changes, for example when a
  web font finishes loading or CSS changes the text, where 0.17 measured them only once.
- Charts inside scaled or zoomed containers (CSS `transform` or `zoom`), or with a border or
  padding on the `<svg>`, are drawn at the right size, and hovering picks the right point.
- Charts follow their container's size, not only the window's, and stop listening when they're
  unmounted. 0.17 never removed its resize listener.
- Hovering the first point works when it sits at the left edge (`padding: "0"`).
- Charts with no data show a 0 to 1 axis instead of `NaN` labels, and datasets with a single
  point or none no longer crash.
- Datasets with more than about 150,000 points no longer throw.
- `min: null` and `max: null` are ignored instead of acting as `0`.
- `verticalLinesNumber: 0` and `horizontalLinesNumber: 0` draw no lines, and fractional counts
  (also for `yLabels`) are rounded down instead of misplacing lines and labels.
- The active point and line are cleared when `interactive` is turned off.
- Flat lines with gradient strokes or fills stay visible on tall charts.
- Server-side rendering draws a regular chart until the browser measures it, instead of
  inverted geometry.
- Grid lines and label ticks are drawn crisp instead of blurred across two pixels.

## [0.17.0] and earlier

Changes before 1.0.0 weren't recorded in a changelog. See the
[commit history](https://github.com/dmtrbrl/vue-trend-chart/commits/main).

[Unreleased]: https://github.com/dmtrbrl/vue-trend-chart/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/dmtrbrl/vue-trend-chart/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/dmtrbrl/vue-trend-chart/compare/v0.17.0...v1.0.0
[0.17.0]: https://github.com/dmtrbrl/vue-trend-chart/releases/tag/v0.17.0
