<!-- @format -->

<template>
  <div>
    <router-view #default="{ route, Component }">
      <Transition :name="transitionName">
        <keep-alive :include="routerStore.keepAliveList">
          <component :is="Component" :key="temp(route)" />
        </keep-alive>
      </Transition>
    </router-view>
    <NavigationBar />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useRouterStore } from '@/store/modules/router'
import router from '@/router'
import { ref, computed } from 'vue'

const routerStore = useRouterStore()
const temp = (data: any) => {
  console.log('data 1', data.name)
}

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
</script>

<style scoped lang="scss"></style>
