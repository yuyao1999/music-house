/** @format */

import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useRouterStore = defineStore('router', () => {
  // 需要缓存的路由
  const keepAliveList = ref<string[]>(['home', 'layout'])
  // 需要缓存的路由的滚动位置
  const scrollTop = ref<{ [key: string]: number }>({})
  const setScrollTop = (name: string, top: number) => {
    scrollTop.value[name] = top
  }
  return {
    keepAliveList,
    scrollTop,
    setScrollTop,
  }
})
