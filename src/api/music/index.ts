/** @format */

import { Http } from '../axios'
class Music {
  private http: Http
  private config = {
    //@ts-ignore
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 1000 * 30, //30秒,
  }
  private headersConfig = {
    // Authorization: localStorage.getItem('token'),
  }
  constructor() {
    this.http = new Http(this.config, this.headersConfig)
  }
  /**
   *  搜索
   */
  search(params: any) {
    return this.http.get('/search', params)
  }
  /**
   * 获取音乐url
   */
  getMusicUrl(params: any) {
    return this.http.get('/song/url', params)
  }
  /**
   * 获取歌词
   */
  getLyric(params: any) {
    return this.http.get('/lyric', params)
  }
}
const musicApi = new Music()
export { musicApi }
