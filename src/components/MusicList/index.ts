/** @format */
import MusicList from './index.vue'
// 命令式组件
import { createApp, h, ref } from 'vue'
export const useMusicList = () => {
  let div: any = null
  let app: any = null
  const show = ref(true)
  const duration = 550
  const open = () => {
    if (!app) {
      div = document.createElement('div')
      // 动画执行中不允许点击
      div.style.pointerEvents = 'none'
      setTimeout(() => {
        div.style.pointerEvents = 'auto'
      }, duration)
      document.body.appendChild(div)
      app = createApp({
        render() {
          return h(MusicList, {
            show: show.value,
            duration,
            close,
          })
        },
      })
      app.mount(div)
    }
  }
  const close = () => {
    show.value = false
    // 动画执行中不允许点击
    div.style.pointerEvents = 'none'
    setTimeout(() => {
      div.style.pointerEvents = 'auto'
    }, duration)
    if (app && div) {
      setTimeout(() => {
        app.unmount()
        app = null
        document.body.removeChild(div)
        div = null
        show.value = true
      }, duration)
    }
  }
  return {
    open,
    close,
  }
}
