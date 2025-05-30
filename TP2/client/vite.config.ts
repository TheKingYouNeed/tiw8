import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0', // Explicitly set to listen on all network interfaces
    cors: true // Enable CORS for all origins
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
