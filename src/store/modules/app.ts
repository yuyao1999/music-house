/** @format */

import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAppStore = defineStore(
  'app',
  () => {
    /**
     * 版本号
     */
    const version = ref('1.0.0')
    const setVersion = (data: string) => {
      version.value = data
    }
    /**
     * 是否黑暗模式
     */
    const isDark = ref(false)
    const setIsDark = (data: boolean) => {
      if (data) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
      } else {
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
      }
      isDark.value = data
    }
    /**
     * 图片主颜色
     */
    const mainColor = ref('')
    const setMainColor = (data: string) => {
      mainColor.value = data
    }
    /**
     * 暗色
     */
    const darkColor = ref('')
    const setDarkColor = (data: string) => {
      darkColor.value = data
    }
    return {
      version,
      setVersion,
      isDark,
      setIsDark,
      mainColor,
      setMainColor,
      darkColor,
      setDarkColor,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
