<!-- @format -->

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { useRouterStore } from '@/store/modules/router'
import { useMusicStore } from '@/store/modules/music'
import { isDark, isPlus } from '@/utils/is'
import { isMobile } from '@/utils/is'
import { useFont } from '@/hooks/useFont'
import { useThrottleFn } from '@/hooks/useFn'
import router from '@/router'
import { ref } from 'vue'
import Player from '@/components/Player/index.vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import ShareMessage from '@/components/shareMessage/index.vue'
import webSee from '@/websee/core'
import { autoRefresh } from '@/utils/refresh'
import { activeRecordScreen } from '@/websee/recordscreen'

window.addEventListener(
  'message',
  (e) => {
    // 当前的域名是http://localhost:5173 return
    const nowHref = window.location.href
    if (nowHref.includes('localhost:5173')) return
    localStorage.setItem('token', e.data)
    routerStore.setKeepAliveList(['home', 'layout'])
    refreshToken()
  },
  false
)

const appStore = useAppStore()
const routerStore = useRouterStore()
const musicStore = useMusicStore()
const userStore = useUserStore()
window.addEventListener('beforeunload', function () {
  console.log('beforeunload')
  activeRecordScreen()
  webSee.log({
    type: '用户关闭页面',
    message: userStore.username + '用户关闭页面',
    error: new Error(),
  })
})
if (isPlus()) {
  window.addEventListener('visibilitychange', function () {
    console.log('visibilitychange')
    if (document.hidden) {
      activeRecordScreen()
      webSee.log({
        type: '安卓端用户隐藏页面',
        message: userStore.username + '用户隐藏页面',
        error: new Error(),
      })
    }
  })
}

const refreshToken = () => {
  userApi.getUserInfo({}).then((res: any) => {
    userStore.setUserData(res || {})
  })
  const token = localStorage.getItem('token')
  const expire = localStorage.getItem('expire') || 0
  const nowTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  if (token && !(nowTime > new Date(expire))) {
    return
  }
  userApi.refreshToken({}).then((res: any) => {
    if (!res) return
    localStorage.setItem('token', res.token)
    localStorage.setItem('expire', res.expire)
  })
}
if (self === top) {
  refreshToken()
}

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  const isDarkTheme = isDark()
  appStore.setIsDark(isDarkTheme)
}

// 设置默认字体大小
const setDefaultFontSize = () => {
  const fontSize = useFont(16)
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

const transitionName = ref('')
router.beforeEach((to, from) => {
  transitionName.value = ''
  if (!from.name) return
  const fromUrl = ['/home', '/mine']
  transitionName.value = fromUrl.includes(from.path) ? '' : 'slide-right'
})

autoRefresh()
appStore.setVersion('0.9.5.6')
</script>

<template>
  <div>
    <ShareMessage />
    <router-view #default="{ Component }">
      <Transition :name="transitionName">
        <keep-alive :include="routerStore.keepAliveList">
          <component :is="Component" />
        </keep-alive>
      </Transition>
    </router-view>
    <Transition name="up-down">
      <Player v-if="musicStore.show" />
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
