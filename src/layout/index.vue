<!-- @format -->

<template>
  <div class="w-full h-[93vh]">
    <router-view #default="{ Component }">
      <Transition>
        <keep-alive :include="routerStore.keepAliveList">
          <component :is="Component" />
        </keep-alive>
      </Transition>
    </router-view>
    <div class="h-[7vh] sticky bottom-0 w-full">
      <NavigationBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useRouterStore } from '@/store/modules/router'

const routerStore = useRouterStore()
defineOptions({
  name: 'layout',
})
</script>

<style scoped lang="scss"></style>
