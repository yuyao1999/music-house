<!-- @format -->

<template>
  <div>
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
