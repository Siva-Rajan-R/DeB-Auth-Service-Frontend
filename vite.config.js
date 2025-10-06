import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      'c2bd9f4c9a82.ngrok-free.app', // your ngrok domain
      'localhost'
    ]
  },
  plugins: [react(),tailwindcss()],
})
