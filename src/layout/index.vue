<!-- @format -->

<template>
  <div class="w-full">
    <router-view #default="{ Component }">
      <div class="mb-[10vh] w-full">
        <Transition @after-leave="onAfterLeave">
          <keep-alive :include="routerStore.keepAliveList">
            <component :is="Component" />
          </keep-alive>
        </Transition>
      </div>
    </router-view>
    <div class="h-[10vh] fixed bottom-0 w-full">
      <NavigationBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'
import { useRouterStore } from '@/store/modules/router'
import router from '@/router'
import { nextTick } from 'vue'

const routerStore = useRouterStore()
defineOptions({
  name: 'layout',
})
const onAfterLeave = () => {
  window.scrollTo(0, routerStore.scrollTop['home'])
}
</script>

<style scoped lang="scss"></style>
