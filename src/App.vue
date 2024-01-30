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
import { useUserStore } from '@/store/modules/user'

const appStore = useAppStore()
const routerStore = useRouterStore()
const musicStore = useMusicStore()
const userStore = useUserStore()

userStore.setUserData({
  id: '1',
  username: '小明',
  mobile: '123456789',
  avatar: 'https://p2.music.126.net/CXr_rIaxkW5kwlIJHd8qSw==/109951168937694185.jpg',
  profile: '的哇大大我打',
  like: 500,
  fans: 0,
  follow: 10,
})

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
// const isFullScreen = ref(false)
// // 全屏
// const fullScreen = () => {
//   isFullScreen.value = true
//   document.documentElement.requestFullscreen()
// }
</script>

<template>
  <div>
    <!-- <view v-if="!isFullScreen" class="full" @click="fullScreen">点击全屏显示</view> -->
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

<style scoped lang="scss">
.full {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #000000bd;
  color: #fff;
  text-align: center;
  line-height: 100vh;
  font-size: 2rem;
}
</style>
