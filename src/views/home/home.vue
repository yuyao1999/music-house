<!-- @format -->

<template>
  <div class="flex justify-center">
    home
    <div @click="toLogin">login</div>
    <div @click="toMusic">music</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const toLogin = () => {
  router.push({ name: 'login' })
}
const toMusic = () => {
  router.push({ name: 'music' })
}
</script>

<style scoped lang="scss"></style>
