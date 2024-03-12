<template>
  <div class="body-yy" @click.self="close">
    <transition
      name="custom-classes"
      appear
      :duration="duration"
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
    >
      <div v-if="show" class="content">
        <div class="text-2xl font-700 mb-5 main-color">
          评论
          <span class="text-base font-400" v-if="total">({{ musicStore.nowMusic.comment_count }})</span>
        </div>
        <div ref="listRef" class="h-[80%] overflow-auto relative">
          <div v-if="total">
            <div v-for="(item, index) in list" :key="item.id">
              <div class="flex justify-between mb-5">
                <img
                  class="w-12 h-12 rounded-full bg-gray-500 mt-1 flex-shrink-0"
                  :src="item.photo ? item.photo : requireImg('logo.png')"
                />
                <div class="w-[80%]">
                  <div class="text-base font-400 text-gray-400 truncate">{{ item.username }}</div>
                  <div class="font-content">{{ item.content }}</div>
                  <div class="mt-1 text-sm font-300 text-gray-400 flex items-center justify-between">
                    <div>
                      {{ timeConverter(item.create_time) }}
                      <span class="text-light-500 font-bold ml-5" @click="onReplay(item)">回复</span>
                    </div>
                    <div class="flex items-center">
                      <LoveBtn
                        :is_like="item.is_like"
                        :comment_id="item.id"
                        class="love-btn"
                        @onLike="onLike"
                        @deleteLike="deleteLike"
                      />
                      <div v-if="item.like_count">{{ item.like_count }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.children_count">
                <div v-for="(subItem, index) in item.children" class="flex justify-between mb-5 pl-13">
                  <img
                    class="w-12 h-12 rounded-full bg-gray-500 mt-1 flex-shrink-0"
                    :src="userStore.photo ? userStore.photo : requireImg('logo.png')"
                  />
                  <div class="w-[80%]">
                    <div class="flex items-center justify-start gap-2">
                      <div class="text-base font-400 text-gray-400 max-w-[40%] truncate">{{ subItem.username }}</div>
                      <div
                        v-if="subItem.reply_user_id !== subItem.user_id && subItem.reply_id !== item.id"
                        class="flex gap-2 items-center max-w-[50%]"
                      >
                        <div>
                          <svg
                            t="1707558455303"
                            class="icon"
                            viewBox="0 0 1024 1024"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            p-id="4194"
                            width="12"
                            height="12"
                          >
                            <path
                              d="M385.536 102.4l398.848 364.544c12.288 10.752 19.456 26.624 19.456 43.008s-7.168 32.256-19.456 43.008l-398.848 364.544c-18.944 17.92-46.08 23.552-70.656 14.336s-40.96-31.232-43.52-57.344V145.408c2.048-26.112 18.944-48.128 43.52-57.344 24.064-9.216 51.712-3.584 70.656 14.336z"
                              fill="#ffffff"
                              p-id="4195"
                            ></path>
                          </svg>
                        </div>
                        <div class="text-base font-400 text-gray-400 truncate">
                          {{ subItem.reply_username }}
                        </div>
                      </div>
                    </div>
                    <div class="font-content">{{ subItem.content }}</div>
                    <div class="mt-1 text-sm font-300 text-gray-400 flex items-center justify-between">
                      <div>
                        {{ timeConverter(subItem.create_time) }}
                        <span class="text-light-500 font-bold ml-5" @click="onReplay(subItem)">回复</span>
                      </div>
                      <div class="flex items-center">
                        <LoveBtn
                          :is_like="subItem.is_like"
                          :comment_id="subItem.id"
                          :parentId="item.id"
                          class="love-btn"
                          @onLike="onLike"
                          @deleteLike="deleteLike"
                        />
                        <div v-if="subItem.like_count">{{ subItem.like_count }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="pl-30 flex gap-5">
                  <div
                    v-if="item.children.length !== item.children_count"
                    @click="onSecondMore(item)"
                    class="flex items-center gap-1 text-gray-400"
                  >
                    展开更多
                    <span
                      ><svg
                        t="1707571049706"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="5230"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M185.884 327.55 146.3 367.133 512.021 732.779 877.7 367.133 838.117 327.55 511.997 653.676Z"
                          p-id="5231"
                          fill="#ffffff"
                        ></path></svg
                    ></span>
                  </div>
                  <div
                    v-if="item.children.length > 3"
                    @click="onSecondRetract(item)"
                    class="flex items-center gap-1 text-gray-400"
                  >
                    收起
                    <span>
                      <svg
                        t="1707575492843"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="6497"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M506.123 361.692L131.357 736.459c-12.497 12.496-32.758 12.496-45.255 0-12.497-12.497-12.497-32.759 0-45.255l403.05-403.051c12.498-12.497 32.759-12.497 45.256 0l403.05 403.05c12.497 12.497 12.497 32.759 0 45.256-12.496 12.496-32.758 12.496-45.254 0L517.437 361.692a8 8 0 0 0-11.314 0z"
                          fill="#ffffff"
                          p-id="6498"
                        ></path></svg
                    ></span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="list.length === total" class="text-center text-gray-700 m-5">没有更多了~</div>
          </div>
          <div v-else class="text-center h-[80%] pt-20 text-2xl font-400 text-gray-400">暂无评论</div>
        </div>
        <div class="input-content">
          <textarea
            ref="textRef"
            type="textarea"
            :placeholder="placeholder"
            v-model="commentText"
            maxlength="100"
            @input="onInput"
            @blur="onBlur"
            @focus="onFocus"
          />
          <div @click="onSendDebounce" v-if="sendShow" class="btn-send cursor-pointer">发送</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { userApi } from '@/api/user'
import { IComment } from '@/types/comment'
import { timeConverter } from '@/utils/handle-time'
import LoveBtn from '@/components/LoveBtn/index.vue'
import { requireImg } from '@/utils/requireImg'
import { useUserStore } from '../../store/modules/user'
import { useToast } from '@/components/Toast'
import { debounce } from '@/utils/debounce'
import { useReachBottom } from '@/hooks/useReachBottom'
import { useMusicStore } from '@/store/modules/music'

const appStore = useAppStore()
const userStore = useUserStore()
const musicStore = useMusicStore()

interface IProps {
  show: boolean
  close: () => void
  duration: number
  activity_id: number
}
const props = defineProps<IProps>()

const listRef = ref<HTMLDivElement>()

const params = reactive({
  page: 1,
  size: 10,
  activity_id: props.activity_id,
  look_id: computed(() => userStore.id),
})

const list = ref<IComment[]>([])
const total = ref<number>(0)
const getList = (isFirst = false) => {
  if (isFirst) {
    list.value = []
    params.page = 1
  }
  userApi.getCommentPage(params).then((res: any) => {
    list.value?.push(...res.data)
    total.value = res.total
  })
}
getList(true)

const onBottom = () => {
  console.log('list.value.length', list.value.length)
  console.log('total.value', total.value)
  if (list.value.length === total.value) return

  params.page++
  getList()
}

const commentText = ref('')

const sendShow = computed(() => {
  return commentText.value.length > 0
})
const textRef = ref<HTMLTextAreaElement>()
const onInput = (e: any) => {
  if (!textRef.value) return
  // textarea内容自动撑开高度，实现高度自适应
  textRef.value.style.height = '2rem'
  textRef.value.style.height = textRef.value.scrollHeight + 'px'
}
const onBlur = () => {
  // 变为一行 超出省略号
  if (!textRef.value) return
  textRef.value.style.height = '2rem'
}
const placeholder = ref('分享你的故事叭')
const onFocus = () => {
  // 聚焦时高度自适应
  if (!textRef.value) return
  textRef.value.style.height = '2rem'
  textRef.value.style.height = textRef.value.scrollHeight + 'px'
}
const sendParams = reactive({
  user_id: userStore.id,
  activity_id: props.activity_id,
  content: computed(() => commentText.value),
  root_id: null as number | null,
  reply_id: null as number | null,
  reply_user_id: null as number | null,
})
const { open } = useToast()
const onSend = () => {
  if (!commentText.value) {
    open('请输入评论内容')
    return
  }
  userApi.sendComment(sendParams).then((res) => {
    if (res?.ok) {
      getList(true)
      commentText.value = ''
      placeholder.value = '分享你的故事叭'
      sendParams.root_id = null
      sendParams.reply_id = null
      sendParams.reply_user_id = null
      musicStore.nowMusic.comment_count++
    }
  })
}
const onSendDebounce = debounce(onSend, 300)

const onReplay = (item: IComment) => {
  placeholder.value = `回复 ${item.username}`
  sendParams.root_id = item.root_id ?? item.id
  sendParams.reply_id = item.id
  sendParams.reply_user_id = item.user_id
  textRef.value?.focus()
}
const secondParams = reactive({
  page: 2,
  size: 5,
  root_id: null as number | null,
  look_id: computed(() => userStore.id),
})
const onSecondMore = (item: IComment) => {
  secondParams.root_id = item.children[0].root_id
  userApi.getMoreChildren(secondParams).then((res: any) => {
    list.value?.find((i) => i.id === item.id)?.children.push(...res.data)
    secondParams.page++
    if (!res.data.length) {
      secondParams.page = 2
    }
  })
}
const onSecondRetract = (item: IComment) => {
  list.value?.find((i) => i.id === item.id)?.children.splice(3)
  secondParams.page = 2
}

const onLike = (comment_id: number, parentId?: number) => {
  console.log('comment_id.value', comment_id)
  userApi
    .commentLike({
      comment_id,
      user_id: userStore.id,
    })
    .then(() => {
      const id = parentId || comment_id
      const index = list.value?.findIndex((i) => i.id === id)
      if (index !== -1) {
        if (parentId) {
          const subIndex = list.value[index].children.findIndex((i) => i.id === comment_id)
          if (subIndex !== -1) {
            list.value[index].children[subIndex].like_count++
          }
        } else {
          list.value[index].like_count++
        }
      }
    })
}
const deleteLike = (comment_id: number, parentId?: number) => {
  userApi
    .commentDeleteLike({
      comment_id,
      user_id: userStore.id,
    })
    .then(() => {
      const id = parentId || comment_id
      const index = list.value?.findIndex((i) => i.id === id)
      if (index !== -1) {
        if (parentId) {
          const subIndex = list.value[index].children.findIndex((i) => i.id === comment_id)
          if (subIndex !== -1) {
            list.value[index].children[subIndex].like_count--
          }
        } else {
          list.value[index].like_count--
        }
      }
    })
}

onMounted(() => {
  console.log('listRef.value', listRef.value)
  useReachBottom({ dom: listRef.value, callback: onBottom, distance: 200 })
})
</script>

<style scoped lang="scss">
.body-yy {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  .content {
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    height: 60%;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    padding: 1rem 2rem;
    box-sizing: border-box;
    background: #020b0a;
    color: #fff;
    .font-content {
      font-size: 1.2rem;
      color: #fff;
      // 强制换行
      word-break: break-all;
    }
    .love-btn {
      font-size: 12px;
    }
    .active {
      color: #80d68cf8 !important;
      // color: v-bind('appStore.mainColor') !important;
    }
    .icon-close {
      // 用css画一个 x
      position: relative;
      top: 0.5rem;
      right: 0.5rem;
      width: 1rem;
      height: 1rem;
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: v-bind('appStore.mainColor');
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
    }
    .close {
      position: relative;
      z-index: 3;
      padding: 0.5rem;
      padding-left: 1rem;
    }
  }
  .input-content {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 10%;
    gap: 1rem;
    border-bottom: 1px solid #fff;
    textarea {
      position: absolute;
      bottom: 10%;
      // 去掉默认样式
      border: none;
      outline: none;
      background: none;
      color: #fff;
      width: 80%;
      height: fit-content;
      height: 2rem;
      padding-left: 1rem;
      resize: none;
      background: #020b0a;
      font-size: 1.2rem;
      z-index: 9;
      &:focus {
        width: 100%;
        padding-top: 1rem;
        padding-bottom: 3rem;
      }
    }
  }

  .btn-send {
    position: absolute;
    bottom: 10%;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: v-bind('appStore.mainColor');
    color: #fff;
    z-index: 10;
    right: 0;
  }
}

.main-color {
  color: v-bind('appStore.mainColor') !important;
}
</style>
