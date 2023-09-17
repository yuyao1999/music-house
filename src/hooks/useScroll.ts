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
    }, 1000)
  }
  const handler = (e: any, dom: any) => {
    console.log('handler')
    if (!dom) return
    var ev = e || event
    if (ev.deltaY) {
      initManualScroll()
      //google
      manualScroll.value = true
      if (ev.deltaY > 0) {
        // console.log('向上滚动...')
        // dom.scrollTop = dom.scrollTop - 40
      } else {
        // console.log('向下滚动...')
        // dom.scrollTop = dom.scrollTop + 40
      }
    } else if (ev.detail) {
      initManualScroll()
      //firefox
      manualScroll.value = true
      console.log('ev.detail', ev.detail)
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
      console.log('touchmove')
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
      console.log('touchend')
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
    console.log('initScroll')
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

      // 滚动结束
      // dom.onscrollend = () => {
      //   // 滚动的距离
      //   const diff = dom.scrollHeight - dom.scrollTop - dom.clientHeight
      //   console.log('onscrollend diff', Math.floor(diff / 10))
      //   options.onScrollEnd?.(Math.floor(diff / 10))
      // }
    }
  }
  return {
    initScroll,
    manualScroll,
  }
}
