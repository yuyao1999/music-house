/** @format */

// 防止按钮多次点击，多次请求
export default {
  mounted(el: any, binding: any) {
    // 至少需要回调函数以及监听事件类型
    if (typeof binding.value.fn !== "function" || !binding.value.event) return
    let delay = 1000 // 默认延迟时间
    el.timer = null
    el.handler = function () {
      if (el.timer) {
        clearTimeout(el.timer)
        el.timer = null
      }
      el.timer = setTimeout(() => {
        binding.value.fn.apply(this, arguments)
        el.timer = null
      }, binding.value.delay || delay)
    }
    el.addEventListener(binding.value.event, el.handler)
  },
  // 元素卸载前也记得清理定时器并且移除监听事件
  beforeMount(el: any, binding: any) {
    if (el.timer) {
      clearTimeout(el.timer)
      el.timer = null
    }
    el.removeEventListener(binding.value.event, el.handler)
  },
}
