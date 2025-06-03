import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => ({
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
    rollupOptions: {
      external: [],
      output: {
        // Disable automatic code splitting to reduce chunk count
        manualChunks: undefined,
        // Force everything into fewer chunks
        inlineDynamicImports: false,
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    // Ensure proper asset handling for production
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    // Optimize for better loading
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}));
