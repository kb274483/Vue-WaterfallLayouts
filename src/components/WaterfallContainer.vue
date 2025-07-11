<template>
  <div
    ref="containerRef"
    class="waterfall-container"
    :style="{height: `${containerHeight}px`}"
  >
    <!-- waterfall items -->
    <div
      v-for="item in items"
      :key="item.id"
      class="waterfall-item"
      :style="getItemStyle(item)"
    >
      <img
        :src="item.src"
        :alt="item.alt || ''"
        class="waterfall-image"
        @load="onImageLoad"
        @error="onImageError"
      />
    </div>

    <div v-if="isLoading">
      Loading...
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { useWaterfall } from '@/composables/useWaterfall'
  import type { WaterfallItem, WaterfallProps } from '@/types'

  const props = defineProps<WaterfallProps>()

  const {
    containerRef,
    itemPositions,
    containerHeight,
    isLoading,
    calculateLayout,
  } = useWaterfall(props.items,{
    columns: props.columns,
    gap: props.gap,
    minColumnWidth: props.minColumnWidth,
  })

  const getItemStyle = (item: WaterfallItem) =>{
    const position = itemPositions.value.get(item.id)
    if(!position) return {}

    return {
      position: 'absolute' as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${position.width}px`,
      opacity: 1,
      transition: 'all 0.3s ease',
    }
  }

  const onImageLoad = ()=>{
    calculateLayout()
  }

  const onImageError = (event: Event)=>{
    const img = event.target as HTMLImageElement
    img.style.opacity = '0'
  }

  watch(()=> props.items, ()=>{
    calculateLayout()
  }, {deep: true})

</script>

<style scoped>
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
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.waterfall-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>