<!-- @format -->

<template>
  <div class="body statusBarHeightPaddingTop">
    <div class="h-[5vh]" />
    <img src="@/assets/logo.png" class="logo" />
    <div class="logo-text">音 乐 屋</div>
    <div class="content">
      <div class="title">
        {{ type === 'register' ? '注册账号' : '登录账号' }}
      </div>
      <div class="tips" v-if="type === 'register'">
        已有账号啦？
        <span class="switch" v-debounce="onSwitch"> 立即登录 </span>
      </div>
      <div class="tips" v-else>
        <span class="switch" v-debounce="onSwitch"> 注册账号 </span>
      </div>
      <div class="username">
        <input type="text" v-model="username" placeholder="请输入账号" />
        <div class="close cursor-pointer" v-if="username.length" @click="username = ''">
          <svg
            t="1706671454308"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5448"
            width="24"
            height="24"
          >
            <path
              d="M810.666667 273.066667L750.933333 213.333333 512 452.266667 273.066667 213.333333 213.333333 273.066667l238.933334 238.933333L213.333333 750.933333 273.066667 810.666667l238.933333-238.933334 238.933333 238.933334 59.733334-59.733334-238.933334-238.933333z"
              p-id="5449"
              fill="#365abb"
            ></path>
          </svg>
        </div>
      </div>
      <div class="password">
        <input type="password" v-model="password" placeholder="密码" />
        <div class="close cursor-pointer" v-if="password.length" @click="password = ''">
          <svg
            t="1706671454308"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5448"
            width="24"
            height="24"
          >
            <path
              d="M810.666667 273.066667L750.933333 213.333333 512 452.266667 273.066667 213.333333 213.333333 273.066667l238.933334 238.933333L213.333333 750.933333 273.066667 810.666667l238.933333-238.933334 238.933333 238.933334 59.733334-59.733334-238.933334-238.933333z"
              p-id="5449"
              fill="#365abb"
            ></path>
          </svg>
        </div>
      </div>
      <div v-debounce="onSubmit" class="login cursor-pointer">
        {{ type === 'register' ? '注册' : '登录' }}
      </div>

      <div class="mt-20">
        <div class="text-center">第三方账号登录</div>
        <div class="flex justify-center mt-3 gap-5">
          <div class="flex flex-col items-center gap-2 text-[0.5rem] cursor-pointer">
            <img
              class="icon-one flex-shrink-0"
              src="https://cdn.acwing.com/media/article/image/2022/10/06/100155_67a0be2145-Drawing1_8Vk4q4F.png"
            />
            AcWing
          </div>
          <div class="flex flex-col items-center gap-2 text-[0.5rem] cursor-pointer">
            <div>
              <svg
                t="1706771260856"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4021"
                width="48"
                height="48"
              >
                <path
                  d="M512 1024C229.547 1024 0 794.453 0 512S229.547 0 512 0s512 229.547 512 512-229.547 512-512 512z m264.533-410.453c-4.266-57.174-42.666-104.107-64.853-128.854 3.413-6.826 10.24-48.64-18.773-76.8v-1.706c0-111.787-80.214-192.854-180.907-192.854-100.693 0-180.907 81.067-180.907 192.854v1.706c-29.013 28.16-21.333 69.974-18.773 76.8-22.187 24.747-60.587 72.534-64.853 128.854-0.854 15.36 1.706 36.693 8.533 46.08 9.387 11.946 33.28-2.56 51.2-40.107 5.12 17.067 16.213 44.373 41.813 77.653-42.666 9.387-55.466 51.2-40.96 74.24 10.24 16.214 33.28 29.014 73.387 29.014 71.68 0 103.253-18.774 116.907-32.427 2.56-2.56 6.826-4.267 11.946-4.267s9.387 1.707 11.947 4.267c14.507 13.653 45.227 32.427 116.907 32.427 40.106 0 63.146-13.654 73.386-29.014 14.507-23.04 2.56-64.853-40.96-74.24 25.6-34.133 36.694-60.586 41.814-77.653 17.92 37.547 42.666 52.053 51.2 40.107 10.24-9.387 12.8-30.72 11.946-46.08z"
                  fill="#5EBEFF"
                  p-id="4022"
                ></path>
              </svg>
            </div>
            QQ
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { userApi } from '@/api/user'
import { useToast } from '@/components/Toast'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const { open, close } = useToast()
const username = ref('')
const password = ref('')
const router = useRouter()

const type = ref<'register' | 'login'>('register')

const onLogin = () => {
  userApi
    .login({
      username: username.value,
      password: password.value,
    })
    .then((res) => {
      if (!res) return
      console.log('res', res)
      open(res.msg)
      if (res.ok) {
        localStorage.setItem('token', res.data?.token)
        userStore.setUserData(res.data?.user)
        setTimeout(() => {
          router.push({
            path: '/home',
          })
        }, 1000)
      }
    })
}

const onRegister = () => {
  userApi
    .register({
      username: username.value,
      password: password.value,
    })
    .then((res) => {
      if (!res) return
      console.log('res', res)
      open(res.msg)
      if (res.ok) {
        onLogin()
      }
    })
}
const onSubmit = () => {
  if (type.value === 'register') {
    onRegister()
  } else {
    onLogin()
  }
}
const onSwitch = () => {
  type.value = type.value === 'register' ? 'login' : 'register'
}
</script>

<style scoped lang="scss">
.body {
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background: #00030c;
  color: #fff;
}
.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}
.logo-text {
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 1rem;
  font-family: 'KaiTi';
}
.content {
  padding: 2rem;
  margin-top: 1rem;
  .title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .username {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 2rem;
    input {
      width: 70%;
      height: 2rem;
      color: #fff;
      font-size: 1rem;
    }
  }
  .password {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    input {
      width: 70%;
      height: 2rem;
      color: #fff;
      font-size: 1rem;
    }
  }
  .close {
    position: absolute;
    right: 8%;
  }
  .login {
    width: 60%;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #365abb;
    color: #fff;
    font-weight: bolder;
    font-size: 1.3rem;
    border-radius: 0.5rem;
    margin: 0 auto;
    margin-top: 3rem;
  }
  .tips {
    margin-top: 1rem;
    color: #fff;
    font-size: 1rem;
    .switch {
      color: #647dc2;
      font-size: 1.1rem;
      font-weight: bolder;
      cursor: pointer;
    }
  }
  .icon-one {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
}
input {
  // 去掉默认样式
  outline: none;
  background: none;
  color: #fff;
  border-bottom: 1px solid #fff;

  &:focus {
    border-bottom: 2px solid #365abb !important;
    &::-webkit-input-placeholder {
      color: #365abb;
    }
  }
}
</style>
