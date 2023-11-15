/** @format */

// 节流
// 防止按钮多次点击，多次请求
import { DirectiveBinding } from 'vue'

export default {
  mounted(el: any, binding: DirectiveBinding) {
    const time = binding.value?.time || 1000
    el.timer = null
    el.addEventListener('click', () => {
      el.disabled = true
      if (el.timer !== null) {
        clearTimeout(el.timer)
        el.timer = null
        el.disabled = true
      }
      el.timer = setTimeout(() => {
        el.disabled = false
      }, time)
    })
  },
  // 元素卸载前也记得清理定时器并且移除监听事件
  beforeMount(el: any) {
    if (el.timer) {
      clearTimeout(el.timer)
      el.timer = null
    }
    el.removeEventListener('click', () => {})
  },
}
