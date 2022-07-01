import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],  
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: `http://localhost:3100`,
        changeOrigin: true
      }
    }
  },
  build: {
      outDir: path.join(__dirname, '..', 'server', 'public')
  }
})
