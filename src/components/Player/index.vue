<template>
  <div>
    <div class="page">
      <!-- 头部 -->
      <div class="flex justify-between items-center w-full statusBarHeightPaddingTop">
        <button class="icon-back hover:cursor-pointer" @click="back" v-throttle />
        <div class="flex flex-col items-center w-[80%] overflow-hidden">
          <div class="music-name">
            <scrollText :text="musicStore.nowMusic.name" class="text-center" />
          </div>
          <div class="cursor-pointer" @click="toSinger">{{ musicStore.nowMusic.singer }}</div>
        </div>
        <div @click="onShare" class="icon-share cursor-pointer" />
      </div>
      <!-- 图片 -->
      <div
        v-show="!fullScreen"
        class="flex justify-center items-center animate__animated animate__rotateInDownRight overflow-hidden py-9"
        @click="onSwitchFullScreen"
      >
        <img class="w-[65vw] h-[65vw] max-h-100 max-w-100 rounded-[50%] music-img" :src="musicStore.nowMusic.cover" />
      </div>
      <!-- 歌词 -->
      <div :class="{ 'lyrics-active': manualScroll }" @click.stop="mousedownDot">
        <div class="lyrics" id="lyrics" ref="lyricsRef" @click.stop @click="onSwitchFullScreen">
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
          <button v-hidden="musicStore.musicListMode === 3" @click="isLove = !isLove" v-throttle>
            <div v-if="isLove" class="pl-5">
              <div class="hover:cursor-pointer animate__animated animate__heartBeat">
                <div class="icon-love" />
              </div>
            </div>
            <div v-else class="pl-5">
              <div class="hover:cursor-pointer animate__animated animate__bounceIn">
                <div class="icon-love-none" />
              </div>
            </div>
          </button>

          <div class="w-[50%] flex justify-between items-center">
            <button
              v-hidden="musicStore.musicListMode === 3"
              @click="onPrev"
              v-throttle
              class="hover:cursor-pointer icon-prev animate__animated animate__bounceIn"
            />
            <button
              v-show="audioPlayFlag"
              @click="audioPause"
              v-throttle
              class="hover:cursor-pointer icon-pause animate__animated animate__bounceIn"
            />
            <button
              v-show="!audioPlayFlag"
              @click="audioPlay"
              v-throttle
              class="hover:cursor-pointer icon-play animate__animated animate__bounceIn"
            />
            <button
              @click="onNext"
              v-throttle
              class="hover:cursor-pointer icon-next animate__animated animate__bounceIn"
            />
          </div>
          <button v-hidden="musicStore.musicListMode === 3" class="pr-2" @click="onPlayMode" v-throttle>
            <img
              :key="musicStore.playMode"
              class="w-8 h-8 hover:cursor-pointer animate__animated animate__bounceIn"
              :src="playModeList[musicStore.playMode].icon"
            />
          </button>
        </div>
        <!-- 歌词全屏 -->
        <div class="relative flex justify-center items-center pb-1">
          <button :class="fullScreen ? 'text-white font-600' : 'text-gray-500'" @click="onSwitchFullScreen" v-throttle>
            词
          </button>
          <button
            v-hidden="musicStore.musicListMode === 3"
            @click="listOpen"
            v-throttle
            class="absolute right-[12px] w-5 h-5 hover:cursor-pointer animate__animated animate__bounceIn"
          >
            <img src="@/assets/music/list.png" />
          </button>
        </div>
      </div>
    </div>
    <div class="bg" />
  </div>
</template>

<script setup lang="ts">
import { formatTime, getPercent, getNowTime } from '@/utils/handle-time'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { useAppStore } from '@/store/modules/app'
import { useAudio } from '@/hooks/useAudio'
import { useDraggable } from '@/hooks/useDraggable'
import { useScroll } from '@/hooks/useScroll'
import { ILyric } from '@/types/lyric'
import { isMobile } from '@/utils/is'
import { requireImg } from '@/utils/requireImg'
import { useThrottleFn } from '@/hooks/useFn'
import { useMusicList } from '@/components/MusicList'
import { useFont } from '@/hooks/useFont'
import { setBack } from '@/utils/app-setting'
import scrollText from '@/components/scrollText/index.vue'
import { musicApi } from '@/api/music'
import { handleDj } from '@/utils/handleDj'
import { useShow } from '@/hooks/useShow'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/Toast'

const musicStore = useMusicStore()
const appStore = useAppStore()
const { open: listOpen } = useMusicList()
const { open: toast } = useToast()
const router = useRouter()

const toSinger = () => {
  musicStore.setShow(false)
  router.push({
    path: '/singer-song',
    query: {
      id: musicStore.nowMusic.singerId,
      name: musicStore.nowMusic.singer,
      musicShow: 'play',
    },
  })
}

const onPlayCss = () => {
  const dom: HTMLDivElement | null = document.querySelector('.music-img')
  if (dom) {
    dom.style.animationPlayState = 'running'
  }
}

const { audio, createAudio, audioPlayFlag, createTimeupdate, audioPlay, audioPause, getMusicUrl } = useAudio()

// 当前歌曲是否喜欢
const isLove = ref(false)
//#region 页面周期
onMounted(() => {
  initScroll(lyricsRef.value)
  setDraggable(dotRef.value)
  useShow({
    el: lyricsRef.value,
    onShow,
    onHide,
  })
  if (audioPlayFlag.value) {
    onPlayCss()
  }
})
onUnmounted(() => {})
//#endregion
const onShow = () => {
  setBack(back)
  // 滚动到当前歌词
  if (lyricsRef.value) {
    const index = getLyricsIndex(currentTime.value)
    lyricsRef.value.scrollTo({
      top: (index - nowActiveIndex) * lyricsHeight.value,
    })
  }
}
const onHide = () => {}

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
  musicStore.setPlayMode((musicStore.playMode + 1) % 3)
}

// 获取路由参数

const back = () => {
  musicStore.setShow(false)
  musicStore.setMiniShow(true)

  if (musicStore.musicListMode === 3) {
    musicStore.setMusicListMode(0)
    audioPause()
    if (audio.value) {
      audio.value.src = musicStore.nowMusic.src || ''
      setTimeout(() => {
        audioPause()
      }, 200)
    }
  }
}

//#region 歌曲

const dotRef = ref<HTMLDivElement>()
//#endregion

//#region 歌词

const lyrics = computed<ILyric[]>(() => {
  return musicStore.nowMusic?.lyric || []
})
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
const lyricsHeight = ref(useFont(40))
console.log('lyricsHeight', lyricsHeight.value)
if (lyricsHeight.value === -1) {
  lyricsHeight.value = 40
}
const setDefaultFontSize = () => {
  const fontSize = useFont(40)
  if (fontSize === -1) {
    lyricsHeight.value = 40
  } else {
    lyricsHeight.value = fontSize
  }
}
setDefaultFontSize()
const throttleFn = useThrottleFn(setDefaultFontSize, 250)
if (!isMobile()) {
  window.addEventListener('resize', throttleFn as EventListenerOrEventListenerObject)
}
// 正在播放的歌词高度
let lyricsActiveHeight = lyricsHeight.value * 1.5

// 监听歌词滚动
const handleLyricsScroll = () => {
  if (manualScroll.value) return
  // 唱完一句歌词后，歌词滚动
  const index = getLyricsIndex(currentTime.value)
  if (index === lyricsIndex.value) {
    return
  }
  lyricsIndex.value = index
  const lyricsDom = lyricsRef.value

  if (lyricsDom) {
    // 滚动到中间
    if (index > nowActiveIndex) {
      // 平滑滚动
      const height = lyricsHeight.value
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
createTimeupdate(handleTimeUpdate)
createAudio(musicStore.nowMusic.src, true)

const getDj = () => {
  audioPause()
  musicApi
    .getPersonalDJ({
      longitude: '116.45301061291795',
      latitude: '39.834686270829096',
    })
    .then((res) => {
      handleDj(res.data)
    })
}
if (musicStore.musicListMode === 3) {
  getDj()
}

// 空白数量
const emptyLyricNum = 7

//歌词拖动
const onScrollEnd = (diff: number) => {
  // 歌词滚动的距离 跳转
  // 开头没有滚动的误差
  let errorIndex = 0
  if (lyricsIndex.value < emptyLyricNum) {
    errorIndex = emptyLyricNum
  }
  const index = Math.floor(diff / lyricsHeight.value) - errorIndex
  const jumpIndex = -index + lyricsIndex.value
  // 歌曲跳转
  if (audio.value && lyricsIndex.value >= 0) {
    audio.value?.play()
    lyricsIndex.value = jumpIndex
    currentTime.value = lyrics.value[jumpIndex]?.time || audio.value.currentTime
    let diffNext = 0.1
    if (diff < 0) diffNext = -(lyrics.value[jumpIndex]?.time - 0.1 - lyrics.value[jumpIndex - 1]?.time)
    audio.value.currentTime = currentTime.value + diffNext
    handleLyricsScroll()
  }
}
const { manualScroll, scrollToTop, initScroll } = useScroll({ onScrollEnd })

const onNext = () => {
  if (musicStore.musicListMode === 3) {
    getDj()
    return
  }
  musicStore.nextMusic()
}
const onPrev = () => {
  musicStore.prevMusic()
}
// musicStore.nowIndex 监听  执行 scrollToTop(lyricsRef.value)
watch(
  () => musicStore.nowIndex,
  () => {
    scrollToTop(lyricsRef.value)
  }
)

//#endregion

//#region 进度条
const currentTime = ref(audio.value?.currentTime || 0)
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
    const index = Math.floor(top / lyricsHeight.value)
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
function setClipValue(text: string) {
  if (plus.os.name == 'Android') {
    var Context = plus.android.importClass('android.content.Context')
    var main = plus.android.runtimeMainActivity()
    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
    plus.android.invoke(clip, 'setText', text)
    // ('已成功复制到剪贴板');
  } else if (plus.os.name == 'iOS') {
    var UIPasteboard = plus.ios.importClass('UIPasteboard')
    var generalPasteboard = UIPasteboard.generalPasteboard()
    generalPasteboard.plusCallMethod({
      setValue: text,
      forPasteboardType: 'public.utf8-plain-text',
    })
    generalPasteboard.plusCallMethod({
      valueForPasteboardType: 'public.utf8-plain-text',
    })
    // ('已成功复制到剪贴板');
  }
}

declare const plus: any

const isPlus = () => {
  // 判断是否是plus
  return typeof plus !== 'undefined'
}
const onShare = () => {
  console.log('分享')
  const text = `【音乐屋】我正在听《${musicStore.nowMusic.name}》，快来听吧！\n点击链接：${
    'https://yuyao.site/#/?shareId=' + musicStore.nowMusic.id
  }  \n直接打开音乐屋 或者复制文本打开音乐屋APP~`
  localStorage.setItem('lastShareId', musicStore.nowMusic.id as string)
  if (isPlus() && plus.os.name == 'Android') {
    setClipValue(text)
    toast('已复制到剪切板,发送给好友叭~')
  } else {
    navigator.clipboard.writeText(text).then(() => {
      toast('已复制到剪切板,发送给好友叭~')
    })
  }
}
</script>

<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  // background: v-bind("musicStore.nowMusic?.cover ? 'url(' + musicStore.nowMusic?.cover + ')' : ''");
  // 渐变效果
  background: v-bind('appStore.darkColor');

  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: 998;
  transform: scale(1.05);
}

.page {
  // 占满屏幕
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  padding: 20px;
  color: #fff;
  @apply flex flex-col justify-between;
  // 不可选中
  user-select: none;
  overflow: hidden;

  .music-name {
    position: relative;
    width: 100%;
    font-size: 1.5rem;
    font-weight: 700;
    color: v-bind('appStore.mainColor');
  }

  .music-img {
    // box-shadow动画 闪动
    box-shadow: v-bind('appStore.mainColor') 0px 0px 20px 10px;
    animation: rotate 50s linear infinite paused, shadow 1s linear infinite alternate paused;
  }
}

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
    border-left: 8px solid v-bind('appStore.mainColor');
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
      v-bind('appStore.mainColor'),
      v-bind('appStore.mainColor') 5px,
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
    height: v-bind("lyricsHeight + 'px'");
    // 从上到下渐变
    // background: linear-gradient(180deg, #010207, transparent);
    background: linear-gradient(180deg, v-bind('appStore.darkColor'), transparent);
    box-shadow: 0 -2px v-bind('appStore.darkColor');
  }

  .bottom {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: v-bind("lyricsHeight + 'px'");
    // 从下到上渐变
    background: linear-gradient(0deg, v-bind('appStore.darkColor'), transparent);
    box-shadow: 0 1px v-bind('appStore.darkColor');
  }

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  .item {
    height: v-bind("lyricsHeight + 'px'");
    width: 100%;
    // 文字垂直居中
    @apply flex items-center justify-center;
    font-size: 1rem;
    text-align: center;
    line-height: 1rem;
    overflow: hidden;

    &.active {
      color: v-bind('appStore.mainColor');
      height: v-bind("lyricsActiveHeight + 'px'");
      // 文字垂直居中
      @apply flex items-center justify-center;
      font-size: 1.3rem;
      line-height: 2rem;
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
    background: v-bind('appStore.mainColor');
  }

  .dot {
    position: absolute;
    top: -3px;
    left: v-bind("progressPercent + '%'");
    width: 8px;
    height: 8px;
    background-color: v-bind('appStore.mainColor');
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
  background: v-bind('appStore.mainColor');
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
    border-left: 0.9rem solid v-bind('appStore.darkColor');
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
  border: 0.1rem solid v-bind('appStore.mainColor');
  position: relative;

  // 两个竖线
  &::after {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1.2rem;
    background: v-bind('appStore.mainColor');
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
  }

  &::before {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1.2rem;
    background: v-bind('appStore.mainColor');
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
    border-left: 1rem solid v-bind('appStore.mainColor');
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
    border-left: 0.8rem solid v-bind('appStore.mainColor');
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
    border-right: 1rem solid v-bind('appStore.mainColor');
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
    border-right: 0.8rem solid v-bind('appStore.mainColor');
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

  //旋转45度
  transform: rotate(-90deg);
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
  width: 32px;
  height: 32px;
  background: url('@/assets/music/icon-share.png') no-repeat center;
}

@keyframes shadow {
  from {
    box-shadow: v-bind('appStore.mainColor') 0px 0px 20px 10px;
  }

  to {
    box-shadow: v-bind('appStore.mainColor') 0px 0px 10px 0px;
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
</style>
