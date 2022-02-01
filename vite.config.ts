import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: './src/renderer',
  base: './',
  publicDir: './public/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
    },
  },
  plugins: [react(), eslint({
    include: ['./src/**/*.ts', './src/**/*.tsx'],
    fix: true,
  })],
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
  },
  server: {
    port: 14843,
  },
});
