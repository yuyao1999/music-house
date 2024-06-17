<template>
  <div class="scroll-content">
    <div class="crosswise" ref="scrollRef">
      <div class="scroll-item statusBarHeightPaddingTop">
        <ScrollImg v-if="appStore.homeMode === 0" />
        <div v-else class="home-list">
          <HomeList :list="musicStore.musicList" type="home" />
        </div>
      </div>
      <div class="scroll-item statusBarHeightPaddingTop">
        <ScrollVideo ref="videoRef" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/hooks/useDraggable'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import ScrollImg from '@/components/ScrollImg/index.vue'
import ScrollVideo from '@/components/ScrollVideo/index.vue'
import HomeList from '@/components/HomeList/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useShow } from '@/hooks/useShow'
import { useAudio } from '@/hooks/useAudio'
import EventEmitter from '@/utils/eventEmitter'
import { isMobile } from '@/utils/is'

const appStore = useAppStore()
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
const { getMusicUrl, audioPause, audioPlay } = useAudio()
const onShow = () => {
  console.log('onShow page')
  musicStore.setMusicListMode(0)
  musicStore.setMiniShow(true)
  console.log(musicStore.nowMusic, 'musicStore.nowMusic.id ')
  getMusicUrl(musicStore.nowMusic.id || 0)

  if (isMobile()) {
    document.addEventListener('touchend', onTouchEnd)
  } else {
    window.addEventListener('dblclick', onDoubleClick)
  }
}
const onHide = () => {
  if (isMobile()) {
    document.removeEventListener('touchend', onTouchEnd)
  } else {
    window.removeEventListener('dblclick', onDoubleClick)
  }
}

let clickCount = 0
let clickTimer = 0
const onTouchEnd = () => {
  // 如果在250毫秒内再次触发touchend，则认为是双击
  clickCount++
  if (clickCount > 1) {
    EventEmitter.emit('refreshHeadDb')
    clickCount = 0
  }
  clickTimer = window.setTimeout(() => {
    clickCount = 0
    clearTimeout(clickTimer)
  }, 250)
}
const onDoubleClick = () => {
  EventEmitter.emit('refreshHeadDb')
}

onMounted(() => {
  useShow({
    el: scrollRef.value,
    onShow,
    onHide,
  })
  setDraggable(scrollRef.value)
  setTimeout(() => {
    if (!scrollRef.value) return
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
// ScrollVideo组件的ref
const videoRef = ref<InstanceType<typeof ScrollVideo>>()
const onDragStart = () => {}
const onDragEnd = () => {
  if (!scrollRef.value || left.value === 0) return
  if (showIndex.value === props.tabsList.length - 1 && left.value < 0) return
  if (left.value < -scrollValue) {
    // 向左滑动
    showIndex.value++
    emits('changeIndex', showIndex.value)
    musicStore.setMiniShow(false)
    audioPause()
    videoRef.value?.getVideo()
  } else if (left.value > scrollValue) {
    // 向右滑动
    showIndex.value--
    emits('changeIndex', showIndex.value)
    musicStore.setMiniShow(true)
    videoRef.value?.paused()
    audioPlay()
  }
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
const { setDraggable, left } = useDraggable({
  axis: 'x',
  onDragStart,
  onDragEnd,
})

const scrollRef = ref<HTMLDivElement>()
// 当前展示的数据下标
const showIndex = ref(0)
watch(
  () => left.value,
  () => {
    emits('setLeft', left.value)
    if (!scrollRef.value || left.value === 0) return
    if (showIndex.value === 0 && left.value > 0) {
      left.value = 0
      return
    } else if (showIndex.value === props.tabsList.length - 1 && left.value < 0) {
      left.value = 0
      return
    }
    if (isTransition) return
    let distance
    distance = showIndex.value * contentHeight + -left.value
    scrollRef.value.style.transform = `translateX(${-distance}px)`
  }
)
const emits = defineEmits<{
  (e: 'changeIndex', value: number): void
  (e: 'setLeft', value: number): void
}>()
// 切换到指定的索引
const changeScroll = (index: number) => {
  if (!scrollRef.value) return
  if (props.currentIndex === index) {
    if (props.currentIndex === 0 && appStore.homeMode === 0) {
      appStore.setHomeMode(1)
    } else {
      appStore.setHomeMode(0)
    }
  }
  if (index === 1) {
    musicStore.setMiniShow(false)
    audioPause()
    videoRef.value?.getVideo()
  }
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
    background: #010101;
    cursor: pointer;
    p {
      margin-left: 2rem;
    }
  }
}
.home-list {
  color: white;
  margin-top: 8vh;
  padding: 1.5rem;
  height: 100%;
}
</style>
