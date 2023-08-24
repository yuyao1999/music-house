/** @format */

import { defineStore } from "pinia"
import { ref } from "vue"
import { IUser } from "@/types/user"
export const useUserStore = defineStore(
  "user",
  () => {
    //#region  用户信息
    /**
     * 用户
     */
    const id = ref("")
    const username = ref("未登录")
    const mobile = ref("")
    const setUserData = (data: IUser) => {
      data?.id && (id.value = data.id)
      data?.user_name && (username.value = data.user_name)
      data?.mobile && (mobile.value = data.mobile)
    }
    /**
     * 清空用户数据
     */
    const clearUserData = () => {
      id.value = ""
      username.value = "未登录"
      mobile.value = ""
    }
    //#endregion

    return {
      id,
      username,
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
