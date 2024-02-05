/**
 * throttle 节流
 */
export const throttle = (fn: Function, delay = 300) => {
  let timer: number | null = null
  return function (this: any, ...args: any) {
    if (!timer) {
      timer = window.setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}
