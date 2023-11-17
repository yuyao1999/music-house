<!-- @format -->

<template>
  <div>
    <router-view #default="{ route, Component }">
      <Transition :name="transitionName">
        <keep-alive :include="routerStore.keepAliveList">
          <component :is="Component" />
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
import { ref } from 'vue'

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
