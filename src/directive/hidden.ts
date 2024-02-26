import type { DirectiveBinding } from 'vue'
const hidden = {
  mounted: (el: any, binding: DirectiveBinding) => {
    // 使用class 绑定应用visibility: hidden true的时候隐藏元素
    el.style.visibility = binding.value ? 'hidden' : 'visible'
  },
}

export default hidden
