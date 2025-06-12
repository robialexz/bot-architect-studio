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
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      external: [],
      output: {
        // ULTRA-SIMPLIFIED chunking to fix vendor conflicts
        manualChunks: id => {
          // Only separate React core to prevent conflicts
          if (id.includes('node_modules')) {
            // Keep React separate but minimal
            if (id.includes('react') && !id.includes('react-')) {
              return 'react';
            }
            if (id.includes('react-dom')) {
              return 'react';
            }

            // Everything else in one vendor bundle to prevent conflicts
            return 'vendor';
          }

          // TEMPORARILY DISABLE ALL APPLICATION CHUNKING
          // This fixes React forwardRef errors across all bundles
          // All app code will be in main bundle with React dependencies

          // Application code chunking - DISABLED to fix React dependency issues
          // if (id.includes('/landing/') || id.includes('Index.tsx')) {
          //   return 'landing';
          // }
          // if (id.includes('Workflow') || id.includes('workflow')) {
          //   return 'workflow';
          // }
          // if (id.includes('Agent') || id.includes('agent') || id.includes('AI')) {
          //   return 'ai-features';
          // }
          // if (id.includes('Dashboard') || id.includes('Analytics') || id.includes('dashboard')) {
          //   return 'dashboard';
          // }
          // if (
          //   id.includes('Crystal') ||
          //   id.includes('3D') ||
          //   id.includes('Canvas') ||
          //   id.includes('AR')
          // ) {
          //   return 'visualization';
          // }
          // if (
          //   id.includes('Auth') ||
          //   id.includes('auth') ||
          //   id.includes('Login') ||
          //   id.includes('Profile')
          // ) {
          //   return 'auth';
          // }
          // if (
          //   id.includes('crypto') ||
          //   id.includes('Token') ||
          //   id.includes('Solana') ||
          //   id.includes('Wallet')
          // ) {
          //   return 'crypto';
          // }
          // if (id.includes('Settings') || id.includes('Config') || id.includes('Billing')) {
          //   return 'settings';
          // }
          // if (id.includes('Documentation') || id.includes('Help') || id.includes('Tutorial')) {
          //   return 'docs';
          // }
          // if (id.includes('Community') || id.includes('Social') || id.includes('Collaboration')) {
          //   return 'community';
          // }
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
