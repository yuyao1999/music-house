<!-- @format -->

<template>
  <div ref="mine">我的</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useShow } from '@/hooks/useShow'

onMounted(() => {
  console.log('onMounted 我的')
  useShow({
    el: mine.value,
    onShow,
    onHide,
  })
})
onUnmounted(() => {
  // console.log('onUnmounted 我的')
})
const onShow = () => {
  // console.log('onShow')
}
const onHide = () => {
  // console.log('onHide')
}
const mine = ref<HTMLDivElement>()
</script>

<style scoped lang="scss"></style>
