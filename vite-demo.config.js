import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [vue()],
  root: resolve(__dirname, "demo"),
  build: {
    outDir: resolve(__dirname, "demo-dist"),
  },
  resolve: {
    alias: {
      "vue-trend-chart": resolve(__dirname, "src"),
    },
  },
});
