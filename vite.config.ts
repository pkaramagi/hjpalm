import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'tabler-react-ui/dist/style.css': fileURLToPath(
        new URL('./node_modules/tabler-react-ui/dist/style.css', import.meta.url),
      ),
    },
  },
})
