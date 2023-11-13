import { ref } from 'vue'
import { useMusicStore } from '@/store/modules/music'

const audio = ref<HTMLAudioElement | null>(null)
let timeupdate: EventListenerOrEventListenerObject

export const useAudio = () => {
  return {
    createAudio,
    createTimeupdate,
    audio,
    audioPlay,
    audioPause,
  }
}
/**
 *
 *  创建audio
 * @param {string} src
 * @returns
 * @memberof Audio
 */
const createAudio = (src: string) => {
  // 清空之前的audio
  if (audio.value) {
    audio.value.removeEventListener('ended', audioEnded)
    audio.value.removeEventListener('timeupdate', timeupdate)
    audio.value.oncanplay = null
    audio.value.pause()
    audio.value = null
  }
  audio.value = new Audio(src)
  // 音乐无法播放的情况
  audio.value.onerror = () => {
    console.log('音乐无法播放')
    // 下一首
    setTimeout(() => {
      const musicStore = useMusicStore()
      musicStore.nextMusic()
    }, 1000)
  }
  audio.value.addEventListener('ended', audioEnded)
  audio.value.addEventListener('timeupdate', timeupdate)
  audio.value.oncanplay = () => {
    audioPlay()
  }
}
/**
 * createTimeupdate
 * @param {Function} fn
 */
const createTimeupdate = (fn: EventListenerOrEventListenerObject) => {
  timeupdate = fn
}

/**
 * 音频播放结束时触发
 */
const audioEnded = () => {
  audioPause()
  // if (audio.value) audio.value.currentTime = 0
}

/**
 * audio播放
 */
const audioPlay = () => {
  audio.value?.play()
  const dom: HTMLDivElement | null = document.querySelector('.music-img')
  if (dom) {
    dom.style.animationPlayState = 'running'
  }
}

/**
 * audio暂停
 */
const audioPause = () => {
  console.log('audioPause ', audio.value)
  audio.value?.pause()
  const dom: HTMLDivElement | null = document.querySelector('.music-img')
  if (dom) {
    dom.style.animationPlayState = 'paused'
  }
}
