import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'htmls/index.html'),
        login: resolve(__dirname, 'htmls/login.html'),
        dashboard: resolve(__dirname, 'htmls/dashboard.html'),
        error401: resolve(__dirname, 'htmls/errors/401.html'),
        error403: resolve(__dirname, 'htmls/errors/403.html'),
        error404: resolve(__dirname, 'htmls/errors/404.html'),
        error409: resolve(__dirname, 'htmls/errors/409.html'),
        error500: resolve(__dirname, 'htmls/errors/500.html'),
        error502: resolve(__dirname, 'htmls/errors/502.html')
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})