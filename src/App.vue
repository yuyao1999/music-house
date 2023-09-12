<!-- @format -->

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { isDark } from '@/utils/is'
import { useFont, useSetZoom } from '@/hooks/useFont'
import { useThrottleFn } from '@/hooks/useFn'
const appStore = useAppStore()

useSetZoom()

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  const isDarkTheme = isDark()
  appStore.setIsDark(isDarkTheme)
}

// 设置默认字体大小
const setDefaultFontSize = () => {
  const fontSize = useFont(16)
  console.log('fontSize', fontSize)
  // 设置根元素字体大小
  document.documentElement.style.fontSize = fontSize + 'px'
}
setDefaultFontSize()
const throttleFn = useThrottleFn(setDefaultFontSize, 250)
// 窗口大小改变时重新设置字体大小
window.addEventListener('resize', throttleFn as EventListenerOrEventListenerObject)

setDefaultTheme()

//#region temp
localStorage.setItem('token', '123456789')
// console.log('import.meta.env.VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL)
//#endregion
</script>

<template>
  <div>
    <router-view />
  </div>
</template>

<style scoped lang="scss"></style>
