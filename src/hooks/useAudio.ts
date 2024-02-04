import { ref } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { formatMusicLyrics } from '@/utils/handle-lyrics'
import { useAppStore } from '@/store/modules/app'
import { getImgColor, getDarkColor } from '@/utils/img'
import { useToast } from '@/components/Toast'
import { musicApi } from '@/api/music'
import { get } from 'http'

const audio = ref<HTMLAudioElement | null>(null)
// audio是否播放
const audioPlayFlag = ref(false)
let timeupdate: EventListenerOrEventListenerObject
const { open } = useToast()

export const useAudio = () => {
  /**
   *
   *  创建audio
   * @param {string} src
   * @returns
   * @memberof Audio
   */
  const createAudio = (src: string | undefined) => {
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
    audio.value.onerror = (err) => {
      // 重新赋值src
      // const musicStore = useMusicStore()
      open('音乐无法播放')
      // 下一首
      // setTimeout(() => {
      //   if (musicStore.musicList.length > 1) {
      //     useToast().open('音乐无法播放，自动播放下一首')
      //     musicStore.nextMusic()
      //   }
      // }, 2500)
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
    if (!audio.value) {
      return
    }
    audio.value?.play()
    audioPlayFlag.value = true
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
    audioPlayFlag.value = false
    const dom: HTMLDivElement | null = document.querySelector('.music-img')
    if (dom) {
      dom.style.animationPlayState = 'paused'
    }
  }

  /**
   * 获取音乐详情
   */
  const getMusicDetail = (ids: string) => {
    const musicStore = useMusicStore()
    const appStore = useAppStore()
    musicApi.detail({ ids }).then((res: any) => {
      // 错误处理返回异常
      if (!res) {
        return
      }
      const data = res.songs[0]?.al?.picUrl
      musicStore.supplementMusic({
        id: ids,
        cover: data,
      })
      getImgColor(data).then((res: any) => {
        appStore.setMainColor(res)
        const dark = getDarkColor(res)
        appStore.setDarkColor(dark)
      })
    })
  }
  /**
   * 获取音乐歌词
   */
  const getMusicLyric = (id: string) => {
    const musicStore = useMusicStore()
    musicApi.getLyric({ id }).then((res: any) => {
      if (!res) {
        return
      }
      const { lyric } = formatMusicLyrics(res.lrc.lyric)
      musicStore.supplementMusic({
        id,
        lyric,
      })
    })
  }
  /**
   * 获取音乐url
   */
  const getMusicUrl = (id: string, createFlag = true) => {
    const appStore = useAppStore()
    const musicStore = useMusicStore()
    getImgColor(musicStore.nowMusic?.cover || '').then((res: any) => {
      appStore.setMainColor(res)
      appStore.setDarkColor(getDarkColor(res))
    })

    const promise = new Promise((resolve, reject) => {
      musicApi.getMusicUrl({ id }).then((res: any) => {
        if (res.code !== 200) {
          reject(res)
          return
        }
        createFlag && createAudio(res.data[0].url)
        musicStore.supplementMusic({
          id,
          src: res.data[0].url,
        })
        resolve(res)
      })
    })
    return promise
  }

  /**
   * 搜索音乐
   */
  const getMusicSearch = (data: any, changeFlag = true) => {
    const musicStore = useMusicStore()
    // 如果存在跳转到当前音乐
    const index = musicStore.musicList.findIndex((item) => item.id === data.id)
    console.log('index', index)
    if (index !== -1 && changeFlag) {
      musicStore.changeIndex(index)
      return
    }
    if (changeFlag) {
      musicStore.pushPlayList({
        id: data.id,
        name: data.name,
        singer: data.artists[0].name,
        album: data.album.name,
        mvId: data.mvId,
      })
      getMusicUrl(data.id)
    }

    // 优化
    Promise.all([getMusicDetail(data.id), getMusicLyric(data.id)])
      .then((res) => {
        // console.log('Promise res', res)
      })
      .catch((err) => {
        // console.log('Promise err', err)
      })
  }
  return {
    createAudio,
    createTimeupdate,
    audio,
    audioPlayFlag,
    audioPlay,
    audioPause,
    getMusicSearch,
    getMusicUrl,
  }
}
