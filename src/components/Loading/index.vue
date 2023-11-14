<template>
  <div class="body-yy">
    <transition
      name="custom-classes"
      :appear="true"
      :duration="duration"
      enter-active-class="animate__animated animate__jello"
      leave-active-class="animate__animated animate__zoomOut"
    >
      <div v-if="show">
        <div class="loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  show: boolean
  duration: number
}
defineProps<IProps>()
</script>

<style scoped lang="scss">
.body-yy {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  color: #ebebeb;
}

.loading.la-dark {
  color: #333;
}

.loading > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid currentColor;
}

.loading {
  width: 40px;
  height: 32px;
}

.loading > div {
  width: 4px;
  height: 32px;
  margin: 2px;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0;
  animation: line-scale-pulse-out 0.9s infinite cubic-bezier(0.85, 0.25, 0.37, 0.85);
}

.loading > div:nth-child(3) {
  animation-delay: -0.9s;
}

.loading > div:nth-child(2),
.loading > div:nth-child(4) {
  animation-delay: -0.7s;
}

.loading > div:nth-child(1),
.loading > div:nth-child(5) {
  animation-delay: -0.5s;
}

.loading.la-sm {
  width: 20px;
  height: 16px;
}

.loading.la-sm > div {
  width: 2px;
  height: 16px;
  margin: 1px;
  margin-top: 0;
  margin-bottom: 0;
}

.loading.la-2x {
  width: 80px;
  height: 64px;
}

.loading.la-2x > div {
  width: 8px;
  height: 64px;
  margin: 4px;
  margin-top: 0;
  margin-bottom: 0;
}

.loading.la-3x {
  width: 120px;
  height: 96px;
}

.loading.la-3x > div {
  width: 12px;
  height: 96px;
  margin: 6px;
  margin-top: 0;
  margin-bottom: 0;
}

@keyframes line-scale-pulse-out {
  0% {
    transform: scaley(1);
  }

  50% {
    transform: scaley(0.3);
  }

  100% {
    transform: scaley(1);
  }
}
</style>
