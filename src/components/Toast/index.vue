<template>
  <div class="body-yy">
    <transition
      name="custom-classes"
      :appear="true"
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut"
    >
      <div v-if="show" class="content">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  show: boolean
}
defineProps<IProps>()
</script>

<style scoped lang="scss">
.body-yy {
  position: fixed;
  z-index: 999;
  top: 50%;
  transform: translateY(-50%);
  // 水平居中 不使用transform
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 1.2rem;
    font-weight: bolder;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80vw;
  }
}
</style>
