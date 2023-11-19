import { onUnmounted } from 'vue'

interface Options {
  el: HTMLElement | undefined
  onShow?: () => void
  onHide?: () => void
}
/**
 * @description  监听dom元素的显示隐藏
 * @param {HTMLElement} el 需要监听的元素
 * @param {object} options 配置项
 * @param {function} options.onShow 显示时的回调
 * @param {function} options.onHide 隐藏时的回调
 */
export const useShow = (options: Options) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      options.onShow?.()
    } else {
      options.onHide?.()
    }
  })
  if (!options.el) return
  observer.observe(options.el)
  onUnmounted(() => {
    setTimeout(() => {
      observer.disconnect()
    }, 1000)
  })
}
