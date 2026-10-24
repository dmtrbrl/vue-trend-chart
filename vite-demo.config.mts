import { defineConfig } from "vite";
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "",
  plugins: [vue()],
  root: resolve(import.meta.dirname, "demo"),
  build: {
    outDir: resolve(import.meta.dirname, "demo-dist"),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "vue-trend-chart": resolve(import.meta.dirname, "src/index.ts"),
    },
  },
});
