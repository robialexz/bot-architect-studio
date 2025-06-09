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
      // Keep framer-motion in production for animations to work
      // Removed polyfill replacement to fix Vercel deployment styling issues
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    cssTarget: 'chrome90',
    cssCodeSplit: false, // Bundle all CSS into one file for better loading
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      external: [],
      output: {
        // Ensure CSS is properly included in the build
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[hash].css';
          }
          return 'assets/[name].[hash].[ext]';
        },
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI and Icons - split large icon library
          'ui-vendor': [
            '@radix-ui/react-slot',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
          ],
          'icons-vendor': ['lucide-react'],
          // Animation libraries - CRITICAL for styling
          'animation-vendor': ['framer-motion'],
          // Charts and visualization - very large
          'charts-vendor': ['recharts', 'd3-scale', 'd3-array', 'd3-shape', 'd3-selection'],
          // Particles system - large
          'particles-vendor': ['@tsparticles/react', '@tsparticles/slim', '@tsparticles/engine'],
          // Database and API
          'supabase-vendor': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],
          // Monitoring and analytics
          'sentry-vendor': ['@sentry/react', '@sentry/browser'],
          // Utilities
          'utils-vendor': ['lodash', 'clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Keep CSS and animation-related code
        pure_funcs: [],
      },
      mangle: {
        // Don't mangle CSS class names or animation names
        reserved: ['animate', 'transition', 'transform'],
      },
    },
    // Ensure CSS is properly processed
    cssMinify: 'esbuild',
    chunkSizeWarningLimit: 1000, // Increased from 500 to accommodate our large chunks
  },
});
