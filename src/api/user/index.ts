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
    Authorization: true,
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
  /**
   * 发帖
   */
  sendActivity(data: any) {
    return this.http.post('/activity/add', data)
  }
  /**
   * 获取帖子列表
   */
  getActivityPage(data: any) {
    return this.http.post('/activity/page', data)
  }
  /**
   * acwing一键登录
   */
  acwingLogin(data: any) {
    return this.http.get('/account/web/apply_code4/', data)
  }
  acwingReceive(data: any) {
    return this.http.get('/account/web/receive_code4/', data)
  }
  /**
   * 获取评论
   */
  getCommentPage(data: any) {
    return this.http.post('/comment/page', data)
  }
  /**
   * 查看更多子评论
   */
  getMoreChildren(data: any) {
    return this.http.post('/comment/more_children', data)
  }
  /**
   * 发表评论
   */
  sendComment(data: any) {
    return this.http.post('/comment/add', data)
  }
  /**
   * 动态点赞
   */
  activityLike(data: any) {
    return this.http.post('/activity_like/add', data)
  }
  /**
   * 取消点赞
   */
  activityDeleteLike(data: any) {
    return this.http.post('/activity_like/delete', data)
  }
  /**
   * 评论点赞
   */
  commentLike(data: any) {
    return this.http.post('/comment_like/add', data)
  }
  /**
   * 取消评论点赞
   */
  commentDeleteLike(data: any) {
    return this.http.post('/comment_like/delete', data)
  }
}
const userApi = new User()
export { userApi }
