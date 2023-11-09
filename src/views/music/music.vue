<template>
  <div>
    <div class="page">
      <!-- 头部 -->
      <div class="flex justify-between items-center w-full">
        <div class="icon-back hover:cursor-pointer" @click="back" />
        <div class="flex flex-col items-center w-[80%]">
          <div class="name">{{ musicStore.nowMusic.name }}</div>
          <div>{{ musicStore.nowMusic.singer }}</div>
        </div>
        <div class="icon-share" />
      </div>
      <!-- 图片 -->
      <div
        v-show="!fullScreen"
        class="flex justify-center items-center animate__animated animate__rotateInDownRight overflow-hidden py-9"
        @click="onSwitchFullScreen"
      >
        <img class="w-[30vh] h-[30vh] rounded-[50%] music-img" :src="musicStore.nowMusic.cover" />
      </div>
      <!-- 歌词 -->
      <div :class="{ 'lyrics-active': manualScroll }" @click.stop="mousedownDot">
        <div class="lyrics" ref="lyricsRef" @click.stop @click="onSwitchFullScreen">
          <div class="top" />
          <div v-for="(item, index) in lyrics" :key="item.uid" :class="{ active: index === lyricsIndex }" class="item">
            {{ item.lyric }}
          </div>
          <div class="bottom" />
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <!-- 进度条 -->
        <div class="flex items-center justify-center">
          <!-- 当前时长 -->
          <div class="text-sm">{{ formatTime(currentTime) }}</div>
          <!-- 音乐进度条 -->
          <div class="progress-bar hover:cursor-pointer" @mousedown.stop="mousedownBar" ref="barRef">
            <div @mousedown.stop class="dot" @mousedown="onDot" ref="dotRef"></div>
          </div>
          <!-- 总时长 -->
          <div class="text-sm">{{ formatTime(audio?.duration) }}</div>
        </div>
        <!-- 播放按钮 -->
        <div class="flex justify-between items-center">
          <div v-if="isLove" @click="isLove = false" class="pl-5">
            <div class="hover:cursor-pointer animate__animated animate__heartBeat">
              <div class="icon-love" />
            </div>
          </div>
          <div v-else @click="isLove = true" class="pl-5">
            <div class="hover:cursor-pointer animate__animated animate__bounceIn">
              <div class="icon-love-none" />
            </div>
          </div>
          <div class="w-[50%] flex justify-between items-center">
            <div
              @click="musicStore.prevMusic"
              class="hover:cursor-pointer icon-prev animate__animated animate__bounceIn"
            />
            <div
              v-if="!audio?.paused"
              @click="audioPause"
              class="hover:cursor-pointer icon-pause animate__animated animate__bounceIn"
            />
            <div v-else @click="audioPlay" class="hover:cursor-pointer icon-play animate__animated animate__bounceIn" />
            <div
              @click="musicStore.nextMusic"
              class="hover:cursor-pointer icon-next animate__animated animate__bounceIn"
            />
          </div>
          <div class="pr-2" @click="onPlayMode">
            <img
              :key="playMode"
              class="w-8 h-8 hover:cursor-pointer animate__animated animate__bounceIn"
              :src="playModeList[playMode].icon"
            />
          </div>
        </div>
        <!-- 歌词全屏 -->
        <div class="relative flex justify-center items-center pb-1">
          <div :class="fullScreen ? 'text-white font-600' : 'text-gray-500'" @click="onSwitchFullScreen">词</div>
          <img
            class="absolute right-[12px] w-5 h-5 hover:cursor-pointer animate__animated animate__bounceIn"
            src="@/assets/music/list.png"
          />
        </div>
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
import { useAudio } from '@/hooks/useAudio'
import { useDraggable } from '@/hooks/useDraggable'
import { ILyric } from '@/types/lyric'
import { useRoute, useRouter } from 'vue-router'
import { isMobile } from '@/utils/is'
import { requireImg } from '@/utils/requireImg'

const musicStore = useMusicStore()
const { audio, createAudio, audioPlay, audioPause } = useAudio()

// 当前歌曲是否喜欢
const isLove = ref(false)

/**
 * 歌曲播放模式
 * 0 顺序
 * 1 随机
 * 2 单曲循环
 */
const playMode = ref(0)
const playModeList = [
  {
    name: '顺序',
    icon: requireImg('music/sequential.png'),
  },
  {
    name: '随机',
    icon: requireImg('music/random.png'),
  },
  {
    name: '单曲循环',
    icon: requireImg('music/cycle.png'),
  },
]
const onPlayMode = () => {
  playMode.value = (playMode.value + 1) % 3
}

// 搜索
const getMusicSearch = (name: string) => {
  let keyword = name
  musicApi.search({ keywords: keyword }).then((res: any) => {
    const data = res.result.songs[0]
    musicStore.pushPlayList({
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
const router = useRouter()
getMusicSearch(route.query.msg as string)

const back = () => {
  // 跳转到首页
  router.push('/')
}

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
    musicStore.supplementMusic({
      id: musicStore.nowMusic?.id,
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
console.log('audio.value', audio.value)
//获取歌曲url
const getMusicUrl = () => {
  musicApi.getMusicUrl({ id: musicStore.nowMusic?.id }).then((res: any) => {
    console.log('getMusicUrl', audio.value)
    createAudio(res.data[0].url, handleTimeUpdate)
  })
}

const dotRef = ref<HTMLDivElement>()
//#endregion

//#region 页面周期
onMounted(() => {
  initScroll(lyricsRef.value)
  setDraggable(dotRef.value)
})
onUnmounted(() => {})
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
    lyricsShowCount.value = 12
    nowActiveIndex = 4
  } else {
    lyricsShowCount.value = 3
    nowActiveIndex = 1
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
const onScrollEnd = (diff: number) => {
  // 歌词滚动的距离 跳转
  // 开头没有滚动的误差
  let errorIndex = 0
  if (lyricsIndex.value < 4) {
    errorIndex = 4
  }
  const index = Math.floor(diff / lyricsHeight) - errorIndex
  const jumpIndex = -index + lyricsIndex.value
  // 歌曲跳转
  if (audio.value && lyricsIndex.value >= 0) {
    audio.value?.play()
    lyricsIndex.value = jumpIndex
    currentTime.value = lyrics.value[jumpIndex]?.time || audio.value.currentTime
    audio.value.currentTime = currentTime.value + 0.1
    handleLyricsScroll()
  }
}
const { manualScroll, initScroll } = useScroll({ onScrollEnd })

//#endregion

//#region 进度条
const currentTime = ref(0)
const barRef = ref<HTMLDivElement>()

const onDragStart = () => {}
const onDragEnd = () => {
  handleProgress(getPercent(left.value, progressWidth.value) * 0.01)
}
const { setDraggable, left, isDragging, setPosition } = useDraggable({
  axis: 'x',
  onDragStart,
  onDragEnd,
})
const onDot = (e: any) => {
  const barDom = barRef.value
  if (barDom) {
    const left = e.pageX - barDom.getBoundingClientRect().left
    setPosition(left)
  }
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
// 点击滚动条按钮 跳转到对应的时间
const mousedownDot = (e: any) => {
  if (isMobile()) return
  const lyricsDom = lyricsRef.value
  if (lyricsDom) {
    // 获取lyricsRef 的滚动的距离 scrollTop
    const top = e.pageY - lyricsDom.getBoundingClientRect().top + lyricsDom.scrollTop
    const index = Math.floor(top / lyricsHeight)
    if (audio.value) {
      audio.value.currentTime = lyrics.value[index].time
      audioPlay()
    }
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

const progressWidth = computed(() => {
  return barRef.value?.getBoundingClientRect().width || 0
})
// 进度百分比
const progressPercent = computed(() => {
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
    cursor: pointer;
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
    width: 100%;
    // 文字垂直居中
    @apply flex items-center justify-center;
    font-size: 1rem;
    text-align: center;
    line-height: 1rem;
    overflow: hidden;

    &.active {
      color: v-bind('mainColor');
      height: v-bind("lyricsActiveHeight+'px'");
      // 文字垂直居中
      @apply flex items-center justify-center;
      font-size: 1.3rem;
      line-height: 1.3rem;
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

// 按钮
.icon-play {
  // 播放图标 圆形 css绘制
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: v-bind('mainColor');
  position: relative;
  // 三角形
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.6rem solid transparent;
    border-bottom: 0.6rem solid transparent;
    // border-left: 0.9rem solid #fff;
    border-left: 0.9rem solid v-bind('darkColor');
    // 圆角
    border-radius: 0.2rem;

    // 居中
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
  }
}
.icon-pause {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 0.1rem solid v-bind('mainColor');
  position: relative;
  // 两个竖线
  &::after {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1.2rem;
    background: v-bind('mainColor');
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
  }
  &::before {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1.2rem;
    background: v-bind('mainColor');
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
  }
}
.icon-next {
  // 下一首
  // 两个向右的三角形 左边小右边大 两个三角形重叠
  width: 2.5rem;
  height: 2.5rem;

  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.7rem solid transparent;
    border-bottom: 0.7rem solid transparent;
    border-left: 1rem solid v-bind('mainColor');
    // 圆角
    border-radius: 0.2rem;
    // 居中
    top: 50%;
    left: 45%;
    transform: translate(-50%, -50%);
  }
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.8rem solid transparent;
    border-bottom: 0.8rem solid transparent;
    border-left: 0.8rem solid v-bind('mainColor');
    // 圆角
    border-radius: 0.2rem;
    // 居中
    top: 50%;
    left: 65%;
    transform: translate(-50%, -50%);
  }
}
.icon-prev {
  // 上一首
  // 两个向左的三角形 左边大右边小 两个三角形重叠
  width: 2.5rem;
  height: 2.5rem;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.7rem solid transparent;
    border-bottom: 0.7rem solid transparent;
    border-right: 1rem solid v-bind('mainColor');
    // 圆角
    border-radius: 0.2rem;
    // 居中
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
  }
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.8rem solid transparent;
    border-bottom: 0.8rem solid transparent;
    border-right: 0.8rem solid v-bind('mainColor');
    // 圆角
    border-radius: 0.2rem;
    // 居中
    top: 50%;
    left: 35%;
    transform: translate(-50%, -50%);
  }
}
.icon-back {
  // 返回按钮 向左的箭头
  width: 2.5rem;
  height: 2.5rem;
  position: relative;
  // 两条直线 夹角45度
  &::after {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1rem;
    border-radius: 0.2rem;

    background: #fff;
    top: 38%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(50deg);
  }
  &::before {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1rem;
    border-radius: 0.2rem;
    background: #fff;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-50deg);
  }
}
$heartWidth: 1.2rem;
$heartHeight: 1.2rem;
.icon-love {
  //心型
  width: $heartWidth;
  height: $heartHeight;
  position: relative;
  background-color: tomato;
  transform: rotate(-45deg);
  &::before {
    content: '';
    position: absolute;
    // 宽度的一半
    top: calc(-#{$heartWidth} / 2);
    left: 0;
    width: $heartWidth;
    height: $heartHeight;
    border-radius: 50%;
    background-color: tomato;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: calc(#{$heartWidth} / 2);
    width: $heartWidth;
    height: $heartHeight;
    border-radius: 50%;
    background-color: tomato;
  }
}
.icon-love-none {
  // 裁剪为 空心心
  @extend .icon-love;
  background-color: white;
  &::before {
    background-color: white;
  }
  &::after {
    background-color: white;
  }
  transform: rotate(-45deg) scale(0.8);
}
.icon-share {
  // 分享图标
  width: 2.5rem;
  height: 2.5rem;
  background: url('@/assets/music/icon-share.png') no-repeat center;
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
  overflow: hidden;
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
