/**
 * 图片懒加载指令
 */
import defaultImg from '@/assets/logo.png'
const lazy = {
  mounted(el: any, bindings: any) {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntryInit[]) => {
        if (entries[0].isIntersecting) {
          observer.unobserve(el)
          // 表示绑定的 dom 进入可视区域
          el.src = bindings.value
          // 图片加载出错时，显示默认图片
          el.onerror = () => {
            el.src = defaultImg
          }
          // 加载完成 去除.img-none
          el.onload = () => {
            el.classList.remove('img-none')
          }
        }
      },
      {
        root: document.querySelector('.virtual-waterfall-container') as Element,
        rootMargin: '0px 0px 500px 0px',
      }
    )
    // 监视 dom
    observer.observe(el)
  },
}
export default lazy
