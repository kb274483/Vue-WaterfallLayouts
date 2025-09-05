// 項目資料
export interface WaterfallItem {
  id: number | string
  src: string
  alt?: string
  width?: number
  height?: number
  [key: string]: unknown
}

// 組件屬性
export interface WaterfallProps {
  items: WaterfallItem[]
  columns?: number
  gap?: number
  minColumnWidth?: number
  hoverEffect?: boolean
  fadeInAndOut?: boolean
  hoverFunction?: (item: WaterfallItem) => void
  clickFunction?: (item: WaterfallItem) => void
  hoverLeaveFunction?: (item: WaterfallItem) => void
}

// 項目位置
export interface WaterfallPosition {
  x: number
  y: number
  width: number
  height: number
}