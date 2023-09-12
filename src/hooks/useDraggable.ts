import { ref } from 'vue'
import { isMobile } from '@/utils/is'

interface Options {
  onDragStart?: () => void
  onDragEnd?: () => void
  axis?: 'x' | 'y' | 'both'
}
/**
 * @description  创建可拖动的元素
 * @param {HTMLElement} el 需要拖动的元素
 * @param {object} options 配置项
 * @param {function} options.onDragStart 拖动开始的回调
 * @param {function} options.onDragEnd 拖动结束的回调
 * @param {string} options.axis 拖动的轴向，可选值为x,y,both 默认为both
 */
export const useDraggable = (options: Options) => {
  const isDragging = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const left = ref(0)
  const top = ref(0)
  const handleDragStart = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation()
    isDragging.value = true
    startX.value = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
    startY.value = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY
    options.onDragStart && options.onDragStart()
  }
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    // 阻止冒泡
    e.stopPropagation()

    if (!isDragging.value) return
    // 元素移动
    const currentX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX
    const currentY = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY
    const diffX = currentX - startX.value
    const diffY = currentY - startY.value
    if (options.axis === 'x') {
      left.value += diffX
    }
    if (options.axis === 'y') {
      top.value += diffY
    }
    if (options.axis === 'both') {
      left.value += diffX
      top.value += diffY
    }
    startX.value = currentX
    startY.value = currentY
  }
  const handleDragEnd = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation()
    console.log('handleDragEnd')
    isDragging.value = false
    options.onDragEnd && options.onDragEnd()
  }
  const resetPosition = () => {
    left.value = 0
    top.value = 0
  }
  const setPosition = (x?: number, y?: number) => {
    if (x) {
      left.value = x
    }
    if (y) {
      top.value = y
    }
  }
  const draggable = ref<HTMLElement>()

  const bindEvents = () => {
    if (isMobile()) {
      // 兼容移动端
      draggable.value?.addEventListener('touchstart', handleDragStart)
      draggable.value?.addEventListener('touchmove', handleDragMove)
      draggable.value?.addEventListener('touchend', handleDragEnd)
      draggable.value?.addEventListener('touchcancel', handleDragEnd)
    } else {
      // 兼容PC端
      window.addEventListener('mousedown', handleDragStart)
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('mouseleave', handleDragEnd)
      window.addEventListener('contextmenu', handleDragEnd)
    }
  }
  const unbindEvents = () => {
    if (isMobile()) {
      draggable.value?.removeEventListener('touchstart', handleDragStart)
      draggable.value?.removeEventListener('touchmove', handleDragMove)
      draggable.value?.removeEventListener('touchend', handleDragEnd)
      draggable.value?.removeEventListener('touchcancel', handleDragEnd)
    } else {
      window.removeEventListener('mousedown', handleDragStart)
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('mouseleave', handleDragEnd)
      window.removeEventListener('contextmenu', handleDragEnd)
    }
  }

  const setDraggable = (el: HTMLElement | undefined) => {
    console.log('setDraggable')
    if (!el) return
    draggable.value = el
    bindEvents()
  }
  const destroyDraggable = () => {
    unbindEvents()
  }
  return {
    draggable,
    setDraggable,
    destroyDraggable,
    isDragging,
    left,
    top,
    resetPosition,
    setPosition,
  }
}
