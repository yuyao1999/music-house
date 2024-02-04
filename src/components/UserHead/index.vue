<template>
  <div class="user">
    <!-- 头像 -->
    <div class="head">
      <img
        class="head-img"
        @click="toUser"
        :src="musicStore.nowMusic.photo ? musicStore.nowMusic.photo : requireImg('logo.png')"
      />
      <!-- 关注 -->
      <div class="follow" @click="follow">
        <svg
          t="1706086669137"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="20512"
          width="20"
          height="20"
        >
          <path
            d="M512 0c282.758737 0 512 229.241263 512 512s-229.241263 512-512 512S0 794.758737 0 512 229.241263 0 512 0z"
            fill="#EE0A24"
            p-id="20513"
          ></path>
          <path
            d="M512.835368 269.473684c-28.294737 0-51.253895 22.878316-51.253894 51.065263v140.39579h-140.853895c-28.294737 0-51.253895 22.851368-51.253895 51.065263 0 28.186947 22.932211 51.065263 51.253895 51.065263l140.853895-0.026947v140.422737c0 28.213895 22.959158 51.065263 51.253894 51.065263 28.294737 0 51.253895-22.851368 51.253895-51.065263l-0.026947-140.422737h140.934737A51.146105 51.146105 0 0 0 754.526316 512c0-27.540211-21.908211-50.122105-49.529263-51.065263h-140.934737v-140.39579c0-28.186947-22.905263-51.038316-51.2-51.065263z"
            fill="#FFFFFF"
            p-id="20514"
            data-spm-anchor-id="a313x.search_index.0.i12.e94d3a81jMGZiO"
            class="selected"
          ></path>
        </svg>
      </div>
    </div>
    <!-- 点赞 -->
    <LoveBtn />
    <!-- 评论 -->
    <svg
      @click="commentOpen"
      t="1702610600185"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="8336"
      width="32"
      height="32"
    >
      <path
        d="M157.568 751.296c-11.008-18.688-18.219-31.221-21.803-37.91A424.885 424.885 0 0 1 85.333 512c0-235.637 191.03-426.667 426.667-426.667S938.667 276.363 938.667 512 747.637 938.667 512 938.667a424.779 424.779 0 0 1-219.125-60.502A2786.56 2786.56 0 0 0 272.82 866.4l-104.405 28.48c-23.893 6.507-45.803-15.413-39.285-39.296l28.437-104.288z m65.301 3.787l-17.258 63.306 63.306-17.258a32 32 0 0 1 24.523 3.21 4515.84 4515.84 0 0 1 32.352 18.944A360.79 360.79 0 0 0 512 874.667c200.299 0 362.667-162.368 362.667-362.667S712.299 149.333 512 149.333 149.333 311.701 149.333 512c0 60.587 14.848 118.955 42.827 171.136 3.712 6.912 12.928 22.827 27.37 47.232a32 32 0 0 1 3.34 24.715z m145.995-70.774a32 32 0 1 1 40.917-49.205A159.19 159.19 0 0 0 512 672c37.888 0 73.675-13.173 102.187-36.885a32 32 0 0 1 40.917 49.216A223.179 223.179 0 0 1 512 736a223.179 223.179 0 0 1-143.136-51.69z"
        p-id="8337"
        fill="#ffffff"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
import LoveBtn from '@/components/LoveBtn/index.vue'
import { useCommentList } from '@/components/CommentList'
import { useMusicStore } from '@/store/modules/music'
import { requireImg } from '@/utils/requireImg'

const musicStore = useMusicStore()
const { open: commentOpen } = useCommentList()

const follow = () => {
  console.log('follow')
}
const toUser = () => {
  console.log('toUser')
}
</script>

<style scoped lang="scss">
.user {
  position: absolute;
  right: 5vw;
  top: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  z-index: 5;
  .head {
    position: relative;
    .head-img {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
    }
    .follow {
      position: absolute;
      bottom: -20%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
