<!-- @format -->

<template>
  <div class="content" @click.prevent>
    <div
      v-for="(item, index) in list"
      :key="item.name"
      class="item"
      @click="toUrl(item.url, index)"
      :class="{ active: index === nowIndex }"
    >
      <span v-if="item.icon">
        <div v-html="item.icon" />
      </span>
      <span v-else>
        {{ item.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, nextTick } from 'vue'
import { useMusicStore } from '@/store/modules/music'
const musicStore = useMusicStore()
const router = useRouter()
//#region 导航栏
const list = [
  {
    name: '首页',
    icon: '',
    url: '/home',
  },
  {
    name: '私人DJ',
    icon: '',
    url: '/dj',
  },
  {
    name: '发布',
    icon: `
<svg t="1706498134069" class="icon" viewBox="0 0 1024 1024" version="1.1"
xmlns="http://www.w3.org/2000/svg" p-id="5274"
width="50" height="50">
<path d="M512 123.4c-214.6 0-388.6 174-388.6 388.6s174 388.6 388.6 388.6 388.6-174 388.6-388.6-174-388.6-388.6-388.6z m165.2 446.9H570.3v106.9c0 32.2-26.1 58.3-58.3 58.3-32.2 0-58.3-26.1-58.3-58.3V570.3H346.8c-32.2 0-58.3-26.1-58.3-58.3 0-32.2 26.1-58.3 58.3-58.3h106.9V346.8c0-32.2 26.1-58.3 58.3-58.3 32.2 0 58.3 26.1 58.3 58.3v106.9h106.9c32.2 0 58.3 26.1 58.3 58.3 0 32.2-26.1 58.3-58.3 58.3z" fill="#B2B2B2" p-id="5275"></path></svg>
    `,
    url: '/publish',
  },
  {
    name: '消息',
    icon: '',
    url: '/message',
  },
  {
    name: '我的',
    icon: '',
    url: '/mine',
  },
]
const nowIndex = ref(0)
// 点击次数
let lastPath = ''
const toUrl = (url: string, index: number) => {
  if (url === '/dj') {
    musicStore.setMusicListMode(3)
    musicStore.setMiniShow(false)
    musicStore.setShow(true)
    return
  }
  if (lastPath === url && url !== '/publish') {
    router.go(0)
    nowIndex.value = index
    return
  }
  lastPath = url

  nowIndex.value = index
  if (url === '/publish') {
    router.push(url)
  } else router.replace(url)
}
nextTick(() => {
  const path = router.currentRoute.value.path
  lastPath = path
  console.log('path', path)
  nowIndex.value = list.findIndex((item) => item.url === path)
})
//#endregion
</script>

<style scoped lang="scss">
.content {
  @apply w-full h-full flex justify-around items-center;
  background-color: #000000;
  border-top: 1px solid #5f5f5f;
  color: #8f8f8f;
  z-index: 1;
  overflow: hidden;
  .item {
    @apply hover:cursor-pointer;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // 扩大点击区域
    //padding: 0 20px;
  }
  .active {
    color: #ffffff !important;
  }
}
</style>
