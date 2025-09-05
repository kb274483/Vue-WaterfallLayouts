import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { WaterfallItem, WaterfallPosition } from '@/types'

// 防抖函數，避免頻繁計算 Layout
function debounce<F extends (...args: unknown[]) => unknown>(func: F, wait: number) {
  let timer: NodeJS.Timeout
  return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
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
    hoverEffect?: boolean
    fadeInAndOut?: boolean
  }
){
  // 容器元素
  const containerRef = ref<HTMLElement>()
  // 容器寬度
  const containerWidth = ref(0)
  // 項目位置
  const itemPositions = ref<Map<string | number, WaterfallPosition>>(new Map())
  // 容器高度
  const containerHeight = ref(0)
  // 是否正在加載
  const isLoading = ref(false)
  
  // 建立觀察器捕捉卡片高度
  const itemHeights = ref<Map<string | number, number>>(new Map())
  let resizeObserver: ResizeObserver | null = null

  // 可視 Item 
  const visibleItemIds = ref<Set<string | number>>(new Set())
  let intersectionObserver: IntersectionObserver | null = null
  
  // 預設屬性
  const { 
    columns = 3, 
    gap = 10, 
    minColumnWidth = 200, 
    hoverEffect = true,
    fadeInAndOut = false,
  } = options
  
  // 更新容器寬度
  const renderColumnWidth = ref(minColumnWidth)
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
      const height = itemHeights.value.get(item.id) ?? await getImageHeight(item.src, columnWidth.value)

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
    renderColumnWidth.value = columnWidth.value
    isLoading.value = false
  }
  const debouncedCalculateLayout = debounce(calculateLayout, 300)
  
  const ensureResizeObserver = () => {
    if (resizeObserver) return
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        const idAttr = el.dataset.wfId
        if (!idAttr) continue
        const id: string | number = Number.isNaN(Number(idAttr)) ? idAttr : Number(idAttr)
        itemHeights.value.set(id, el.offsetHeight)
      }
      debouncedCalculateLayout()
    })
  }

  const ensureIntersectionObserver = () => {
    if (intersectionObserver) return
    intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        const idAttr = el.dataset.wfId
        if (!idAttr) continue
        const id: string | number = Number.isNaN(Number(idAttr)) ? idAttr : Number(idAttr)
        if (entry.isIntersecting) visibleItemIds.value.add(id)
        else visibleItemIds.value.delete(id)
      }
    }, {
      root: containerRef.value ?? null,
      rootMargin: '0px',
      threshold: 0.2,
    })
  }
  
  const setItemRef = (el: HTMLElement | null, item: WaterfallItem) => {
    if (!el) {
      itemHeights.value.delete(item.id)
      return
    }
    el.dataset.wfId = String(item.id)
    ensureResizeObserver()
    resizeObserver!.observe(el)
    itemHeights.value.set(item.id, el.offsetHeight)
    if(fadeInAndOut) {
      ensureIntersectionObserver()
      intersectionObserver!.observe(el)
    }
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
    updateContainerWidth()
    debouncedCalculateLayout()
  }

  onMounted(() => {
    updateContainerWidth()
    debouncedCalculateLayout()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (intersectionObserver) {
      intersectionObserver.disconnect()
      intersectionObserver = null
    }
    itemHeights.value.clear()
    visibleItemIds.value.clear()
  })

  return {
    containerRef,
    itemPositions,
    containerHeight,
    isLoading,
    hoverEffect,
    calculateLayout,
    renderColumnWidth,
    setItemRef,
    visibleItemIds,
  }
}

