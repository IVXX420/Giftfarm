import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: '/Giftfarm/',
  publicDir: 'public',
  optimizeDeps: {
    include: ['zod', '@vkruglikov/react-telegram-web-app']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'styled-components', 'zod'],
          ton: ['@ton/core', '@ton/crypto', '@ton/ton'],
          tg: ['@vkruglikov/react-telegram-web-app']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/ton': {
        target: 'https://toncenter.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ton/, '')
      }
    }
  },
  preview: {
    port: 3000,
    host: true
  }
}); 