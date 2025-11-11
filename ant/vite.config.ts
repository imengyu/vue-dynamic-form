import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    dts({ tsconfigPath: './tsconfig.app.json' }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vue-dynamic-form-ant',
      fileName: (format) => `vue-dynamic-form-ant.${format}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'ant-design-vue',
        '@imengyu/vue-dynamic-form',
        '@vuemap/vue-amap',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'ant-design-vue': 'antd',
          '@imengyu/vue-dynamic-form': 'VueDynamicForm',
          '@vuemap/vue-amap': 'VueAMap',
        },
        assetFileNames: 'vue-dynamic-form-ant.[ext]',
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
