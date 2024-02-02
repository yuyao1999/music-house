/** @format */

import axios from 'axios'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { IResponseData } from './types'
import { useLoading } from '@/hooks/useLoading'
import { useToast } from '@/components/Toast'
import router from '@/router'
const { showLoading, hideLoading } = useLoading()
const { open, close } = useToast()

export class Http {
  private service: AxiosInstance
  //    构造器
  constructor(config: AxiosRequestConfig, headersConfig?: any) {
    //    创造实例
    this.service = axios.create(config)
    // 首先配置响应拦截

    //请求拦截 除了这些url 这些不拦截
    this.service.interceptors.request.use(
      (config) => {
        /**
         * 实现自己的业务逻辑
         * 1.开启全屏加载动画之类
         * 2.数据加密config。data
         * 3.给请求头添加信息等（token 结合sessionStorage，localStorage,vuex这些）
         *
         */
        config.headers = {
          ...headersConfig,
        }
        let unInterceptors = ['', '/chatgpt/', 'rand.music']
        let nowUrl: any = config.url
        if (unInterceptors.includes(nowUrl)) {
          return config
        }
        showLoading()
        // 多个请求时，以最后一个请求为准

        return config
      },
      (error) => {
        /* 请求错误的业务逻辑
                 1. 关闭全屏loading动画
                 2. 重定向到错误页
               */
        hideLoading()
        return Promise.reject(error) // 为了可以在代码中catch到错误信息
      }
    ) //end request.use

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        /* 
              1. 关闭全屏loading动画
              2. 数据解密
              3. 根据 response.data.code 做不同的错误处理
              4. ……
              */
        hideLoading()

        // 401 403
        if (response.data.code === 401 || response.data.code === 403) {
          localStorage.removeItem('token')
          open('登录失效，请重新登录')
          setTimeout(() => {
            router.replace({ name: 'login' })
          }, 1000)
        }
        if (response.status !== 200) {
          // ElNotification({
          //   title: "提示",
          //   type: "error",
          //   message: response.data.msg,
          // })

          return Promise.reject('error')
        }
        return response.data
      },
      (error) => {
        // ElNotification({
        //   title: "提示",
        //   type: "error",
        //   message: error,
        // })
        hideLoading()
        // 跳转到登录页
        //401 403
        localStorage.removeItem('token')
        open('登录失效，请重新登录')
        setTimeout(() => {
          router.replace({ name: 'login' })
        }, 1000)
      }
    ) //end response.use
  } //end constructor

  // get<T>这个T 是对应后面返回数值data   Promise<IResponseData<T>>  里面的T
  public get<T>(url: string, params?: any): Promise<IResponseData> {
    return this.service.get(url, { params })
  }

  public post<T>(url: string, data: any): Promise<IResponseData> {
    return this.service.post(url, data)
  }

  public request<T>(method: Method, url: string, data?: any): Promise<IResponseData> {
    return this.service.request({ method, url, data })
  }
}
