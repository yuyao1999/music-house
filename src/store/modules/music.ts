/** @format */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { IMusic } from '@/types/music'
import { useAudio } from '@/hooks/useAudio'
import { debounce } from '@/utils/debounce'
import { watch } from 'fs'

export const useMusicStore = defineStore(
  'music',
  () => {
    const { createAudio, audio, audioPlayFlag, getMusicUrl } = useAudio()

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
    const playMode = ref<number>(0)
    /**
     * @param mode 0 顺序 1 随机 2 单曲循环
     */
    const setPlayMode = (mode: number) => {
      playMode.value = mode
    }

    const nowMusic = computed<IMusic>(() => {
      return modeMusicList.value[nowIndex.value] || {}
    })

    /**
     * 改变当前音乐下标
     */
    const changeIndex = debounce((index: number, getUrl = true) => {
      if (index === nowIndex.value) {
        if (!audioPlayFlag.value && getUrl) getMusicUrl(nowMusic.value.id || '')
        return
      }
      nowIndex.value = index
      getUrl && getMusicUrl(nowMusic.value.id || '')
    })
    const changeIndexUnlimited = (index: number) => {
      if (index === nowIndex.value) return
      nowIndex.value = index
      getMusicUrl(nowMusic.value.id || '')
    }

    // 下一首
    const nextMusic = () => {
      if (playMode.value === 1) {
        const randomIndex = Math.floor(Math.random() * modeMusicList.value.length)
        // 防止随机到当前音乐
        if (randomIndex === nowIndex.value) {
          nextMusic()
          return
        }
        changeIndex(randomIndex)
        return
      }
      const nextIndex = (nowIndex.value + 1) % modeMusicList.value.length
      changeIndex(nextIndex)
    }
    // 上一首
    const prevMusic = () => {
      const prevIndex = (nowIndex.value - 1 + modeMusicList.value.length) % modeMusicList.value.length
      changeIndex(prevIndex)
    }

    /**
     * 音乐列表模式
     * 0:动态音乐列表
     * 1:搜索音乐列表
     * 2:个人主页音乐列表
     */
    const musicListMode = ref<number>(0)

    let lastModeIndex = -1
    /**
     * @param mode 0:动态音乐列表 1:搜索音乐列表 2:个人主页音乐列表 3:私人DJ
     */
    const setMusicListMode = (mode: number) => {
      if (mode !== musicListMode.value) {
        musicListMode.value = mode
        //  切换音乐列表模式时，保存当前音乐下标 下一次切换回来时，继续播放
        if (lastModeIndex !== -1) {
          nowIndex.value = lastModeIndex
          lastModeIndex = -1
        } else {
          lastModeIndex = nowIndex.value
        }
      }
    }

    const modeMusicList = computed(() => {
      switch (musicListMode.value) {
        case 0:
          return musicList.value
        case 1:
          return searchMusicList.value
        case 2:
          return personMusicList.value
        case 3:
          return djMusicList.value
        default:
          return musicList.value
      }
    })
    /**
     * 当前音乐下标
     */
    const nowIndex = ref<number>(0)

    /**
     * 搜索的音乐列表
     */
    const searchMusicList = ref<IMusic[]>([])
    /**
     * 个人主页音乐列表
     */
    const personMusicList = ref<IMusic[]>([])
    /**
     * 私人DJ音乐列表
     */
    const djMusicList = ref<IMusic[]>([])

    /**
     * 主页动态播放列表
     */
    const musicList = ref<IMusic[]>([])
    const setPlayList = (data: IMusic[]) => {
      musicList.value = data
    }
    const pushPlayList = (data: Partial<IMusic>) => {
      modeMusicList.value.push(data as any)
      nowIndex.value = modeMusicList.value.length - 1
    }
    const pushListPlayList = (data: IMusic[]) => {
      modeMusicList.value.push(...data)
    }
    //看过的page
    const seenPages = ref(1)
    const setSeenPages = (page: number) => {
      seenPages.value = page
    }
    //之前的total
    const total = ref(Infinity)
    const setTotal = (val: number) => {
      total.value = val
    }

    /**
     * 补充之前的音乐信息
     * @param data
     */
    const supplementMusic = (data: Partial<IMusic>) => {
      const index = modeMusicList.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        modeMusicList.value[index] = { ...modeMusicList.value[index], ...data }
      }
    }

    const removePlayList = (index: number) => {
      if (index === nowIndex.value) {
        modeMusicList.value.splice(index, 1)
        nowIndex.value = (nowIndex.value - 1 + modeMusicList.value.length) % modeMusicList.value.length
        createAudio(nowMusic.value.src || '')
      } else {
        // 当前音乐播放的时间
        const currentTime = audio.value?.currentTime || 0

        modeMusicList.value.splice(index, 1)
        if (index < nowIndex.value) {
          nowIndex.value--
        }
        if (audio.value) audio.value.currentTime = currentTime
      }
    }
    const clearPlayList = () => {
      musicList.value = []
    }
    const clearSearchPlayList = () => {
      searchMusicList.value = []
    }
    const clearPersonPlayList = () => {
      personMusicList.value = []
    }
    const modeClearPlayList = computed(() => {
      switch (musicListMode.value) {
        case 0:
          return clearPlayList
        case 1:
          return clearSearchPlayList
        case 2:
          return clearPersonPlayList
        default:
          return clearPlayList
      }
    })

    /**
     * mv列表
     */
    const mvList = computed(() => {
      return modeMusicList.value.filter((item) => item.mvId)
    })

    return {
      show,
      setShow,
      miniShow,
      setMiniShow,
      playMode,
      setPlayMode,
      nowMusic,
      changeIndex,
      changeIndexUnlimited,
      nextMusic,
      prevMusic,
      musicList,
      setPlayList,
      pushPlayList,
      pushListPlayList,
      supplementMusic,
      removePlayList,
      clearPlayList,
      mvList,
      seenPages,
      setSeenPages,
      total,
      setTotal,
      modeClearPlayList,
      nowIndex,
      modeMusicList,
      musicListMode,
      setMusicListMode,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
