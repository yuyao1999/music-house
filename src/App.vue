<!-- @format -->

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useRouterStore } from '@/store/modules/router'
import { isDark } from '@/utils/is'
import { isMobile } from '@/utils/is'
import { useFont, useSetZoom } from '@/hooks/useFont'
import { useThrottleFn } from '@/hooks/useFn'
import router from './router'
import { computed, ref } from 'vue'
const appStore = useAppStore()
const routerStore = useRouterStore()

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
if (!isMobile()) {
  window.addEventListener('resize', throttleFn as EventListenerOrEventListenerObject)
}

setDefaultTheme()

//#region temp
localStorage.setItem('token', '123456789')
// console.log('import.meta.env.VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL)
//#endregion

const fromUrl = ['/home', '/mine']
const transitionName = ref('')
router.beforeEach((to, from) => {
  transitionName.value = ''
  if (from.path === '/') {
    return
  }
  if (to.path === '/music') {
    transitionName.value = 'slide-up'
    return
  }
  if (from.path === '/music') {
    transitionName.value = 'slide-down'
    return
  }
  // to 和 from 不能同时在 fromUrl 中
  if (fromUrl.includes(to.path) && fromUrl.includes(from.path)) {
    return
  }

  transitionName.value = fromUrl.includes(from.path) ? 'slide-left' : 'slide-right'
})

const getFirstLevelRoute = (route: any) => {
  console.log('app route', route)
  if (!Array.isArray(route.matched) || route.matched.length === 0) {
    return route
  }
  return route.matched[0]
}
</script>

<template>
  <router-view #default="{ route, Component }">
    <Transition :name="transitionName">
      <keep-alive :include="routerStore.keepAliveList">
        <component :is="Component" />
      </keep-alive>
    </Transition>
  </router-view>
</template>

<style scoped lang="scss"></style>
