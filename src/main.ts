/** @format */

import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import directive from './directive'
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

createApp(App).use(router).use(setupStore).use(directive).mount('#app')

// 注册指令
