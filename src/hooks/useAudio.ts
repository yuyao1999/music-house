let audio: HTMLAudioElement
/**
 *
 *  创建audio
 * @param {string} src
 * @param {function} [timeupdate] 音频播放时触发
 * @returns
 * @memberof Audio
 */
export const useAudio = (src: string, timeupdate: any) => {
  audio = new Audio(src)
  audio.crossOrigin = 'anonymous'
  audio.addEventListener('timeupdate', timeupdate)
  audio.addEventListener('ended', audioEnded)
  return audio
}

/**
 * 音频播放结束时触发
 */
const audioEnded = () => {
  audioPause()
  audio.currentTime = 0
  // audio?.play()
}

/**
 * audio播放
 */
export const audioPlay = () => {
  audio?.play()

  const dom: HTMLDivElement | null = document.querySelector('.music-img')
  if (dom) {
    dom.style.animationPlayState = 'running'
  }
}

/**
 * audio暂停
 */
export const audioPause = () => {
  audio?.pause()

  const dom: HTMLDivElement | null = document.querySelector('.music-img')
  if (dom) {
    dom.style.animationPlayState = 'paused'
  }
}
/**
 * 获取audio的播放状态
 * @returns {boolean} true: 播放中 false: 暂停中
 */
export const getAudioStatus = () => {
  console.log('getAudioStatus', !audio?.paused)
  return !audio?.paused
}
