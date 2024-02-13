<template>
  <div>
    <div class="body">
      <div class="search statusBarHeightPaddingTop">
        <div @click="toBack" class="cursor-pointer">
          <svg
            t="1706500070344"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="14972"
            width="32"
            height="32"
          >
            <path
              d="M363.840919 472.978737C336.938714 497.358861 337.301807 537.486138 364.730379 561.486138L673.951902 832.05497C682.818816 839.813519 696.296418 838.915012 704.05497 830.048098 711.813519 821.181184 710.915012 807.703582 702.048098 799.94503L392.826577 529.376198C384.59578 522.174253 384.502227 511.835287 392.492414 504.59418L702.325747 223.807723C711.056111 215.895829 711.719614 202.404616 703.807723 193.674252 695.895829 184.943889 682.404617 184.280386 673.674253 192.192278L363.840919 472.978737Z"
              fill="#ffffff"
              p-id="14973"
            ></path>
          </svg>
        </div>
        <div class="input-content">
          <div>
            <svg
              t="1706603763744"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8243"
              width="20"
              height="20"
            >
              <path
                d="M496 96C275.09 96 96 275.08 96 496s179.09 400 400 400 400-179.08 400-400S716.91 96 496 96z m0-96c273.93 0 496 222.07 496 496 0 119.69-42.4 229.48-112.99 315.17l130.93 130.89c18.75 18.75 18.75 49.14 0 67.88-17.57 17.57-45.38 18.67-64.24 3.29l-3.65-3.29-130.88-130.93C725.48 949.6 615.69 992 496 992 222.07 992 0 769.93 0 496S222.07 0 496 0z"
                fill="#FFFFFF"
                p-id="8244"
              ></path>
            </svg>
          </div>
          <input v-focus type="text" placeholder="搜索音乐" v-model="keyword" />
          <div class="close cursor-pointer" v-if="keyword.length" @click="keyword = ''">
            <svg
              t="1706671454308"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5448"
              width="24"
              height="24"
            >
              <path
                d="M810.666667 273.066667L750.933333 213.333333 512 452.266667 273.066667 213.333333 213.333333 273.066667l238.933334 238.933333L213.333333 750.933333 273.066667 810.666667l238.933333-238.933334 238.933333 238.933334 59.733334-59.733334-238.933334-238.933333z"
                p-id="5449"
                fill="#ffffff"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <div class="list">
        <div class="h-[80%] overflow-auto">
          <div
            v-for="(item, index) in list"
            :key="item.id"
            @click="onPlay(item)"
            class="flex justify-between items-center mb-3 cursor-pointer"
          >
            <div class="flex items-center gap-3 basis-[90%] overflow-hidden">
              <div class="text-base text-gray-500 font-400 w-4 flex-shrink-0">
                {{ index + 1 }}
              </div>
              <div>
                <scrollText class="text-xl text-gray-300 font-600 w-full" :text="item.name" :max="15" />
                <scrollText
                  class="text-base text-gray-500 font-400 w-full"
                  :text="item.artists[0].name + '-' + item.album.name"
                  :max="24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { musicApi } from '@/api/music'
import { debounceRef } from '@/utils/debounceRef'
import scrollText from '@/components/scrollText/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAudio } from '@/hooks/useAudio'
import { watch, ref } from 'vue'
import { useMusicStore } from '@/store/modules/music'

const keyword = debounceRef('')
const list = ref([] as any)
watch(keyword, (val) => {
  musicApi.search({ keywords: val }).then((res: any) => {
    list.value = res.result?.songs.slice(0, 10) || []
  })
})

const router = useRouter()
const toBack = () => {
  router.back()
}
let typeShare = false
if (useRoute().query.type === 'share') {
  typeShare = true
}

const { getMusicSearch } = useAudio()
const musicStore = useMusicStore()
const onPlay = (data: any) => {
  if (typeShare) {
    router.replace({
      path: '/publish',
      query: {
        data: JSON.stringify(data),
      },
    })
    return
  }
  musicStore.setShow(true)
  musicStore.setMusicListMode(1)
  getMusicSearch(data)
}
</script>

<style scoped lang="scss">
.body {
  position: absolute;
  width: 100vw;
  min-height: 100vh;
  background: #010101;
}
.search {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 2rem 1rem;
  .input-content {
    position: relative;
    display: flex;
    align-items: center;
    width: 70%;
    gap: 1rem;
    border-bottom: 1px solid #fff;
    padding-bottom: 0.5rem;
    .close {
      position: absolute;
      right: 0;
    }
  }
  input {
    // 去掉默认样式
    border: none;
    outline: none;
    background: none;
    color: #fff;
  }
}
.list {
  padding: 0 2rem;
  .scroll-text {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
