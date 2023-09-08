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
  lrc?: ILyric[]
  [key: string]: any
}
