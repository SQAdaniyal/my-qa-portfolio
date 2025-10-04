import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace with your GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/my-qa-portfolio/',  // ⚡ yahan repo ka naam
})
