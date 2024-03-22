<template>
  <div class="app">
    <PageTop title="列表" />
    <div class="container" ref="fContainerRef">
      <VirtualAndWaterfallList
        filed="data"
        :request="getData"
        :gap="25"
        :page-size="20"
        :column="column"
        :enter-size="column * 2"
      >
        <template #item="{ item, style }">
          <Card
            :detail="{
              title: item.name,
              author: item.author,
              imgSrc: item.picUrl,
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
import Card from '@/components/VirtualAndWaterfallList/card.vue'
import VirtualAndWaterfallList from '@/components/VirtualAndWaterfallList/index.vue'
import PageTop from '@/components/PageTop/index.vue'
import { musicApi } from '@/api/music'

const fContainerRef = ref<HTMLDivElement | null>(null)
const column = ref(3)
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
    margin-top: 5rem;
    padding: 1rem;
    width: 100%;
    height: 100%;
  }
}
</style>
