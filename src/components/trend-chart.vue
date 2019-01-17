<template>
  <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg">
    <path
      v-if="d"
      :d="d"
      fill="none"
      :stroke="stroke"
      :stroke-dasharray="strokeDashArray"
      ref="path"
    ></path>
  </svg>
</template>

<script>
import { genPoints, genPath } from "../helpers/path";

export default {
  name: "TrendChart",
  props: {
    autoDraw: Boolean,
    autoDrawDuration: {
      default: 2000,
      type: Number
    },
    autoDrawEasing: {
      default: "ease",
      type: String
    },
    data: {
      required: true,
      type: Array
    },
    width: {
      default: 300,
      type: Number
    },
    height: {
      default: 75,
      type: Number
    },
    max: {
      default: -Infinity,
      type: Number
    },
    min: {
      default: Infinity,
      type: Number
    },
    padding: {
      default: 10,
      type: Number
    },
    radius: {
      default: 15,
      type: Number
    },
    smooth: Boolean,
    stroke: {
      default: "black",
      type: String
    },
    strokeDashArray: {
      type: String
    }
  },
  computed: {
    boundary() {
      return {
        minX: this.padding,
        minY: this.padding,
        maxX: this.width - this.padding,
        maxY: this.height - this.padding
      };
    },
    points() {
      return genPoints(this.data, this.boundary, this.max, this.min);
    },
    d() {
      return genPath(this.points, this.smooth ? this.radius : 0);
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (this.$isServer || !this.$refs.path || !this.autoDraw) {
            return;
          }

          const path = this.$refs.path;
          const length = path.getTotalLength();

          path.style.transition = "none";
          path.style.strokeDasharray = length + " " + length;
          path.style.strokeDashoffset = Math.abs(
            length - (this.lastLength || 0)
          );
          path.getBoundingClientRect();
          path.style.transition = `stroke-dashoffset ${
            this.autoDrawDuration
          }ms ${this.autoDrawEasing}`;
          path.style.strokeDashoffset = 0;
          this.lastLength = length;
        });
      }
    }
  }
};
</script>
