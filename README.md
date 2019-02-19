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
  
#### **`datasets`** required
Type: **Array**  
*Array of objects with properties for each dataset*

---

#### **`grid`**
Type: **Object**  
*Grid properties*

---

#### **`labels`**
Type: **Object**  
*Labels properties*

---
  
#### **`min`**
Type: **Number**  
Default: min value from datasets

---

#### **`max`**
Type: **Number**  
Default:  max value from datasets

---

#### **`padding`**  
Type: **String**  
Default: "5"  
  
*If you set a large *stroke-width* on your lines, you may notice that it gets "cropped" towards the edges. It's similar to padding css property but without specifying units.*  

Examples:  
`"5"` apply to all four sides  
`"5 10"` vertical | horizontal  
`"5 15 10"` top | horizontal | bottom  
`"5 10 15 20"` top | right | bottom | left
