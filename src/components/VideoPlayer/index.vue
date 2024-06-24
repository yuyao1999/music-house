<template>
  <video ref="videoRef" v-bind="$attrs" :src="src" class="video"></video>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface IProps {
  src?: string
}

defineProps<IProps>()

const videoRef = ref<HTMLVideoElement | null>(null)
// 监听点击事件
const handleClick = () => {
  console.log('click')
  const dom = videoRef.value
  if (!dom) return
  if (dom.paused) {
    dom.play()
  } else {
    dom.pause()
  }
}
onMounted(() => {
  videoRef.value?.addEventListener('click', handleClick)
})
onUnmounted(() => {
  videoRef.value?.removeEventListener('click', handleClick)
})
</script>

<style scoped lang="scss"></style>
