import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@imengyu/vue-dynamic-form': resolve(__dirname, '../library/main')
    },
  },
})