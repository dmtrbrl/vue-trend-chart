<template>
  <section class="framework" :class="slug" v-if="data">
    <header class="framework__header">
      <strong class="framework__name">{{name}}</strong>
    </header>
    <div class="framework__data">
      <div class="framework__data-info">
        <div class="framework__period">
          <svg viewBox="0 0 7.22 11.76" class="framework__period-icon">
            <path d="M4.59 4.94V0H2.62v4.94H0l3.28 4.59 3.94-4.59H4.59zM.11 10.76h7v1h-7z"></path>
          </svg>
          <span class="framework__period-text">{{info.label}}</span>
        </div>
        <strong class="framework__downloads">{{info.value}}</strong>
      </div>
      <trend-chart
        :datasets="[dataset]"
        :min="0"
        padding="5 5 0"
        :hoverable="true"
        @onMouseMove="onMouseMove"
      ></trend-chart>
    </div>
  </section>
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
      return this.numberWithSpaces(this.data.reduce((a, c) => a + c.value, 0));
    },
    dataset() {
      return {
        data: this.data,
        showPoints: true,
        fill: true,
        className: `curve-${this.slug}`
      };
    },
    info() {
      return {
        label: this.currentInfo ? this.currentInfo.label : "weekly downloads",
        value: this.currentInfo ? this.currentInfo.value : this.weeklyDownloads
      };
    }
  },
  methods: {
    numberWithSpaces(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    onMouseMove(params) {
      if (!params) {
        this.currentInfo = null;
        return;
      }
      this.currentInfo = {
        label: params.data[0].day,
        value: this.numberWithSpaces(params.data[0].value)
      };
    }
  }
};
</script>

