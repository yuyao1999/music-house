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
import ScrollPage from '@/components/ScrollPage/index.vue'
import Tabs from '@/components/Tabs/index.vue'

const scrollPageRef = ref<InstanceType<typeof ScrollPage>>()
const left = ref(0)

const tabsList = ref(['动态', 'MV'])
const currentIndex = ref(0)
const changeIndex = (index: number) => {
  currentIndex.value = index
  scrollPageRef.value?.changeScroll(index)
}

defineOptions({
  name: 'home',
})
const onShow = () => {}
const onHide = () => {}

const msg = ref('那天')
const router = useRouter()

const homeRef = ref<HTMLDivElement>()
onMounted(() => {
  useShow({
    el: homeRef.value,
    onShow,
    onHide,
  })
})
</script>

<style scoped lang="scss"></style>
