let audio: HTMLAudioElement
/**
 *
 *  创建audio
 * @param {string} src
 * @param {function} [timeupdate] 音频播放时触发
 * @returns
 * @memberof Audio
 */
export const createAudio = (src: string, timeupdate: any) => {
  if (!audio) {
    audio = new Audio(src)
    audio.crossOrigin = 'anonymous'
    audio.addEventListener('timeupdate', timeupdate)
  }
  return audio
}

/**
 * audio播放
 */
export const audioPlay = () => {
  audio.play()
}

/**
 * audio暂停
 */
export const audioPause = () => {
  audio.pause()
}
