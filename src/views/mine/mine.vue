<!-- @format -->

<template>
  <div>
    <div class="bg" />
    <div class="px-7 flex flex-col gap-4 relative z-2">
      <div class="flex justify-between items-center mt-[10vh]">
        <div class="flex items-center gap-5">
          <img
            class="w-20 rounded-full border-2 border-[#878787]"
            :src="userStore.photo ? userStore.photo : requireImg('logo.png')"
          />
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
        {{ userStore.signature }}
      </div>
      <div class="flex justify-around items-center text-[#FFFFFF] text-xl font-bold">
        <div class="flex flex-col items-center gap-1">
          <div>{{ userStore.like_count }}</div>
          <div class="text-[#f9f2f2] text-sm">获赞</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div>{{ userStore.follow_count }}</div>
          <div class="text-[#f9f2f2] text-sm">关注</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div>{{ userStore.fans_count }}</div>
          <div class="text-[#f9f2f2] text-sm">粉丝</div>
        </div>
      </div>
      <div class="text-light-500" v-debounce="onLogout">退出登录</div>
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useShow } from '@/hooks/useShow'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/store/modules/music'
import { useUserStore } from '@/store/modules/user'
import { requireImg } from '@/utils/requireImg'
import HomeList from '@/components/HomeList/index.vue'
import { useReachBottom } from '@/hooks/useReachBottom'
import { userApi } from '@/api/user'

const callback = () => {
  console.log('callBack mine')
}

const userStore = useUserStore()
const getUser = () => {
  // 获取用户信息
  userApi.getUserInfo({}).then((res: any) => {
    userStore.setUserData(res || {})
  })
}
getUser()
onMounted(() => {
  useReachBottom({ dom: document.getElementById('scrollId'), callback, distance: 200 })
  useShow({
    el: mine.value,
    onShow,
    onHide,
  })
})
onUnmounted(() => {})

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

const onShow = () => {}
const onHide = () => {}
const mine = ref<HTMLDivElement>()

const router = useRouter()
const toLogin = () => {
  router.push({ name: 'login' })
}
const text = ref('1')
const musicStore = useMusicStore()

const onLogout = () => {
  localStorage.clear()
  router.replace({ name: 'login' })
}
const bgUrl = computed(() => {
  return userStore.photo ? `url(${userStore.photo}) ` : '#000000'
})
</script>

<style scoped lang="scss">
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 40vh;
  background: v-bind('bgUrl') no-repeat center;
  background-size: cover;
  scale: 1.5;
  filter: blur(40px);
  z-index: 1;
}
.card {
  position: relative;
  margin-top: 2vh;
  z-index: 3;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #3a3e3f;
  border-radius: 30px 30px 0 0;
  transition: all 0.3s;
  padding: 1.4rem;

  .active {
    font-size: 1.3rem;
    font-weight: bolder;
    color: #fcfafa;
  }
  .none {
    font-weight: normal;
    color: #9fa5a7;
  }

  .home-list {
    color: rgb(255, 255, 255);
  }
}
</style>
