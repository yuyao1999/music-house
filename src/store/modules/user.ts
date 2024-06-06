/** @format */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { IUser } from '@/types/user'
export const useUserStore = defineStore(
  'user',
  () => {
    //#region  用户信息
    /**
     * 用户
     */
    const id = ref(0)
    const username = ref('未登录')
    const photo = ref('')
    const signature = ref('')
    const background = ref('')
    const like_count = ref(0)
    const follow_count = ref(0)
    const fans_count = ref(0)
    const setUserData = (data: IUser) => {
      data?.id && (id.value = data.id)
      data?.username && (username.value = data.username)
      data?.photo && (photo.value = data.photo)
      data?.signature && (signature.value = data.signature)
      data?.background && (background.value = data.background)
      like_count.value = data?.like_count ?? like_count.value
      follow_count.value = data?.follow_count ?? follow_count.value
      fans_count.value = data?.fans_count ?? fans_count.value
    }
    /**
     * 清空用户数据
     */
    const clearUserData = () => {
      id.value = 0
      username.value = ''
      photo.value = ''
    }
    //#endregion

    return {
      id,
      username,
      photo,
      signature,
      like_count,
      follow_count,
      fans_count,
      setUserData,
      clearUserData,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
