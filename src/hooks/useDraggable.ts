import { ref } from 'vue'
import { isMobile } from '@/utils/is'

// 全局只允许x y 同时只能有一个元素在拖动
let dragDirection: 'x' | 'y' | '' = ''

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
    if (!isMobile()) {
      draggable.value?.addEventListener('mousemove', handleDragMove)
      draggable.value?.addEventListener('mouseup', handleDragEnd)
      draggable.value?.addEventListener('mouseleave', handleDragEnd)
    }
    isDragging.value = true
    isFirst = true
    startX.value = e instanceof MouseEvent ? e.screenX : e.touches[0].pageX
    startY.value = e instanceof MouseEvent ? e.screenY : e.touches[0].pageY
    options.onDragStart?.()
  }
  let isFirst = true
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return
    // 元素移动
    const currentX = e instanceof MouseEvent ? e.screenX : e.touches[0].pageX
    const currentY = e instanceof MouseEvent ? e.screenY : e.touches[0].pageY
    const diffX = currentX - startX.value
    const diffY = currentY - startY.value
    if (isFirst) {
      // x y 的夹角
      const angle = Math.abs(Math.atan(diffY / diffX) * (180 / Math.PI))
      // 0-20为x轴 50-90为y轴
      if (angle >= 0 && angle <= 20) {
        dragDirection = 'x'
      }
      if (angle >= 50 && angle <= 90) {
        dragDirection = 'y'
      }
      // 只允许 0-20 50-90 之间的角度
      if (angle > 20 && angle < 50 && options.axis !== 'both') {
        isDragging.value = false
        return
      }
    }

    isFirst = false

    if (options.axis === 'x' && options.axis === dragDirection) {
      left.value += diffX
    }
    if (options.axis === 'y' && options.axis === dragDirection) {
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
    isDragging.value = false
    dragDirection = ''
    options.onDragEnd?.()
    if (!isMobile()) {
      draggable.value?.removeEventListener('mouseup', handleDragEnd)
      draggable.value?.removeEventListener('mouseleave', handleDragEnd)
      draggable.value?.removeEventListener('mousemove', handleDragMove)
    }
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
      draggable.value?.addEventListener('mousedown', handleDragStart)
    }
  }
  const unbindEvents = () => {
    if (isMobile()) {
      draggable.value?.removeEventListener('touchstart', handleDragStart)
      draggable.value?.removeEventListener('touchmove', handleDragMove)
      draggable.value?.removeEventListener('touchend', handleDragEnd)
      draggable.value?.removeEventListener('touchcancel', handleDragEnd)
    } else {
      draggable.value?.removeEventListener('mousedown', handleDragStart)
      draggable.value?.removeEventListener('mouseup', handleDragEnd)
      draggable.value?.removeEventListener('mouseleave', handleDragEnd)
      draggable.value?.removeEventListener('mousemove', handleDragMove)
    }
  }

  const setDraggable = (el: HTMLElement | undefined) => {
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
