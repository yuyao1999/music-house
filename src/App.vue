<!-- @format -->

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useRouterStore } from '@/store/modules/router'
import { useMusicStore } from '@/store/modules/music'
import { isDark } from '@/utils/is'
import { isMobile } from '@/utils/is'
import { useFont, useSetZoom } from '@/hooks/useFont'
import { useThrottleFn } from '@/hooks/useFn'
import router from '@/router'
import { nextTick, ref } from 'vue'
import Music from '@/components/Player/index.vue'
import MiniPlayer from '@/components/MiniPlayer/index.vue'

const appStore = useAppStore()
const routerStore = useRouterStore()
const musicStore = useMusicStore()

musicStore.setShow(false)

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

const transitionName = ref('')
router.beforeEach((to, from) => {
  transitionName.value = ''
  if (!from.name) return
  const fromUrl = ['/home', '/mine']
  transitionName.value = fromUrl.includes(from.path) ? '' : 'slide-right'
})
const onAfterLeave = () => {
  nextTick(() => {
    window.scrollTo(0, routerStore.scrollTop['home'] || 0)
  })
}
</script>

<template>
  <div>
    <router-view #default="{ Component }">
      <Transition :name="transitionName" @after-leave="onAfterLeave">
        <keep-alive :include="routerStore.keepAliveList">
          <component :is="Component" />
        </keep-alive>
      </Transition>
    </router-view>
    <Transition appear enter-active-class="animate__animated animate__bounceInLeft">
      <MiniPlayer v-show="musicStore.miniShow" />
    </Transition>
    <Transition name="up-down">
      <Music v-show="musicStore.show" />
    </Transition>
  </div>
</template>

<style scoped lang="scss"></style>
