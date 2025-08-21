import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base:
    process.env.NODE_ENV === 'production' ? '/react-grid-layout-demo/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  resolve: {
    alias: [
      { find: '@src', replacement: path.resolve(__dirname, './src') },
      {
        find: '@untitled-ui',
        replacement: path.resolve(__dirname, './untitled-ui'),
      },
    ],
  },
});
