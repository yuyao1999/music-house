<template>
  <div class="body" ref="scrollRef">
    <div class="card" v-for="(item, index) in list" :key="item.id">
      <div class="flex items-center gap-5">
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
        <div>{{ item.username }}</div>
      </div>
      <div class="content">
        {{ item.content }}
      </div>
      <div class="music cursor-pointer" @click="toPlay(index)">
        <img :src="item.cover" class="cover" />
        <div>
          <div class="name">{{ item.name }}</div>
          <div class="singer">{{ item.singer }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IMusic } from '@/types/music'
import { useMusicStore } from '@/store/modules/music'
import { requireImg } from '@/utils/requireImg'

const musicStore = useMusicStore()

interface IProps {
  /**
   * 列表
   */
  list: IMusic[]
}
defineProps<IProps>()

const scrollRef = ref<HTMLDivElement | undefined>()

const follow = () => {
  console.log('follow')
}
const toUser = () => {
  console.log('toUser')
}
const toPlay = (index: number) => {
  musicStore.changeIndex(index)
}
</script>

<style scoped lang="scss">
.body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 10vh;
  .card {
    padding-bottom: 2rem;
    margin-bottom: 2rem;
    .head {
      position: relative;
      height: 3.5rem;
      width: 3.5rem;
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
    .content {
      margin-top: 1rem;
      white-space: pre-wrap;
      font-size: 1.15rem;
      line-height: 1.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 10;
      font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
    }
    .music {
      margin-top: 1rem;
      background-color: #384147;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-radius: 10px;
      padding: 0.5rem;
      .cover {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 10px;
      }
      .name {
        font-size: 1.15rem;
        color: #fff;
        font-weight: bold;
      }
      .singer {
        font-size: 1rem;
        color: #b9b9b9;
      }
    }
    &:not(:last-child) {
      border-bottom: 0.5px solid #f0f1f52a;
    }
  }
}
</style>
