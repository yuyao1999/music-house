export interface IComment {
  id: number
  user_id: number
  username: string
  photo: string
  activity_id: number
  content: string
  like_count: number
  //根评论id
  root_id: number | null
  //回复评论id
  reply_id: number | null
  reply_user_id: number | null
  reply_username: string
  reply_user_photo: string
  //二级评论
  children: IComment[]
  children_count: number
  create_time: string

  is_like: number
  like_count: number
}
