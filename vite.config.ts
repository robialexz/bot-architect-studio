import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '::',
    port: 3000,
    strictPort: false,
    hmr: {
      port: 3000,
    },
  },
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['framer-motion'],
    exclude: ['@react-three/fiber', '@react-three/drei'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Replace framer-motion with our polyfill in production for smaller bundle
      ...(process.env.NODE_ENV === 'production' && {
        'framer-motion': path.resolve(__dirname, './src/lib/framer-motion-polyfill.ts'),
      }),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    cssTarget: 'chrome80',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000, // Increased from 500 to accommodate our large chunks
  },
});
