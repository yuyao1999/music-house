/** @format */
import Toast from './index.vue'
// 命令式组件
import { createApp, h, ref } from 'vue'
export const useToast = () => {
  let div: any = null
  let app: any = null
  const show = ref(true)
  const open = (msg: string) => {
    if (!app) {
      div = document.createElement('div')
      document.body.appendChild(div)
      app = createApp({
        render() {
          return h(
            Toast,
            {
              show: show.value,
            },
            {
              default: () => msg,
            }
          )
        },
      })
      app.mount(div)
      setTimeout(() => {
        show.value = false
        setTimeout(close, 1000)
      }, 2000)
    }
  }
  const close = () => {
    if (app) {
      app.unmount()
      app = null
      document.body.removeChild(div)
      div = null
    }
  }
  return {
    open,
    close,
  }
}
