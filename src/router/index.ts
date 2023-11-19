/** @format */

import { createRouter, createMemoryHistory, createWebHashHistory } from 'vue-router'
import LayOut from '@/layout/index.vue'

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
]

const router = createRouter({
  // createMemoryHistory 不展示路由 无法使用浏览器前进后退
  // history: createMemoryHistory(),

  // createHashHistory 展示路由
  history: createWebHashHistory(),
  routes,
})

export default router
