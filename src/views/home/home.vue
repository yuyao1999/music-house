<!-- @format -->

<template>
  <div class="flex justify-center">
    <div @click="toLogin">login</div>
    <div @click="toMusic">music</div>
    <input class="border w-50" type="text" v-model="msg" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const msg = ref('那天')
const router = useRouter()
const toLogin = () => {
  router.push({ name: 'login' })
}
const toMusic = () => {
  // 传参 msg
  router.push({ name: 'music', query: { msg: msg.value } })
}
</script>

<style scoped lang="scss"></style>
