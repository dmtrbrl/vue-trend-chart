(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{17:function(t,e,a){t.exports=a(42)},3:function(t,e,a){},36:function(t,e,a){"use strict";var n=a(3);a.n(n).a},37:function(t,e,a){"use strict";var n=a(4);a.n(n).a},38:function(t,e,a){"use strict";var n=a(5);a.n(n).a},39:function(t,e,a){"use strict";var n=a(6);a.n(n).a},4:function(t,e,a){},42:function(t,e,a){"use strict";a.r(e);var n=a(2),r=a(15),s=a.n(r),i=a(16),c=a.n(i),l=function(t){var e=t.split(" ").filter(function(t){return""!==t}).map(function(t){return parseInt(t)});switch(e.length){case 4:return{top:e[0],right:e[1],bottom:e[2],left:e[3]};case 3:return{top:e[0],right:e[1],bottom:e[2],left:e[1]};case 2:return{top:e[0],right:e[1],bottom:e[0],left:e[1]};default:return{top:e[0],right:e[0],bottom:e[0],left:e[0]}}};function o(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},n=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter(function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable}))),n.forEach(function(e){h(t,e,a[e])})}return t}function h(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var u={name:"TrendChartGrid",props:{xAxes:{default:!1,type:Boolean},xAxesLines:{type:Number},yAxes:{default:!1,type:Boolean},yAxesLines:{type:Number}},computed:{xLines:function(){return this.xAxesLines||this.$parent.params.maxAmount},yLines:function(){return this.yAxesLines||this.$parent.labels.yLabelsAmount},boundary:function(){return this.$parent.boundary}},methods:{setXLineParams:function(t){var e=this.boundary,a=this.xLines,n=a>1?(e.maxX-e.minX)/(a-1):0,r=e.minX+n*(t-1);return{x1:r,x2:r,y1:e.minY,y2:e.maxY,stroke:"rgba(0,0,0,0.1)"}},setYLineParams:function(t){var e=this.boundary,a=this.yLines,n=a>1?(e.maxY-e.minY)/(a-1):0,r=e.maxY-n*(t-1);return{x1:e.minX,x2:e.maxX,y1:r,y2:r,stroke:"rgba(0,0,0,0.1)"}}},render:function(t){if(this.xAxes||this.yAxes){var e=[];if(this.xAxes&&this.xLines>0){for(var a=[],n=1;n<=this.xLines;n++)a.push(t("line",{class:"vtc-axis-x",attrs:o({},this.setXLineParams(n))}));e.push(t("g",{class:"vtc-axes-x"},a))}if(this.yAxes&&this.yLines>0){for(var r=[],s=1;s<=this.yLines;s++)r.push(t("line",{class:"vtc-axis-y",attrs:o({},this.setYLineParams(s))}));e.push(t("g",{class:"vtc-axes-y"},r))}return t("g",e)}}};function m(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},n=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter(function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable}))),n.forEach(function(e){f(t,e,a[e])})}return t}function f(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var d={name:"TrendChartLabels",props:{xLabels:{type:Array},yLabelsAmount:{type:Number},yLabelsTextFormatter:{default:function(t){return t},type:Function}},data:function(){return{xLabelHeight:null,yLabelHeight:null}},computed:{boundary:function(){return this.$parent.boundary}},methods:{setXLabelsParams:function(t){var e=this.boundary,a=this.xLabels,n=(e.maxX-e.minX)/(a.length-1),r=e.minX+n*t,s=e.maxY;return{transform:"translate(".concat(r,", ").concat(s,")")}},setYLabelsParams:function(t){var e=this.boundary,a=this.yLabelsAmount,n=(e.maxY-e.minY)/(a-1),r=e.minX,s=e.maxY-n*t;return{transform:"translate(".concat(r,", ").concat(s,")")}}},mounted:function(){this.xLabels&&this.xLabels.length&&(this.xLabelHeight=document.querySelector(".vtc-labels-x text").getBoundingClientRect().height),this.yLabelsAmount&&this.yLabelsAmount>0&&(this.yLabelHeight=document.querySelector(".vtc-labels-y text").getBoundingClientRect().height)},render:function(t){var e=this;if(this.xLabels&&this.xLabels.length||this.yLabelsAmount&&this.yLabelsAmount>0){var a=[];if(this.xLabels&&this.xLabels.length&&a.push(t("g",{class:"vtc-labels-x"},this.xLabels.map(function(a,n){return t("g",{class:"vtc-label-x",attrs:m({},e.setXLabelsParams(n))},[t("line",{attrs:{stroke:"black",y2:5}}),t("text",{attrs:{dy:e.xLabelHeight+5,"text-anchor":"middle"}},a)])}))),this.yLabelsAmount&&this.yLabelsAmount>0){for(var n=[],r=0;r<this.yLabelsAmount;r++)n.push(t("g",{class:"vtc-label-y",attrs:m({},this.setYLabelsParams(r))},[t("text",{attrs:{dx:-10,dy:this.yLabelHeight/4,"text-anchor":"end"}},this.yLabelsTextFormatter(this.$parent.params.minValue+(this.$parent.params.maxValue-this.$parent.params.minValue)/(this.yLabelsAmount-1)*r)),t("line",{attrs:{stroke:"black",x1:0,x2:-5}})]));a.push(t("g",{class:"vtc-labels-y"},n))}return t("g",a)}}};function p(t){return function(t){if(Array.isArray(t)){for(var e=0,a=new Array(t.length);e<t.length;e++)a[e]=t[e];return a}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var v={name:"TrendChartCurve",props:{data:{required:!0,type:Array},className:{type:String},smooth:{default:!1,type:Boolean},stroke:{default:!0,type:Boolean},fill:{default:!1,type:Boolean},showPoints:{default:!1,type:Boolean}},computed:{points:function(){return function(t,e,a,n,r){var s=e.minX,i=e.minY,c=e.maxX,l=e.maxY;t=t.map(function(t){return"number"===typeof t?t:t.value});var o=n-.001,h=(c-s)/(r-1),u=(l-i)/(a+.001-o);return t.map(function(t,e){return{x:e*h+s,y:l-(t-o)*u+1e-5*+(e===r-1)-1e-5*+(0===e)}})}(this.data,this.$parent.boundary,this.$parent.params.maxValue,this.$parent.params.minValue,this.$parent.params.maxAmount)},paths:function(){return function(t,e,a){var n=a.maxY,r=p(t),s=r.shift(),i=r[r.length-1],c=(r[0].x-s.x)/2,l="M ".concat(s.x,",").concat(s.y);r.forEach(function(t,a){if(e){var n=r[a-1]||s;l+=" C ".concat(c+n.x,",").concat(n.y," ").concat(c+n.x,",").concat(t.y," ").concat(t.x,",").concat(t.y)}else l+=" L".concat(t.x,",").concat(t.y)});var o=l;return i.Y!==n&&(o+=" L".concat(i.x,",").concat(n)),s.Y!==n&&(o+=" L".concat(s.x,",").concat(n)),{linePath:l,fillPath:o+=" Z"}}(this.points,this.smooth,this.$parent.boundary)}},render:function(t){var e=this,a=[];return this.fill&&this.paths&&this.paths.fillPath&&a.push(t("path",{class:"vtc-curve-fill",attrs:{d:this.paths.fillPath,fill:"rgba(0,0,0,0.15)"}})),this.stroke&&this.paths&&this.paths.linePath&&a.push(t("path",{class:"vtc-curve-stroke",attrs:{d:this.paths.linePath,fill:"none",stroke:"#000000"}})),this.showPoints&&this.points&&a.push(t("g",{class:"vtc-points"},this.points.map(function(a,n){return t("circle",{class:{"vtc-point":!0,"is-active":e.$parent.activeLineParams&&e.$parent.activeLineParams.index===n},attrs:{cx:a.x,cy:a.y,r:2,stroke:"black","stroke-width":1}})}))),t("g",{class:this.className},a)}};function b(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{},n=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter(function(t){return Object.getOwnPropertyDescriptor(a,t).enumerable}))),n.forEach(function(e){y(t,e,a[e])})}return t}function y(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function g(t){return function(t){if(Array.isArray(t)){for(var e=0,a=new Array(t.length);e<t.length;e++)a[e]=t[e];return a}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var x={name:"TrendChart",components:{TrendChartGrid:u,TrendChartLabels:d,TrendChartCurve:v},props:{datasets:{required:!0,type:Array},grid:{default:null,type:Object},labels:{default:null,type:Object},max:{type:Number},min:{type:Number},padding:{default:"5",type:String,validator:function(t){return function(t){var e=t.split(" ").filter(function(t){return""!==t}).map(function(t){return parseInt(t)});return!(e.length<1||e.length>4)&&e.every(function(t){return"number"==typeof t&&t>=0})}(t)}},hoverable:{default:!1,type:Boolean}},data:function(){return{width:null,height:null,labelsOverflowObject:{top:0,right:0,bottom:0,left:0},activeLine:null,activeLineParams:null}},computed:{paddingObject:function(){return this.padding?l(this.padding):l("0")},boundary:function(){var t=this.width,e=this.height,a=this.paddingObject,n=this.labelsOverflowObject,r={minX:a.left+n.left,minY:a.top+n.top,maxX:t-a.right-n.right,maxY:e-a.bottom-n.bottom};return r},params:function(){var t=-1/0,e=1/0,a=0;return this.datasets.forEach(function(n){var r=n.data.map(function(t){return"number"===typeof t?t:t.value}),s=Math.max.apply(Math,g(r));s>t&&(t=s);var i=Math.min.apply(Math,g(r));i<e&&(e=i),r.length>a&&(a=r.length)}),void 0!==this.max&&this.max>t&&(t=this.max),void 0!==this.min&&this.min<e&&(e=this.min),{maxValue:t,minValue:e,maxAmount:a}},chartOverlayParams:function(){var t=this.boundary,e=t.maxX-t.minX,a=t.maxY-t.minY;return{x:t.minX,y:t.minY,width:e>0?e:0,height:a>0?a:0,opacity:0}},chartAxesXCoords:function(){for(var t=[],e=(this.boundary.maxX-this.boundary.minX)/(this.params.maxAmount-1),a=0;a<this.params.maxAmount;a++)t.push(e*a+this.boundary.minX);return t}},methods:{setSize:function(){var t=this.$refs.chart.getBoundingClientRect();this.width=t.width,this.height=t.height},fitLabels:function(){var t=this.$refs.chart,e=this.$refs["chart-labels"];if(e&&(e.xLabels&&e.xLabels.length||e.yLabelsAmount>0)){var a=t.getBoundingClientRect(),n=e.$el.getBoundingClientRect(),r=a.top-n.top+this.paddingObject.top,s=n.right-a.right+this.paddingObject.right,i=n.bottom-a.bottom+this.paddingObject.bottom,c=this.paddingObject.left-n.left+a.left;this.labelsOverflowObject={top:r>0?r:0,right:s>0?s:0,bottom:i>0?i:0,left:c>0?c:0}}else this.labelsOverflowObject={top:0,right:0,bottom:0,left:0}},init:function(){var t=this;this.setSize(),this.$nextTick(function(){t.fitLabels()})},getNearestCoordinate:function(t){return this.chartAxesXCoords.reduce(function(e,a){return Math.abs(e)>Math.abs(a-t)?a-t:e},1/0)+t},onWindowResize:function(){this.setSize()},onMouseMove:function(t){var e=this.$refs.chart.getBoundingClientRect();this.activeLine=this.getNearestCoordinate(t.clientX-e.left)},onMouseOut:function(){this.activeLine=null,this.activeLineParams=null}},watch:{activeLine:function(t){var e=this,a=[];if(t){var n=this.$refs.chart.getBoundingClientRect();this.activeLineParams={top:this.boundary.minY+n.top,left:this.boundary.minX+n.left+this.activeLine,height:this.boundary.maxY-this.boundary.minY,index:this.chartAxesXCoords.indexOf(this.activeLine)},this.datasets.forEach(function(t){a.push(t.data[e.activeLineParams.index])})}this.$emit("onMouseMove",this.activeLineParams?b({},this.activeLineParams,{data:a}):null)}},mounted:function(){this.init(),window.addEventListener("resize",this.onWindowResize)},destroyed:function(){window.removeEventListener("resize",this.onWindowResize)},render:function(t){var e=this,a=[];return this.grid&&a.push(t(u,{class:"vtc-grid",attrs:b({},this.grid)})),this.hoverable&&this.chartOverlayParams&&this.activeLine&&a.push(t("line",{class:"vtc-active-line",ref:"chart-active-line",attrs:{x1:this.activeLine,x2:this.activeLine,y1:this.boundary.minY,y2:this.boundary.maxY,stroke:"black"}})),this.labels&&a.push(t(d,{class:"vtc-labels",ref:"chart-labels",attrs:b({},this.labels)})),this.datasets.map(function(e){a.push(t(v,{class:"vtc-curve",attrs:b({},e)}))}),this.hoverable&&this.chartOverlayParams&&a.push(t("rect",{ref:"chart-hover-area",attrs:b({},this.chartOverlayParams),on:{mousemove:function(t){return e.onMouseMove(t)},mouseout:function(){return e.onMouseOut()}}})),t("svg",{class:"vtc",ref:"chart",attrs:{xmlns:"http://www.w3.org/2000/svg",width:"100%",height:"100%"}},a)},install:function(t){t.component(x.name,x)}};"undefined"!==typeof window&&window.Vue&&window.Vue.use(x);var w=x,L=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{staticClass:"demo"},[a("header",{staticClass:"demo__header"},[a("svg",{staticClass:"demo__logo",attrs:{viewBox:"0 0 454 130",xmlns:"http://www.w3.org/2000/svg"}},[a("title",[t._v("Vue Trend Chart")]),t._v(" "),a("g",{attrs:{fill:"none","fill-rule":"evenodd"}},[a("path",{attrs:{d:"M.5 45h20c30 0 30 80 60 80s30-110 60-110h20",stroke:"#39AF77","stroke-width":"10"}}),t._v(" "),a("path",{attrs:{d:"M.5 35h20c34 0 42 80 60 80 22 0 18-110 60-110h20",stroke:"#2F4053","stroke-width":"10"}}),t._v(" "),a("path",{attrs:{d:"M154.45 84h-7.5c-.55 0-.85-.25-.95-.8l-5-34.05c-.1-.55.25-.9.8-.9h6.35c.55 0 .9.25.95.8l1.8 15.25c.4 3.35.85 7.8 1.05 10.7h.3c1.15-2.85 2.75-6.9 4.2-10.1l7.4-16c.2-.4.6-.65 1.05-.65h6.9c.65 0 .9.4.6 1.05l-16.95 34.05c-.2.45-.55.65-1 .65zm31.283-26h5.85c.6 0 .85.35.75.9l-4.05 22.85c-.1.45-.35.75-.75.9-3.1 1.25-6.9 1.95-10.05 1.95-7.45 0-10.85-4.75-9.6-11.8l2.5-14.05c.1-.5.4-.75.9-.75h5.8c.55 0 .85.35.75.9l-2.5 14.65c-.55 3.1.55 4.55 3.05 4.55 1.2 0 2.4-.25 3.1-.55l3.35-18.8c.05-.5.4-.75.9-.75zm8.084 8.9c1.2-6.55 6.4-9.6 12.45-9.6 6.4 0 10.95 3.4 9.6 10.75l-.85 4.85c-.1.5-.4.75-.9.75h-13.9l-.15.7c-.5 2.65.7 3.95 3.45 3.95 2.2 0 4.5-.8 6.5-2 .5-.35.9-.3 1.15.25l2.05 3.85c.2.5.15.95-.3 1.2-2.7 1.85-6.1 3.05-10.45 3.05-6.55 0-11.1-4-9.95-10.5l1.3-7.25zm14.6 1.75l.25-1.25c.35-2-.5-3.75-3.05-3.75-2.15 0-3.8 1.3-4.25 3.65l-.25 1.35h7.3zm19.216-20.4h25.1c.6 0 .9.35.8.95l-1 5.5c-.05.5-.35.8-.9.8h-8.65l-4.9 27.7c-.1.5-.4.8-.9.8h-6.25c-.55 0-.85-.4-.75-.95l4.9-27.55h-8.55c-.6 0-.85-.4-.8-.95l1-5.5c.1-.5.4-.8.9-.8zM252.517 84h-5.8c-.6 0-.9-.4-.8-.95l3.95-22.7c.1-.45.35-.75.75-.95 2.9-1.35 6.1-2.1 9.25-2.1 1.35 0 2.7.15 4.15.45.55.1.8.5.7 1l-.9 4.9c-.05.55-.45.8-1 .75-.85-.15-1.85-.25-2.9-.25-1.3 0-2.4.25-3.25.6l-3.25 18.45c-.1.5-.4.8-.9.8zM264 66.9c1.2-6.55 6.4-9.6 12.45-9.6 6.4 0 10.95 3.4 9.6 10.75l-.85 4.85c-.1.5-.4.75-.9.75h-13.9l-.15.7c-.5 2.65.7 3.95 3.45 3.95 2.2 0 4.5-.8 6.5-2 .5-.35.9-.3 1.15.25l2.05 3.85c.2.5.15.95-.3 1.2-2.7 1.85-6.1 3.05-10.45 3.05-6.55 0-11.1-4-9.95-10.5l1.3-7.25zm14.6 1.75l.25-1.25c.35-2-.5-3.75-3.05-3.75-2.15 0-3.8 1.3-4.25 3.65l-.25 1.35h7.3zM292.683 84h-5.8c-.6 0-.9-.4-.8-.95l4.1-22.85c.1-.4.3-.7.75-.9 3.15-1.2 6.9-2 10.15-2 7.55 0 10.95 4.8 9.7 11.9l-2.5 14c-.1.5-.4.8-.95.8h-5.75c-.55 0-.85-.4-.8-.95l2.5-14.6c.6-3.15-.5-4.6-3.15-4.6-1.2 0-2.45.25-3.2.6l-3.3 18.75c-.1.55-.4.8-.95.8zm40.084-1.2c-2.85 1.15-6.7 1.85-10 1.85-7.25 0-11.25-4.95-10.1-11.6l1.05-5.75c1.05-5.95 5.6-10 11.55-10 1.85 0 3.6.4 4.85 1.05l1.65-9.3c.1-.5.4-.8.9-.8h5.8c.6 0 .9.4.8.95l-5.75 32.7c-.05.45-.3.75-.75.9zm-12.5-9.2c-.6 3.15.5 4.4 3.2 4.4 1.2 0 2.5-.2 3.3-.55l2.25-12.9c-.8-.55-2.05-.85-3.3-.85-2.4 0-3.95 1.5-4.5 4.55l-.95 5.35zm50.616 7.85c-3.1 1.85-6.95 3.2-11.9 3.2-8.25 0-13.15-5.3-11.6-14.3l1.75-10.15c1.45-8.35 7.6-12.6 15.7-12.6 3.9 0 7.4 1.35 9.85 3.4.45.3.45.75.1 1.2l-3.65 4.3c-.3.4-.7.45-1.2.15-1.6-1.1-3.65-1.8-5.8-1.8-4 0-6.4 2.45-7 6.15l-1.75 10.1c-.65 4.05 1.15 6.25 5.05 6.25 2.3 0 4.95-.8 7.05-2.2.5-.3.9-.2 1.2.35l2.35 4.9c.25.55.2.85-.15 1.05zm13.134-23.1c1.35-.65 2.95-1.05 4.9-1.05 5.85 0 9.15 4.45 7.85 11.85l-2.5 14.05c-.05.5-.4.8-.9.8h-5.75c-.6 0-.9-.4-.8-.95l2.55-14.8c.55-2.9-.4-4.4-3.1-4.4-1.2 0-2.45.4-3.35.85l-3.25 18.5c-.1.5-.4.8-.95.8h-5.75c-.55 0-.85-.4-.8-.95l6.05-34c.05-.5.35-.8.9-.8h5.75c.55 0 .85.4.75.95l-1.6 9.15zM417.5 82.9c-2.85 1-6.55 1.75-10.4 1.75-7 0-10.55-4-9.55-9.45.85-4.85 4.95-7 11.35-7 1.5 0 3 .15 4.25.4l.1-.8c.45-2.45-.25-3.8-3.4-3.8-2.2 0-4.45.45-5.95 1.15-.55.25-.95.15-1.15-.4l-1.55-4.1c-.15-.45-.15-.8.15-1 2.4-1.45 6.15-2.35 10.2-2.35 6.8 0 10.3 4.5 8.95 12l-2.25 12.65c-.1.45-.3.8-.75.95zM405 75.6c-.35 1.9.85 2.8 3.05 2.8 1.15 0 2.55-.2 3.45-.4l.7-4.35c-.95-.2-2.1-.35-3.2-.35-2.45 0-3.75.8-4 2.3zm22.933 8.4h-5.8c-.6 0-.9-.4-.8-.95l3.95-22.7c.1-.45.35-.75.75-.95 2.9-1.35 6.1-2.1 9.25-2.1 1.35 0 2.7.15 4.15.45.55.1.8.5.7 1l-.9 4.9c-.05.55-.45.8-1 .75-.85-.15-1.85-.25-2.9-.25-1.3 0-2.4.25-3.25.6l-3.25 18.45c-.1.5-.4.8-.9.8zm24.284-19.05h-4.1l-1.7 9.65c-.4 2.25.4 3.45 2.45 3.45h1.35c.6-.05.95.2.8.85l-.8 4.65c-.1.5-.35.8-.85.85-.75.15-1.7.25-2.55.25-5.55 0-9.1-3.35-7.8-10.65l3.75-21.45c.1-.5.4-.8.95-.8h4.9c.6 0 .9.35.85.9l-.3 5.95h4c.6 0 .9.4.8.95l-.8 4.6c-.1.55-.4.8-.95.8z",fill:"#2F4053"}}),t._v(" "),a("path",{attrs:{d:"M157.482 116.164c-.832 4.056-4.264 5.174-7.644 5.174-2.73 0-4.68-.962-6.448-2.522-.208-.182-.234-.416-.052-.65l1.872-2.314c.182-.234.416-.234.65-.052 1.43 1.118 2.808 1.716 4.42 1.716 1.508 0 2.834-.598 3.042-1.82.208-1.3-1.118-1.82-3.042-2.366-2.782-.806-5.304-2.522-4.68-6.214.624-3.64 3.51-5.044 7.02-5.044 2.47 0 4.29.65 6.084 1.976.234.156.26.39.078.624l-1.82 2.34c-.182.208-.39.234-.624.078-1.17-.754-2.704-1.274-4.186-1.274-1.404 0-2.288.676-2.496 1.716-.208 1.248.884 1.69 2.548 2.184 2.366.728 6.136 2.054 5.278 6.448zm3.943 4.836h-3.016c-.286 0-.442-.208-.39-.494l2.236-12.636c.026-.26.208-.39.468-.39h3.016c.312 0 .468.182.416.468l-2.236 12.636c-.052.26-.208.416-.494.416zm3.588-17.29c.26-1.404-.572-2.444-1.898-2.444-1.196 0-2.08.754-2.288 1.898-.26 1.352.572 2.418 1.898 2.418a2.3 2.3 0 0 0 2.288-1.872zm9.638 4.446c1.222-.65 2.548-1.04 3.848-1.04 3.588 0 5.408 2.652 4.784 6.344l-1.3 7.124c-.026.26-.208.416-.468.416h-2.938c-.312 0-.442-.208-.416-.494l1.326-7.592c.286-1.664-.312-2.392-1.56-2.392-.624 0-1.274.208-1.742.468.13.728.13 1.586-.026 2.47l-1.274 7.124c-.026.26-.208.416-.468.416h-2.938c-.312 0-.468-.208-.416-.494l1.326-7.592c.286-1.664-.26-2.392-1.43-2.392-.572 0-1.144.13-1.508.312l-1.768 9.75c-.052.286-.208.416-.468.416h-2.99c-.286 0-.442-.182-.39-.494l2.158-11.882a.637.637 0 0 1 .39-.468c1.534-.65 3.432-1.04 5.044-1.04 1.3 0 2.418.39 3.224 1.04zm11.587.052c1.508-.676 3.51-1.066 5.252-1.066 3.744 0 5.824 2.548 5.226 6.032l-.52 2.99c-.52 3.068-2.912 5.174-6.006 5.174-.988 0-1.872-.208-2.522-.572l-.858 4.758c-.026.26-.208.416-.468.416h-3.016c-.312 0-.442-.208-.39-.494l2.938-16.77a.662.662 0 0 1 .364-.468zm6.084 7.436l.468-2.756c.312-1.69-.26-2.34-1.664-2.34-.624 0-1.274.156-1.716.39l-1.17 6.604c.416.312 1.066.494 1.664.494 1.326 0 2.132-.78 2.418-2.392zm10.417 5.564c.182-.026.286-.156.338-.416l.416-2.47c.052-.312-.104-.442-.416-.416h-.52c-.936 0-1.248-.702-1.014-1.95l2.288-13.052c.052-.286-.104-.494-.39-.494h-3.016c-.26 0-.416.156-.468.416l-2.288 12.922c-.572 3.38.884 5.59 3.692 5.59.546 0 1.014-.052 1.378-.13zm2.202-9.1c.624-3.406 3.328-4.992 6.474-4.992 3.328 0 5.694 1.768 4.992 5.59l-.442 2.522c-.052.26-.208.39-.468.39h-7.228l-.078.364c-.26 1.378.364 2.054 1.794 2.054 1.144 0 2.34-.416 3.38-1.04.26-.182.468-.156.598.13l1.066 2.002c.104.26.078.494-.156.624-1.404.962-3.172 1.586-5.434 1.586-3.406 0-5.772-2.08-5.174-5.46l.676-3.77zm7.592.91l.13-.65c.182-1.04-.26-1.95-1.586-1.95-1.118 0-1.976.676-2.21 1.898l-.13.702h3.796zm15.816-1.924h-2.132l-.884 5.018c-.208 1.17.208 1.794 1.274 1.794h.702c.312-.026.494.104.416.442l-.416 2.418c-.052.26-.182.416-.442.442-.39.078-.884.13-1.326.13-2.886 0-4.732-1.742-4.056-5.538l1.95-11.154c.052-.26.208-.416.494-.416h2.548c.312 0 .468.182.442.468l-.156 3.094h2.08c.312 0 .468.208.416.494l-.416 2.392c-.052.286-.208.416-.494.416zm3.502 9.906h-3.016c-.312 0-.468-.208-.416-.494l2.054-11.804a.689.689 0 0 1 .39-.494c1.508-.702 3.172-1.092 4.81-1.092.702 0 1.404.078 2.158.234.286.052.416.26.364.52l-.468 2.548c-.026.286-.234.416-.52.39a8.81 8.81 0 0 0-1.508-.13c-.676 0-1.248.13-1.69.312l-1.69 9.594c-.052.26-.208.416-.468.416zm5.971-8.892c.624-3.406 3.328-4.992 6.474-4.992 3.328 0 5.694 1.768 4.992 5.59l-.442 2.522c-.052.26-.208.39-.468.39h-7.228l-.078.364c-.26 1.378.364 2.054 1.794 2.054 1.144 0 2.34-.416 3.38-1.04.26-.182.468-.156.598.13l1.066 2.002c.104.26.078.494-.156.624-1.404.962-3.172 1.586-5.434 1.586-3.406 0-5.772-2.08-5.174-5.46l.676-3.77zm7.592.91l.13-.65c.182-1.04-.26-1.95-1.586-1.95-1.118 0-1.976.676-2.21 1.898l-.13.702h3.796zm7.323 7.982h-3.016c-.312 0-.468-.208-.416-.494l2.132-11.882a.637.637 0 0 1 .39-.468c1.638-.624 3.588-1.04 5.278-1.04 3.926 0 5.694 2.496 5.044 6.188l-1.3 7.28c-.052.26-.208.416-.494.416h-2.99c-.286 0-.442-.208-.416-.494l1.3-7.592c.312-1.638-.26-2.392-1.638-2.392-.624 0-1.274.13-1.664.312l-1.716 9.75c-.052.286-.208.416-.494.416zm20.844-.624c-1.482.598-3.484.962-5.2.962-3.77 0-5.85-2.574-5.252-6.032l.546-2.99c.546-3.094 2.912-5.2 6.006-5.2.962 0 1.872.208 2.522.546l.858-4.836c.052-.26.208-.416.468-.416h3.016c.312 0 .468.208.416.494l-2.99 17.004c-.026.234-.156.39-.39.468zm-6.5-4.784c-.312 1.638.26 2.288 1.664 2.288.624 0 1.3-.104 1.716-.286l1.17-6.708c-.416-.286-1.066-.442-1.716-.442-1.248 0-2.054.78-2.34 2.366l-.494 2.782zm23.018 4.628c-1.404.78-2.912 1.118-4.472 1.118-3.51 0-5.642-2.34-4.992-6.032l.572-3.224c.572-3.276 3.172-4.966 6.474-4.966 1.638 0 2.912.494 3.952 1.248.208.156.234.39.078.624l-1.534 1.976c-.182.208-.364.234-.624.078a3.977 3.977 0 0 0-2.002-.546c-1.378 0-2.21.728-2.444 2.002l-.546 3.068c-.312 1.586.39 2.392 1.664 2.392.728 0 1.612-.26 2.444-.754.26-.156.494-.104.624.156l1.014 2.236c.13.26.078.468-.208.624zm7.038-12.558c.702-.338 1.534-.546 2.548-.546 3.042 0 4.758 2.314 4.082 6.162l-1.3 7.306c-.026.26-.208.416-.468.416h-2.99c-.312 0-.468-.208-.416-.494l1.326-7.696c.286-1.508-.208-2.288-1.612-2.288-.624 0-1.274.208-1.742.442l-1.69 9.62c-.052.26-.208.416-.494.416h-2.99c-.286 0-.442-.208-.416-.494l3.146-17.68c.026-.26.182-.416.468-.416h2.99c.286 0 .442.208.39.494l-.832 4.758zm17.411 12.766a16.79 16.79 0 0 1-5.408.91c-3.64 0-5.486-2.08-4.966-4.914.442-2.522 2.574-3.64 5.902-3.64.78 0 1.56.078 2.21.208l.052-.416c.234-1.274-.13-1.976-1.768-1.976-1.144 0-2.314.234-3.094.598-.286.13-.494.078-.598-.208l-.806-2.132c-.078-.234-.078-.416.078-.52 1.248-.754 3.198-1.222 5.304-1.222 3.536 0 5.356 2.34 4.654 6.24l-1.17 6.578c-.052.234-.156.416-.39.494zm-6.5-3.796c-.182.988.442 1.456 1.586 1.456.598 0 1.326-.104 1.794-.208l.364-2.262a8.363 8.363 0 0 0-1.664-.182c-1.274 0-1.95.416-2.08 1.196zM319.973 121h-3.016c-.312 0-.468-.208-.416-.494l2.054-11.804a.689.689 0 0 1 .39-.494c1.508-.702 3.172-1.092 4.81-1.092.702 0 1.404.078 2.158.234.286.052.416.26.364.52l-.468 2.548c-.026.286-.234.416-.52.39a8.81 8.81 0 0 0-1.508-.13c-.676 0-1.248.13-1.69.312l-1.69 9.594c-.052.26-.208.416-.468.416zm12.628-9.906h-2.132l-.884 5.018c-.208 1.17.208 1.794 1.274 1.794h.702c.312-.026.494.104.416.442l-.416 2.418c-.052.26-.182.416-.442.442-.39.078-.884.13-1.326.13-2.886 0-4.732-1.742-4.056-5.538l1.95-11.154c.052-.26.208-.416.494-.416h2.548c.312 0 .468.182.442.468l-.156 3.094h2.08c.312 0 .468.208.416.494l-.416 2.392c-.052.286-.208.416-.494.416zm11.145 6.214c-.52 2.756-2.834 4.03-6.084 4.03-2.158 0-3.848-.572-5.278-1.742-.234-.182-.234-.416-.078-.624l1.482-2.028c.182-.234.39-.26.624-.104a5.554 5.554 0 0 0 3.38 1.118c1.248 0 1.872-.39 2.002-.988.182-.806-.728-1.014-1.768-1.248-2.548-.52-4.576-2.054-4.004-4.862.546-2.626 2.73-3.744 5.876-3.744 1.794 0 3.172.39 4.576 1.196.26.156.286.39.104.624l-1.534 2.054c-.156.234-.364.26-.624.13-.806-.468-1.794-.702-2.886-.702-.962 0-1.56.208-1.664.858-.156.78.676 1.014 1.924 1.3 2.002.442 4.498 1.69 3.952 4.732zm14.205-11.726a7.445 7.445 0 0 0-1.092-.078c-1.092 0-1.716.598-1.95 1.82l-.078.52h2.288c.286 0 .442.182.416.494l-.416 2.392c-.052.26-.208.416-.494.416h-2.392l-1.69 9.438c-.026.26-.182.416-.468.416h-3.016c-.312 0-.468-.208-.416-.494l2.418-13.546c.572-3.224 2.522-4.888 5.746-4.888.598 0 1.196.026 1.638.104.286.052.416.234.364.546l-.442 2.47c-.026.312-.182.416-.416.39zm10.495 10.608c-.598 3.276-2.964 5.148-6.786 5.148-3.484 0-5.59-2.6-4.992-5.902l.546-3.224c.572-3.146 3.12-5.096 6.734-5.096 3.562 0 5.642 2.626 5.096 5.798l-.598 3.276zm-7.878-.364c-.234 1.274.312 2.106 1.534 2.106 1.352 0 2.184-.728 2.392-1.95l.598-3.328c.208-1.17-.338-2.132-1.586-2.132s-2.132.78-2.34 1.95l-.598 3.354zM372.675 121c.26 0 .416-.156.468-.416l1.69-9.594a4.455 4.455 0 0 1 1.69-.312 8.81 8.81 0 0 1 1.508.13c.286.026.494-.104.52-.39l.468-2.548c.052-.26-.078-.468-.364-.52a10.529 10.529 0 0 0-2.158-.234c-1.638 0-3.302.39-4.81 1.092a.689.689 0 0 0-.39.494l-2.054 11.804c-.052.286.104.494.416.494h3.016zm17.091 0h-3.9c-.286 0-.442-.13-.494-.416l-2.6-17.706c-.052-.286.13-.468.416-.468h3.302c.286 0 .468.13.494.416l.936 7.93c.208 1.742.442 4.056.546 5.564h.156c.598-1.482 1.43-3.588 2.184-5.252l3.848-8.32a.606.606 0 0 1 .546-.338h3.588c.338 0 .468.208.312.546l-8.814 17.706a.53.53 0 0 1-.52.338zm16.267-13.52h3.042c.312 0 .442.182.39.468l-2.106 11.882a.604.604 0 0 1-.39.468c-1.612.65-3.588 1.014-5.226 1.014-3.874 0-5.642-2.47-4.992-6.136l1.3-7.306c.052-.26.208-.39.468-.39h3.016c.286 0 .442.182.39.468l-1.3 7.618c-.286 1.612.286 2.366 1.586 2.366.624 0 1.248-.13 1.612-.286l1.742-9.776c.026-.26.208-.39.468-.39zm4.204 4.628c.624-3.406 3.328-4.992 6.474-4.992 3.328 0 5.694 1.768 4.992 5.59l-.442 2.522c-.052.26-.208.39-.468.39h-7.228l-.078.364c-.26 1.378.364 2.054 1.794 2.054 1.144 0 2.34-.416 3.38-1.04.26-.182.468-.156.598.13l1.066 2.002c.104.26.078.494-.156.624-1.404.962-3.172 1.586-5.434 1.586-3.406 0-5.772-2.08-5.174-5.46l.676-3.77zm7.592.91l.13-.65c.182-1.04-.26-1.95-1.586-1.95-1.118 0-1.976.676-2.21 1.898l-.13.702h3.796zm8.259 6.214c-.208 1.17-1.118 2.028-2.47 2.028-1.404 0-2.262-1.144-2.002-2.6.234-1.196 1.144-2.028 2.444-2.028 1.43 0 2.288 1.092 2.028 2.6zm5.217 1.794c-.728 4.108-2.938 5.226-5.538 5.226-.468 0-.884-.052-1.222-.104-.286-.052-.39-.26-.338-.546l.468-2.652c.052-.286.208-.416.442-.39.208.026.442.026.65.026.858 0 1.456-.65 1.69-2.028l2.21-12.688c.052-.26.208-.39.494-.39h3.016c.286 0 .442.182.39.468l-2.262 13.078zm3.12-17.316c.26-1.404-.572-2.444-1.898-2.444-1.17 0-2.054.754-2.288 1.898-.26 1.352.572 2.418 1.898 2.418a2.3 2.3 0 0 0 2.288-1.872zm9.95 13.598c-.52 2.756-2.834 4.03-6.084 4.03-2.158 0-3.848-.572-5.278-1.742-.234-.182-.234-.416-.078-.624l1.482-2.028c.182-.234.39-.26.624-.104a5.554 5.554 0 0 0 3.38 1.118c1.248 0 1.872-.39 2.002-.988.182-.806-.728-1.014-1.768-1.248-2.548-.52-4.576-2.054-4.004-4.862.546-2.626 2.73-3.744 5.876-3.744 1.794 0 3.172.39 4.576 1.196.26.156.286.39.104.624l-1.534 2.054c-.156.234-.364.26-.624.13-.806-.468-1.794-.702-2.886-.702-.962 0-1.56.208-1.664.858-.156.78.676 1.014 1.924 1.3 2.002.442 4.498 1.69 3.952 4.732z",fill:"#39AF77"}})])]),t._v(" "),a("GithubCorner")],1),t._v(" "),a("main",{staticClass:"demo__examples"},[a("frameworks-downloads",{staticClass:"demo__example"}),t._v(" "),a("example3",{staticClass:"demo__example"})],1),t._v(" "),t._m(0)])};L._withStripped=!0;var _=function(){var t=this.$createElement,e=this._self._c||t;return e("a",{staticClass:"github-corner",attrs:{href:"https://github.com/dmtrbrl/vue-trend-chart","aria-label":"View source on GitHub"}},[e("svg",{staticStyle:{fill:"#2F4053",color:"#f8f8f8",position:"absolute",top:"0",border:"0",right:"0"},attrs:{width:"70",height:"70",viewBox:"0 0 250 250","aria-hidden":"true"}},[e("path",{attrs:{d:"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"}}),this._v(" "),e("path",{staticClass:"octo-arm",staticStyle:{"transform-origin":"130px 106px"},attrs:{d:"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2",fill:"currentColor"}}),this._v(" "),e("path",{staticClass:"octo-body",attrs:{d:"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z",fill:"currentColor"}})])])};_._withStripped=!0;a(36);var C=a(1),z=Object(C.a)({},_,[],!1,null,null,null);z.options.__file="demo/components/github-corner.vue";var O=z.exports,A=function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"frameworks"},this._l(this.datasets,function(t,a){return e("framework",{key:a,attrs:{data:t.data,slug:t.slug}})}),1)};A._withStripped=!0;var M=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.data?a("div",{staticClass:"framework",class:t.slug},[a("div",{staticClass:"framework-info"},[a("strong",{staticClass:"framework-info-heading"},[t._v(t._s(t.name))]),t._v(" "),a("span",[t._v(t._s(t.info.label)+": "+t._s(t.info.value))])]),t._v(" "),a("trend-chart",{attrs:{datasets:[{data:t.data,showPoints:!0,fill:!0,className:"curve-"+t.slug}],min:0,padding:"5 5 0",hoverable:!0},on:{onMouseMove:t.onMouseMove}})],1):t._e()};M._withStripped=!0;var P={props:{data:{type:Array,required:!0},slug:{type:String,required:!0}},data:function(){return{currentInfo:null}},computed:{name:function(){return"".concat(this.slug[0].toUpperCase()+this.slug.slice(1))},weeklyDownloads:function(){return this.data.reduce(function(t,e){return t+e.value},0)},info:function(){return{label:this.currentInfo?this.currentInfo.label:"weekly downloads",value:this.currentInfo?this.currentInfo.value:this.weeklyDownloads}}},methods:{onMouseMove:function(t){this.currentInfo=t?{label:t.data[0].day,value:t.data[0].value}:null}}},k=Object(C.a)(P,M,[],!1,null,null,null);k.options.__file="demo/components/framework.vue";var j={components:{Framework:k.exports},data:function(){return{frameworks:["vue","react","angular"],data:null}},computed:{datasets:function(){var t=this;return this.data?this.frameworks.map(function(e){if(t.data[e])return{slug:e,data:t.data[e].downloads.map(function(t){return{value:t.downloads,day:t.day}})}}):null}},methods:{fetchData:function(){var t=this;this.$http.get("https://api.npmjs.org/downloads/range/last-week/".concat(this.frameworks.join(","))).then(function(e){t.data=e.data}).catch(function(t){return console.log(t)})}},mounted:function(){this.fetchData()}},$=(a(37),Object(C.a)(j,A,[],!1,null,null,null));$.options.__file="demo/components/frameworks-downloads.vue";var X=$.exports,Y=function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"example3"},[e("trend-chart",{attrs:{datasets:this.datasets,grid:this.grid,labels:this.labels,min:0,max:500,padding:"0",hoverable:!0},on:{onMouseMove:this.onMouseMove}})],1)};Y._withStripped=!0;var S={data:function(){return{datasets:[{data:[70,100,400,180,100,300,500],smooth:!0,showPoints:!0,fill:!0,className:"curve1"},{data:[150,300,350,100,350,100,15],smooth:!0,showPoints:!0,className:"curve2"},{data:[50,150,200,50,120,250,200],smooth:!0,showPoints:!0,className:"curve3"}],grid:{yAxes:!0,yAxesLines:5},labels:{xLabels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],yLabelsAmount:5,yLabelsTextFormatter:function(t){return Math.round(100*t)/100}}}},methods:{onMouseMove:function(t){console.log(t)}}},T=(a(38),Object(C.a)(S,Y,[],!1,null,null,null));T.options.__file="demo/components/example3.vue";var B={name:"home",components:{GithubCorner:O,FrameworksDownloads:X,example3:T.exports}},E=(a(39),Object(C.a)(B,L,[function(){var t=this.$createElement,e=this._self._c||t;return e("footer",{staticClass:"demo__footer"},[this._v("\n    Released under the\n    "),e("a",{attrs:{href:"#"}},[this._v("MIT")]),this._v(" license.\n    "),e("a",{attrs:{href:"#"}},[this._v("View source")]),this._v(".\n  ")])}],!1,null,null,null));E.options.__file="demo/home.vue";var N=E.exports;n.a.use(c.a,s.a),n.a.use(w),n.a.config.productionTip=!1,new n.a({render:function(t){return t(N)}}).$mount("#app")},5:function(t,e,a){},6:function(t,e,a){}},[[17,2,0]]]);