import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Netlify'da VITE_GEMINI_API_KEY olarak ayarlanan ortam değişkenini
    // kod içinde process.env.API_KEY olarak kullanılabilir hale getirir.
    'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY)
  },
  resolve: {
    alias: {
      // Fix: __dirname is not available in ES modules.
      // Use `import.meta.url` to get the path to the current file and resolve relative paths.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
