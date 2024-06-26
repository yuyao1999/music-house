<template>
  <div>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useAudio } from '@/hooks/useAudio'
import { onMounted, ref, watch } from 'vue'
import { nextTick } from 'process'
const { audio } = useAudio()

const props = defineProps({
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
  fillStyle: {
    type: String,
    default: '#000',
  },
})

let dataArray: Uint8Array, analyser: AnalyserNode, ctx: CanvasRenderingContext2D
const canvas = ref<HTMLCanvasElement>()
const init = () => {
  if (!canvas.value) return true
  ctx = canvas.value.getContext('2d') as CanvasRenderingContext2D
  if (!audio.value) return
  canvas.value.width = props.width
  canvas.value.height = props.height
  audioPlay()
  audioDraw()
}
watch(
  () => audio.value?.src,
  (val) => {
    if (!val) return
    nextTick(() => {
      init()
    })
  },
  {
    deep: true,
    immediate: true,
  }
)

const audioPlay = () => {
  //创建音频上下文
  const audioCtx = new window.AudioContext()
  //创建音频源节点
  const source = audioCtx.createMediaElementSource(audio.value!)
  analyser = audioCtx.createAnalyser()
  analyser.fftSize = 512
  //创建数组，用于接收分析器节点的分析数据
  dataArray = new Uint8Array(analyser.frequencyBinCount)
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
}

const audioDraw = () => {
  requestAnimationFrame(audioDraw)
  const width = canvas.value?.width || 0
  const height = canvas.value?.height || 0
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  //让分析器节点分析出数据到数组中
  analyser.getByteFrequencyData(dataArray)
  //   console.log('dataArray', dataArray)
  const len = dataArray.length / 2.5
  const barWidth = width / len / 2
  ctx.fillStyle = props.fillStyle
  for (let i = 0; i < len; i++) {
    const data = dataArray[i]
    const barHeight = (data / 255) * height
    const x = i * barWidth + width / 2
    const x2 = width / 2 - (i + 1) * barWidth
    const y = height - barHeight
    ctx.fillRect(x, y, barWidth, barHeight)
    ctx.fillRect(x2, y, barWidth, barHeight)
  }
}
</script>

<style scoped lang="scss"></style>
