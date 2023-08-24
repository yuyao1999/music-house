<!-- @format -->

<template>
  <div class="content">
    <div v-for="item in list" :key="item.name">
      <div class="item" @click="toUrl(item.url)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

//#region 导航栏
const list = [
  {
    name: '首页',
    icon: 'home',
    url: '/home',
  },
  {
    name: '我的',
    icon: 'mine',
    url: '/mine',
  },
]
const toUrl = (url: string) => {
  router.replace(url)
}
//#endregion
</script>

<style scoped lang="scss">
.content {
  @apply fixed  w-full h-[5%];
  @apply flex justify-around items-center;
  bottom: 0;
  background-color: #9e9a9a;
  .item {
    // 悬浮 手
    @apply hover:cursor-pointer;
  }
}
</style>
