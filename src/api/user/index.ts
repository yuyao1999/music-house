/** @format */

import { Http } from '../axios'
class User {
  private http: Http
  private config = {
    //@ts-ignore
    baseURL: import.meta.env.VITE_API_MUSIC_BASE_URL,
    timeout: 1000 * 30, //30秒,
  }
  private headersConfig = {
    Authorization: localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : '',
  }
  constructor() {
    this.http = new Http(this.config, this.headersConfig)
  }
  /**
   * 注册
   */
  register(data: any) {
    return this.http.post('/user/register', data)
  }
  /**
   * 登录
   */
  login(data: any) {
    return this.http.post('/user/login', data)
  }
  /**
   * 获取用户信息
   */
  getUserInfo(data: any) {
    return this.http.post('/user/info', data)
  }
  /**
   * 跟新token
   */
  refreshToken(data: any) {
    return this.http.post('/user/refresh_token', data)
  }
}
const userApi = new User()
export { userApi }
