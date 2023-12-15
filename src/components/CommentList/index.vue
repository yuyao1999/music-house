<template>
  <div class="body-yy" @click.self="close">
    <transition
      name="custom-classes"
      appear
      :duration="duration"
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
    >
      <div v-if="show" class="content">
        <div class="text-2xl font-700 mb-5 main-color">
          评论
          <span class="text-base font-400">(56)</span>
        </div>
        <div class="h-[80%] overflow-auto" ref="listRef">
          <div class="flex items-center mb-5">
            <div class="w-12 h-12 rounded-full bg-gray-500"></div>
            <div class="ml-3">
              <div class="text-base font-700">用户名</div>
              <div class="text-sm font-400">2021-09-09 12:00:00</div>
            </div>
          </div>
          <div class="flex items-center mb-5">
            <div class="w-12 h-12 rounded-full bg-gray-500"></div>
            <div class="ml-3">
              <div class="text-base font-700">用户名</div>
              <div class="text-sm font-400">2021-09-09 12:00:00</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { onMounted, ref } from 'vue'

const appStore = useAppStore()

interface IProps {
  show: boolean
  close: () => void
  duration: number
}
defineProps<IProps>()

const onShow = () => {}
const onHide = () => {}
const listRef = ref<HTMLDivElement>()
onMounted(() => {})
</script>

<style scoped lang="scss">
.body-yy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  .content {
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    height: 60%;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    padding: 1rem 2rem;
    background: #020b0a;
    color: #fff;
    .active {
      color: #80d68cf8 !important;
      // color: v-bind('appStore.mainColor') !important;
    }
    .icon-close {
      // 用css画一个 x
      position: relative;
      top: 0.5rem;
      right: 0.5rem;
      width: 1rem;
      height: 1rem;
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: v-bind('appStore.mainColor');
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
    }
    .close {
      position: relative;
      z-index: 3;
      padding: 0.5rem;
      padding-left: 1rem;
    }
  }
}

.main-color {
  color: v-bind('appStore.mainColor') !important;
}
</style>
