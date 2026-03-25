import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ tsconfigPath: './tsconfig.type.json' }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vue-dynamic-form-rich',
      fileName: (format) => `vue-dynamic-form-rich.${format}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        '@imengyu/vue-dynamic-form',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          '@imengyu/vue-dynamic-form': 'VueDynamicForm',
          '@vuemap/vue-amap': 'VueAMap',
        },
        assetFileNames: 'vue-dynamic-form-rich.[ext]',
      },
    },
    sourcemap: true,
    outDir: './lib',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
