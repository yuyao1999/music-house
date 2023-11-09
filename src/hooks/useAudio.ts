import { ref } from 'vue'

const audio = ref<HTMLAudioElement | null>(null)
export const useAudio = () => {
  return {
    createAudio,
    audio,
    audioPlay,
    audioPause,
  }
}
/**
 *
 *  创建audio
 * @param {string} src
 * @param {function} [timeupdate] 音频播放时触发
 * @returns
 * @memberof Audio
 */
const createAudio = (src: string, timeupdate?: any) => {
  // 清空之前的audio
  if (audio.value) {
    audio.value.removeEventListener('ended', audioEnded)
    audio.value.removeEventListener('timeupdate', timeupdate)
    audio.value.oncanplay = null
    audio.value.pause()
    audio.value = null
  }
  audio.value = new Audio(src)
  audio.value.addEventListener('ended', audioEnded)
  audio.value.addEventListener('timeupdate', timeupdate)
  audio.value.oncanplay = () => {
    audioPlay()
  }
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
  audio.value?.pause()

  const dom: HTMLDivElement | null = document.querySelector('.music-img')
  if (dom) {
    dom.style.animationPlayState = 'paused'
  }
}
