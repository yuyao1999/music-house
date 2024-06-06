/** @format */

import { Http } from '../axios'
class Music {
  private http: Http
  private config = {
    //@ts-ignore
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 1000 * 30, //30秒,
    withCredentials: true,
  }
  private headersConfig = {
    Authorization: false,
    cookie:
      'MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/openapi/clientlog;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/eapi/feedback;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/api/clientlog;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/api/feedback;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/weapi/feedback;;MUSIC_U=001EE0EB0B3DB28F57BEDF25EC2A894816B1580E000C1AAC740A86808C12649F9DDE44EC088D97A5B75ED699E39A87251C592B006B14C8E0F244A347A586B872FD98D1B65845A8E9BD5704E2C5CE657038BF16FCC896A7EEE0BE5C788ED27C5669AE327FBA0121BB8B1EEB4EC020E53B7FD17ACFE8F4DB21155090AAF4B4C3182A5984F92048E42E7E2544DBB842F8777B5F4319FB1C64B9C17081FD146476DB36322D433503B168C7F75874E1D4D952458C245BE1E686227F8EC37A4C41DFDB213AB7346D2CF45AB6F827A48E83486B8B75A633E04ED742D6E323C2619CACE114DBF663D8A04E364CF6064414EA3C6E738FC2FE25F6DAC55895D240FB2977062E5BC34D7B59DEC27E2DFB1419CFD37D836C035F3E004D7B61CFC012E341D945764A0E7CA4F80A4DCA79C6C3B03A3F852FF1342782D77B102526D38EC4ACFA3F23E580E934F6A79FC7BEF21900659864A6; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/eapi/clientlog;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/neapi/clientlog;;__remember_me=true; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/eapi/feedback;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/weapi/clientlog;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/wapi/feedback;;__csrf=002285da58a680284537b5bfc9ee6427; Max-Age=1296010; Expires=Fri, 21 Jun 2024 13:05:31 GMT; Path=/;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/wapi/feedback;;MUSIC_SNS=; Max-Age=0; Expires=Thu, 06 Jun 2024 13:05:21 GMT; Path=/;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/neapi/feedback;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/neapi/feedback;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/openapi/clientlog;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/api/clientlog;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/weapi/feedback;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/weapi/clientlog;;MUSIC_R_T=0; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1717679105901; Max-Age=2147483647; Expires=Tue, 24 Jun 2092 16:19:28 GMT; Path=/api/feedback;',
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
   * 获取歌曲详情
   */
  detail(params: any) {
    return this.http.get('/song/detail', params)
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
  /**
   * 获取mv
   */
  getMv(params: any) {
    return this.http.get('/mv/url', params)
  }
  /**
   * 私人DJ
   */
  getPersonalDJ(params: any) {
    return this.http.get('/aidj/content/rcmd', params)
  }
  /**
   * 分页获取最新音乐
   */
  getNewMusic(params: any) {
    return this.http.get('/top/song', params)
  }
  /**
   * 搜索歌手
   */
  searchSinger(params: any) {
    return this.http.get('/ugc/artist/search', params)
  }
  /**
   * 歌手全部歌曲
   */
  singerSongs(params: any) {
    return this.http.get('/artist/songs', params)
  }
}
const musicApi = new Music()
export { musicApi }
