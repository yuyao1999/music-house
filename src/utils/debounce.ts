/** @format */

/**
 * @param fn
 * @param delay
 * @param immediate
 * @returns 防抖函数
 */
export const debounce = (fn: Function, delay: number = 1000, immediate = true) => {
  // 有参数的防抖
  let timer: any = null
  return function (this: any, ...args: any[]) {
    let context = this
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, delay)
      if (callNow) {
        fn.apply(context, args)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
}

// 节流函数
export const throttle = (fn: Function, delay: number) => {
  let timer: any = null
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn()
        timer = null
      }, delay)
    }
  }
}
