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
    if (app) {
      show.value = false
      setTimeout(() => {
        app.unmount()
        app = null
        document.body.removeChild(div)
        div = null
      }, duration)
    }
  }
  return {
    open,
    close,
  }
}
