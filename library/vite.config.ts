import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(), 
    dts(),
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
