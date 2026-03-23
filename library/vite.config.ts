import { fileURLToPath, resolve, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(), 
    // 必须包含 .vue，否则 main.ts 引用 .vue 时会在生成 d.ts 阶段报 TS6307（文件不在项目 file list 内）
    dts({
      include: ['./**/*.ts', './**/*.vue'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  build: {
    lib: {
      entry: 'main.ts',
      name: 'vue-dynamic-form',
      fileName: (format) => `vue-dynamic-form.${format}.js`,
    },
    outDir: '../dist',
    sourcemap: true,
    minify: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
