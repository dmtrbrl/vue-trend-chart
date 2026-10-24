import { defineConfig } from "vite";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";

// The ES build exposes named exports; the UMD build keeps the plugin itself as
// the module value (window.VueTrendChart / require()), as in previous versions.
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const umd = mode === "umd";
  return {
    plugins: [vue()],
    build: {
      emptyOutDir: !umd,
      lib: {
        entry: resolve(
          import.meta.dirname,
          umd ? "src/umd.ts" : "src/index.ts",
        ),
        name: "VueTrendChart",
        formats: [umd ? "umd" : "es"],
        fileName: () =>
          umd ? "vue-trend-chart.umd.js" : "vue-trend-chart.mjs",
      },
      rolldownOptions: {
        external: ["vue"],
        output: {
          globals: {
            vue: "Vue",
          },
        },
      },
    },
  };
});
