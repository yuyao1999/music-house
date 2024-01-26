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
    const id = ref('')
    const username = ref('未登录')
    const mobile = ref('')
    const avatar = ref('')
    const profile = ref('')
    const like = ref(0)
    const follow = ref(0)
    const fans = ref(0)
    const setUserData = (data: IUser) => {
      data?.id && (id.value = data.id)
      data?.username && (username.value = data.username)
      data?.mobile && (mobile.value = data.mobile)
      data?.avatar && (avatar.value = data.avatar)
      data?.profile && (profile.value = data.profile)
      like.value = data?.like ?? like.value
      follow.value = data?.follow ?? follow.value
      fans.value = data?.fans ?? fans.value
    }
    /**
     * 清空用户数据
     */
    const clearUserData = () => {
      id.value = ''
      username.value = ''
      mobile.value = ''
      avatar.value = ''
    }
    //#endregion

    return {
      id,
      username,
      avatar,
      profile,
      like,
      follow,
      fans,
      setUserData,
      mobile,
      clearUserData,
    }
  },
  {
    // 开启数据持久化
    persist: true,
  }
)
