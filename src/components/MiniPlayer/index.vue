<template>
  <div class="content cursor-pointer" @click="openMusic">
    <img class="img" :src="musicStore.nowMusic.cover" />
    <div class="flex-1 ml-4 w-[60%]">
      <scrollText class="text-text-lg text-white font-bold" :text="musicStore.nowMusic.name" :max="15" />
      <scrollText
        class="text-xs text-gray-300"
        :text="musicStore.nowMusic?.singer + ' - ' + musicStore.nowMusic?.album"
        :max="20"
      />
    </div>
    <button
      v-show="audioPlayFlag"
      @click.stop="audioPause"
      v-throttle
      class="hover:cursor-pointer icon-pause animate__animated animate__bounceIn ml-5"
    />
    <button
      v-show="!audioPlayFlag"
      @click.stop="audioPlay"
      v-throttle
      class="hover:cursor-pointer icon-play animate__animated animate__bounceIn ml-5"
    />
    <button
      @click.stop="listOpen"
      v-throttle
      class="w-5 h-5 ml-3 hover:cursor-pointer animate__animated animate__bounceIn"
    >
      <img src="@/assets/music/list.png" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '@/store/modules/music'
import { useAudio } from '@/hooks/useAudio'
import { useMusicList } from '@/components/MusicList'
import { useAppStore } from '@/store/modules/app'
import scrollText from '@/components/scrollText/index.vue'

const musicStore = useMusicStore()
const appStore = useAppStore()
const { open: listOpen } = useMusicList()
const { audioPlayFlag, audioPlay, audioPause } = useAudio()
console.log('audio mini', audioPlayFlag.value)
const openMusic = () => {
  musicStore.setMiniShow(false)
  musicStore.setShow(true)
}
</script>

<style scoped lang="scss">
.content {
  position: fixed;
  bottom: 7vh;
  width: 100%;
  height: 7vh;
  z-index: 100;
  border-radius: 14px 14px 0 0;
  // 背景模糊
  background: rgba(24, 24, 24, 0.445);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  padding: 0 2vh;
  .img {
    width: 5vh;
    height: 5vh;
    border-radius: 50%;
  }
}

.icon-play {
  // 播放图标 圆形 css绘制
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: v-bind('appStore.mainColor');
  position: relative;
  // 三角形
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 0.6rem solid transparent;
    border-bottom: 0.6rem solid transparent;
    // border-left: 0.9rem solid #fff;
    border-left: 0.9rem solid v-bind('appStore.darkColor');
    // 圆角
    border-radius: 0.2rem;

    // 居中
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
  }
}
.icon-pause {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 0.1rem solid v-bind('appStore.mainColor');
  position: relative;
  // 两个竖线
  &::after {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1rem;
    background: v-bind('appStore.mainColor');
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
  }
  &::before {
    content: '';
    position: absolute;
    width: 0.2rem;
    height: 1rem;
    background: v-bind('appStore.mainColor');
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
  }
}
</style>
