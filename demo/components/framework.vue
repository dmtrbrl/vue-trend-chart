<template>
  <div class="framework" :class="slug" v-if="data">
    <div class="framework-info">
      <strong class="framework-info-heading">{{name}}</strong>
      <span>{{info.label}}: {{info.value}}</span>
    </div>
    <trend-chart
      :datasets="[{
        data,
        showPoints: true,
        fill: true,
        className: `curve-${slug}`
      }]"
      :min="0"
      padding="5 5 0"
      :hoverable="true"
      @onMouseMove="onMouseMove"
    ></trend-chart>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentInfo: null
    };
  },
  computed: {
    name() {
      return `${this.slug[0].toUpperCase() + this.slug.slice(1)}`;
    },
    weeklyDownloads() {
      return this.data.reduce((a, c) => a + c.value, 0);
    },
    info() {
      return {
        label: this.currentInfo ? this.currentInfo.label : "weekly downloads",
        value: this.currentInfo ? this.currentInfo.value : this.weeklyDownloads
      };
    }
  },
  methods: {
    onMouseMove(params) {
      if (!params) {
        this.currentInfo = null;
        return;
      }
      this.currentInfo = {
        label: params.data[0].day,
        value: params.data[0].value
      };
    }
  }
};
</script>

