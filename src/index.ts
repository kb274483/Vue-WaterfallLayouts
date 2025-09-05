import type { App } from 'vue'
import WaterfallContainer from '@/components/WaterfallContainer.vue'
import './style.css'

export { WaterfallContainer }

export default {
  install(app: App) {
    app.component('WaterfallContainer', WaterfallContainer)
  }
}

export * from '@/types'
export * from '@/composables/useWaterfall'
