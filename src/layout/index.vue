<!-- @format -->

<template>
  <div class="w-full">
    <router-view #default="{ Component }">
      <div class="h-[90vh] overflow-scroll w-full" id="home">
        <Transition :name="transitionName" @onAfterLeave="onAfterLeave">
          <keep-alive :include="routerStore.keepAliveList">
            <component :is="Component" />
          </keep-alive>
        </Transition>
      </div>
    </router-view>
    <div class="h-[10vh] w-full">
      <NavigationBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useRouterStore } from '@/store/modules/router'
import router from '@/router'
import { nextTick, ref } from 'vue'

defineOptions({
  name: 'layout',
})

const routerStore = useRouterStore()

const transitionName = ref('')
router.beforeEach((to, from) => {
  transitionName.value = ''
  if (from.path === '/') {
    return
  }
  // 如果是 routerStore.keepAliveList 中的路由 保留滚动位置
  if (from.name === 'home') {
    routerStore.setScrollTop('home', document.getElementById('home')?.scrollTop || 0)
    console.log('document.getElementById', document.getElementById('home')?.scrollTop)
  }
  if (to.path === '/music') {
    transitionName.value = 'slide-up'
    return
  }
  if (from.path === '/music') {
    transitionName.value = 'slide-down'
    return
  }
  const fromUrl = ['/home', '/mine']
  // to 和 from 不能同时在 fromUrl 中
  if (fromUrl.includes(to.path) && fromUrl.includes(from.path)) {
    return
  }
  // to 不在 fromUrl 中，
  if (!fromUrl.includes(to.path)) {
    return
  }

  transitionName.value = fromUrl.includes(from.path) ? 'slide-left' : 'slide-right'
})
router.afterEach((to, from) => {
  // 如果是 routerStore.keepAliveList 中的路由 保留滚动位置
  if (to.name === 'home') {
    nextTick(() => {
      console.log('nextTick 2', routerStore.scrollTop['home'])
      document.getElementById('home')?.scrollTo(0, routerStore.scrollTop['home'])
    })
  }
})
const onAfterLeave = () => {
  console.log('xxx xxx', routerStore.scrollTop['home'])
  document.getElementById('home')?.scrollTo(0, routerStore.scrollTop['home'])
}
</script>

<style scoped lang="scss"></style>
