<template>
  <div class="fs-book-card-container cursor-pointer" :id="'class' + props.detail.title">
    <div class="fs-book-card-image">
      <img class="img img-none" v-lazy="detail.imgSrc" />
    </div>
    <div class="fs-book-card-footer">
      <div class="title">{{ props.detail.title }}（{{ props.detail.author }}）</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, nextTick } from 'vue'

interface ICardDetail {
  title: string
  author: string
  imgSrc: string
  style: CSSProperties
  [key: string]: any
}
const props = defineProps<{
  detail: ICardDetail
}>()
const handleClass = () => {
  nextTick(() => {
    const dom = document.getElementById('class' + props.detail.title)
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
</script>

<style scoped lang="scss">
@keyframes MoveAnimateDown {
  from {
    opacity: 0;
    transform: translateY(200px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes MoveAnimateUp {
  from {
    opacity: 0;
    transform: translateY(-200px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-move-down-class {
  animation: MoveAnimateDown 0.5s ease-in-out;
}
.animate-move-up-class {
  animation: MoveAnimateUp 0.5s ease-in-out;
}
.fs-book-card {
  &-container {
    width: 100%;
    height: 100%;
    background: #010101;
  }
  &-image {
    border: none !important;
    .img {
      width: 100%;
      height: v-bind('props.detail.style.width');
      border: 0;
      border-radius: 20px;
    }
    .img-none {
      background: #eee; /*从多少度开始，到25%是#eee,37%是#fff*/
      background-size: 100% 400%;
      background-image: linear-gradient(180deg, #eee 25%, #fff 37%, #eee 63%);
      width: 100%;
      height: v-bind('props.detail.style.width');
      list-style: none;
      background-position: 0 0;
      animation: loading 0.6s infinite; /*infinite规定动画播放无限次*/
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
  }
  &-footer {
    padding: 0.2rem;
    font-size: 1.2rem;
    .title {
      word-break: break-all;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      color: rgb(255, 255, 255);
      font-weight: 800;
      margin-bottom: 0.6rem;
    }
  }
}
</style>
