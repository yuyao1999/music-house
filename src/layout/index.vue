<!-- @format -->

<template>
  <div>
    <router-view #default="{ route, Component }">
      <Transition :name="route.name as string || ''" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" v-if="route.meta.keepAlive" />
        </keep-alive>
      </Transition>
      <component :is="Component" :key="route.fullPath" v-if="!route.meta.keepAlive" />
    </router-view>
    <NavigationBar />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'

const onEnter = (routeName: string) => {
  console.log('routeName', routeName)
}
</script>

<style scoped lang="scss">
.home-enter-active {
  animation: fadeOut 0.5s ease-in-out reverse;
}
// .home-leave-active {
//   animation: fadeOut 0.5s ease-in-out;
// }
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
