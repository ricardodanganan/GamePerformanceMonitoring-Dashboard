import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: './', // 👈 add this line
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        library: resolve(__dirname, 'library.html'), // for game library window
      },
    },
    outDir: 'dist',
  },
});
