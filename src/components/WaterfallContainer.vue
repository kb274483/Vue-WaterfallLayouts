<template>
  <div
    ref="containerRef"
    class="waterfall-container"
    :style="{height: `${containerHeight}px`}"
  >
    <template v-if="!isInit && items.length > 0">
      <div
        v-for="(item, index) in items"
        :key="`skeleton-${item.id}`"
        class="waterfall-skeleton"
        :style="getSkeletonStyle(index)"
      >
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-line-short"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    </template>
    
    <!-- waterfall items -->
    <div
      v-for="(item, index) in items"
      class="waterfall-item"
      :key="item.id"
      :class="{
        'is-hidden' : !isInit,
        fadeInOut: props.fadeInAndOut,
        'in-view' : visibleItemIds.has(item.id) && props.fadeInAndOut,
      }"
      :style="getItemStyle(item)"
      :ref="(el) => setItemRef(el as HTMLElement, item)"
      @click="handleItemClick(item)"
      @mouseenter="handleItemHover(item)"
      @mouseleave="handleItemLeave(item)"
    >
      <!-- slot 自訂內容 -->
      <slot :item="item" :index="index">
        <img
          :src="item.src"
          :alt="item.alt || ''"
          class="waterfall-image"
          loading="lazy"
          @error="onImageError"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, withDefaults } from 'vue'
  import { useWaterfall } from '@/composables/useWaterfall'
  import type { WaterfallItem, WaterfallProps } from '@/types'

  const props = withDefaults(defineProps<WaterfallProps>(), {
    columns: 3,
    gap: 10,
    minColumnWidth: 200,
    hoverEffect: true,
    fadeInAndOut: false,
  })
  const isInit = ref(false)

  const {
    containerRef,
    itemPositions,
    containerHeight,
    calculateLayout,
    setItemRef,
    renderColumnWidth,
    visibleItemIds,
  } = useWaterfall(props.items,{
    columns: props.columns,
    gap: props.gap,
    minColumnWidth: props.minColumnWidth,
    hoverEffect: props.hoverEffect,
    fadeInAndOut: props.fadeInAndOut,
  })

  const getSkeletonStyle = (index: number) => {
    // 網格設定
    const columns = props.columns || 3
    const gap = props.gap || 10
    const columnIndex = index % columns
    const rowIndex = Math.floor(index / columns)
    
    // 計算位置
    const width = `calc((100% - ${gap * (columns - 1)}px) / ${columns})`
    const left = `calc(${columnIndex} * (100% / ${columns}) + ${columnIndex * gap}px)`
    const top = `${rowIndex * 250 + rowIndex * gap}px` 
    
    return {
      position: 'absolute' as const,
      width,
      left,
      top,
      height: '200px',
    }
  }

  const getItemStyle = (item: WaterfallItem) =>{
    const position = itemPositions.value.get(item.id)
    const hoverTranslate = props.hoverEffect ? "-3px" : "0px"
    const hoverScale = props.hoverEffect ? "1.01" : "1"

    const baseStyle = {
      "--hover-translate": hoverTranslate,
      "--hover-scale": hoverScale,
      width: `${renderColumnWidth.value}px`,
    } as const

    if(!position) return baseStyle

    return {
      ...baseStyle,
      position: 'absolute' as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
      ...(props.fadeInAndOut ? {} : {opacity: 1}),
    }
  }

  const onImageError = (event: Event)=>{
    const img = event.target as HTMLImageElement
    img.style.opacity = '0'
  }

  watch(itemPositions, (newPositions) => {
    if (newPositions.size > 0 && !isInit.value) {
      setTimeout(() => {
        isInit.value = true
      }, 100)
    }
  }, { immediate: true })

  watch(() => props.items, (newItems, oldItems) => {
    if (newItems.length !== oldItems?.length) {
      isInit.value = false
    }
    calculateLayout()
  }, { deep: true })

  // 點擊事件
  const handleItemClick = (item: WaterfallItem) => {
    if (props.clickFunction) {
      props.clickFunction(item)
    }
  }

  // hover 事件
  const handleItemHover = (item: WaterfallItem) => {
    if (props.hoverFunction) {
      props.hoverFunction(item)
    }
  }

  // hover 離開事件
  const handleItemLeave = (item: WaterfallItem) => {
    if (props.hoverLeaveFunction) {
      props.hoverLeaveFunction(item)
    }
  }

</script>