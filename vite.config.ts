import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import VueRouter from 'vue-router/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwind from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Must be placed before vue()
    VueRouter({
      dts: 'src/typed-router.d.ts'
    }),
    vue(),
    tailwind(),
    vueDevTools(),
  ],
  devtools: {
    apply: "serve"
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  }
})
