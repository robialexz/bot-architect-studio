import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging production issues
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      external: [],
      output: {
        // Fix Framer Motion React dependency issue by ensuring proper chunk order
        manualChunks: {
          // Core React dependencies must load first
          'react-vendor': ['react', 'react-dom'],
          // Framer Motion in separate chunk that loads after React
          'framer-motion': ['framer-motion'],
          // UI components that depend on React
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-toast', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
