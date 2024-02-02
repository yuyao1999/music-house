/**
 * 以逻辑分辨率为390 × 844pt为基准 移动端字体大小为 1pt = 1px 电脑端字体大小为 1pt = 2px
 * 动态计算字体大小
 * @param {number} 需要计算的字体大小
 * @param {boolean} 是否为html字体大小
 * @return {number} 计算后的字体大小
 * @return {number} -1 为宽屏
 */
export const useFont = (size: number): number => {
  const baseSize = 390 / 844
  //   当前#app设备的逻辑分辨率
  const app = document.getElementById('app')
  const width = app?.offsetWidth || 390
  const height = app?.offsetHeight || 844
  // 宽屏
  if (width > height) {
    return -1
  }
  const currentSize = width / height
  const res = size * (currentSize / baseSize)
  if (useIsMobile() && height < 740) {
    return 13
  }
  if (res > 40) {
    return 40
  }

  return res
}
/**
 * 判断是否为移动端
 */
export const useIsMobile = (): boolean => {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = false
  for (let i = 0; i < Agents.length; i++) {
    if (userAgentInfo.indexOf(Agents[i]) > 0) {
      flag = true
      break
    }
  }
  return flag
}

/**
 * 设置浏览器缩放为100% 并且禁止用户缩放
 */
export const useSetZoom = (): void => {
  // pc端 禁止用户缩放 并且设置缩放为100%
  if (!useIsMobile()) {
    document.addEventListener(
      'touchstart',
      function (event) {
        if (event.touches.length > 1) {
          event.preventDefault()
        }
      },
      { passive: false }
    )
    let lastTouchEnd = 0
    document.addEventListener(
      'touchend',
      function (event) {
        const now = new Date().getTime()
        if (now - lastTouchEnd <= 300) {
          event.preventDefault()
        }
        lastTouchEnd = now
      },
      { passive: false }
    )
    document.addEventListener(
      'gesturestart',
      function (event) {
        event.preventDefault()
      },
      { passive: false }
    )
    document.addEventListener(
      'keydown',
      function (event) {
        if (event.ctrlKey && (event.keyCode === 187 || event.keyCode === 189 || event.keyCode === 48)) {
          event.preventDefault()
        }
      },
      { passive: false }
    )
    document.addEventListener(
      'mousewheel',
      function (event: any) {
        if (event.ctrlKey) {
          event.preventDefault()
        }
      },
      { passive: false }
    )
    document.addEventListener(
      'DOMMouseScroll',
      function (event: any) {
        if (event.ctrlKey) {
          event.preventDefault()
        }
      },
      { passive: false }
    )
  }
}
