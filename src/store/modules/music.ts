/** @format */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IMusic } from '@/types/music'
export const useMusicStore = defineStore(
  'music',
  () => {
    /**
     * 当前音乐
     */
    const nowMusic = ref<IMusic>({
      id: '',
      name: '',
      singer: '',
      src: '',
      cover: '',
      lrc: [],
    })
    const setNowMusic = (data: IMusic) => {
      Object.keys(data).forEach((key) => {
        data[key] && (nowMusic.value[key] = data[key])
      })
    }

    return {
      nowMusic,
      setNowMusic,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
