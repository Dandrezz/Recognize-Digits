import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:'https://dandrezz.github.io/Recognize-Digits/',
  plugins: [react()]
})
