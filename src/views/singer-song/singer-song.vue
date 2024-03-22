<template>
  <div class="app">
    <PageTop :title="query?.name as string" :onBack="onBack" />
    <div class="container" ref="fContainerRef">
      <VirtualAndWaterfallList
        isPagination
        :request="getData"
        filed="songs"
        :gap="25"
        :page-size="20"
        :column="column"
        :enter-size="column * 2"
      >
        <template #item="{ item, style }">
          <Card
            @click="onCard(item)"
            :detail="{
              imgSrc: item.imgSrc,
              title: item.name,
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
import { useRoute, useRouter } from 'vue-router'

const musicStore = useMusicStore()
const { query } = useRoute()
const router = useRouter()

const onBack = () => {
  if (query.musicShow) {
    musicStore.setShow(true)
  }
  router.back()
}
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
  return musicApi.singerSongs({
    id: query.id,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    order: 'time',
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
    padding-top: 4rem;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
}
</style>
