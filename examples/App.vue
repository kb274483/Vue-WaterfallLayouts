<template>
  <div>
    <h1>Waterfall 開發測試</h1>
    <div class="mainContainer">
      <WaterfallContainer 
        :items="testImages" 
        :columns="4"
        :click-function="handleItemClick"
        :hover-function="handleItemHover"
        :hover-leave-function="handleItemLeave"
      >
        <!-- 自訂每個卡片的內容 -->
        <template #default="{ item, index }">
          <div class="custom-card">
            <img
              :src="item.src"
              :alt="item.alt || ''"
              class="waterfall-image"
              loading="lazy"
            />
            <div class="card-content">
              <h3>{{ item.title || `圖片 ${index + 1}` }}</h3>
              <p>{{ item.description || '這是一張美麗的圖片' }}</p>
              <div class="card-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </WaterfallContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WaterfallItem } from '../src/types'

const testImages = ref<WaterfallItem[]>([
  { 
    id: 1, 
    src: 'https://plus.unsplash.com/premium_photo-1747851400213-5140b43aee3b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '美麗風景',
    description: '這是一張令人驚嘆的風景照片',
    tags: ['風景', '自然']
  },
  { 
    id: 2, 
    src: 'https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 3, 
    src: 'https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '自然風景',
    description: '這是一張令人驚嘆的風景照片',
    tags: ['風景', '自然']
  },
  { 
    id: 4, 
    src: 'https://images.unsplash.com/photo-1554629947-334ff61d85dc?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 5, 
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '自然風景',
    description: '這是一張令人驚嘆的風景照片',
    tags: ['風景', '自然']
  },
  { 
    id: 6, 
    src: 'https://plus.unsplash.com/premium_photo-1747851400213-5140b43aee3b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 7, 
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 8, 
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 9, 
    src: 'https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 10, 
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 11, 
    src: 'https://plus.unsplash.com/premium_photo-1747851400213-5140b43aee3b?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 12, 
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 13, 
    src: 'https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 14, 
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },
  { 
    id: 15, 
    src: 'https://images.unsplash.com/photo-1478059299873-f047d8c5fe1a?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '城市夜景',
    description: '繁華的城市在夜晚展現不同的美',
    tags: ['城市', '夜景']
  },  
])

// 點擊事件處理
const handleItemClick = (item: WaterfallItem) => {
  console.log('點擊了項目:', item)
  alert(`你點擊了: ${item.title || item.id}`)
}

// hover 事件處理
const handleItemHover = (item: WaterfallItem) => {
  console.log('Hover 項目:', item)
}

// hover 離開事件處理
const handleItemLeave = (item: WaterfallItem) => {
  console.log('離開 Hover 項目:', item)
}
</script>

<style scoped>
.mainContainer{
  width: 80vw;
  height: 100%;
  margin: 0 auto;
}

.custom-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.waterfall-image {
  width: 100%;
  height: auto;
  display: block;
}

.card-content {
  padding: 12px;
}

.card-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}
</style>
