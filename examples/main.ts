import { createApp } from 'vue'
import App from './App.vue'
import VueWaterfall from '../src'

const app = createApp(App)
app.use(VueWaterfall)
app.mount('#app')