<!-- @format -->

<template>
  <div class="flex justify-center">
    home
    <div @click="toLogin">login</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
const router = useRouter()
const toLogin = () => {
  router.push({ name: "login" })
}
</script>

<style scoped lang="scss"></style>
