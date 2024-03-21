/**
 * 图片懒加载指令
 */
const move = {
  mounted(el: any) {
    const observer = new IntersectionObserver(
      (entries: any) => {
        // 下滑才触发 上滑不触发
        if (entries[0].isIntersecting && entries[0].boundingClientRect.top > 0) {
          el.classList.add('animate-move-class')
          observer.unobserve(el)
        }
      },
      {
        root: document.querySelector('.fs-virtual-waterfall-container') as Element,
        rootMargin: '0px 0px 10px 0px',
      }
    )
    // 监视 dom
    observer.observe(el)
  },
}
export default move
