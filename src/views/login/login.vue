<!-- @format -->

<template>
  <div>
    <div>
      个组件的多次访问就不需要重新渲染了，从而解决抖动问题。 3. 使用硬件加速 将 CSS
      动画的加速方式从软件加速改为硬件加速，通过 CSS transform 属性实现。 .fade-enter-active, .fade-leave-active {
      transition: opacity .3s ease; } .fade-enter, .fade-leave-to { opacity: 0; transform: translate3d(0, 0, 0); }
      上面这些方法都可以帮助你解决 Vue
      中路由过渡动画抖动的问题。需要注意的是，使用不同的解决方法可能会有不同的效果，你需要根据自己的需求和项目情况选择最合适的方法。
      发布于 2023-02-09 12:26・IP 属地北
    </div>
    <div class="" @click="back">login</div>
    <div @click="open">list</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useMusicList } from '@/components/MusicList'

const { open } = useMusicList()
const router = useRouter()
const back = () => {
  router.back()
}

onMounted(() => {
  console.log('onMounted login')
})
</script>

<style scoped lang="scss"></style>
