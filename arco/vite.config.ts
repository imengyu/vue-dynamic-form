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
    dts({
      tsconfigPath: './tsconfig.type.json',
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'vue-dynamic-form-arco',
      fileName: (format) => `vue-dynamic-form-arco.${format}.js`,
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
          '@arco-design/web-vue': 'ArcoDesign',
          '@imengyu/vue-dynamic-form': 'VueDynamicForm',
        },
        assetFileNames: 'vue-dynamic-form-arco.[ext]',
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
