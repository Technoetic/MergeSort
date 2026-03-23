import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/MergeSort/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
