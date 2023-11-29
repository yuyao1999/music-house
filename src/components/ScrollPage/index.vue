<template>
  <div class="scroll-content">
    <div class="crosswise" ref="scrollRef">
      <div class="scroll-item">
        <ScrollImg />
      </div>
      <div class="scroll-item">
        <ScrollVideo />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/hooks/useDraggable'
import { onMounted, ref, watch } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import ScrollImg from '@/components/ScrollImg/index.vue'
import ScrollVideo from '@/components/ScrollVideo/index.vue'

const musicStore = useMusicStore()

interface IProps {
  /**
   * 列表
   */
  tabsList: string[]
  /**
   * 当前所在的索引
   */
  currentIndex: number
}
const props = defineProps<IProps>()

onMounted(() => {
  setDraggable(scrollRef.value)
  setTimeout(() => {
    const style = getComputedStyle(scrollRef.value!)
    contentHeight = parseFloat(style.width) || 500
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

const onDragStart = () => {
  console.log('onDragStart page')
}
const onDragEnd = () => {
  if (!scrollRef.value || left.value === 0) return
  // 优化代码
  if (topTips.value || bottomTips.value) {
    // 滚动到顶部或底部 动画
    let distance
    if (topTips.value) {
      distance = 0
    } else {
      distance = (musicStore.musicList.length - 1) * contentHeight
    }
    scrollRef.value.style.transform = `translateX(-${distance}px)`
    scrollRef.value.style.transition = `transform ${transitionTime}ms ease`
    isTransition = true

    setTimeout(() => {
      if (!scrollRef.value) return
      scrollRef.value.style.transition = ``
      isTransition = false
      left.value = 0
      topTips.value = false
      bottomTips.value = false
    }, transitionTime)

    return
  }

  if (left.value < -scrollValue) {
    // 向左滑动
    showIndex.value++
  } else if (left.value > scrollValue) {
    // 向右滑动
    showIndex.value--
  }
  emits('changeIndex', showIndex.value)
  // 切换到下一个数据的位置
  isTransition = true
  scrollRef.value.style.transform = `translateX(-${showIndex.value * contentHeight}px)`
  // 过度动画
  scrollRef.value.style.transition = `transform ${transitionTime}ms ease`
  setTimeout(() => {
    if (!scrollRef.value) return
    scrollRef.value.style.transition = ``
    isTransition = false
  }, transitionTime)
  left.value = 0
}
const { setDraggable, left, setDragDirection } = useDraggable({
  axis: 'x',
  onDragStart,
  onDragEnd,
})

const scrollRef = ref<HTMLDivElement>()
// 当前展示的数据下标
const showIndex = ref(0)
const topTips = ref(false)
const bottomTips = ref(false)
watch(
  () => left.value,
  () => {
    if (!scrollRef.value || left.value === 0) return
    if (showIndex.value === 0 && left.value > 30) {
      topTips.value = true
      return
    } else if (showIndex.value === props.tabsList.length - 1 && left.value < -30) {
      bottomTips.value = true
      return
    }
    if (isTransition) return
    let distance
    distance = showIndex.value * contentHeight + -left.value
    scrollRef.value.style.transform = `translateX(${-distance}px)`
    setDragDirection('x')
  }
)
const emits = defineEmits<{ (e: 'changeIndex', value: number): void }>()

// 切换到指定的索引
const changeScroll = (index: number) => {
  if (!scrollRef.value) return
  showIndex.value = index
  scrollRef.value.style.transform = `translateX(-${showIndex.value * contentHeight}px)`
  scrollRef.value.style.transition = `transform ${transitionTime}ms ease`
  isTransition = true
  setTimeout(() => {
    if (!scrollRef.value) return
    scrollRef.value.style.transition = ``
    isTransition = false
  }, transitionTime)
}
defineExpose({
  changeScroll,
})
</script>

<style scoped lang="scss">
.crosswise {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.scroll-content {
  width: 100%;
  height: 100%;
  overflow: hidden;

  // 取消长按的背景色
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);

  -webkit-user-select: none;

  -moz-user-focus: none;

  -moz-user-select: none;

  .scroll-item {
    position: relative;
    width: 100%;
    height: 100%;
    flex-shrink: 0;

    cursor: pointer;
    padding: 50px;
    p {
      margin-left: 2rem;
    }
  }
}
</style>
