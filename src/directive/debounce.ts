import { DirectiveBinding } from 'vue'
const debounce = {
  inserted: (el: any, binding: DirectiveBinding) => {
    // 没有绑定函数抛出错误
    if (typeof binding.value !== 'function') {
      throw 'debounce callback not a function'
    }

    let timer: any
    el.addEventListener('click', () => {
      if (timer) clearTimeout(timer)

      timer = setTimeout((_) => {
        binding.value()
      }, 1000)
    })
  },
}

export default debounce
