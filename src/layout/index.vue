<!-- @format -->

<template>
  <div>
    <router-view #default="{ route, Component }">
      <Transition :name="transitionName">
        <keep-alive>
          <component :is="Component" :key="getFirstLevelRoute(route).name" v-if="route.meta.keepAlive" />
        </keep-alive>
      </Transition>
      <component :is="Component" :key="getFirstLevelRoute(route).name" v-if="!route.meta.keepAlive" />
    </router-view>
    <NavigationBar />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'
import router from '@/router'
import { ref } from 'vue'

const getFirstLevelRoute = (route: any) => {
  if (!Array.isArray(route.matched) || route.matched.length === 0) {
    return route
  }
  return route.matched[0]
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

  transitionName.value = fromUrl.includes(from.path) ? 'slide-left' : 'slide-right'
})
</script>

<style scoped lang="scss"></style>
