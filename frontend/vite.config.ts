import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://backend:3000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: process.env.BACKEND_URL || 'http://backend:3000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})

