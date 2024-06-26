<template>
  <div class="scroll-content">
    <div class="w-full h-full" ref="scrollRef">
      <div v-if="topTips" class="text-light-500 text-center mt-12">已经到顶了~</div>
      <div class="scroll-item" v-for="(item, index) in musicStore.mvList" :key="index">
        <span class="name">{{ item.name }}</span>
        <VideoPlayer
          v-if="index === showIndex && item?.mvId"
          ref="videoRef"
          :src="item.mvSrc"
          class="video"
          :controls="false"
          autoplay
          :mute="mute"
        />
        <div class="unmute" v-if="index === 0 && mute" @click="onUnmute">点击取消静音</div>
      </div>
      <div v-if="bottomTips" class="text-light-500 text-center mb-[15vh]">没有更多了~</div>
      <div class="text-light-500 text-xl text-center mt-[45vh]" v-if="musicStore.mvList.length === 0">动态中没有MV</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/hooks/useDraggable'
import { onMounted, ref, watch } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { musicApi } from '@/api/music'
import VideoPlayer from '@/components/VideoPlayer/index.vue'
import { checkAudioPermission } from '@/hooks/useAudio'

const musicStore = useMusicStore()
const videoRef = ref()
const getVideo = async () => {
  if (!musicStore.mvList[showIndex.value]?.mvId) return
  const res: any = await musicApi.getMv({ id: musicStore.mvList[showIndex.value]?.mvId })
  musicStore.supplementMusic({
    id: musicStore.mvList[showIndex.value]?.id,
    mvSrc: res.data?.url || '',
  })
  play()
}
const play = () => {
  const dom: any = videoRef.value?.[0]
  dom?.play && dom.play()
}
const paused = () => {
  const dom: any = videoRef.value?.[0]
  dom?.pause && dom.pause()
}
defineExpose({
  getVideo,
  paused,
})

const mute = ref(true)
if (checkAudioPermission()) mute.value = false

// 打开声音
const onUnmute = () => {
  const dom: any = videoRef.value?.[0]
  if (!dom) return
  dom!.mute = false
  mute.value = false
  play()
}

onMounted(() => {
  setDraggable(scrollRef.value)
  setTimeout(() => {
    const style = getComputedStyle(scrollRef.value!)
    contentHeight = parseFloat(style.height) || 500
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
  if (!scrollRef.value || top.value === 0) return
  // 优化代码
  if (topTips.value || bottomTips.value) {
    // 滚动到顶部或底部 动画
    let distance
    if (topTips.value) {
      distance = 0
    } else {
      distance = (musicStore.mvList.length - 1) * contentHeight
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
  // 如果即不向上滑动也不向下滑动 则不做视频处理
  const nextFlag = top.value > scrollValue || top.value < -scrollValue
  const dom: any = videoRef.value?.[0]
  if (dom && nextFlag) {
    // 记录当前播放时间
    musicStore.supplementMusic({
      id: musicStore.mvList[showIndex.value]?.id,
      currentTime: dom.currentTime,
    })
  }

  if (top.value < -scrollValue) {
    // 向下滑动
    showIndex.value++
    getVideo()
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
    const dom: any = videoRef.value?.[0]
    // 跳转到已经播放的时间
    if (dom && nextFlag) {
      dom.currentTime = musicStore.mvList[showIndex.value]?.currentTime || 0
      dom.play()
    }
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
    // if (!scrollRef.value || Math.abs(top.value) < 5) return
    if (!scrollRef.value || top.value === 0) return
    if (showIndex.value === 0 && top.value > 30) {
      topTips.value = true
      return
    } else if (
      (showIndex.value === musicStore.mvList.length - 1 || musicStore.mvList.length === 0) &&
      top.value < -30
    ) {
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
.unmute {
  position: absolute;
  bottom: 10vh;
  right: 0;
  padding: 0.5rem 1rem;
  background: #41c453bd;
  color: #fff;
  border-radius: 0.5rem 0 0 0.5rem;
  font-size: 1rem;
  z-index: 9999;
}
.scroll-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  user-select: none;

  .scroll-item {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #010101;
    p {
      margin-top: 2rem;
    }
    .name {
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
    }
    .video {
      width: 100%;
      height: 100%;
      height: fit-content;
      object-fit: cover;
    }
  }
}
</style>
