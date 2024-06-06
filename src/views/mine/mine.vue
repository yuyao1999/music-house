<!-- @format -->

<template>
  <div ref="mine">
    <div class="bg" />
    <div class="top-title statusBarHeightPaddingTop" :style="handleStyle()">
      <div v-if="userId" @click="toBack" class="cursor-pointer icon-back">
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
      <span> {{ userInfo.username }}的主页</span>
      <span v-if="scrollTop > 100" class="icon-up" @click="toTop">↑</span>
    </div>
    <div v-if="!userId" class="setting cursor-pointer" @click="settingShow = true">
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
            :src="userInfo.photo ? userInfo.photo : requireImg('logo.png')"
          />
          <div class="text-light-500 font-bold text-2xl">
            {{ userInfo.username }}
          </div>
        </div>
        <!-- 关注 -->
        <div v-if="userId && userId !== String(userStore.id)">
          <div v-if="!is_follow" class="follow-btn" @click="follow">关注</div>
          <div v-else class="follow-btn" @click="delFollow">已关注</div>
        </div>
      </div>
      <div class="text-[#ECEBEC]">
        {{ userInfo.signature }}
      </div>
      <div class="flex justify-around items-center text-[#FFFFFF] text-xl font-bold">
        <div class="flex flex-col items-center gap-1" @click="toLike">
          <div>{{ userInfo.like_count }}</div>
          <div class="text-[#f9f2f2] text-sm">获赞</div>
        </div>
        <div class="flex flex-col items-center gap-1" @click="toFollow">
          <div>{{ userInfo.follow_count }}</div>
          <div class="text-[#f9f2f2] text-sm">关注</div>
        </div>
        <div class="flex flex-col items-center gap-1" @click="toFans">
          <div>{{ userInfo.fans_count }}</div>
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
        <div v-else-if="!musicStore.modeMusicList.length">
          <div class="text-gray-500 text-3xl pt-40 text-center">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMusicStore } from '@/store/modules/music'
import { useUserStore } from '@/store/modules/user'
import { requireImg } from '@/utils/requireImg'
import HomeList from '@/components/HomeList/index.vue'
import { useReachBottom } from '@/hooks/useReachBottom'
import { userApi } from '@/api/user'
import { useAudio } from '@/hooks/useAudio'
import { throttle } from '@/utils/throttle'
import { IUser } from '@/types/user'
import { useToast } from '@/components/Toast'

const { open } = useToast()
const router = useRouter()
const musicStore = useMusicStore()
const userStore = useUserStore()

const userId = useRoute().query.userId
const bgUrl = computed(() => {
  return userInfo.value?.photo ? `url(${userInfo.value.photo}) ` : '#000000'
})

const params = reactive({
  page: 1,
  size: 10,
  user_id: computed(() => {
    return userId ?? userStore.id
  }),
})
const getList = () => {
  userApi.getActivityPublishPage(params).then((res: any) => {
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
    }
  })
}
const userInfo = ref({} as IUser)
const is_follow = ref(Number(useRoute().query.is_follow) || 0)

const getUser = () => {
  // 获取用户信息
  userApi
    .getUserInfo({
      userId,
    })
    .then((res: any) => {
      userInfo.value = res || {}
    })
}
getUser()
getList()

const { getMusicSearch } = useAudio()

const total = ref(0)

const getLikeList = () => {
  userApi.getActivityLikePage(params).then((res: any) => {
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
    }
  })
}
const onBottom = () => {
  if (musicStore.modeMusicList.length === total.value) return
  params.page++
  getList()
}

const mine = ref<HTMLDivElement>()

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
  musicStore.modeClearPlayList()
  params.page = 1
  if (index === 0) {
    getList()
  } else {
    getLikeList()
  }
  currentTab.value = index
}
musicStore.setMiniShow(false)
musicStore.setMusicListMode(2)
musicStore.modeClearPlayList()

const onLogout = () => {
  localStorage.clear()
  router.replace({ name: 'login' })
}

const follow = () => {
  userApi
    .follow({
      user_id: userStore.id,
      follow_user_id: musicStore.nowMusic.userId || userId,
    })
    .then((res) => {
      open(res.msg)
      if (res.ok) {
        is_follow.value = res.data
        musicStore.nowMusic.is_follow = res.data
        musicStore.modeMusicList.map((item) => {
          if (item.userId === musicStore.nowMusic.userId) {
            musicStore.updateMusic({
              id: item.id,
              is_follow: res.data,
            })
          }
        })
      }
    })
}
const delFollow = () => {
  userApi
    .deleteFollow({
      id: is_follow.value,
    })
    .then((res) => {
      if (res.ok) {
        is_follow.value = 0
        musicStore.modeMusicList.map((item) => {
          if (item.userId === musicStore.nowMusic.userId) {
            musicStore.updateMusic({
              id: item.id,
              is_follow: 0,
            })
          }
        })
        open(res.msg)
      }
    })
}

const settingShow = ref(false)
onMounted(() => {
  const mineDom = document.getElementById('scrollId')
  useReachBottom({ dom: mineDom, callback: onBottom, distance: 200 })
  mineDom?.addEventListener('scroll', throttle(handleScroll))
})
onUnmounted(() => {
  const mineDom = document.getElementById('scrollId')
  mineDom?.removeEventListener('scroll', handleScroll)
})

// 当前滚动条位置
const scrollTop = ref(0)
// 滚动事件
const handleScroll = () => {
  scrollTop.value = Number(document.getElementById('scrollId')?.scrollTop)
}
const toTop = () => {
  document.getElementById('scrollId')?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const toBack = () => {
  router.back()
}
const toLike = () => {
  router.push({
    name: 'likeList',
    query: {
      userId: userId ?? userStore.id,
    },
  })
}
const toFollow = () => {
  router.push({
    name: 'followList',
    query: {
      userId: userId ?? userStore.id,
    },
  })
}
const toFans = () => {
  router.push({
    name: 'fansList',
    query: {
      userId: userId ?? userStore.id,
    },
  })
}
const handleStyle = () => {
  if (userId) {
    return `
    transition:all 0.5s;
    background:#000000;
    `
  }
  if (scrollTop.value < 100) {
    return `
    opacity:0;
    `
  } else {
    return `
    transition:all 0.5s;
    background:#000000;
    `
  }
}
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
.top-title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #fff;
  z-index: 99;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    text-align: center;
    width: 70%;
    // 超出省略号
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .icon-back {
    width: 2rem;
    height: 1rem;
    font-size: 2rem;
    position: absolute;
    top: 50%;
    left: 5%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon-up {
    width: 2rem;
    height: 1rem;
    font-size: 2rem;
    position: absolute;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
    min-height: 65vh;
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
.follow-btn {
  padding: 0.5rem 1rem;
  background: #3ebe33;
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
}
</style>
