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
      'MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/api/feedback;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/openapi/clientlog;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/openapi/clientlog;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/api/clientlog;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/eapi/feedback;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/weapi/clientlog;;__remember_me=true; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/;;MUSIC_SNS=; Max-Age=0; Expires=Tue, 18 Jun 2024 03:07:48 GMT; Path=/;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/wapi/feedback;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/api/feedback;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/neapi/feedback;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/eapi/feedback;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/weapi/feedback;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/wapi/feedback;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/neapi/clientlog;;__csrf=6abd74f51abf7d9e5758a4dae822cb91; Max-Age=1296010; Expires=Wed, 03 Jul 2024 03:07:58 GMT; Path=/;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/weapi/feedback;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/weapi/clientlog;;MUSIC_U=0055F29616B62323AC2066B362F5EBFFAD148F95EF77984A02F52F84CBD4E5425236DAA83DA383D7107214FDD3FA1443333713C3E184526BB7291D9F9D579EB810C035259F3944C4BED6C7C2834D26CAC06DA6BC4678AEF4906042419198410FF907B9302DB559C36BA1917A420274C761669B56E2289B17C57A7E2A19E361907582BD09DC4885F9C4FCC0FE99C0272F20634C8AD7C57761C1F77A41BDEF9604047CE8C3256DCA216AAFE86EF53E6B72A5F8BC41CD28448F15D6BE28CD1EF9B02B4FE6E7CADB6AF96EA3F3EF716E9AFFFF4A97897686969F12BFE617136E3F83D57EA059C29B3FF8B108031E56EEFC8CD1A4207284D15EB6CE9DFE1E7A70013077D2D57EACF5EA173C95FCF97402CEEB37746E7A6C9E664D333202E8D0D20F2DEA2B26E709E101360556499E4F4795448C8FC02375233D66256ADA6238679429846A5BD917F65487648F95F68FFC8201B4; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/neapi/feedback;;MUSIC_A_T=1482847243547; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/eapi/clientlog;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/api/clientlog;;MUSIC_R_T=1482847264406; Max-Age=2147483647; Expires=Sun, 06 Jul 2092 06:21:55 GMT; Path=/wapi/clientlog;',
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
    return this.http.get('/song/url/v1', params)
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
