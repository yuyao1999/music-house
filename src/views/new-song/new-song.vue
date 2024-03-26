<template>
  <div class="app">
    <PageTop title="新歌" />
    <div class="container" ref="fContainerRef">
      <VirtualAndWaterfallList
        :request="getData"
        :gap="25"
        :page-size="20"
        :column="column"
        :enter-size="column * 2"
        filed="data"
      >
        <template #item="{ item, style }">
          <Card
            @click="onCard(item)"
            :detail="{
              title: item.name,
              author: item.artists[0].name,
              imgSrc: item.album.picUrl,
              style,
            }"
          />
        </template>
      </VirtualAndWaterfallList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Card from './card.vue'
import VirtualAndWaterfallList from '@/components/VirtualAndWaterfallList/index.vue'
import PageTop from '@/components/PageTop/index.vue'
import { musicApi } from '@/api/music'
import { useMusicStore } from '@/store/modules/music'
import { useAudio } from '@/hooks/useAudio'

const musicStore = useMusicStore()
const fContainerRef = ref<HTMLDivElement | null>(null)
const column = ref(2)
const fContainerObserver = new ResizeObserver((entries) => {
  changeColumn(entries[0].target.clientWidth)
})

const changeColumn = (width: number) => {
  if (width > 960) {
    column.value = 5
  } else if (width >= 690 && width < 960) {
    column.value = 4
  } else if (width >= 500 && width < 690) {
    column.value = 3
  } else {
    column.value = 2
  }
}

onMounted(() => {
  fContainerRef.value && fContainerObserver.observe(fContainerRef.value)
})

onUnmounted(() => {
  fContainerRef.value && fContainerObserver.unobserve(fContainerRef.value)
})

const getData = (page: number, pageSize: number) => {
  return musicApi.getNewMusic({
    area: 'ZH',
    offset: (page - 1) * pageSize,
    limit: pageSize,
  }) as any
}
const { getMusicSearch } = useAudio()
const onCard = (item: any) => {
  console.log(item)
  musicStore.setMiniShow(false)
  musicStore.setShow(true)
  getMusicSearch(item)
}
</script>

<style scoped lang="scss">
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #010101;
  .container {
    padding: 1rem;
    // padding-top: calc(4rem + var(--statusBarHeight));
    //statusBarHeight 有值则加上状态栏高度 无值则不加
    padding-top: calc(3rem + var(--statusBarHeight, 0px));
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
}
</style>
