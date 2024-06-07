<template>
  <div class="card" :id="'class' + detail.username" @click="toUser(detail.user_id, detail.id)">
    <img class="img img-none" :src="detail.photo ? detail.photo : requireImg('logo.png')" />
    <div class="title">{{ detail.username }}</div>
    <div class="btn cursor-pointer">
      <div v-if="isFollow" @click.stop="delFollow(detail.id)">已关注</div>
      <div v-else @click.stop="follow(detail.user_id)">关注</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { requireImg } from '@/utils/requireImg'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { useToast } from '@/components/Toast'
const { open } = useToast()
const router = useRouter()
const userStore = useUserStore()

interface ICardDetail {
  username: string
  photo: string
  id: string
  user_id: string
}
const props = defineProps<{
  detail: ICardDetail
}>()
// console.log('props', props.detail)
const handleClass = () => {
  nextTick(() => {
    const dom = document.getElementById('class' + props.detail.username)
    if (!dom) return
    // 在上方出现使用animate-move-up-class 动画 否则使用animate-move-down-class 动画
    const top = dom.getBoundingClientRect().top
    if (top < document.getElementById('app')?.clientHeight! / 2) {
      dom.classList.add('animate-move-up-class')
    } else {
      dom.classList.add('animate-move-down-class')
    }
  })
}
handleClass()

const isFollow = ref(true)
const toUser = (userId: string | number, is_follow: string | number) => {
  if (!isFollow.value) {
    is_follow = ''
  }
  router.push({
    path: '/mine',
    query: {
      userId,
      hidden: 'true',
      is_follow,
    },
  })
}

const follow = (follow_user_id: string) => {
  userApi
    .follow({
      user_id: userStore.id,
      follow_user_id,
    })
    .then((res) => {
      open(res.msg)
      if (res.ok) {
        isFollow.value = true
      }
    })
}
const delFollow = (id: string) => {
  userApi
    .deleteFollow({
      id,
    })
    .then((res) => {
      if (res.ok) {
        isFollow.value = false
        open(res.msg)
      }
    })
}
</script>

<style scoped lang="scss">
$distance: 5rem;
$imgWidth: 5rem;
@keyframes MoveAnimateDown {
  from {
    opacity: 0;
    transform: translate3d(0, $distance, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes MoveAnimateUp {
  from {
    // opacity: 0;
    transform: translate3d(0, -$distance, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.animate-move-down-class {
  animation: MoveAnimateDown 0.5s ease-in-out;
}
.animate-move-up-class {
  animation: MoveAnimateUp 0.5s ease-in-out;
}
.card {
  background: #444444;
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  align-items: center;
  .img {
    width: $imgWidth;
    height: $imgWidth;
    border: 0;
    border-radius: 20px;
    object-fit: fill;
    background: #000000;
  }
  .img-none {
    width: $imgWidth;
    height: $imgWidth;

    background: #000000; /*从多少度开始，到25%是#000000,37%是#fff*/
    background-size: 100% 400%;
    background-image: linear-gradient(180deg, #000000 25%, #807f7f 37%, #000000 63%);
    list-style: none;
    background-position: 0 0;
    animation: loading 0.8s infinite; /*infinite规定动画播放无限次*/
    @keyframes loading {
      // 从上到下
      0% {
        background-position: 0 100%;
      }
      100% {
        background-position: 0 0;
      }
    }
  }
  .title {
    margin-left: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    width: 60%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: white;
  }
  .btn {
    margin-left: 1rem;
    color: white;
    width: 4rem;
    height: 2rem;
    background-image: linear-gradient(108deg, #a7f712 3%, #79be6fa8 98%);
    box-shadow: 0 2px 8px 0 #498d40a8;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
  }
}
</style>
