<template>
  <div class="scroll-content">
    <div class="w-full h-full" ref="scrollRef">
      <div v-if="topTips">已经到顶了~</div>
      <div class="scroll-item" v-for="(item, index) in musicStore.musicList" :key="index">
        <div class="p-5 pb-[10vh] pt-16 w-full h-full flex flex-col items-center">
          <img class="img" :src="item.cover" alt="" />
          <div class="text">
            <div class="text-font">
              {{ item.content }}
            </div>
          </div>
        </div>
        <div class="user">
          <!-- 头像 -->
          <img class="head" src="https://p2.music.126.net/CXr_rIaxkW5kwlIJHd8qSw==/109951168937694185.jpg" />
          <!-- 点赞 -->
          <LoveBtn />
          <!-- 评论 -->
          <svg
            @click="commentOpen"
            t="1702610600185"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8336"
            width="32"
            height="32"
          >
            <path
              d="M157.568 751.296c-11.008-18.688-18.219-31.221-21.803-37.91A424.885 424.885 0 0 1 85.333 512c0-235.637 191.03-426.667 426.667-426.667S938.667 276.363 938.667 512 747.637 938.667 512 938.667a424.779 424.779 0 0 1-219.125-60.502A2786.56 2786.56 0 0 0 272.82 866.4l-104.405 28.48c-23.893 6.507-45.803-15.413-39.285-39.296l28.437-104.288z m65.301 3.787l-17.258 63.306 63.306-17.258a32 32 0 0 1 24.523 3.21 4515.84 4515.84 0 0 1 32.352 18.944A360.79 360.79 0 0 0 512 874.667c200.299 0 362.667-162.368 362.667-362.667S712.299 149.333 512 149.333 149.333 311.701 149.333 512c0 60.587 14.848 118.955 42.827 171.136 3.712 6.912 12.928 22.827 27.37 47.232a32 32 0 0 1 3.34 24.715z m145.995-70.774a32 32 0 1 1 40.917-49.205A159.19 159.19 0 0 0 512 672c37.888 0 73.675-13.173 102.187-36.885a32 32 0 0 1 40.917 49.216A223.179 223.179 0 0 1 512 736a223.179 223.179 0 0 1-143.136-51.69z"
              p-id="8337"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </div>
      <div v-if="bottomTips">没有更多了~</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/hooks/useDraggable'
import { onMounted, ref, watch } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { useAudio } from '@/hooks/useAudio'
import LoveBtn from '@/components/LoveBtn/index.vue'
import { useCommentList } from '@/components/CommentList'

const { getMusicUrl } = useAudio()
const { open: commentOpen } = useCommentList()

const musicStore = useMusicStore()

onMounted(() => {
  setDraggable(scrollRef.value)
  setTimeout(() => {
    // contentHeight = scrollRef.value?.offsetHeight || 500
    // 使用offsetHeight获取元素的高度时，会发现获取的都是整数值，其实这是js自动对其进行了四舍五入，这就导致了获取的结果会出现偏差，使用getComputedStyle，就可以解决这个问题
    const style = getComputedStyle(scrollRef.value!)
    contentHeight = parseFloat(style.height) || 500
  }, transitionTime)
  getMusicUrl(musicStore.nowMusic.id || '0')
  musicStore.changeIndex(showIndex.value)
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
      distance = (musicStore.musicList.length - 1) * contentHeight
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
  musicStore.changeIndexUnlimited(showIndex.value)
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
const { setDraggable, top, setDragDirection } = useDraggable({
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
    } else if (showIndex.value === musicStore.musicList.length - 1 && top.value < -30) {
      bottomTips.value = true
      return
    }
    if (isTransition) return
    let distance
    distance = showIndex.value * contentHeight + -top.value
    scrollRef.value.style.transform = `translateY(${-distance}px)`
    setDragDirection('y')
  }
)
</script>

<style scoped lang="scss">
.scroll-content {
  overflow: hidden;
  width: 100%;
  height: 100%;

  user-select:none .video {
    width: 100%;
    object-fit: cover;
    z-index: 1;
  }
  .scroll-item {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .img {
      width: 80vw;
      height: 80vw;
      object-fit: cover;
      border-radius: 1rem;
      // 不允许用户拖动
      -webkit-user-drag: none;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      -webkit-user-select: none;
      -moz-user-focus: none;
      -moz-user-select: none;
    }
    .text {
      width: 80vw;
      height: 50vh;
      margin-top: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 2rem;
      .text-font {
        color: #ffffff;
        white-space: pre-wrap;
        font-size: 1.15rem;
        line-height: 1.8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 10;
        font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
      }
    }
    .user {
      position: absolute;
      right: 5vw;
      top: 88vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.9rem;
      z-index: 5;
      .head {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
      }
    }
  }
}
</style>
