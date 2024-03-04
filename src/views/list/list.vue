<template>
  <div class="h-[500px] mt-20">
    <VirtualList :listData="data" :estimatedItemSize="50">
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

const data = Array.from({ length: 1000 }).map((_, index) => {
  return {
    id: index,
    name: `name-${index + 1}`,
  }
})
data[10].name = 'name-2-updaupdatedupdatedupdatedupdatedupdatedupdatedupdatedupdatedupdatedupdatedupdatedupdatedted'
</script>

<style scoped lang="scss">
.items {
  min-height: 50px;
  // 强制换行
  white-space: normal;
  word-wrap: break-word;
  border: 1px solid #ff0404;
}
</style>
