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

### **`datasets`**
**Required**  
Type: **Array**  
  
*Array of objects with [properties for each dataset](#dataset-props).*

### **`grid`**
Type: **Object**  
  
*[Grid properties](#grid-props)*

### **`labels`**
Type: **Object**  
  
*[Labels properties](#labels-props)*

### **`min`**
Type: **Number**  
Default: min value from datasets

### **`max`**
Type: **Number**  
Default:  max value from datasets

### **`padding`**  
Type: **String**  
Default: "5"  
  
*If you set a large *stroke-width* on your lines, you may notice that it gets "cropped" towards the edges. It's similar to "padding" CSS property but without specifying units.*  

Examples:  
`"5"` apply to all four sides  
`"5 10"` vertical | horizontal  
`"5 15 10"` top | horizontal | bottom  
`"5 10 15 20"` top | right | bottom | left

### **`interactive`**
Type: **Boolean**  
Default: **false**  
  
*Allows to set onmousemove interaction. Set to `true` to enable.*

### **`v-on:mouseMove`**
Or `@mouseMove`  
Type: **Function**  
  
*Callback function for **onmouseover** interaction. This has no effect if `interactive` isn't set to true. Receives an **object** `{index: Number, data: Array}` parameter based on current active line. This function has no effect if `interactive` isn't set to `true`.*

## Dataset Props

Chart line (curve) properties

### **`data`**
Type: **Number|Object**
  
*Example: `[70, 100, 400, 180, 100]` or `[{ value: 70 }, { value: 100 }, { value: 400 }, { value: 180 }, { value: 100 }]`  
For object type you can also add other properties to use them in `interactive` mode.*

### **`className`**  
Type: **String**  
  
*Allows to append custom class to chart line for future styling.*

### **`smooth`**
Type: **Boolean**  
Default: **false**  
  
*Allows the peaks to be 'rounded' out.*

### **`stroke`**
Type: **Boolean**  
Default: **true**  
  
*If `false`, the line is not drawn for this dataset.*

### **`fill`**
Type: **Boolean**  
Default: **false**
  
*Allows to fill the area under the line. Set to `true` to enable.*

### **`showPoints`**
Type: **Boolean**  
Default: **false**

*Allows to show points. Set to `true` to enable.*

## Grid Props

### **`verticalLines`**
Type: **Boolean**  
Default: false
  
*Allows to show vertical gridlines. Set to `true` to enable.*

### **`verticalLinesNumber`**
Type: **Number**  
Default: number of `xLabels`
  
*Allows to set custom number of vertical gridlines. This prop has no effect if `verticalLines` isn't set to `true`.*

### **`horizontalLines`**
Type: **Boolean**  
Default: false
  
*Allows to show horizontal gridlines. Set to `true` to enable.*

### **`horizontalLinesNumber`**
Type: **Number**  
Default: number of `yLabels`
  
*Allows to set custom number of horizontal gridlines. This prop has no effect if `horizontalLines` isn't set to `true`.*

## Labels Props

### **`xLabels`**
Type: **Array**
  
*X axis labels.  
Example: `["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]`*

### **`yLabels`**
Type: **Number**
  
*Number of Y axis labels. Labels text is based on data values.*

### **`yLabelsTextFormatter`**
Type: **Function**
  
*Allows to format Y axis labels text.  
Example: `val => "$" + Math.round(val * 100) / 100`*

## Styling

You need to use CSS to style chart.

## Development

```shell
npm install
npm run dev
```

## Contributing

Pull requests are welcome!

## License

MIT
