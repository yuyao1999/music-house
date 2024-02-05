/** @format */

import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useRouterStore = defineStore(
  'router',
  () => {
    const keepAliveList = ref<string[]>()
    const clearKeepAliveList = () => {
      keepAliveList.value = []
    }
    const setKeepAliveList = (list: string[]) => {
      keepAliveList.value = list
    }
    // 需要缓存的路由的滚动位置
    const scrollTop = ref<{ [key: string]: number }>({})
    const setScrollTop = (name: string, top: number) => {
      scrollTop.value[name] = top
    }
    return {
      keepAliveList,
      clearKeepAliveList,
      setKeepAliveList,
      scrollTop,
      setScrollTop,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
