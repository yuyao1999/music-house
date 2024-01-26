<!-- @format -->

<template>
  <div>
    <div class="bg" />
    <div class="px-7 flex flex-col gap-4">
      <div class="flex justify-between items-center mt-[14vh]">
        <div class="flex items-center gap-5">
          <img class="w-20 rounded-full border-3 border-[#9A9899]" :src="userStore.avatar" />
          <div class="text-light-500 font-bold text-2xl">
            {{ userStore.username }}
          </div>
        </div>
        <svg
          t="1706144371911"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6024"
          width="34"
          height="34"
        >
          <path
            d="M512 65C265.1 65 65 265.1 65 512s200.1 447 447 447 447-200.1 447-447S758.9 65 512 65z m266.3 433c0 17.6-14.4 32-32 32H558v188.3c0 17.6-14.4 32-32 32s-32-14.4-32-32V530H305.7c-17.6 0-32-14.4-32-32s14.4-32 32-32H494V277.7c0-17.6 14.4-32 32-32s32 14.4 32 32V466h188.3c17.6 0 32 14.4 32 32z"
            fill="#81C1ED"
            p-id="6025"
          ></path>
        </svg>
      </div>
      <div class="text-[#ECEBEC]">
        {{ userStore.profile }}
      </div>
      <div class="flex justify-around items-center text-[#FFFFFF] text-xl">
        <div class="flex flex-col items-center gap-1">
          <div>{{ userStore.like }}</div>
          <div class="text-[#A5ACB4] text-sm">获赞</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div>{{ userStore.follow }}</div>
          <div class="text-[#A5ACB4] text-sm">关注</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div>{{ userStore.fans }}</div>
          <div class="text-[#A5ACB4] text-sm">粉丝</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="flex items-center gap-5">
        <div
          v-for="(item, index) in tabList"
          :key="index"
          @click="onTab(index)"
          :class="currentTab === index ? 'active' : 'none'"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="mt-5 home-list">
        <HomeList :list="musicStore.musicList" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useShow } from '@/hooks/useShow'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/store/modules/music'
import { useUserStore } from '@/store/modules/user'
import { useAudio } from '@/hooks/useAudio'
import HomeList from '@/components/HomeList/index.vue'

const userStore = useUserStore()

const { getMusicSearch } = useAudio()
onMounted(() => {
  console.log('onMounted 我的')
  useShow({
    el: mine.value,
    onShow,
    onHide,
  })
})
onUnmounted(() => {
  // console.log('onUnmounted 我的')
})

const tabList = [
  {
    name: '发布',
    value: '1',
  },
  {
    name: '喜欢',
    value: '2',
  },
]
const currentTab = ref(0)
const onTab = (index: number) => {
  currentTab.value = index
}

const onShow = () => {
  console.log('onShow mine')
}
const onHide = () => {
  console.log('onHide mine')
}
const mine = ref<HTMLDivElement>()

const router = useRouter()
const toLogin = () => {
  router.push({ name: 'login' })
}
const text = ref('1')
const musicStore = useMusicStore()
const music = () => {
  getMusicSearch(text.value)
  musicStore.setShow(true)
}
</script>

<style scoped lang="scss">
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: v-bind("userStore?.avatar ? 'url(' + userStore?.avatar + ')' : '#000000'") no-repeat center;
  filter: blur(40px);
  background-position: center center;
  scale: 1.5;
  z-index: -1;
}
.card {
  margin-top: 2vh;
  z-index: 2;
  width: 100%;
  height: 60vh;
  background: #fff;
  border-radius: 30px 30px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  padding: 1.4rem;

  .active {
    font-size: 1.3rem;
    font-weight: bolder;
  }
  .none {
    font-weight: normal;
    color: #3c3c3c;
  }

  .home-list {
    color: black;
  }
}
</style>
