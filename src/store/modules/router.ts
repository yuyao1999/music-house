/** @format */

import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useRouterStore = defineStore(
  'router',
  () => {
    // 需要缓存的路由
    const keepAliveList = ref<string[]>(['home', 'music', 'layout'])
    return {
      keepAliveList,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
