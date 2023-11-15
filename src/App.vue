<!-- @format -->

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { isDark } from '@/utils/is'
import { isMobile } from '@/utils/is'
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
if (!isMobile()) window.addEventListener('resize', throttleFn as EventListenerOrEventListenerObject)

setDefaultTheme()

//#region temp
localStorage.setItem('token', '123456789')
// console.log('import.meta.env.VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL)
//#endregion

const getFirstLevelRoute = (route: any) => {
  if (!Array.isArray(route.matched) || route.matched.length === 0) {
    return route
  }
  return route.matched[0]
}
</script>

<template>
  <router-view #default="{ route, Component }">
    <Transition :name="route.name as string || ''" mode="out-in">
      <keep-alive>
        <component :is="Component" :key="getFirstLevelRoute(route).name" v-if="route.meta.keepAlive" />
      </keep-alive>
    </Transition>
    <Transition :name="route.name as string || ''">
      <component :is="Component" :key="getFirstLevelRoute(route).name" v-if="!route.meta.keepAlive" />
    </Transition>
  </router-view>
</template>

<style scoped lang="scss">
.music-enter-active {
  // 从下往上进入
  animation: bounceInUp 0.5s ease-in-out;
}
.home-leave-active {
  animation: bounceInUp 0.1s ease-in-out reverse;
}

// .music-leave-active {
//   animation: fadeOut 0.5s ease-in-out;
// }

// .home-enter-active {
//   animation: fadeOut 0.3s ease-in-out;
// }
// .home-leave-from {
//   animation: fadeOut 0.3s ease-in-out;
// }
// .home-leave-active {
//   animation: bounceInUp 0.3s ease-in-out reverse;
// }
// .home-enter-from {
//   // animation: fadeOut 0.3s ease-in-out;
//   opacity: 1;
// }
@keyframes bounceInUp {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
