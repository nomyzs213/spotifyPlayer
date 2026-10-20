import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'htmls/index.html'),
        login: resolve(__dirname, 'htmls/login.html'),
        dashboard: resolve(__dirname, 'htmls/dashboard.html'),
      },
    },
  },
})

