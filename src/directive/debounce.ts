import type { Directive, DirectiveBinding } from 'vue'
interface ElType extends HTMLElement {
  __handleClick__: () => any
}
const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function'
    }
    let timer: NodeJS.Timeout | null = null
    let immediate = true
    const wait = 500
    const handleClick = () => {
      if (timer) clearTimeout(timer)
      if (immediate) {
        let callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        if (callNow) {
          binding.value()
        }
      } else {
        timer = setTimeout(() => {
          binding.value()
        }, wait)
      }
    }
    el.__handleClick__ = handleClick
    el.addEventListener('click', el.__handleClick__)
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  },
}

export default debounce
