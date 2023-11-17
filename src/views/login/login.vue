<!-- @format -->

<template>
  <div class="" @click="back">login</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
const router = useRouter()
const back = () => {
  router.back()
}

onMounted(() => {
  console.log('onMounted login')
})
</script>

<style scoped lang="scss"></style>
