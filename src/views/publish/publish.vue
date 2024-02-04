<template>
  <div class="fixed-body">
    <PageTop title="发布动态" :onBack="onBack">
      <template #right>
        <div class="right" @click="onPublish">发布</div>
      </template>
    </PageTop>
    <div class="chose" @click="toSearch">
      <div v-if="!choseData?.name" class="flex items-center gap-1">
        <div>
          <svg
            t="1706603657451"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6282"
            width="32"
            height="32"
          >
            <path
              d="M265.906 670.203c0 0 0 0 0 0 0 87.374 70.829 158.203 158.203 158.203 87.374 0 158.203-70.829 158.203-158.203 0 0 0 0 0 0 0-87.374-70.829-158.203-158.203-158.203-87.374 0-158.203 70.829-158.203 158.203z"
              fill="#1afa29"
              p-id="6283"
            ></path>
            <path d="M512 195.594v474.609h70.313v-333.984l193.359 52.734v-123.047z" fill="#1afa29" p-id="6284"></path>
          </svg>
        </div>
        添加音乐
      </div>
      <div v-else class="music">
        <span class="font-bold truncate">{{ choseData?.name }}</span>
        <span class="mx-1">—</span>
        <span class="truncate">{{ choseData?.artists[0]?.name }}</span>
        <div class="close" @click.stop="onClose">
          <div class="icon-close" />
        </div>
      </div>
    </div>
    <div class="input">
      <textarea v-focus class="textarea" placeholder="分享一下叭~" rows="11" maxlength="150" v-model="text" />
      <div class="tips">{{ text?.length }}/150</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageTop from '@/components/PageTop/PageTop.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { useToast } from '@/components/Toast'
import { userApi } from '@/api/user'

const { open, close } = useToast()
const router = useRouter()

const choseData = ref()
const route = useRoute()
choseData.value = JSON.parse((route.query?.data as string) || '{}')

const onClose = () => {
  choseData.value = {}
}

const toSearch = () => {
  router.push({
    path: '/search',
    query: {
      type: 'share',
    },
  })
}
const onBack = () => {
  router.replace({
    path: '/home',
  })
}
const text = ref('')

const onPublish = () => {
  if (!choseData.value?.name) {
    open('请添加音乐')
    return
  }
  const params = {
    son_id: choseData.value.id,
    son_name: choseData.value.name,
    son_singer: choseData.value.artists[0].name,
    son_album: choseData.value.album.name,
    son_mvId: choseData.value.mvId,
    content: text.value,
  }
  userApi.sendActivity(params).then((res) => {
    if (!res) return
    open(res.msg)
    if (res.ok) {
      setTimeout(() => {
        router.push({
          path: '/home',
        })
      }, 1000)
    }
  })
}
</script>

<style scoped lang="scss">
.fixed-body {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.right {
  color: #fff;
  background: rgb(51, 194, 70);
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
}
.chose {
  margin: 0 2vw;
  margin-top: 5rem;
  padding: 0 0.5rem;
  height: 3rem;
  background: #313131;
  color: #fff;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .music {
    width: 100%;
    padding-right: 2rem;
    font-size: 1.2rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .close {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
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
          background: #fff;
          transform: rotate(45deg);
        }
        &::after {
          transform: rotate(-45deg);
        }
      }
    }
  }
}
.input {
  width: 100%;
  padding: 0.5rem;
  padding-top: 1.5rem;
  color: #fff;
  .textarea {
    border: 0;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    resize: none;
    border: 1px solid #505050;
  }
  .tips {
    text-align: right;
    padding-right: 1rem;
  }
}
</style>
<style>
html {
  background: #000000;
}
</style>
