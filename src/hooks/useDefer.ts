import { onUnmounted, ref } from 'vue'

export const useDefer = (maxCount: number = 100) => {
  const frameCount = ref(0)
  let refId: number
  const updateFrameCount = () => {
    refId = requestAnimationFrame(() => {
      frameCount.value++
      if (frameCount.value >= maxCount) {
        return
      }
      updateFrameCount()
    })
  }
  updateFrameCount()
  onUnmounted(() => {
    cancelAnimationFrame(refId)
  })
  const defer = (n: number) => {
    console.log('frameCount.value', n, frameCount.value)
    return frameCount.value >= n
  }
  const reset = () => {
    frameCount.value = 0
    updateFrameCount()
  }
  return {
    defer,
    reset,
  }
}
