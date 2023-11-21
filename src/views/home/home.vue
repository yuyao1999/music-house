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
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达
        瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达
        瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达
        瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
        达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦
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
import { useMusicStore } from '@/store/modules/music'

const musicStore = useMusicStore()

const { getMusicSearch } = useAudio()
defineOptions({
  name: 'home',
})

const onShow = () => {
  console.log('onShow')
}
const onHide = () => {
  console.log('onHide')
}

const msg = ref('那天')
const router = useRouter()

const toLogin = () => {
  router.push({ name: 'login' })
}
const toMusic = () => {
  getMusicSearch(msg.value)
  musicStore.setShow(true)
  // 传参 msg
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
