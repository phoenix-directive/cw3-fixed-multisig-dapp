import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      contexts: path.resolve(__dirname, './src/contexts'),
      hooks: path.resolve(__dirname, './src/hooks'),
      pages: path.resolve(__dirname, './src/pages'),
      services: path.resolve(__dirname, './src/services'),
      styles: path.resolve(__dirname, './src/styles'),
      types: path.resolve(__dirname, './src/types'),
      util: path.resolve(__dirname, './src/util'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
