<template>
  <div class="">
    <h1>音乐</h1>
    <div @click="audioPlay">播放</div>
    <div @click="audioPause">暂停</div>
    <!-- audio进度条 -->
    <div>
      <!-- 歌词 -->
      <div class="lyrics" ref="lyricsRef">
        <div v-for="(item, index) in lyrics" :key="item.uid" :class="{ active: index === lyricsIndex }">
          {{ item.lyric }}
        </div>
      </div>
      <div>
        当前时长
        <!-- audio 当前播放时间 -->
        <div>
          {{ formatTime(currentTime) }}
        </div>
      </div>
      <div>
        总时长
        <!-- audio 长度 -->
        <div>
          {{ formatTime(audio?.duration) }}
        </div>
      </div>
      <!-- 音乐进度条 -->
      <div>
        <div class="progress-bar" @click="handleProgressClick">
          <div class="bg"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { musicApi } from '@/api/music'
import { formatMusicLyrics } from '@/utils/handle-lyrics'
import { formatTime, getPercent, getNowTime } from '@/utils/handle-time'
import { ref, computed } from 'vue'
import { createAudio, audioPlay, audioPause } from './audio'
import { ILyric } from '@/types/lyric'

const audio = ref<HTMLAudioElement>()
musicApi.getMusicUrl({ id: '1436879751' }).then((res: any) => {
  const audioTemp = createAudio(res.data[0].url, handleTimeUpdate)
  audioTemp.oncanplay = () => {
    audio.value = audioTemp
    console.log('audio', audio.value)
  }
})
const lyrics = ref<ILyric[]>([])
musicApi.getLyric({ id: '1436879751' }).then((res: any) => {
  const { lyric } = formatMusicLyrics(res.lrc.lyric)
  console.log('lyric', lyric)
  lyrics.value = lyric
})

//#region 歌词
const lyricsRef = ref<HTMLDivElement>()
// 当前歌词索引
const lyricsIndex = ref(0)
// 监听歌词滚动
const handleLyricsScroll = () => {
  const lyricsDom = lyricsRef.value
  // 唱完一句歌词后，歌词滚动
  const index = getLyricsIndex(currentTime.value)
  lyricsIndex.value = index
  console.log('index', index)
  if (lyricsDom) {
    // 滚动到中间
    if (index > 2) {
      // 平滑滚动
      lyricsDom.scrollTo({
        top: (index - 2) * lyricsDom.children[0].clientHeight,
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
    }
  }
  return index
}

//#endregion

const currentTime = ref(0)
// 进度百分比
const progressPercent = computed(() => {
  return getPercent(currentTime.value, audio.value?.duration || 0)
})

// 点击进度条 跳转到对应的时间
const handleProgressClick = (e: any) => {
  const { clientX } = e
  const { left, width } = e.target.getBoundingClientRect()
  const percent = (clientX - left) / width
  console.log('percent', percent)
  if (audio.value) {
    audio.value.currentTime = getNowTime(percent, audio.value?.duration)
    // 如果没有播放，点击进度条后，自动播放
    if (audio.value.paused) {
      audioPlay()
    }
  }
}

const handleTimeUpdate = () => {
  currentTime.value = audio.value?.currentTime || 0
  handleLyricsScroll()
}
</script>

<style scoped lang="scss">
// 单个歌词高度
$lyricsHeight: 50px;
// 当前歌词高度
$lyricsActiveHeight: 80px;
// 歌词显示行数 不包括当前歌词
$lyricsShowCount: 4;
.lyrics {
  // 歌词显示行数 * （歌词显示行数-1） + 当前歌词高度
  height: $lyricsShowCount * ($lyricsHeight - 1) + $lyricsActiveHeight;
  overflow: auto;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }
  div {
    height: $lyricsHeight;
    // 文字垂直居中
    @apply flex items-center justify-center;
    font-size: 20px;
    text-align: center;
    &.active {
      color: #ffcd32;
      // 1.5的高度
      height: $lyricsActiveHeight;
      // 文字垂直居中
      @apply flex items-center justify-center;
      font-size: 30px;
      text-align: center;
    }
  }
  // 滚动动画
  transition: all 0.3s;
}
.progress-bar {
  width: 50%;
  height: 10px;
  background-color: #e2e2e2;
  position: relative;
  .bg {
    width: 100%;
    height: 100%;
    background-color: #ffcd32;
    position: absolute;
    left: 0;
    top: 0;
  }
  .dot {
    width: 20px;
    height: 20px;
    background-color: #ffcd32;
    position: absolute;
    // 动态计算位置
    left: v-bind("progressPercent + '%'");
    top: -3px;
    border-radius: 50%;
  }
}
</style>
