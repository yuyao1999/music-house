import { ref } from 'vue'
import { isMobile } from '@/utils/is'

interface Options {
  onScrollEnd?: (diff: number) => void
}

/**
 * @description  创建可拖动的元素
 * @param {object} options 配置项
 * @param {function} options.onScrollEnd 滚动结束的回调
 * @returns {boolean} 返回拖动的状态.manualScroll 是否正在拖动
 */
export const useScroll = (options: Options) => {
  const initManualScroll = () => {
    setTimeout(() => {
      manualScroll.value = false
    }, 2000)
  }

  const handler = (e: any, dom: any) => {
    if (!dom) return
    manualScroll.value = true
    initManualScroll()
    var ev = e || event
    if (ev.deltaY) {
      //google
      if (ev.deltaY > 0) {
        // console.log('向上滚动...')
        // dom.scrollTop = dom.scrollTop - 40
      } else {
        // console.log('向下滚动...')
        // dom.scrollTop = dom.scrollTop + 40
      }
    } else if (ev.detail) {
      //firefox
      if (ev.detail > 0) {
        // console.log('向下滚动...')
        // dom.scrollTop = dom.scrollTop + 40
      } else {
        // console.log('向上滚动...')
        // dom.scrollTop = dom.scrollTop - 40
      }
    }
  }
  const useTouch = (dom: any) => {
    if (!dom) return
    let startY: number
    let endY: number
    dom.addEventListener(
      'touchstart',
      (e: any) => {
        startY = e.touches[0].pageY
      },
      false
    )
    dom.addEventListener('touchmove', (e: any) => {
      manualScroll.value = true
      endY = e.touches[0].pageY
      if (endY - startY > 0) {
        // console.log('touchmove向下滚动...')
        // dom.scrollTop = dom.scrollTop - 40
      } else {
        // console.log('touchmove向上滚动...')
        // dom.scrollTop = dom.scrollTop + 40
      }
    })
    dom.addEventListener('touchend', (e: any) => {
      if (!manualScroll.value) return
      manualScroll.value = false
      options.onScrollEnd?.(endY - startY)
    })
  }
  const removeTouch = (dom: any) => {
    if (!dom) return
    dom.removeEventListener('touchstart', null)
    dom.removeEventListener('touchmove', null)
    dom.removeEventListener('touchend', null)
  }
  const removeScroll = (dom: any) => {
    if (!dom) return
    dom.onmousewheel = null
    dom.removeEventListener('DOMMouseScroll', null)
  }

  const manualScroll = ref(false)
  const initScroll = (dom: any) => {
    if (isMobile()) {
      useTouch(dom)
    } else {
      if (!dom) return
      dom.onwheel = (e: any) => {
        handler(e, dom)
      }
      dom.addEventListener('DOMMouseScroll', (e: any) => {
        handler(e, dom)
      })
    }
  }
  /**
   * 滚动到顶部
   */
  const scrollToTop = (dom: any) => {
    if (!dom) return
    dom.scrollTop = 0
  }
  return {
    initScroll,
    scrollToTop,
    manualScroll,
  }
}
