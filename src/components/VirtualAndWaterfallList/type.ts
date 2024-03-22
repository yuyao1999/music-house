import type { CSSProperties } from 'vue'

export interface IVirtualWaterFallProps {
  gap: number
  column: number
  pageSize: number
  enterSize?: number
  request: (page: number, pageSize: number) => Promise<ICardItem>
  // 是否分页
  isPagination?: boolean
  //接口字段
  filed: string
}

export interface ICardItem {
  id: number | string
  style: CSSProperties
  albums: any
  total: number
  [key: string]: any
}

export interface IColumnQueue {
  list: IRenderItem[]
  height: number
}

// 渲染视图项
export interface IRenderItem {
  item: ICardItem
  y: number
  h: number
  style: CSSProperties
}

export interface IItemRect {
  width: number
  height: number
}

export interface IBookColumnQueue {
  list: IBookRenderItem[]
  height: number
}

export interface IBookRenderItem {
  item: ICardItem
  y: number
  h: number
  style: CSSProperties
}

export interface IBookItemRect {
  width: number
  height: number
}
