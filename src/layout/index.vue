<!-- @format -->

<template>
  <div>
    <div class="relative w-full h-[93vh] overflow-y-scroll overflow-x-hidden">
      <router-view #default="{ Component }">
        <Transition>
          <keep-alive :include="routerStore.keepAliveList">
            <component :is="Component" />
          </keep-alive>
        </Transition>
      </router-view>
    </div>
    <Transition appear enter-active-class="animate__animated animate__bounceInLeft">
      <MiniPlayer v-show="musicStore.miniShow" />
    </Transition>
    <div class="h-[7vh] sticky bottom-0 w-full">
      <NavigationBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'
import MiniPlayer from '@/components/MiniPlayer/index.vue'
import { useRouterStore } from '@/store/modules/router'
import { useMusicStore } from '@/store/modules/music'

const musicStore = useMusicStore()
const routerStore = useRouterStore()
defineOptions({
  name: 'layout',
})
</script>

<style scoped lang="scss"></style>
