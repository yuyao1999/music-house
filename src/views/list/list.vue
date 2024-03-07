<template>
  <div class="h-[500px]">
    <VirtualList :listData="data" :estimatedItemSize="50" ref="listRef">
      <template #item="{ data }">
        <div class="items">
          {{ data.item?.name }}
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import VirtualList from '@/components/VirtualList/index.vue'
import { onMounted, ref } from 'vue'
import { useReachBottom } from '@/hooks/useReachBottom'
import { useLoading } from '@/hooks/useLoading'
const { showLoading, hideLoading } = useLoading()
const listRef = ref()

const data = ref([] as any)
const page = ref(1)
const size = 30
const getList = () => {
  console.log('getList')
  showLoading()
  setTimeout(() => {
    const res = Array.from({
      length: size,
    }).map((_, index) => {
      const id = (page.value - 1) * size + index
      return {
        id,
        name: `name-${id + 1}`,
      }
    })
    data.value.push(...res)
    data.value[(page.value - 1) * size + Math.floor(Math.random() * size)].name =
      'pdaupdatedupdatedupdatedupdatedupdatedupdatedupdateddupdatedupdatedudupdatedupdatedudupdatedupdateduupdatedupdatedupdatedupdatedupdatedted'
    page.value++
    console.log('getList done')
    hideLoading()
  }, 500)
}
getList()
onMounted(() => {
  useReachBottom({ dom: listRef.value.listRef, callback: getList, distance: 300 })
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
