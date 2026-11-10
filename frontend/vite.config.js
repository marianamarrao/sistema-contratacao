import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serve em /<repo>/; o CD define VITE_BASE=/sistema-contratacao/
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    proxy: {
      '/funcionarios': {
        target: 'http://localhost:8080',
      },
    },
  },
})