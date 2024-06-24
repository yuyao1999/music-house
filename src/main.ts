/** @format */

import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import directive from './directive'
import { useUserStore } from '@/store/modules/user'

import webSee from '@/websee/core'
// import performance from '@/websee/performance'
import recordscreen from '@/websee/recordscreen'

// 权限
import './permission'
// 注入路由
import router from './router'
// 引入状态管理
import { setupStore } from '@/store'
// 引入动画
import 'animate.css'
// 引入全局样式
import '@/styles/index.scss'
// h5 app设置
import '@/utils/app-setting'

createApp(App)
  .use(router)
  .use(setupStore)
  .use(directive)
  .use(webSee, {
    dsn: import.meta.env.VITE_API_MUSIC_BASE_URL + '/report/add',
    apikey: 'music',
    // useImgUpload: true,
    silentClick: true,
    silentXhr: false,
    throttleDelayTime: 100,
    getUserId: () => {
      return useUserStore().id || '未登录'
    },
  })
  .mount('#app')

// webSee.use(performance, {})
webSee.use(recordscreen, {})
