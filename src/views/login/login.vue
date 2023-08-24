<!-- @format -->

<template>
  <div class="" @click="back">login</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
const router = useRouter()
const back = () => {
  router.back()
}
</script>

<style scoped lang="scss"></style>
