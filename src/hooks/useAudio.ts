import { ref } from 'vue'

const audio = ref<HTMLAudioElement>(new Audio('https://music.163.com/song/media/outer/url?id=33894312.mp3'))

export const useAudio = () => {
  return {
    createAudio,
    audio,
    setAudioSrc,
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
export const createAudio = (src: string, timeupdate?: any) => {
  audio.value = new Audio(src)
  audio.value.addEventListener('ended', audioEnded)
  audio.value.addEventListener('timeupdate', timeupdate)
  audio.value.oncanplay = () => {}
  return audio
}
/**
 * 设置audio的src
 */
export const setAudioSrc = (src: string) => {
  if (audio.value) audio.value.src = src
}

/**
 * 音频播放结束时触发
 */
const audioEnded = () => {
  audioPause()
  if (audio.value) audio.value.currentTime = 0
  // audio?.play()
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
