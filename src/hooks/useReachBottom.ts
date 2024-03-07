import { throttle } from '@/utils/throttle'
import { onUnmounted } from 'vue'
/**
 * useReachBottom 触底事件
 */
interface Options {
  dom: HTMLElement | undefined | null
  callback: () => void
  distance?: number
}
export const useReachBottom = (options: Options) => {
  let lastScrollTop = 0
  const { dom } = options
  if (!dom) return
  //触底触发事件
  const onReachBottom = (e: any) => {
    //只有向下滑动才触发 向上滑动不触发 优化
    const { callback, distance = 50 } = options
    if (!dom) return
    const { clientHeight, scrollHeight, scrollTop } = dom
    if (scrollTop > lastScrollTop) {
      if (clientHeight + scrollTop + distance >= scrollHeight) {
        console.log('触底了')
        callback()
      }
    }
    lastScrollTop = scrollTop
  }

  dom.addEventListener('scroll', throttle(onReachBottom))

  //取消监听
  onUnmounted(() => {
    console.log('取消监听')
    dom.removeEventListener('scroll', throttle(onReachBottom))
  })
}
