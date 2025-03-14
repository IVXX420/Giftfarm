import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      protocolImports: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  optimizeDeps: {
    include: ['zod', '@vkruglikov/react-telegram-web-app']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
<<<<<<< HEAD
        format: 'es',
        generatedCode: {
          constBindings: true
=======
        manualChunks: {
          vendor: ['react', 'react-dom', 'styled-components', 'zod'],
          ton: ['@ton/core', '@ton/crypto', '@ton/ton'],
          tg: ['@vkruglikov/react-telegram-web-app']
>>>>>>> e49eebaea57194cdd7c7e8d3a16e8deda6ab08a6
        },
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ton: ['@tonconnect/ui-react']
        }
      }
    }
  },
  server: {
    port: 3000,
<<<<<<< HEAD
    host: true
=======
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
>>>>>>> e49eebaea57194cdd7c7e8d3a16e8deda6ab08a6
  },
  preview: {
    port: 3000,
    host: true
  }
}); 