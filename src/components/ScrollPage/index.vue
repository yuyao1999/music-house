<template>
  <div class="scroll-content">
    <div class="w-full h-full" ref="scrollRef">
      <div v-if="topTips">已经到顶了~</div>
      <div class="scroll-item" v-for="(item, index) in data" :key="index">
        <img :src="item.img" alt="" />
        <p>{{ item.name }}</p>
        <slot name="music" />
      </div>
      <div v-if="bottomTips">没有更多了~</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/hooks/useDraggable'
import { nextTick, onMounted, ref, watch } from 'vue'

interface IData {
  name: string
  img: string
}

interface IProps {
  data: IData[]
}
const props = defineProps<IProps>()

onMounted(() => {
  console.log('onMounted scrollPage')
  setDraggable(scrollRef.value)

  setTimeout(() => {
    // contentHeight = scrollRef.value?.offsetHeight || 500
    // 使用offsetHeight获取元素的高度时，会发现获取的都是整数值，其实这是js自动对其进行了四舍五入，这就导致了获取的结果会出现偏差，使用getComputedStyle，就可以解决这个问题
    const style = getComputedStyle(scrollRef.value!)
    console.log('style', style.height)
    contentHeight = parseFloat(style.height) || 500
    console.log('contentHeight 2', contentHeight)
  }, transitionTime)
})

// 滑动距离切换的值
const scrollValue = 50
// 动画时间
const transitionTime = 500
// 动画正在执行
let isTransition = false
// 容器高度
let contentHeight = 0

const onDragStart = () => {}
const onDragEnd = () => {
  if (!scrollRef.value) return
  // 优化代码
  if (topTips.value || bottomTips.value) {
    // 滚动到顶部或底部 动画
    let distance
    if (topTips.value) {
      distance = 0
    } else {
      distance = (props.data.length - 1) * contentHeight
    }
    scrollRef.value.style.transform = `translateY(-${distance}px)`
    scrollRef.value.style.transition = `transform ${transitionTime}ms ease`
    isTransition = true

    setTimeout(() => {
      if (!scrollRef.value) return
      scrollRef.value.style.transition = ``
      isTransition = false
      top.value = 0
      topTips.value = false
      bottomTips.value = false
    }, transitionTime)

    return
  }
  if (top.value < -scrollValue) {
    // 向下滑动
    showIndex.value++
  } else if (top.value > scrollValue) {
    // 向上滑动
    showIndex.value--
  }
  // 切换到下一个数据的位置
  isTransition = true
  scrollRef.value.style.transform = `translateY(-${showIndex.value * contentHeight}px)`
  // 过度动画
  scrollRef.value.style.transition = `transform ${transitionTime}ms ease`
  setTimeout(() => {
    if (!scrollRef.value) return
    scrollRef.value.style.transition = ``
    isTransition = false
  }, transitionTime)
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
const bottomTips = ref(false)

watch(
  () => top.value,
  () => {
    if (!scrollRef.value || top.value === 0) return
    if (showIndex.value === 0 && top.value > 30) {
      topTips.value = true
      return
    } else if (showIndex.value === props.data.length - 1 && top.value < -30) {
      bottomTips.value = true
      return
    }
    if (isTransition) return
    let distance
    distance = showIndex.value * contentHeight + -top.value
    scrollRef.value.style.transform = `translateY(${-distance}px)`
  }
)
</script>

<style scoped lang="scss">
.scroll-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  .scroll-item {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    img {
      margin-top: 2rem;
      width: 100%;
      height: 50%;
      object-fit: cover;
      -webkit-user-drag: none;
    }
    p {
      margin-top: 2rem;
    }
  }
}
</style>
