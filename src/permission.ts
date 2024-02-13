/** @format */

import router from './router'

const whiteList = ['/login'] // 不重定向白名单

// router.beforeEach(async (to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     // 不做任何处理
//     next()
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
//     }
//   }
// })

// router.afterEach((to) => {})
