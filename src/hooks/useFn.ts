/**
 * @description: 函数防抖
 * @param {Function} fn 需要防抖的函数
 * @param {number} delay 防抖时间
 * @return {Function} 防抖后的函数
 */
export const useDebounceFn = (fn: Function, delay: number): Function => {
  let timer: any = null
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
/**
 * @description: 函数节流
 * @param {Function} fn 需要节流的函数
 * @param {number} delay 节流时间
 * @return {Function} 节流后的函数
 */
export const useThrottleFn = (fn: Function, delay: number): Function => {
  let flag = true
  return (...args: any) => {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn(...args)
      flag = true
    }, delay)
  }
}
