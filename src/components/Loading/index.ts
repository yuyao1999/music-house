/** @format */
import Loading from './index.vue'
// 命令式组件
import { createApp, h, ref } from 'vue'
export const useLoadingComponent = () => {
  let div: any = null
  let app: any = null
  const show = ref(true)
  const duration = 200
  const open = () => {
    if (!app) {
      div = document.createElement('div')
      document.body.appendChild(div)
      app = createApp({
        render() {
          return h(Loading, {
            show: show.value,
            duration,
          })
        },
      })
      app.mount(div)
    }
  }
  const close = () => {
    show.value = false
    setTimeout(() => {
      if (app && div) {
        app.unmount()
        app = null
        document.body.removeChild(div)
        div = null
      }

      show.value = true
    }, duration)
  }
  return {
    open,
    close,
  }
}
