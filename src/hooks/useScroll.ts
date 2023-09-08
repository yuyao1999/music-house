import { ref } from 'vue'
//是否人工滚动歌词
export const useManualScroll = ref(false)

const initManualScroll = () => {
  setTimeout(() => {
    useManualScroll.value = false
  }, 1000)
}

const handler = (e: any, dom: any) => {
  if (!dom) return

  var ev = e || event
  if (ev.wheelDelta) {
    //google
    useManualScroll.value = true
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
    useManualScroll.value = true
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
export const useScroll = (dom: any) => {
  if (!dom) return
  dom.onmousewheel = (e: any) => {
    handler(e, dom)
  }
  dom.addEventListener('DOMMouseScroll', (e: any) => {
    handler(e, dom)
  })
}

export const removeScroll = (dom: any) => {
  if (!dom) return
  dom.onmousewheel = null
  dom.removeEventListener('DOMMouseScroll', null)
}

/**
 * 监听移动端touch事件
 */
export const useTouch = (dom: any) => {
  if (!dom) return

  let startY: number
  let endY: number
  dom.addEventListener(
    'touchstart',
    (e: any) => {
      startY = e.touches[0].pageY
      useManualScroll.value = true
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
    useManualScroll.value = false
  })
}
export const removeTouch = (dom: any) => {
  if (!dom) return
  dom.removeEventListener('touchstart', null)
  dom.removeEventListener('touchmove', null)
  dom.removeEventListener('touchend', null)
}
