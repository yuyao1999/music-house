<!-- @format -->

<template>
  <div class="content" @click.prevent>
    <div v-for="(item, index) in list" :key="item.name">
      <div class="item" @click="toUrl(item.url, index)" :class="{ active: index === nowIndex }">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
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
const nowIndex = ref(0)
const toUrl = (url: string, index: number) => {
  nowIndex.value = index
  router.replace(url)
}
//#endregion
</script>

<style scoped lang="scss">
.content {
  @apply w-full h-full flex justify-around items-center;
  background-color: #181818;
  border-top: 1px solid #5f5f5f;
  color: #8f8f8f;
  z-index: 1;
  .item {
    // 悬浮 手
    @apply hover:cursor-pointer;
  }
  .active {
    color: #ffffff !important;
  }
}
</style>
