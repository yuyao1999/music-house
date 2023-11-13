import { ref } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { useToast } from '@/components/Toast'

export const audio = ref<HTMLAudioElement | null>(null)
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
    const musicStore = useMusicStore()
    useToast().open('音乐无法播放')
    // 下一首
    setTimeout(() => {
      if (musicStore.musicList.length > 1) {
        useToast().open('音乐无法播放，自动播放下一首')
        musicStore.nextMusic()
      }
    }, 2500)
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
  // audioPause()
  const musicStore = useMusicStore()
  switch (musicStore.playMode) {
    case 0:
      // 顺序
      musicStore.nextMusic()
      break
    case 1:
      // 随机
      const randomIndex = Math.floor(Math.random() * musicStore.musicList.length)
      // 防止随机到当前音乐
      if (randomIndex === musicStore.nowIndex) {
        musicStore.nextMusic()
        break
      }
      musicStore.changeIndex(randomIndex)
      break
    case 2:
      // 单曲循环
      audioPlay()
      break
    default:
      break
  }
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
