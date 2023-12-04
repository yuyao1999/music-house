<template>
  <div class="body-yy" @click.self="close">
    <transition
      name="custom-classes"
      :appear="true"
      :duration="duration"
      enter-active-class="animate__animated animate__bounceInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
    >
      <div v-if="show" class="content">
        <div class="text-2xl font-700 mb-5 main-color">
          当前播放
          <span class="text-base font-400">({{ musicStore.musicList.length }})</span>
        </div>
        <div class="h-[80%] overflow-auto" ref="listRef">
          <div
            v-for="(item, index) in musicStore.musicList"
            @click="musicStore.changeIndex(index)"
            :key="item.id"
            class="flex justify-between items-center mb-3 cursor-pointer"
          >
            <div class="flex items-center gap-3 basis-[90%] overflow-hidden">
              <div
                class="text-base text-gray-500 font-400 w-4 flex-shrink-0"
                :class="{ 'text-current': activeFunc(item.id) }"
              >
                {{ index + 1 }}
              </div>
              <div>
                <!-- <div class="text-xl text-gray-300 font-600" :class="{ active: activeFunc(item.id) }">
                  {{ item.name }}
                </div>
                <div class="text-base text-gray-500 font-400" :class="{ active: activeFunc(item.id) }">
                  {{ item.singer }} - {{ item.album }}
                </div> -->
                <scrollText
                  class="text-xl text-gray-300 font-600 w-full"
                  :class="{ active: activeFunc(item.id) }"
                  :text="item.name"
                  :max="11"
                />
                <scrollText
                  class="text-base text-gray-500 font-400 w-full"
                  :class="{ active: activeFunc(item.id) }"
                  :text="item.singer + '-' + item.album"
                  :max="14"
                />
              </div>
            </div>
            <div @click.stop="musicStore.removePlayList(index)" class="close basis-[10%]">
              <div class="icon-close" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@/store/modules/music'
import { useAppStore } from '@/store/modules/app'
import { onMounted, onUnmounted, ref } from 'vue'
import { useShow } from '@/hooks/useShow'
import scrollText from '@/components/scrollText/index.vue'

const musicStore = useMusicStore()
const appStore = useAppStore()

interface IProps {
  show: boolean
  close: () => void
  duration: number
}
defineProps<IProps>()

const activeFunc = (id: string | undefined) => {
  return musicStore.nowMusic.id === id
}
const onShow = () => {
  if (!listRef.value) return
  const index = musicStore.nowIndex
  if (index < 4) return
  const itemHeight = (listRef.value?.children[0] as any).offsetHeight || 0
  const scrollTop = index * itemHeight - itemHeight / 2
  listRef.value?.scrollTo({
    top: scrollTop,
  })
}
const onHide = () => {}
const listRef = ref<HTMLDivElement>()
onMounted(() => {
  useShow({
    el: listRef.value,
    onShow,
    onHide,
  })
})
</script>

<style scoped lang="scss">
.body-yy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
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
