/** @format */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有带yy短横线的标签名都视为自定义元素
          isCustomElement: (tag) => tag.includes('yy-'),
        },
      },
    }),
    WindiCSS(),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
