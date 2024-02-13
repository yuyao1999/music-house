/** @format */
import { ILyric } from '@/types/lyric'
export type IMusic = {
  /**
   * 歌曲id
   */
  id?: string
  /**
   * 歌曲名
   */
  name?: string
  /**
   * 歌手
   */
  singer?: string
  /**
   * 专辑
   */
  album?: string
  /**
   * 歌曲地址
   */
  src?: string
  /**
   * 歌曲封面
   */
  cover?: string
  /**
   * 歌词
   */
  lyric?: ILyric[]
  /**
   * 视频id
   */
  mvId?: number
  /**
   * 视频地址
   */
  mvSrc?: string
  /**
   * 播放了多少秒
   */
  currentTime?: number
  /**
   * 内容
   */
  content?: string
  /**
   * 发动态的作者id
   */
  userId?: string
  /**
   * 发动态的作者姓名
   */
  username?: string
  /**
   * 头像
   */
  photo?: string
  /**
   * 动态id
   */
  activityId: number
  /**
   * 动态创建时间
   */
  createTime?: string
  comment_count: number
  like_count: number
  is_like: number
}
