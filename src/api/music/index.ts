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
      'MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/wapi/feedback;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/neapi/clientlog;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/eapi/clientlog;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/api/feedback;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/weapi/feedback;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/wapi/clientlog;;__csrf=dd85dfa8e355e54b501f2d9e5293ea68; Max-Age=1296010; Expires=Tue, 27 Feb 2024 07:47:06 GMT; Path=/;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/weapi/clientlog;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/eapi/feedback;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/api/feedback;;__remember_me=true; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/;;MUSIC_SNS=; Max-Age=0; Expires=Mon, 12 Feb 2024 07:46:56 GMT; Path=/;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/api/clientlog;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/eapi/clientlog;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/eapi/feedback;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/neapi/feedback;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/openapi/clientlog;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/api/clientlog;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/openapi/clientlog;;MUSIC_R_T=1707705889057; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/weapi/clientlog;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/weapi/feedback;;MUSIC_U=000BDAF058503578808B31A5CAA3C9B5995D566026CC7BAD3B32714E00DC0F354553EFF4EA4126DF4A3B9A34B5E710C470AF755B790D3135916FA3F0BE45B261D632466F8E29B72C80DF769BF8F00BEE17E8B79944183E22DD9379EAA43008926DD45AF9210B05DAC5AB86338E8C127A210BD180770C8B9FEF1B424A782B9DD1ABDEAD3B22E3CBFB2FD57DE4A2B244E9B7931C46CCF564066B9F395646E5E8A376DDA357A478F89A5B541093F869E5AC0E7C575038BFC28170E1F3960FC33016F3852DA53726EF41E6695B766B2355CCC32CF6F86F38F12A4D1A5B2970DE41E2F3B6B5E738D37A56D2F099EB4341D1FD68D4BF9CB3D99B002145D03EE328B51DD1ABBAFE1D70D518ECCAFFB0EA782C02835F77183824320F02037AEC7AFF4A5646704D070CD4094180311D6E5158B98D6817B2E27A738E190DF8E00D307A4E77CCCF623DA5BF25942CA8D7C98343510AC6; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/wapi/feedback;;MUSIC_A_T=1707705888833; Max-Age=2147483647; Expires=Sat, 01 Mar 2092 11:01:03 GMT; Path=/neapi/feedback;',
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
}
const musicApi = new Music()
export { musicApi }
