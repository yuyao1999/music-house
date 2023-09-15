import { ref } from 'vue'
import { isMobile } from '@/utils/is'

interface Options {
  onScrollEnd?: () => void
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
    }, 1000)
  }
  const handler = (e: any, dom: any) => {
    const removeScroll = (dom: any) => {
      if (!dom) return
      dom.onmousewheel = null
      dom.removeEventListener('DOMMouseScroll', null)
    }

    /**
     * 监听移动端touch事件
     */

    if (!dom) return

    var ev = e || event
    if (ev.wheelDelta) {
      //google
      manualScroll.value = true
      initManualScroll()
      if (ev.wheelDelta > 0) {
        // console.log('向上滚动...')
        // dom.scrollTop = dom.scrollTop - 40
      } else {
        // console.log('向下滚动...')
        // dom.scrollTop = dom.scrollTop + 40
      }
    } else if (ev.detail) {
      //firefox
      manualScroll.value = true
      initManualScroll()
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
        manualScroll.value = true
      },
      false
    )
    dom.addEventListener('touchmove', (e: any) => {
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
      manualScroll.value = false
    })
  }
  const removeTouch = (dom: any) => {
    if (!dom) return
    dom.removeEventListener('touchstart', null)
    dom.removeEventListener('touchmove', null)
    dom.removeEventListener('touchend', null)
  }

  const manualScroll = ref(false)
  const initScroll = (dom: any) => {
    if (isMobile()) {
      useTouch(dom)
    } else {
      if (!dom) return
      dom.onmousewheel = (e: any) => {
        handler(e, dom)
      }
      dom.addEventListener('DOMMouseScroll', (e: any) => {
        handler(e, dom)
      })
    }
  }
  return {
    initScroll,
    manualScroll,
  }
}
