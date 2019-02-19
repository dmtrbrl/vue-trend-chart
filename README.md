<div align="center">
  <img src="https://raw.githubusercontent.com/dmtrbrl/vue-trend-chart/master/media/vtc-logo.png" width="230" alt="Vue Trend">
</div>

----
<div align="center">
  <a href="https://dmtrbrl.github.io/vue-trend-chart/">Live Demo</a>
</div>

## Installation

```shell
npm i vue-trend-chart
```
## Usage

```js
import Vue from "vue";
import TrendChart from "vue-trend-chart";

Vue.use(TrendChart);
```

## Props

**`datasets`** Array **required**
Array of objects with properties for each dataset

**`grid`** Object
Specify number of vertical and horizontal lines

**`labels`** Object
Labels properties

**`min`** Number
Specify min value. By default it takes min value from datasets

**`max`** **Number**
Specify max value. By default it takes max value from datasets
