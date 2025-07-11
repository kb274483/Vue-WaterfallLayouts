// 項目資料
export interface WaterfallItem {
  id: number | string
  src: string
  alt?: string
  width?: number
  height?: number
}

// 組件屬性
export interface WaterfallProps {
  items: WaterfallItem[]
  columns?: number
  gap?: number
  minColumnWidth?: number
}

// 項目位置
export interface WaterfallPosition {
  x: number
  y: number
  width: number
  height: number
}