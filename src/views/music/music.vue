<template>
  <div>
    <div class="page">
      <!-- 头部 -->
      <div class="flex justify-between items-center w-full">
        <div>返回</div>
        <div class="flex flex-col items-center w-[80%]">
          <div class="name">{{ musicStore.nowMusic.name }}</div>
          <div>{{ musicStore.nowMusic.singer }}</div>
        </div>
        <div>分享</div>
      </div>
      <!-- 图片 -->
      <div v-show="!fullScreen" class="flex justify-center items-center mt-5" @click="onSwitchFullScreen">
        <img class="w-[30vh] h-[30vh] rounded-[50%] music-img" :src="musicStore.nowMusic.cover" alt="" />
      </div>
      <!-- 歌词 -->
      <div :class="{ 'lyrics-active': manualScroll }">
        <div class="lyrics" ref="lyricsRef" @click="onSwitchFullScreen">
          <div class="top" />

          <div v-for="(item, index) in lyrics" :key="item.uid" :class="{ active: index === lyricsIndex }" class="item">
            {{ item.lyric }}
          </div>
          <div class="bottom" />
        </div>
      </div>

      <!-- 进度条 -->
      <div class="flex items-center justify-center">
        <!-- 当前时长 -->
        <div class="text-sm">{{ formatTime(currentTime) }}</div>
        <!-- 音乐进度条 -->
        <div class="progress-bar hover:cursor-pointer" @click.stop="mousedownBar" ref="barRef">
          <div class="dot" @mousedown="onDot" ref="dotRef"></div>
        </div>
        <!-- 总时长 -->
        <div class="text-sm">{{ formatTime(audio?.duration) }}</div>
      </div>
      <!-- 播放按钮 -->
      <div class="flex justify-between items-center">
        <div class="hover:cursor-pointer">上一首</div>
        <div v-if="getAudioStatus()" class="hover:cursor-pointer" @click="audioPause">暂停</div>
        <div v-else class="hover:cursor-pointer" @click="audioPlay">播放</div>
        <div class="hover:cursor-pointer">上一首</div>
      </div>
      <!-- 歌词全屏 -->
      <div class="flex justify-center items-center pb-1" @click="onSwitchFullScreen">
        <!-- <div class="text-gray-500" :class="{ 'text-white! font-600': fullScreen }">词</div> -->
        <div :class="fullScreen ? 'text-white font-600' : 'text-gray-500'">词</div>
      </div>
    </div>
    <div class="bg" />
  </div>
</template>

<script setup lang="ts">
import { musicApi } from '@/api/music'
import { formatMusicLyrics } from '@/utils/handle-lyrics'
import { useScroll } from '@/hooks/useScroll'
import { useFont } from '@/hooks/useFont'
import { formatTime, getPercent, getNowTime } from '@/utils/handle-time'
import { getImgColor, getDarkColor } from '@/utils/img'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { useAudio, audioPlay, audioPause, getAudioStatus } from '@/hooks/useAudio'
import { useDraggable } from '@/hooks/useDraggable'
import { ILyric } from '@/types/lyric'
import { useRoute } from 'vue-router'
const musicStore = useMusicStore()

// 搜索
const getMusicSearch = (name: string) => {
  let keyword = name
  musicApi.search({ keywords: keyword }).then((res: any) => {
    const data = res.result.songs[0]
    musicStore.setNowMusic({
      id: data.id,
      name: data.name,
      singer: data.artists[0].name,
    })
    getMusicDetail()
    getMusicLyric()
    getMusicUrl()
  })
}

// 获取路由参数
const route = useRoute()
console.log('route', route.query)
getMusicSearch(route.query.msg as string)

//#region 歌曲

// 图片主色调
const mainColor = ref('')
// 界面暗色调
const darkColor = computed(() => {
  return getDarkColor(mainColor.value)
})

const getMusicDetail = () => {
  musicApi.detail({ ids: musicStore.nowMusic?.id }).then((res: any) => {
    const data = res.songs[0]?.al?.picUrl
    musicStore.setNowMusic({
      cover: data,
    })
    getImgColor(data).then((res: any) => {
      mainColor.value = res
    })
  })
}
//获取歌词
const getMusicLyric = () => {
  musicApi.getLyric({ id: musicStore.nowMusic?.id }).then((res: any) => {
    const { lyric } = formatMusicLyrics(res.lrc.lyric)
    lyrics.value = lyric
  })
}
//获取歌曲url
const getMusicUrl = () => {
  musicApi.getMusicUrl({ id: musicStore.nowMusic?.id }).then((res: any) => {
    const audioTemp = useAudio(res.data[0].url, handleTimeUpdate)
    audioTemp.oncanplay = () => {
      audio.value = audioTemp
    }
  })
}

const audio = ref<HTMLAudioElement>()
const dotRef = ref<HTMLDivElement>()
//#endregion

//#region 页面周期
onMounted(() => {
  console.log('onMounted')
  initScroll(lyricsRef.value)
  setDraggable(dotRef.value)
})
onUnmounted(() => {
  console.log('onUnmounted')
})
//#endregion

//#region 歌词

const lyrics = ref<ILyric[]>([])
const lyricsRef = ref<HTMLDivElement>()

// 歌词全屏
const fullScreen = ref(false)
const lyricsShowCount = ref(2)

// 切换
const onSwitchFullScreen = () => {
  fullScreen.value = !fullScreen.value
  if (fullScreen.value) {
    lyricsShowCount.value = 9
    nowActiveIndex = 4
  } else {
    lyricsShowCount.value = 2
    nowActiveIndex = 0
  }
}

// 当前歌词索引
const lyricsIndex = ref(0)

// 当前歌词居中索引
let nowActiveIndex = 0
// 歌词高度 40 60
let lyricsHeight = useFont(40)
if (lyricsHeight === -1) {
  lyricsHeight = 40
}
// 正在播放的歌词高度
let lyricsActiveHeight = lyricsHeight * 1.5

// 监听歌词滚动
const handleLyricsScroll = () => {
  // 唱完一句歌词后，歌词滚动
  const index = getLyricsIndex(currentTime.value)
  if (index === lyricsIndex.value) {
    return
  }

  lyricsIndex.value = index
  const lyricsDom = lyricsRef.value

  if (lyricsDom) {
    // 滚动到中间
    if (index > nowActiveIndex && !manualScroll.value) {
      // 平滑滚动
      const height = lyricsHeight
      lyricsDom.scrollTo({
        top: (index - nowActiveIndex) * height,
        behavior: 'smooth',
      })
    }
  }
}
/**
 * 根据当前播放时间，获取对应的歌词的索引
 */
const getLyricsIndex = (currentTime: number) => {
  let index = 0
  for (let i = 0; i < lyrics.value.length; i++) {
    if (currentTime > lyrics.value[i].time) {
      index = i
      // 为什么不跳出循环，因为可能有多个歌词的时间小于当前播放时间
    }
  }
  return index
}

const handleTimeUpdate = () => {
  currentTime.value = audio.value?.currentTime || 0
  handleLyricsScroll()
}

//歌词拖动
const { manualScroll, initScroll } = useScroll({})

//#endregion

//#region 进度条
const currentTime = ref(0)
const barRef = ref<HTMLDivElement>()

const onDragStart = () => {
  console.log('onDragStart')
}
const onDragEnd = () => {
  console.log('onDragEnd')
  handleProgress(getPercent(left.value, progressWidth.value) * 0.01)
}

// 点击进度条 跳转到对应的时间
const mousedownBar = (e: any) => {
  const barDom = barRef.value
  if (barDom) {
    const left = e.pageX - barDom.getBoundingClientRect().left
    setPosition(left)
    handleProgress(getPercent(left, progressWidth.value) * 0.01)
  }
}
const onDot = (e: any) => {
  console.log('onDot')
  const barDom = barRef.value
  if (barDom) {
    const left = e.pageX - barDom.getBoundingClientRect().left
    console.log('left', left)
    setPosition(left)
  }
}

const handleProgress = (percent: number) => {
  if (audio.value) {
    audio.value.currentTime = getNowTime(percent, audio.value?.duration)
    // 如果没有播放，点击进度条后，自动播放
    if (audio.value.paused) {
      audioPlay()
    }
  }
}

const { setDraggable, left, isDragging, setPosition } = useDraggable({
  axis: 'x',
  onDragStart,
  onDragEnd,
})

const progressWidth = computed(() => {
  return barRef.value?.getBoundingClientRect().width || 0
})
// 进度百分比
const progressPercent = computed(() => {
  // console.log('progressPercent', left.value)
  if (isDragging.value) {
    // 不能超出
    if (left.value < 0) {
      left.value = 0
      return 0
    }
    if (left.value > progressWidth.value) {
      left.value = progressWidth.value
      return 100
    }
    return getPercent(left.value, progressWidth.value)
  }
  return getPercent(currentTime.value, audio.value?.duration || 0)
})

//#endregion
</script>

<style scoped lang="scss">
.lyrics-active {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 55%;
    transform: translateY(-50%);
    right: 10px;
    // 向右的箭头
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid v-bind('mainColor');
  }
  &::before {
    content: '';
    position: absolute;
    top: 55%;
    transform: translateY(-50%);
    right: 20px;
    height: 1px;
    width: 20%;
    // 虚线
    background: repeating-linear-gradient(
      90deg,
      v-bind('mainColor'),
      v-bind('mainColor') 5px,
      transparent 5px,
      transparent 12px
    );
  }
}
.lyrics {
  position: relative;
  // height: calc(#{$lyricsShowCount} * #{$lyricsHeight} + #{$lyricsActiveHeight});
  // 上边的的代码在编译时会报错，所以用下面的代码代替
  height: v-bind("lyricsShowCount * lyricsHeight + lyricsActiveHeight + 'px'");

  overflow: auto;
  .top {
    position: sticky;
    top: 0;
    width: 100%;
    height: v-bind("lyricsHeight+'px'");
    // 从上到下渐变
    // background: linear-gradient(180deg, #010207, transparent);
    background: linear-gradient(180deg, v-bind('darkColor'), transparent);
    box-shadow: 0 -2px v-bind('darkColor');
  }
  .bottom {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: v-bind("lyricsHeight+'px'");
    // 从下到上渐变
    background: linear-gradient(0deg, v-bind('darkColor'), transparent);
    box-shadow: 0 1px v-bind('darkColor');
  }

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  .item {
    height: v-bind("lyricsHeight+'px'");
    // 文字垂直居中
    @apply flex items-center justify-center;
    font-size: 1rem;
    text-align: center;
    &.active {
      color: v-bind('mainColor');
      height: v-bind("lyricsActiveHeight+'px'");
      // 文字垂直居中
      @apply flex items-center justify-center;
      font-size: 1.3rem;
      font-weight: 700;
      text-align: center;
    }
  }
  // 滚动动画
  transition: all 0.3s;
}

.progress-bar {
  position: relative;
  width: 60%;
  height: 2px;
  background-color: #e2e2e2;
  @apply mx-5;
  // 播放完的进度条颜色 从左到右渐变
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind("progressPercent + '%'");
    height: 100%;
    background: v-bind('mainColor');
  }

  .dot {
    position: absolute;
    top: -3px;
    left: v-bind("progressPercent + '%'");
    width: 8px;
    height: 8px;
    background-color: v-bind('mainColor');
    border-radius: 50%;
    // 扩大点击区域
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      width: 30px;
      height: 30px;
    }
  }
}
.page {
  // 占满屏幕
  height: 100vh;
  width: 100vw;
  padding: 20px;
  color: #fff;
  @apply flex flex-col justify-between;
  // 不可选中
  user-select: none;

  .name {
    font-size: 1.5rem;
    font-weight: 700;
    width: 100%;
    text-align: center;
    color: v-bind('mainColor');
    @apply truncate;
  }
  .music-img {
    // box-shadow动画 闪动
    box-shadow: v-bind('mainColor') 0px 0px 20px 10px;
    animation: rotate 50s linear infinite paused, shadow 1s linear infinite alternate paused;
  }
}
@keyframes shadow {
  from {
    box-shadow: v-bind('mainColor') 0px 0px 20px 10px;
  }
  to {
    box-shadow: v-bind('mainColor') 0px 0px 10px 0px;
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  // background: v-bind("musicStore.nowMusic?.cover ? 'url(' + musicStore.nowMusic?.cover + ')' : ''");
  // 渐变效果
  background: v-bind('darkColor');

  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: -1;
  transform: scale(1.05);
}
</style>
