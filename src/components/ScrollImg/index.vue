<template>
  <div class="scroll-content" @click.self>
    <div class="w-full h-full" ref="scrollRef">
      <div v-if="topTips" class="text-light-500 text-center mt-12">已经到顶了~</div>
      <div class="scroll-item" v-for="(item, index) in musicStore.musicList" :key="index">
        <div class="p-5 pt-16 w-full h-full flex flex-col items-center">
          <img class="img" :src="item.cover" alt="" />
          <div class="username">{{ item.username }}：</div>
          <div class="text">{{ item.content || 'I like this song' }}</div>
          <div class="time">{{ formatDate(item.createTime) }}</div>
          <UserHead
            :key="headKey"
            :activity_id="item.activityId"
            :comment_count="item.comment_count"
            :like_count="item.like_count"
            :is_like="item.is_like"
            :author_user_id="item.userId"
          />
          <!-- 取消静音 -->
          <div class="unmute" v-if="index === 0 && mute" @click="onUnmute">点击取消静音</div>
        </div>
      </div>
      <div v-if="bottomTips" class="text-light-500 text-center -mt-[8vh]">没有更多了~</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/hooks/useDraggable'
import { computed, onMounted, ref, watch } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { useAudio, checkAudioPermission } from '@/hooks/useAudio'
import UserHead from '@/components/UserHead/index.vue'
import { userApi } from '@/api/user'
import { useToast } from '@/components/Toast'
import { formatDate } from '@/utils/handle-time'
import { useUserStore } from '@/store/modules/user'
import EventEmitter from '@/utils/eventEmitter'

const { open } = useToast()
let firstLoad = true
const { getMusicUrl, getMusicSearch } = useAudio()
const musicStore = useMusicStore()
musicStore.setMusicListMode(0)
musicStore.setPlayMode(2)
musicStore.setShow(false)
musicStore.modeClearPlayList()
musicStore.changeIndex(0, false)

const headKey = ref(1)
EventEmitter.once('refreshHeadDbLike', () => {
  if (!musicStore.nowMusic.is_like)
    musicStore.nowMusic.like_count = musicStore.nowMusic.like_count ? musicStore.nowMusic.like_count + 1 : 1
  musicStore.nowMusic.is_like = 1
  headKey.value++
})
EventEmitter.once('refreshHeadDel', () => {
  musicStore.nowMusic.like_count--
  headKey.value++
})

const userStore = useUserStore()
const params = ref({
  page: 1,
  size: 3,
  user_id: computed(() => {
    return userStore.id
  }),
})
params.value.page = musicStore.seenPages
musicStore.setSeenPages(musicStore.seenPages + 1)

//跳转遗漏数据
const jumpMissData = {
  page: 0,
  start: 0,
}

const getList = (type: 'top' | 'bottom') => {
  // 下次加载越界判断
  if (params.value.page * params.value.size >= musicStore.total) {
    musicStore.setSeenPages(1)
  }
  userApi.getActivityPage(params.value).then((res: any) => {
    if (res.ok) {
      const nowTotal = res.total

      if (nowTotal > musicStore.total && (musicStore.total as any) !== null) {
        const diff = nowTotal - musicStore.total
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
      } else if (type === 'top') {
        headKey.value++
        musicStore.modeClearPlayList()
        musicStore.pushListPlayList(list)

        musicStore.changeIndex(0)
        getMusicUrl(musicStore.nowMusic.id || 0)
        showIndex.value = 0

        // 回到顶部
        if (scrollRef.value) {
          scrollRef.value.style.transform = `translateY(0px)`
        }
      }
      firstLoad && getMusicUrl(musicStore.nowMusic.id || 0)
      firstLoad = false
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

const mute = ref(true)
if (checkAudioPermission()) mute.value = false
const onUnmute = () => {
  mute.value = false
  getMusicUrl(musicStore.nowMusic.id || 0)
}

onMounted(() => {
  setDraggable(scrollRef.value)
  setTimeout(() => {
    getList('bottom')
    if (!scrollRef.value) return
    const style = getComputedStyle(scrollRef.value!)
    contentHeight = parseFloat(style.height) || 500
  }, transitionTime)
})

// 滑动距离切换的值
const scrollValue = 50
// 动画时间
const transitionTime = 500
// 动画正在执行
let isTransition = false
// 容器高度
let contentHeight = 0

const onDragStart = () => {}
const onDragEnd = () => {
  if (!scrollRef.value || top.value === 0) return
  // 优化代码
  if (topTips.value || bottomTips.value) {
    // 滚动到顶部或底部 动画
    let distance
    if (topTips.value) {
      distance = 0
      if (params.value.page > 1) {
        params.value.page = 1
        musicStore.setSeenPages(params.value.page)
        open('为您刷新最新动态~')
        getList('top')
      }
    } else {
      distance = (musicStore.musicList.length - 1) * contentHeight

      params.value.page = 1
      musicStore.setSeenPages(1)
      open('为您从最新动态开始加载~')
      setTimeout(() => {
        getList('top')
      }, transitionTime)
    }

    scrollRef.value.style.transform = `translateY(-${distance}px)`
    scrollRef.value.style.transition = `transform ${transitionTime}ms ease`
    isTransition = true

    setTimeout(() => {
      if (!scrollRef.value) return
      scrollRef.value.style.transition = ``
      isTransition = false
      top.value = 0
      topTips.value = false
      bottomTips.value = false
    }, transitionTime)

    return
  }
  if (top.value < -scrollValue) {
    // 向下滑动
    showIndex.value++
    //请求数据
    if (showIndex.value === musicStore.musicList.length - 2 && !bottomTips.value) {
      if (musicStore.musicList.length < musicStore.total) {
        params.value.page++
        musicStore.setSeenPages(params.value.page + 1)
        getList('bottom')
      }
    }
  } else if (top.value > scrollValue) {
    // 向上滑动
    showIndex.value--
  }
  musicStore.changeIndexUnlimited(showIndex.value)

  isTransition = true
  scrollRef.value.style.transform = `translateY(-${showIndex.value * contentHeight}px)`
  scrollRef.value.style.transition = `transform ${transitionTime}ms ease`

  setTimeout(() => {
    if (!scrollRef.value) return
    scrollRef.value.style.transition = ``
    isTransition = false
  }, transitionTime)

  top.value = 0
}
const { setDraggable, top } = useDraggable({
  axis: 'y',
  onDragStart,
  onDragEnd,
})

const scrollRef = ref<HTMLDivElement>()
// 当前展示的数据下标
const showIndex = ref(0)
const topTips = ref(false)
const bottomTips = ref(false)

watch(
  () => top.value,
  () => {
    if (!scrollRef.value || top.value === 0) return
    if (showIndex.value === 0 && top.value > 30) {
      musicStore.setSeenPages(1)
      topTips.value = true
      return
    } else if (
      params.value.page * params.value.size >= musicStore.total &&
      top.value < -30 &&
      showIndex.value === musicStore.musicList.length - 1
    ) {
      musicStore.setSeenPages(1)
      bottomTips.value = true
      return
    }
    if (isTransition) return
    let distance
    distance = showIndex.value * contentHeight + -top.value
    scrollRef.value.style.transform = `translateY(${-distance}px)`
  }
)
</script>

<style scoped lang="scss">
.scroll-content {
  overflow: hidden;
  width: 100%;
  height: 100%;

  user-select:none .video {
    width: 100%;
    object-fit: cover;
    z-index: 1;
  }
  .scroll-item {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .img {
      height: 18rem;
      min-height: 18rem;
      max-height: 74vw;
      object-fit: cover;
      border-radius: 1rem;
      // 不允许用户拖动
      -webkit-user-drag: none;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      -webkit-user-select: none;
      -moz-user-focus: none;
      -moz-user-select: none;
    }
    .username {
      width: 80vw;
      margin-left: -0.2rem;
      margin-top: 1rem;
      padding-right: 2rem;
      color: #61e3ec;
      font-size: 1.3rem;
      font-weight: bolder;
      text-align: left;
      font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
    }
    .text {
      width: 80vw;
      margin-top: 0.5rem;
      padding-right: 1.5rem;
      color: #ffffff;
      white-space: pre-wrap;
      font-size: 1.05rem;
      line-height: 1.4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 12;
      font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
      letter-spacing: 0.1rem;
    }
    .time {
      position: absolute;
      bottom: 8vh;
      width: 100%;
      padding-right: 1rem;
      text-align: right;
      margin-top: 0.2rem;
      color: #8f8f8f;
      font-size: 0.8rem;
      font-family: 'Microsoft YaHei', Arial, Helvetica, sans-serif;
    }
    .unmute {
      position: absolute;
      bottom: 10vh;
      right: 0;
      padding: 0.5rem 1rem;
      background: #41c453bd;
      color: #fff;
      border-radius: 0.5rem 0 0 0.5rem;
      font-size: 1rem;
      z-index: 800;
    }
  }
}
</style>
