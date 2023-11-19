<!-- @format -->

<template>
  <div ref="homeRef">
    <div class="flex flex-col justify-center">
      <input class="border w-50" type="text" v-model="msg" />
      <div>
        瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦 达瓦达瓦达
        瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        <div @click="toMusic">music</div>

        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦
      </div>
      <div>
        <div @click="toLogin">login</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '@/hooks/useAudio'
import { useShow } from '@/hooks/useShow'

const { getMusicSearch } = useAudio()
defineOptions({
  name: 'home',
})

const onShow = () => {
  console.log('onShow')
}
const onHide = () => {
  console.log('onHide', document.getElementById('home')?.scrollTop)
}
const scrollY = ref(0)
// 获取当前滚动条位置
const getScrollY = () => {
  console.log('123123 ', document.getElementById('home')?.scrollTop)
  scrollY.value = document.getElementById('home')?.scrollTop
}

const msg = ref('那天')
const router = useRouter()

// 监听路由变化
router.afterEach((to, from) => {
  // 保持进度条的位置
  if (from.name === 'home') {
    getScrollY()
  }
  if (to.name === 'home') {
    console.log('scrollY.value', scrollY.value)
    document.getElementById('home')?.scrollTo(0, scrollY.value)
  }
})

const toLogin = () => {
  router.push({ name: 'login' })
}
const toMusic = () => {
  getMusicSearch(msg.value)

  // 传参 msg
  router.push({ name: 'music', query: { msg: msg.value } })
}
const homeRef = ref<HTMLDivElement>()
onMounted(() => {
  console.log('onMounted home')
  useShow({
    el: homeRef.value,
    onShow,
    onHide,
  })
})
</script>

<style scoped lang="scss"></style>
