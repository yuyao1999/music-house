<!-- @format -->

<template>
  <div ref="homeRef" class="w-full h-full">
    <ScrollPage :data="data">
      <template #music>
        <input class="border w-50" type="text" v-model="msg" />
        <div>
          <div @click="toMusic">music</div>
        </div>
        <div>
          <div @click="toLogin">login</div>
        </div>
      </template>
    </ScrollPage>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '@/hooks/useAudio'
import { useShow } from '@/hooks/useShow'
import { useMusicStore } from '@/store/modules/music'
import ScrollPage from '@/components/ScrollPage/index.vue'

const data = ref([
  {
    name: '1',
    img: 'https://p1.music.126.net/xEHCPvJXUVXbMJUefadIxA==/54975581404753.jpg',
  },
  {
    name: '2',
    img: 'https://p1.music.126.net/xEHCPvJXUVXbMJUefadIxA==/54975581404753.jpg',
  },
  {
    name: '3',
    img: 'https://p1.music.126.net/xEHCPvJXUVXbMJUefadIxA==/54975581404753.jpg',
  },
])

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
