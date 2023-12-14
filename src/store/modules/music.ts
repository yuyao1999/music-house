/** @format */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IMusic } from '@/types/music'
import { useAudio } from '@/hooks/useAudio'
import { debounce } from '@/utils/debounce'

export const useMusicStore = defineStore(
  'music',
  () => {
    //
    const show = ref<boolean>(false)
    const setShow = (flag: boolean) => {
      show.value = flag
    }
    const miniShow = ref<boolean>(true)
    const setMiniShow = (flag: boolean) => {
      miniShow.value = flag
    }
    /**
     歌曲播放模式
     * 0 顺序
     * 1 随机
     * 2 单曲循环
     */
    const { createAudio, audio, getMusicUrl } = useAudio()
    const playMode = ref<number>(0)
    const setPlayMode = (mode: number) => {
      playMode.value = mode
    }

    const nowMusic = computed<IMusic>(() => {
      return musicList.value[nowIndex.value] || {}
    })

    /**
     * 当前音乐下标
     */
    const nowIndex = ref<number>(0)
    /**
     * 改变当前音乐下标
     */
    const changeIndex = debounce((index: number) => {
      if (index === nowIndex.value) return
      nowIndex.value = index
      getMusicUrl(nowMusic.value.id || '')
    })

    // 下一首
    const nextMusic = () => {
      if (playMode.value === 1) {
        const randomIndex = Math.floor(Math.random() * musicList.value.length)
        // 防止随机到当前音乐
        if (randomIndex === nowIndex.value) {
          nextMusic()
          return
        }
        changeIndex(randomIndex)
        return
      }
      const nextIndex = (nowIndex.value + 1) % musicList.value.length
      changeIndex(nextIndex)
    }
    // 上一首
    const prevMusic = () => {
      const prevIndex = (nowIndex.value - 1 + musicList.value.length) % musicList.value.length
      changeIndex(prevIndex)
    }
    /**
     * 播放列表
     */
    const musicList = ref<IMusic[]>([])
    const setPlayList = (data: IMusic[]) => {
      musicList.value = data
    }
    const pushPlayList = (data: IMusic) => {
      musicList.value.push(data)
      nowIndex.value = musicList.value.length - 1
    }
    /**
     * 补充之前的音乐信息
     * @param data
     */
    const supplementMusic = (data: IMusic) => {
      const index = musicList.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        musicList.value[index] = { ...musicList.value[index], ...data }
      }
    }

    const removePlayList = (index: number) => {
      if (index === nowIndex.value) {
        musicList.value.splice(index, 1)
        nowIndex.value = (nowIndex.value - 1 + musicList.value.length) % musicList.value.length
        createAudio(nowMusic.value.src || '')
      } else {
        // 当前音乐播放的时间
        const currentTime = audio.value?.currentTime || 0

        musicList.value.splice(index, 1)
        if (index < nowIndex.value) {
          nowIndex.value--
        }
        if (audio.value) audio.value.currentTime = currentTime
      }
    }
    const clearPlayList = () => {
      musicList.value = []
    }

    return {
      show,
      setShow,
      miniShow,
      setMiniShow,
      playMode,
      setPlayMode,
      nowMusic,
      nowIndex,
      changeIndex,
      nextMusic,
      prevMusic,
      musicList,
      setPlayList,
      pushPlayList,
      supplementMusic,
      removePlayList,
      clearPlayList,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
