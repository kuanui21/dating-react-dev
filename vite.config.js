import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: process.env.NODE_ENV === 'production' ? '/dating-react-dev/' : '/',
  build: {
    outDir: 'dist', // 確保建置輸出到 dist 資料夾
  },
});