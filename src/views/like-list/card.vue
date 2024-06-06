<template>
  <div class="card" :id="'class' + detail.id" @click="toUser(detail.user_id)">
    <div class="flex items-center">
      <img class="img img-none" :src="detail.photo ? detail.photo : requireImg('logo.png')" />
      <div class="title">{{ detail.username }}</div>
      <!-- <div class="btn cursor-pointer">
        <div v-if="true">关注</div>
        <div v-else>已关注</div>
      </div> -->
    </div>
    <div class="content">
      {{ formatDate(detail.create_time) }}<br />点赞了你的动态<br />
      <span> 《{{ detail.son_name }}》 </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { requireImg } from '@/utils/requireImg'
import { formatDate } from '@/utils/handle-time'
import { useRouter } from 'vue-router'
const router = useRouter()

interface ICardDetail {
  id: string | number
  user_id: string | number
  username: string
  photo: string
  son_name: string
  create_time: string
}
const props = defineProps<{
  detail: ICardDetail
}>()
// console.log('props', props.detail)
const handleClass = () => {
  nextTick(() => {
    const dom = document.getElementById('class' + props.detail.id)
    if (!dom) return
    // 在上方出现使用animate-move-up-class 动画 否则使用animate-move-down-class 动画
    const top = dom.getBoundingClientRect().top
    if (top < document.getElementById('app')?.clientHeight!  / 2 ) {
      dom.classList.add('animate-move-up-class')
    } else {
      dom.classList.add('animate-move-down-class')
    }
  })
}
handleClass()

const toUser = (userId: string | number) => {
  router.push({
    path: '/mine',
    query: {
      userId,
      hidden: 'true',
      is_follow: '',
    },
  })
}
</script>

<style scoped lang="scss">
$distance: 5rem;
$imgWidth: 3rem;
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
  flex-direction: column;
  color: white;

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
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .content {
    margin-top: 1rem;
    font-size: 1.8rem;
    span {
      color: #a7f712;
      font-weight: 600;
    }
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
  }
}
</style>
