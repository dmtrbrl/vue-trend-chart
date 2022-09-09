import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
          entry: resolve(__dirname, 'src/index.js'),
          name: 'VueTrendChart',
          // the proper extensions will be added
          fileName: 'vue-trend-chart'
        },
        rollupOptions: {
          // make sure to externalize deps that shouldn't be bundled
          // into your library
          external: ['vue'],
          output: {
            // Provide global variables to use in the UMD build
            // for externalized deps
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
})