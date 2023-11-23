<template>
  <div class="scroll-content">
    <div class="w-full h-full" ref="scrollRef">
      <div v-if="topTips">已经到顶了</div>
      <div class="scroll-item" v-for="(item, index) in data" :key="index">
        <img :src="item.img" alt="" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/hooks/useDraggable'
import { onMounted, ref, watch } from 'vue'

interface IData {
  name: string
  img: string
}

interface IProps {
  data: IData[]
}
defineProps<IProps>()

onMounted(() => {
  console.log('onMounted scrollPage')
  setDraggable(scrollRef.value)
})

// 滑动距离切换的值
const scrollValue = 30
// 动画时间
const transitionTime = 300
const onDragStart = () => {
  console.log('onDragStart')
  console.log('top', top.value)
}
const onDragEnd = () => {
  if (!scrollRef.value) return
  console.log('onDragEnd')
  console.log('top', top.value)
  if (topTips.value) {
    // 滚动到顶部 动画
    scrollRef.value.style.transform = `translateY(0px)`
    // 过度动画
    scrollRef.value.style.transition = `transform 0.3s ease`
    setTimeout(() => {
      if (!scrollRef.value) return
      scrollRef.value.style.transition = ``
    }, transitionTime)
    top.value = 0
    topTips.value = false
    return
  }
  // 差值超过 scrollValue 时，切换数据 切换动画
  // 向下是负数 向上是正数 超过时切换数据 滑动一个数据的高度
  if (top.value < -scrollValue) {
    console.log('向下滑动')
    // 向下滑动
    showIndex.value++
    // 切换到下一个数据的位置
    scrollRef.value.style.transform = `translateY(-${showIndex.value * 100}%)`
    // 过度动画
    scrollRef.value.style.transition = `transform 0.3s ease`
    setTimeout(() => {
      if (!scrollRef.value) return
      scrollRef.value.style.transition = ``
    }, transitionTime)
  } else if (top.value > scrollValue) {
    console.log('向上滑动')
    // 向上滑动
    showIndex.value--
    // 切换到上一个数据的位置
    scrollRef.value.style.transform = `translateY(-${showIndex.value * 100}%)`
    // 过度动画
    scrollRef.value.style.transition = `transform 0.3s ease`
    setTimeout(() => {
      if (!scrollRef.value) return
      scrollRef.value.style.transition = ``
    }, transitionTime)
  }
  top.value = 0
}
const { setDraggable, top } = useDraggable({
  axis: 'y',
  onDragStart,
  onDragEnd,
})

const scrollRef = ref<HTMLDivElement>()
// 当前展示的数据下标
const showIndex = ref(0)
const topTips = ref(false)

watch(
  () => top.value,
  () => {
    if (!scrollRef.value) return
    if (showIndex.value === 0 && top.value > 30) {
      topTips.value = true
    } else {
      scrollRef.value.style.transform = `translateY(${top.value}px)`
    }
  }
)
</script>

<style scoped lang="scss">
.scroll-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .scroll-item {
    width: 100%;
    height: 100%;
  }
}
</style>
