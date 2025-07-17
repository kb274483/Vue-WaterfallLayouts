import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { WaterfallItem, WaterfallPosition, AnimationOffset } from '@/types'

// 防抖函數，避免頻繁計算 Layout
function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
) {
  let timer: ReturnType<typeof setTimeout>
  return function(this: unknown, ...args: Args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}


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
  // 容器寬度
  const containerWidth = ref(0)
  // 項目位置
  const itemPositions = ref<Map<string | number, WaterfallPosition>>(new Map())
  // 變形位置
  const transformPositions = ref<Map<string | number, AnimationOffset>>(new Map())
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
  // 動畫狀態
  const isAnimating = ref(false)
  const switchAnimation = (status: boolean)=>{
    isAnimating.value = status
  }
  const debouncedSwitchAnimation = debounce(switchAnimation, 500)

  
  // 更新容器寬度
  const updateContainerWidth = () =>{
    if(!containerRef.value) return
    containerWidth.value = containerRef.value?.offsetWidth || 0
  }

  // 計算實際可放入的列的數量
  const calculateColumns = computed(() => {
    if(!containerRef.value) return columns
    const availableColumns = Math.floor((containerWidth.value + gap) / (minColumnWidth + gap))
    return Math.max(Math.min(columns, availableColumns), 1)
  })

  // 計算每列的寬度
  const columnWidth = computed(() => {
    if(!containerRef.value) return minColumnWidth
    return (containerWidth.value - (calculateColumns.value - 1) * gap) / calculateColumns.value
  })

  // 計算位移
  const calculateAnimationOffsets = (
    oldPos: Map<string | number, WaterfallPosition>,
    newPos: Map<string | number, WaterfallPosition>
  ) => {
    const offsets = new Map<string | number, AnimationOffset>()
    
    // 遍歷所有項目
    newPos.forEach((newPosition, id) => {
      const oldPosition = oldPos.get(id)
      
      if (oldPosition && oldPosition.width > 0 && oldPosition.height > 0) {
        // 計算位置差異
        offsets.set(id, {
          deltaX: oldPosition.x - newPosition.x,
          deltaY: oldPosition.y - newPosition.y,
          scaleX: newPosition.width / oldPosition.width,
          scaleY: newPosition.height / oldPosition.height
        })
      } else {
        // 新項目，從容器底部進入
        offsets.set(id, {
          deltaX: 0,
          deltaY: containerHeight.value - newPosition.y,
          scaleX: 0,
          scaleY: 0
        })
      }
    })
    
    // 處理被移除的項目（如果需要）
    oldPos.forEach((oldPosition, id) => {
      if (!newPos.has(id)) {
        offsets.set(id, {
          deltaX: 0,
          deltaY: -oldPosition.height, // 向上移出
          scaleX: 0,
          scaleY: 0
        })
      }
    })
    
    return offsets
  }
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
    if(isAnimating.value){
      transformPositions.value = calculateAnimationOffsets(itemPositions.value, positions)
    }

    itemPositions.value = positions
    containerHeight.value = Math.max(...columnHeights)
    isLoading.value = false
  }
  const debouncedCalculateLayout = debounce(calculateLayout, 300)

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
  const handleResize = async () => {
    isAnimating.value = true
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
    transformPositions.value = calculateAnimationOffsets(itemPositions.value, positions)

    updateContainerWidth()
    debouncedCalculateLayout()
    debouncedSwitchAnimation(false)
  }

  onMounted(() => {
    updateContainerWidth()
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
    isAnimating,
    transformPositions,
    calculateLayout,
  }
}

