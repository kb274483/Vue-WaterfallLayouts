import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { WaterfallItem, WaterfallPosition } from '@/types'

export function useWaterfall(
  items: WaterfallItem[],
  options: {
    columns?: number
    gap?: number
    minColumnWidth?: number
  }
){
  // 容器元素
  const containerRef = ref<HTMLElement>()
  // 項目位置
  const itemPositions = ref<Map<string | number, WaterfallPosition>>(new Map())
  // 容器高度
  const containerHeight = ref(0)
  // 是否正在加載
  const isLoading = ref(false)
  // 預設屬性
  const { 
    columns = 3, 
    gap = 10, 
    minColumnWidth = 200, 
  } = options

  // 計算實際可放入的列的數量
  const calculateColumns = computed(() => {
    if(!containerRef.value) return columns

    const containerWidth = containerRef.value.offsetWidth
    const availableColumns = Math.floor((containerWidth + gap) / (minColumnWidth + gap))

    return Math.max(Math.min(columns, availableColumns), 1)
  })

  // 計算每列的寬度
  const columnWidth = computed(() => {
    if(!containerRef.value) return minColumnWidth

    const containerWidth = containerRef.value.offsetWidth
    return (containerWidth - (calculateColumns.value - 1) * gap) / calculateColumns.value
  })

  // 計算Layout 
  const calculateLayout = async () =>{
    if(!containerRef.value || items.length === 0) return
    isLoading.value = true

    const positions = new Map<string | number, WaterfallPosition>()
    const columnHeights = new Array(calculateColumns.value).fill(0)

    for(let i = 0; i < items.length; i++){
      const item = items[i]
      const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights))
      const x = shortestColumn * (columnWidth.value + gap)
      const y = columnHeights[shortestColumn]
      const height = await getImageHeight(item.src, columnWidth.value)

      positions.set(item.id, {
        x,
        y,
        width: columnWidth.value,
        height
      })

      columnHeights[shortestColumn] += height + gap
    }

    itemPositions.value = positions
    containerHeight.value = Math.max(...columnHeights)
    isLoading.value = false
  }

  // 取得圖片高度，或預設高度
  const getImageHeight = (src: string, width: number):
  Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const aspectRatio = img.naturalHeight / img.naturalWidth
        resolve(width * aspectRatio)
      }
      img.onerror = () => {
        resolve(200) // 預設高度
      }
      img.src = src
    })
  }

  // 監聽容器寬度變化
  const handleResize = () => {
    calculateLayout()
  }

  onMounted(() => {
    calculateLayout()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    containerRef,
    itemPositions,
    containerHeight,
    isLoading,
    calculateLayout,
  }
}

