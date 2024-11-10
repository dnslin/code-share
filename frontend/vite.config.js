import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          jsonWorker: ['monaco-editor/esm/vs/language/json/json.worker'],
          cssWorker: ['monaco-editor/esm/vs/language/css/css.worker'],
          htmlWorker: ['monaco-editor/esm/vs/language/html/html.worker'],
          tsWorker: ['monaco-editor/esm/vs/language/typescript/ts.worker'],
          editorWorker: ['monaco-editor/esm/vs/editor/editor.worker'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 如果后端 API 没有 /api 前缀，可以去掉它
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
