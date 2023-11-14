/** @format */

import { useLoadingComponent } from '@/components/Loading'
const { open, close } = useLoadingComponent()

//timeBlock内不显示loading
const timeBlock = 500
// 最短展示时间 timeMin
const timeMin = 1000
// 最长展示时间 timeMax
const timeMax = 8000

export const useLoading = () => {
  let startTime = new Date().getTime()
  let timer = Math.random() * 1000
  const showLoading = () => {
    startTime = new Date().getTime()
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      open()
      clearTimeout(timer)
    }, timeBlock)
    window.setTimeout(() => {
      close()
      clearTimeout(timer)
    }, timeMax)
  }
  const hideLoading = () => {
    const endTime = new Date().getTime()
    const resTime = endTime - startTime
    const timer2 = window.setTimeout(
      () => {
        close()
        clearTimeout(timer)
        clearTimeout(timer2)
      },
      //0 - 500 不展示 500-1000 展示1s 1000以上不延迟
      resTime < timeBlock ? 0 : resTime < timeMin ? timeMin : 0
    )
  }
  return {
    showLoading,
    hideLoading,
  }
}
