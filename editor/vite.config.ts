import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@imengyu/vue-dynamic-form': resolve(__dirname, '../library/main'),
      '@imengyu/vue-dynamic-form-ant': resolve(__dirname, '../ant/src'),
    },
  },
  build: {
    sourcemap: false,
  },
})
