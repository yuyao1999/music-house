/** @format */

import { createRouter, createMemoryHistory, createWebHashHistory } from 'vue-router'
import LayOut from '@/layout/index.vue'
import musicVue from '@/views/music/music.vue'
const routes = [
  {
    path: '/',
    name: 'root',
    component: LayOut,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/home.vue'),
        meta: {
          title: '首页',
          icon: '',
          keepAlive: true,
        },
      },
      {
        path: '/mine',
        name: 'mine',
        component: () => import('@/views/mine/mine.vue'),
        meta: {
          title: '我的',
          icon: '',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      title: '登录',
      icon: '',
    },
  },
  {
    path: '/music',
    name: 'music',
    component: musicVue,
    meta: {
      title: '音乐播放器',
      icon: '',
      keepAlive: true,
    },
  },
]

const router = createRouter({
  // createMemoryHistory 不展示路由 无法使用浏览器前进后退
  // history: createMemoryHistory(),

  // createHashHistory 展示路由
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from) {
    // 保留滚动位置
    if (from.meta.keepAlive) {
      const scrollTop = window.scrollY || 0
      sessionStorage.setItem(from.path, scrollTop.toString())
    }
    return { top: Number(sessionStorage.getItem(to.path)) || 0 }
  },
})

export default router
