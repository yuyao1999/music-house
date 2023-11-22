<!-- @format -->

<template>
  <div class="w-full">
    <router-view #default="{ Component }">
      <div class="pb-[10vh] w-full">
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
import { nextTick } from 'vue'
import router from '@/router'

const routerStore = useRouterStore()
defineOptions({
  name: 'layout',
})

let namePage = ''
router.beforeEach((to, from) => {
  namePage = to.name as string
})
const onAfterLeave = () => {
  console.log('routerStore.scrollTop[namePage]', routerStore.scrollTop[namePage])
  nextTick(() => {
    window.scrollTo(0, routerStore.scrollTop[namePage] || 0)
  })
}
</script>

<style scoped lang="scss"></style>
