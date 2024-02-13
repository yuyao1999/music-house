/** @format */
// 命令式组件
import CommentList from './index.vue'
import { createApp, h, ref } from 'vue'
import { setBack } from '@/utils/app-setting'

export const useCommentList = () => {
  let div: any = null
  let app: any = null
  const show = ref(true)
  const duration = 350
  const open = (activity_id: number) => {
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
          return h(CommentList, {
            show: show.value,
            duration,
            close,
            activity_id,
          })
        },
      })
      app.mount(div)
      setBack(close)
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
