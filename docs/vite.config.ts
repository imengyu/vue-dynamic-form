import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
export default defineConfig({
  plugins: [
    vueJsx()
  ],
  resolve: {
    alias: {
      '@imengyu/vue-dynamic-form': resolve(__dirname, '../library/main')
    },
  },
})