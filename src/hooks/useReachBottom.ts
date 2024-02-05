import { throttle } from '@/utils/throttle'
/**
 * useReachBottom 触底事件
 */
interface Options {
  dom: HTMLElement | undefined | null
  callback: () => void
  distance?: number
}
export const useReachBottom = (options: Options) => {
  //触底触发事件
  const onReachBottom = (e: any) => {
    const { dom, callback, distance = 50 } = options
    if (!dom) return
    const { clientHeight, scrollHeight, scrollTop } = dom
    console.log(clientHeight, scrollHeight, scrollTop)
    if (clientHeight + scrollTop + distance >= scrollHeight) {
      callback()
    }
  }
  const { dom } = options
  console.log(dom)

  if (!dom) return
  dom.addEventListener('scroll', throttle(onReachBottom), false)

  return {
    unbind: () => {
      console.log('unbind')
      dom.removeEventListener('scroll', onReachBottom, false)
    },
  }
}
