import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'assets',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/transit-widget.ts'),
      name: 'TransitWidget',
      fileName: 'transit-widget',
      formats: ['es']
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'transit-widget.[ext]'
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
