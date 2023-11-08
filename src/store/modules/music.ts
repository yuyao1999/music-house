/** @format */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IMusic } from '@/types/music'
import { useAudio } from '@/hooks/useAudio'
const { audioPlay } = useAudio()
export const useMusicStore = defineStore(
  'music',
  () => {
    const nowMusic = computed<IMusic>(() => {
      return musicList.value[nowIndex.value] || {}
    })
    /**
     * 当前音乐下标
     */
    const nowIndex = ref<number>(0)
    // 下一首
    const nextMusic = () => {
      nowIndex.value = (nowIndex.value + 1) % musicList.value.length
      audioPlay()
    }
    // 上一首
    const prevMusic = () => {
      nowIndex.value = (nowIndex.value - 1 + musicList.value.length) % musicList.value.length
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
      musicList.value.splice(index, 1)
    }
    const clearPlayList = () => {
      musicList.value = []
    }

    return {
      nowMusic,
      nowIndex,
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
