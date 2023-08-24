<!-- @format -->

<template>
  <div>
    <router-view #default="{ Component }">
      <transition
        name="custom-classes"
        enter-active-class="animate__animated animate__backInDown"
        leave-active-class="animate__animated animate__backOutDown"
      >
        <component :is="Component" />
      </transition>
    </router-view>
    <NavigationBar />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar/index.vue'
</script>

<style scoped lang="scss"></style>
