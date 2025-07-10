import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const isPlayground = process.env.NODE_ENV !== 'production' && process.env.PLAYGROUND !== undefined

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  root: isPlayground ? 'examples' : undefined,
  build: isPlayground
    ? undefined
    : {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'VueWaterfall',
          fileName: (format) => `vue-waterfall.${format}.js`,
          formats: ['es', 'umd']
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
      }
})
