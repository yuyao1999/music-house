<template>
  <div class="share" v-if="song.id">
    <div class="card">
      <div class="title">你的好友给你分享了歌曲</div>
      <img :src="song.al.picUrl" class="img" alt="" />
      <div class="text">{{ song.name }} - {{ song.ar[0].name }}</div>
      <div class="btn" v-debounce="onPlay">点击播放</div>
      <div class="icon-close" @click="onClose" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { musicApi } from '@/api/music'
import { ref } from 'vue'
import { useMusicStore } from '@/store/modules/music'
import { useAudio } from '@/hooks/useAudio'
const { getMusicSearch } = useAudio()
const musicStore = useMusicStore()

const song = ref({} as any)

const isPlus = () => {
  // 判断是否是plus
  return typeof plus !== 'undefined'
}

const readClipboard = () => {
  console.log('navigator.clipboard', isPlus())
  if (isPlus() && plus.os.name == 'Android') {
    handleText(getClipValue())
  } else {
    navigator.clipboard.readText().then((text: any) => {
      handleText(text)
    })
  }
}
const handleText = (text: string) => {
  console.log('text', text)
  const shareId = text.match(/shareId=(\d+)/)?.[1]
  const lastShareId = localStorage.getItem('lastShareId') || ''
  if (lastShareId === shareId) return
  if (shareId) {
    localStorage.setItem('lastShareId', shareId)
    musicApi.detail({ ids: shareId }).then((res: any) => {
      console.log('res', res)
      song.value = res.songs[0] || {}
    })
  }
}

function getClipValue() {
  if (plus.os.name == 'Android') {
    var Context = plus.android.importClass('android.content.Context')
    var main = plus.android.runtimeMainActivity()
    var clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
    return plus.android.invoke(clip, 'getText')
  } else {
    var UIPasteboard = plus.ios.importClass('UIPasteboard')
    var generalPasteboard = UIPasteboard.generalPasteboard()
    var _val = generalPasteboard.plusCallMethod({ valueForPasteboardType: 'public.utf8-plain-text' })
    return _val || ''
  }
}

readClipboard()

document.addEventListener('visibilitychange', function () {
  let pageVisibility = document.visibilityState
  // 页面变为不可见时触发
  if (pageVisibility == 'hidden') {
    console.log('离开时间点：' + new Date())
  }
  // 页面变为可见时触发
  if (pageVisibility == 'visible') {
    console.log('重新进入时间点：' + new Date())
    document.body.focus()
    setTimeout(() => {
      readClipboard()
    }, 500)
    // DOMException: Document is not focused.
  }
})
const onPlay = () => {
  console.log('播放')
  getMusicSearch(song.value)
  song.value = {}
  musicStore.setMiniShow(false)
  musicStore.setShow(true)
}
const onClose = () => {
  song.value = {}
}

declare const plus: any
</script>

<style scoped lang="scss">
.share {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99999;

  .card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 52%;
    background-color: #fefefe;
    border-radius: 10px;
    padding: 1rem;
    .title {
      font-size: 1.1rem;
      font-weight: 400;
      text-align: center;
      color: #333;
    }

    .img {
      margin: 1rem auto;
      width: 15rem;
      height: 15rem;
      border-radius: 20px;
    }

    .text {
      font-size: 1.3rem;
      text-align: center;
      font-weight: 600;
      width: 80%;
      //   超出部分显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 1rem auto;
    }

    .btn {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background-color: #00c1c1;
      color: #fff;
      border-radius: 5px;
      font-size: 1.4rem;
      text-align: center;
      font-weight: 700;
      cursor: pointer;
    }
    .icon-close {
      position: absolute;
      bottom: -4rem;
      right: 50%;
      transform: translateX(50%);
      width: 3rem;
      height: 3rem;
      background-color: #3a3a3a;
      border-radius: 50%;
      cursor: pointer;
      &::before {
        position: absolute;
        content: '×';
        // 垂直水平居中
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        height: 3rem;
        font-size: 2.5rem;
        line-height: 2.5rem;
        // 文字垂直对齐方式 使文字垂直居中
        vertical-align: middle;
      }
    }
  }
}
</style>
