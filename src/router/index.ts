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
  {
    path: '/publish',
    name: 'publish',
    component: () => import('@/views/publish/publish.vue'),
    meta: {
      title: '发布',
      icon: '',
    },
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/search.vue'),
    meta: {
      title: '搜索',
      icon: '',
    },
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('@/views/list/list.vue'),
    meta: {
      title: '列表',
      icon: '',
    },
  },
  {
    path: '/list2',
    name: 'list2',
    component: () => import('@/views/list/list2.vue'),
    meta: {
      title: '列表',
      icon: '',
    },
  },
  {
    path: '/list3',
    name: 'list3',
    component: () => import('@/views/list/list3.vue'),
    meta: {
      title: '列表',
      icon: '',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/404.vue'),
    meta: {
      title: '404',
      icon: '',
    },
  },
  { path: '/:pathMatch(.*)', redirect: '/404', name: 'notMatch' },
]

const router = createRouter({
  // createMemoryHistory 不展示路由 无法使用浏览器前进后退
  // history: createMemoryHistory(),

  // createHashHistory 展示路由
  history: createWebHashHistory(),
  routes,
})

export default router
