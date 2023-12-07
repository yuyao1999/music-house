<!-- @format -->

<template>
  <div ref="homeRef" class="w-full h-full bg-dark-300">
    <Tabs :tabsList="tabsList" :currentIndex="currentIndex" @changeIndex="changeIndex" :left="left" />
    <ScrollPage
      ref="scrollPageRef"
      :tabsList="tabsList"
      :currentIndex="currentIndex"
      @changeIndex="changeIndex"
      @setLeft="(value) => (left = value)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudio } from '@/hooks/useAudio'
import { useShow } from '@/hooks/useShow'
import { useMusicStore } from '@/store/modules/music'
import ScrollPage from '@/components/ScrollPage/index.vue'
import Tabs from '@/components/Tabs/index.vue'

const scrollPageRef = ref<InstanceType<typeof ScrollPage>>()
const left = ref(0)

const tabsList = ref(['图文', 'MV', '达娃大'])
// const tabsList = ref(['图文', 'MV'])
const currentIndex = ref(0)
const changeIndex = (index: number) => {
  currentIndex.value = index
  scrollPageRef.value?.changeScroll(index)
}

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
for (let i = 4; i < 100; i++) {
  data.value.push({
    name: i.toString(),
    img: 'https://p1.music.126.net/xEHCPvJXUVXbMJUefadIxA==/54975581404753.jpg',
  })
}

const musicStore = useMusicStore()

const { getMusicSearch } = useAudio()
defineOptions({
  name: 'home',
})
const onShow = () => {
  console.log('onShow home')
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
