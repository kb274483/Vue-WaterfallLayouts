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

<style scoped>
:root{
  --hover-translate: 0;
  --hover-scale: 1.01;
}
.waterfall-container{
  position: relative;
  width: 100%;
  transition: height 0.3s ease;
}
.waterfall-item{
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}
.waterfall-item:hover {
  transform: translateY(var(--hover-translate)) scale(var(--hover-scale));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: left 0.3s ease, top 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}

.waterfall-item.fadeInOut {
  opacity: 0;
  transform: translateY(20px);
  will-change: opacity, transform;
}
.waterfall-item.fadeInOut.in-view {
  opacity: 1;
  transform: translateY(0);
}

.waterfall-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

.waterfall-skeleton {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-image {
  width: 100%;
  height: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-content {
  padding: 12px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  margin-bottom: 8px;
  border-radius: 4px;
}

.skeleton-line-short {
  width: 60%;
}

.waterfall-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.is-hidden {
  visibility: hidden;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

</style>