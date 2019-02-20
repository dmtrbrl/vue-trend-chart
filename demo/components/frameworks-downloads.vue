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
      frameworks: ["vue", "react", "angular", "hapi", "express", "koa"],
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
  .vtc {
    width: 160px;
    height: 60px;
    margin-right: -5px;
  }
  .stroke {
    stroke-width: 2;
  }
  .fill {
    opacity: 0.2;
  }
  .active-line {
    stroke: rgba(0, 0, 0, 0.2);
  }
  .point {
    display: none;
  }
  .point.is-active {
    display: block;
  }
}
.framework {
  width: 100%;
  @media (max-width: 699px) {
    &:nth-child(n + 2) {
      margin-top: 30px;
    }
    &:nth-child(n + 4) {
      display: none;
    }
  }
  @media (min-width: 700px) {
    width: calc(50% - 25px);
    &:nth-child(2n) {
      margin-left: 50px;
    }
    &:nth-child(n + 3) {
      margin-top: 50px;
    }
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
      white-space: nowrap;
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
  &.hapi {
    border-bottom: 2px solid rgba(#febc6b, 0.2);
  }
  &.express {
    border-bottom: 2px solid rgba(#259dff, 0.2);
  }
  &.koa {
    border-bottom: 2px solid rgba(#33333d, 0.2);
  }
}
.curve-vue {
  .stroke {
    stroke: #39af77;
  }
  .fill {
    fill: #39af77;
  }
  .point {
    fill: #39af77;
    stroke: #39af77;
  }
}
.curve-react {
  .stroke {
    stroke: #61dafb;
  }
  .fill {
    fill: #61dafb;
  }
  .point {
    fill: #61dafb;
    stroke: #61dafb;
  }
}
.curve-angular {
  .stroke {
    stroke: #d8002b;
  }
  .fill {
    fill: #d8002b;
  }
  .point {
    fill: #d8002b;
    stroke: #d8002b;
  }
}
.curve-hapi {
  .stroke {
    stroke: #febc6b;
  }
  .fill {
    fill: #febc6b;
  }
  .point {
    fill: #febc6b;
    stroke: #febc6b;
  }
}
.curve-express {
  .stroke {
    stroke: #259dff;
  }
  .fill {
    fill: #259dff;
  }
  .point {
    fill: #259dff;
    stroke: #259dff;
  }
}
.curve-koa {
  .stroke {
    stroke: #33333d;
  }
  .fill {
    fill: #33333d;
  }
  .point {
    fill: #33333d;
    stroke: #33333d;
  }
}
</style>


