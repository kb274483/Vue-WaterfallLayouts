import type { App } from 'vue'
import WaterfallContainer from '@/components/WaterfallContainer.vue'

export { WaterfallContainer }

export default {
  install(app: App) {
    app.component('WaterfallContainer', WaterfallContainer)
  }
}

export * from '@/types'
export * from '@/composables/useWaterfall'
