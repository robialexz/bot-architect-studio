
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
    target: 'es2020', // Ensure compatibility with modern browsers
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging production issues
        drop_debugger: true,
      },
    },
    rollupOptions: {
      // Ensure proper HTML entry point handling
      input: {
        main: './index.html',
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
        // Ensure proper module format for production
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 500,
  },
}));
