<template>
  <div class="frameworks">
    <framework v-for="(dataset,i) in datasets" :key="i" :data="dataset.data" :slug="dataset.slug"/>
  </div>
</template>

<script>
import Framework from "./framework.vue";
export default {
  components: { Framework },
  data() {
    return {
      frameworks: ["vue", "react", "angular"],
      data: null
    };
  },
  computed: {
    datasets() {
      if (!this.data) return null;
      return this.frameworks
        .filter(f => this.data[f])
        .map(f => {
          return {
            slug: f,
            data: this.data[f].downloads.map(d => {
              return { value: d.downloads, day: d.day };
            })
          };
        });
    }
  },
  methods: {
    fetchData() {
      this.$http
        .get(
          `https://api.npmjs.org/downloads/range/last-week/${this.frameworks.join(
            ","
          )}`
        )
        .then(res => {
          this.data = res.data;
        })
        .catch(error => console.log(error));
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="scss">
.frameworks {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  .vtc {
    width: 160px;
    height: 50px;
    margin-right: -5px;
  }
  .vtc-curve-stroke {
    stroke-width: 2;
  }
  .vtc-curve-fill {
    opacity: 0.2;
  }
  .vtc-active-line {
    stroke: rgba(0, 0, 0, 0.2);
  }
  .vtc-point {
    display: none;
  }
  .vtc-point.is-active {
    display: block;
  }
  .curve-vue {
    .vtc-curve-stroke {
      stroke: #39af77;
    }
    .vtc-curve-fill {
      fill: #39af77;
    }
    .vtc-point {
      fill: #39af77;
      stroke: #39af77;
    }
  }
  .curve-react {
    .vtc-curve-stroke {
      stroke: #61dafb;
    }
    .vtc-curve-fill {
      fill: #61dafb;
    }
    .vtc-point {
      fill: #61dafb;
      stroke: #61dafb;
    }
  }
  .curve-angular {
    .vtc-curve-stroke {
      stroke: #d8002b;
    }
    .vtc-curve-fill {
      fill: #d8002b;
    }
    .vtc-point {
      fill: #d8002b;
      stroke: #d8002b;
    }
  }
}
.framework {
  width: calc(50% - 25px);
  &:nth-child(2n) {
    margin-left: 50px;
  }
  &:nth-child(n + 3) {
    margin-top: 50px;
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__name {
    width: 150px;
  }
  &__period {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    opacity: 0.5;
    &-icon {
      display: block;
      height: 10px;
      width: auto;
      margin-right: 5px;
    }
    &-text {
      font-size: 11px;
      line-height: 16px;
    }
  }
  &__data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  &__downloads {
    font-size: 24px;
  }
  &.vue {
    border-bottom: 2px solid rgba(#39af77, 0.2);
  }
  &.react {
    border-bottom: 2px solid rgba(#61dafb, 0.2);
  }
  &.angular {
    border-bottom: 2px solid rgba(#d8002b, 0.2);
  }
}
</style>


