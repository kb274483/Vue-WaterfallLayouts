這是一個簡易的 Vue 3 瀑布流布局組件，支援響應式設計和Slot自定義內容。
也是我嘗試做的第一個開源套件，許多部分都是邊查網頁、邊問AI完成的，
### 但凡事都有第一次嘛，下次再來試試看能不能做一個真正解決問題的套件。

## 安裝

```bash
npm i vue-responsive-waterfall
```
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
// 引入
import VueWaterfall from 'vue-responsive-waterfall'
import 'vue-responsive-waterfall/dist/vue-responsive-waterfall.css'

const app = createApp(App)
app.use(VueWaterfall)
app.mount('#app')
```

## 基本使用

```vue
<template>
  <WaterfallContainer :items="images" />
</template>

<script setup>
import { WaterfallContainer } from 'vue-waterfall-layout'

const images = [
  { id: 1, src: 'https://example.com/image1.jpg' },
  { id: 2, src: 'https://example.com/image2.jpg' },
  // ...
]
</script>
```

## 組件屬性

| 屬性名              | 類型                            | 預設值  | 說明                     |
|--------------------|--------------------------------|--------|--------------------------|
| `items`            | `WaterfallItem[]`              | `[]`   | 瀑布流項目數據             |
| `columns`          | `number`                       | `3`    | 列數                     |
| `gap`              | `number`                       | `10`   | 項目間距（px）            |
| `minColumnWidth`   | `number`                       | `200`  | 最小列寬（px）            |
| `hoverEffect`      | `boolean`                      | `true` | 是否啟用 hover 效果       |
| `fadeInAndOut`     | `boolean`                      | `false`| 是否啟用淡入淡出動畫       |
| `clickFunction`    | `function`                     | -      | 點擊事件回調              |
| `hoverFunction`    | `function`                     | -      | hover 事件回調           |
| `hoverLeaveFunction` | `function`                   | -      | hover 離開事件回調        |


## 數據格式

```typescript
interface WaterfallItem {
  id: number | string
  src: string
  alt?: string
  width?: number
  height?: number
  [key: string]: unknown  // 支援自定義屬性
}
```

## 自定義內容

使用 slot 自定義每個項目的內容：

```vue
<template>
  <WaterfallContainer :items="items">
    <template #default="{ item, index }">
      <div class="custom-card">
        <img :src="item.src" :alt="item.alt" />
        <div class="content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </template>
  </WaterfallContainer>
</template>
```

## 事件處理

```vue
<template>
  <WaterfallContainer 
    :items="items"
    :click-function="handleClick"
    :hover-function="handleHover"
  />
</template>

<script setup>
const handleClick = (item) => {
  console.log('點擊項目:', item)
}

const handleHover = (item) => {
  console.log('Hover 項目:', item)
}
</script>
```

## 開發

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置
npm run build

# 代碼檢查
npm run lint
```

## 功能

- 響應式設計，自動適應螢幕寬度
- 支援圖片懶載入
- 內建骨架屏載入效果
- TypeScript 支援
- 支援自定義內容和事件

## 許可

MIT
