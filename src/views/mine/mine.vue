<!-- @format -->

<template>
  <div ref="mine">
    <div class="bg" />
    <div class="setting cursor-pointer" @click="settingShow = true">
      <svg
        t="1707643319812"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="5236"
        width="32"
        height="32"
      >
        <path
          d="M512 512m-98.133333 0a98.133333 98.133333 0 1 0 196.266666 0 98.133333 98.133333 0 1 0-196.266666 0Z"
          fill="#BBC3C9"
          p-id="5237"
        ></path>
        <path
          d="M891.733333 418.133333H853.333333c-42.666667 0-64-51.2-34.133333-81.066666l25.6-25.6c17.066667-17.066667 17.066667-46.933333 0-68.266667l-68.266667-68.266667c-17.066667-17.066667-46.933333-17.066667-68.266666 0l-25.6 25.6c-29.866667 29.866667-81.066667 8.533333-81.066667-34.133333v-34.133333c0-25.6-21.333333-46.933333-46.933333-46.933334h-93.866667c-25.6 0-46.933333 21.333333-46.933333 46.933334V170.666667c0 42.666667-51.2 64-81.066667 34.133333l-21.333333-29.866667c-17.066667-17.066667-46.933333-17.066667-68.266667 0L174.933333 243.2c-17.066667 17.066667-17.066667 46.933333 0 68.266667l25.6 25.6c29.866667 29.866667 8.533333 81.066667-29.866666 81.066666h-38.4c-25.6 0-46.933333 21.333333-46.933334 46.933334v93.866666c0 25.6 21.333333 46.933333 46.933334 46.933334H170.666667c42.666667 0 64 51.2 34.133333 81.066666l-25.6 25.6c-17.066667 17.066667-17.066667 46.933333 0 68.266667l68.266667 68.266667c17.066667 17.066667 46.933333 17.066667 68.266666 0l25.6-25.6c29.866667-29.866667 81.066667-8.533333 81.066667 34.133333v34.133333c0 25.6 21.333333 46.933333 46.933333 46.933334h93.866667c25.6 0 46.933333-21.333333 46.933333-46.933334V853.333333c0-42.666667 51.2-64 81.066667-34.133333l25.6 25.6c17.066667 17.066667 46.933333 17.066667 68.266667 0l68.266666-68.266667c17.066667-17.066667 17.066667-46.933333 0-68.266666l-25.6-25.6c-29.866667-29.866667-8.533333-81.066667 34.133334-81.066667h34.133333c25.6 0 46.933333-21.333333 46.933333-46.933333v-93.866667c-4.266667-21.333333-25.6-42.666667-51.2-42.666667zM512 695.466667c-102.4 0-183.466667-81.066667-183.466667-183.466667S409.6 328.533333 512 328.533333s183.466667 81.066667 183.466667 183.466667-81.066667 183.466667-183.466667 183.466667z"
          fill="#BBC3C9"
          p-id="5238"
        ></path>
      </svg>
    </div>
    <div v-if="settingShow" @click="settingShow = false" class="setting-right">
      <div @click.stop class="panel">
        <div class="logout" v-debounce="onLogout">退出登录</div>
      </div>
    </div>
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
        <!-- <svg
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
        </svg> -->
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
    </div>
    <div class="card">
      <div class="flex items-center gap-5">
        <div v-for="(item, index) in tabList" @click="onTab(index)" :class="currentTab === index ? 'active' : 'none'">
          {{ item.name }}
        </div>
      </div>
      <div class="mt-5 home-list">
        <HomeList v-if="musicStore.modeMusicList.length" :list="musicStore.modeMusicList" type="mine" />
        <div v-if="musicStore.modeMusicList.length === total">
          <div class="text-gray-500 text-xs pb-15 pt-20 text-center">没有更多了~</div>
        </div>
        <div v-else>
          <div class="text-gray-500 text-3xl pt-40 text-center">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/store/modules/music'
import { useUserStore } from '@/store/modules/user'
import { requireImg } from '@/utils/requireImg'
import HomeList from '@/components/HomeList/index.vue'
import { useReachBottom } from '@/hooks/useReachBottom'
import { userApi } from '@/api/user'
import { useAudio } from '@/hooks/useAudio'

const router = useRouter()
const musicStore = useMusicStore()

const { getMusicSearch } = useAudio()
const params = reactive({
  page: 1,
  size: 10,
  user_id: computed(() => {
    return userStore.id
  }),
})

const total = ref(0)
const getList = () => {
  userApi.getActivityPage(params).then((res: any) => {
    if (res.ok) {
      const listRes = res.data.map((item: any) => {
        getMusicSearch({ id: item.son_id }, false)
        return {
          id: item.son_id,
          name: item.son_name,
          singer: item.son_singer,
          album: item.son_album,
          mvId: item.son_mvId,
          content: item.content,
          userId: item.user_id,
          username: item.username,
          photo: item.photo,
          activityId: item.id,
          createTime: item.create_time,
        }
      })

      musicStore.pushListPlayList(listRes)
      total.value = res.total
      console.log('list', musicStore.modeMusicList)
      console.log('total', total.value)
    }
  })
}
const onBottom = () => {
  if (musicStore.modeMusicList.length === total.value) return
  params.page++
  getList()
}

const userStore = useUserStore()
const getUser = () => {
  // 获取用户信息
  userApi.getUserInfo({}).then((res: any) => {
    userStore.setUserData(res || {})
  })
}
const mine = ref<HTMLDivElement>()
onMounted(() => {
  console.log('mine mounted')
  useReachBottom({ dom: document.getElementById('scrollId'), callback: onBottom, distance: 200 })
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
musicStore.setMiniShow(false)
musicStore.setMusicListMode(2)
musicStore.modeClearPlayList()
getUser()
getList()

const onLogout = () => {
  localStorage.clear()
  router.replace({ name: 'login' })
}
const bgUrl = computed(() => {
  return userStore.photo ? `url(${userStore.photo}) ` : '#000000'
})

const settingShow = ref(false)
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
    min-height: 60vh;
  }
}
.setting {
  position: absolute;
  top: calc(2vh + var(--statusBarHeight, 0px));
  right: 2vh;
  z-index: 101;
}
.setting-right {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: #3a3e3f42;
  top: 0;
  right: 0;
  z-index: 102;
  .panel {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40vw;
    height: 100vh;
    background: #f8f8f8;
    border-radius: 30px 0 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    // 过度动画 从右边滑入
    animation: slideInRight 0.3s;

    .logout {
      // 按钮
      background: #3ebe33;
      padding: 10px 20px;
      border-radius: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      cursor: pointer;
    }
  }
}
// 过度动画 从右边滑出
@keyframes slideInRight {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
