/** @format */

export type IUser = {
  id: number
  username: string
  mobile: string
  photo: string
  photo: string
  like_count: number
  follow_count: number
  fans_count: number
  /**
   * 是否关注
   */
  is_follow: number
  [key: string]: any
}
