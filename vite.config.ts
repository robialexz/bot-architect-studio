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
        // Manual chunking strategy to optimize bundle size
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }

            // UI libraries
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }

            // 3D and visualization libraries (largest chunks)
            if (id.includes('three') || id.includes('@react-three') || id.includes('three-stdlib')) {
              return 'three-vendor';
            }

            // Chart libraries
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts-vendor';
            }

            // Utility libraries
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('classcat')) {
              return 'utils-vendor';
            }

            // Supabase and auth
            if (id.includes('supabase') || id.includes('@supabase')) {
              return 'supabase-vendor';
            }

            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }

            // Other large vendor libraries
            if (id.includes('tsparticles') || id.includes('@tsparticles')) {
              return 'particles-vendor';
            }

            // Remaining vendor code
            return 'vendor';
          }

          // Application code chunking
          // Landing page components
          if (id.includes('/landing/') || id.includes('Index.tsx')) {
            return 'landing';
          }

          // Workflow related components
          if (id.includes('Workflow') || id.includes('workflow')) {
            return 'workflow';
          }

          // AI Agent components
          if (id.includes('Agent') || id.includes('agent') || id.includes('AI')) {
            return 'ai-features';
          }

          // Dashboard and analytics
          if (id.includes('Dashboard') || id.includes('Analytics') || id.includes('dashboard')) {
            return 'dashboard';
          }

          // 3D and visualization components
          if (id.includes('Crystal') || id.includes('3D') || id.includes('Canvas') || id.includes('AR')) {
            return 'visualization';
          }

          // Authentication and user management
          if (id.includes('Auth') || id.includes('auth') || id.includes('Login') || id.includes('Profile')) {
            return 'auth';
          }

          // Crypto and token components
          if (id.includes('crypto') || id.includes('Token') || id.includes('Solana') || id.includes('Wallet')) {
            return 'crypto';
          }

          // Settings and configuration
          if (id.includes('Settings') || id.includes('Config') || id.includes('Billing')) {
            return 'settings';
          }

          // Documentation and help
          if (id.includes('Documentation') || id.includes('Help') || id.includes('Tutorial')) {
            return 'docs';
          }

          // Community and social features
          if (id.includes('Community') || id.includes('Social') || id.includes('Collaboration')) {
            return 'community';
          }
        },

        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/[name]-[hash].js`;
        },

        // Optimize asset naming
        assetFileNames: 'assets/[name]-[hash].[ext]',

        // Entry file naming
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },

    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500, // 500KB warning limit

    // Ensure proper asset handling for production
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production for smaller builds

    // Optimize for better loading
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },

    // Target modern browsers for better optimization
    target: 'es2020',

    // Enable CSS code splitting
    cssCodeSplit: true,
  },
}));
