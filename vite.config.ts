import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:
    process.env.NODE_ENV === 'production' ? '/react-grid-layout-demo/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/untitled_ui': path.resolve(__dirname, './src/untitled_ui'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
