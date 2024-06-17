<template>
  <div class="body" ref="scrollRef">
    <div class="card" v-for="(item, index) in list" :key="item.id">
      <div class="flex items-center gap-3">
        <div class="head">
          <img class="head-img" @click="toUser(item)" :src="item.photo ? item.photo : requireImg('logo.png')" />
          <!-- 关注 -->
          <div
            v-if="!item.is_follow && item.userId !== userStore.id && type !== 'mine'"
            class="follow"
            @click="follow(item)"
          >
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
        <div class="truncate">{{ item.username }}</div>
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
    <div v-if="bottomTips" class="text-light-500 text-center mb-[15vh]">没有更多了~</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { IMusic } from '@/types/music'
import { useMusicStore } from '@/store/modules/music'
import { requireImg } from '@/utils/requireImg'
import { useReachBottom } from '@/hooks/useReachBottom'
import { useAudio } from '@/hooks/useAudio'
import { userApi } from '@/api/user'
import { useToast } from '@/components/Toast'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
const router = useRouter()
interface IProps {
  list: IMusic[]
  type: string
}
const props = defineProps<IProps>()

const { open } = useToast()
const musicStore = useMusicStore()
const { getMusicSearch } = useAudio()
console.log('musicStore')
if (props.type !== 'mine') {
  musicStore.modeClearPlayList()
}
const userStore = useUserStore()
const params = ref({
  page: 1,
  size: 10,
  user_id: computed(() => {
    return userStore.id
  }),
})
const bottomTips = ref(false)
// 是否有新数据
let hasNewData = false
//跳转遗漏数据
const jumpMissData = {
  page: 0,
  start: 0,
}
const getList = (type: 'top' | 'bottom') => {
  userApi.getActivityPage(params.value).then((res: any) => {
    if (res.ok) {
      const nowTotal = res.total
      const diff = nowTotal - musicStore.total
      if (nowTotal > musicStore.total) {
        hasNewData = true

        //定位page的位置
        const page = Math.floor(diff / params.value.size)
        params.value.page += page
        musicStore.setTotal(nowTotal)
        jumpMissData.page = params.value.page
        jumpMissData.start = diff % params.value.size

        getMissList()
        return
      }

      musicStore.setTotal(nowTotal)

      const list = res.data.map((item: any) => {
        getMusicSearch({ id: item.son_id }, false)
        return {
          ...item,
          id: item.son_id,
          name: item.son_name,
          singer: item.son_singer,
          album: item.son_album,
          mvId: item.son_mvId,
          userId: item.user_id,
          activityId: item.id,
          createTime: item.create_time,
        }
      })
      if (type === 'bottom') {
        musicStore.pushListPlayList(list)
      }
    }
  })
}

const getMissList = () => {
  const paramsMiss = {
    page: jumpMissData.page,
    size: params.value.size,
    user_id: userStore.id,
  }
  userApi.getActivityPage(paramsMiss).then((res: any) => {
    if (res.ok) {
      const list = res.data.map((item: any) => {
        getMusicSearch({ id: item.son_id }, false)
        return {
          ...item,
          id: item.son_id,
          name: item.son_name,
          singer: item.son_singer,
          album: item.son_album,
          mvId: item.son_mvId,
          userId: item.user_id,
          activityId: item.id,
          createTime: item.create_time,
        }
      })
      musicStore.pushListPlayList(list.slice(jumpMissData.start))
      jumpMissData.page = 0
    }
  })
}
const onBottom = () => {
  if (params.value.page * params.value.size >= musicStore.total) {
    bottomTips.value = true
    if (hasNewData && musicStore.musicList.length < musicStore.total) {
      hasNewData = false
      params.value.page = 1
      open('为您从最新动态开始加载~')
      musicStore.modeClearPlayList()
      getList('bottom')
      //滚动到顶部
      scrollRef.value?.scrollTo(0, 0)
      bottomTips.value = false
      return
    }
    return
  }

  params.value.page++
  getList('bottom')
}

const scrollRef = ref<HTMLDivElement | undefined>()
onMounted(() => {
  if (props.type === 'mine') return
  getList('bottom')
  useReachBottom({ dom: scrollRef.value, callback: onBottom })
})
const emits = defineEmits(['change'])
const follow = (item: IMusic) => {
  userApi
    .follow({
      user_id: userStore.id,
      follow_user_id: item.userId,
    })
    .then((res) => {
      open(res.msg)
      if (res.ok) {
        item.is_follow = res.data
        musicStore.modeMusicList.map((music) => {
          if (music.userId === musicStore.nowMusic.userId) {
            music.is_follow = res.data
          }
        })
      }
    })
}
const toUser = (item: IMusic) => {
  if (!item.userId) return
  router.push({
    path: '/mine',
    query: {
      userId: item.userId,
      hidden: 'true',
      is_follow: item.is_follow,
    },
  })
}
const toPlay = (index: number) => {
  musicStore.setMiniShow(true)
  musicStore.changeIndex(index)
}
</script>

<style scoped lang="scss">
.body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  .card {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    .head {
      position: relative;
      height: 3.5rem;
      width: 3.5rem;
      flex-shrink: 0;

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
      margin-top: 0.5rem;
      padding-left: 0.5rem;
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
      margin-top: 0.5rem;
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
      border-bottom: 1px solid #f0f1f52a;
    }
  }
}
</style>
