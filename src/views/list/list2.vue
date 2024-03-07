<template>
  <div class="h-[500px]">
    <WaterFallList ref="listRef" :list="list" :size="size" :columns="3">
      <template #item="{ data }">
        <div class="items" :style="{ height: data.height }">
          {{ data.index }}
        </div>
      </template>
    </WaterFallList>
  </div>
</template>

<script setup lang="ts">
import WaterFallList from '@/components/WaterfallList/index.vue'
import { onMounted, ref } from 'vue'
import { useReachBottom } from '@/hooks/useReachBottom'
import { useLoading } from '@/hooks/useLoading'
const { showLoading, hideLoading } = useLoading()
const listRef = ref()
const list = ref([
  { color: '#76da6e', height: '120px' },
  { color: '#76da6e', height: '120px' },
  { color: '#40a988', height: '170px' },
  { color: '#2384c4', height: '420px' },
  { color: '#2384c4', height: '420px' },
  { color: '#2384c4', height: '420px' },
  { color: '#2384c4', height: '420px' },
  { color: '#106ba3', height: '80px' },
  { color: '#106ba3', height: '80px' },
  { color: '#0a589e', height: '110px' },
  { color: '#0a4e98', height: '90px' },
  { color: '#09408c', height: '100px' },
  { color: '#083680', height: '130px' },
] as any)
const addCard = () => {
  console.log('addCard')
  const res = Array.from({
    length: size,
  }).map((_, index) => {
    return {
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      height: Math.floor(Math.random() * 100 + 100) + 'px',
      index,
    }
  })
  list.value.push(...res)
}
const page = ref(1)
const size = 10

onMounted(() => {
  useReachBottom({ dom: listRef.value.contentRef, callback: addCard, distance: 300 })
})
</script>

<style scoped lang="scss">
.items {
  min-height: 50px;
  // 强制换行
  white-space: normal;
  word-wrap: break-word;
  border: 1px solid #ff0404;
  color: #fff;
}
</style>
<style>
#app {
  background: black;
}
</style>
