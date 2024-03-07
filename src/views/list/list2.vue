<template>
  <div class="h-[500px]">
    <WaterFallList ref="listRef" :list="list" :size="size" :columns="3">
      <template #item="{ data }">
        <div class="items" :style="{ height: data.height }">
          {{ data.index }}:
          {{ data.content }}
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
  {
    color: '#76da6e',
    content:
      '打我打打awd带娃啊1233333333333333333333333333333333333333啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊',
  },
  { color: '#76da6e', content: '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊' },
  { color: '#40a988', content: '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊' },
  { color: '#2384c4', content: 'dawddaw' },
  { color: '#2384c4', content: '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊awdad' },
  { color: '#2384c4', content: '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊' },
  {
    color: '#2384c4',
    content:
      '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊',
  },
  { color: '#106ba3', content: 'dawddaw' },
  { color: '#106ba3', content: '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊adwad' },
  { color: '#0a589e', content: 'dawddaw' },
  { color: '#0a4e98', content: 'dawddaw' },
  { color: '#09408c', content: '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊awdawd' },
  { color: '#083680', content: '打我打打awd带娃啊啊啊啊啊啊啊啊我啊打我啊打我啊打我啊打我啊打我啊打我啊我啊' },
] as any)
const addCard = () => {
  showLoading()
  console.log('addCard')
  const res = Array.from({
    length: size,
  }).map((_, index) => {
    return {
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      content: 'content-' + index,
      index,
    }
  })

  setTimeout(() => {
    list.value.push(...res)
    list.value[list.value.length - Math.floor(Math.random() * size)].content =
      'pdaupdatedupdatedupdatedupdatedupdatedupdatedupdateddupdatedupdatedudupdatedupdatedudupdatedupdateduupdatedupdatedupdatedupdatedupdatedted'

    hideLoading()
  }, 500)
}
const size = 10

onMounted(() => {
  useReachBottom({ dom: listRef.value.contentRef, callback: addCard, distance: 300 })
})
</script>

<style scoped lang="scss">
.items {
  min-height: 50px;
  border: 1px solid #ff0404;
  color: #fff;
  white-space: normal;
  word-wrap: break-word;
}
</style>
<style>
#app {
  background: black;
}
</style>
