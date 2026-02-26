// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // cho phép truy cập từ ngoài container
    proxy: {
      "/api": {
        target: "http://backend:5000", // dùng tên service trong docker-compose
        changeOrigin: true
      }
    }
  }
})