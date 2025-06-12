import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Bundle analyzer configuration for detailed analysis
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Generate detailed chunk analysis
        manualChunks: id => {
          // Vendor libraries with detailed categorization
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-core';
            }
            if (id.includes('react-router')) {
              return 'react-router';
            }

            // UI libraries
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }

            // 3D and visualization libraries (largest chunks)
            if (id.includes('three') && !id.includes('@react-three')) {
              return 'three-core';
            }
            if (id.includes('@react-three')) {
              return 'react-three';
            }
            if (id.includes('postprocessing')) {
              return 'postprocessing';
            }

            // Chart libraries
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('d3-')) {
              return 'd3-utils';
            }

            // Animation libraries
            if (id.includes('gsap')) {
              return 'gsap';
            }

            // Utility libraries
            if (id.includes('lodash')) {
              return 'lodash';
            }
            if (id.includes('date-fns')) {
              return 'date-fns';
            }
            if (id.includes('zod')) {
              return 'zod';
            }
            if (id.includes('zustand')) {
              return 'zustand';
            }

            // Supabase and auth
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'react-query';
            }

            // Icons
            if (id.includes('lucide-react')) {
              return 'lucide-icons';
            }

            // Particles
            if (id.includes('tsparticles') || id.includes('@tsparticles')) {
              return 'tsparticles';
            }

            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform')) {
              return 'react-hook-form';
            }

            // Other utilities
            if (
              id.includes('clsx') ||
              id.includes('class-variance-authority') ||
              id.includes('tailwind-merge')
            ) {
              return 'css-utils';
            }

            // Remaining vendor code
            return 'vendor-misc';
          }

          // Application code chunking with detailed categorization
          // Landing page components
          if (id.includes('/landing/') || id.includes('Index.tsx')) {
            return 'app-landing';
          }

          // Workflow related components
          if (id.includes('Workflow') || id.includes('workflow') || id.includes('ReactFlow')) {
            return 'app-workflow';
          }

          // AI Agent components
          if (
            id.includes('Agent') ||
            id.includes('agent') ||
            id.includes('AI') ||
            id.includes('Nexus')
          ) {
            return 'app-ai';
          }

          // Dashboard and analytics
          if (id.includes('Dashboard') || id.includes('Analytics') || id.includes('dashboard')) {
            return 'app-dashboard';
          }

          // 3D and visualization components
          if (
            id.includes('Crystal') ||
            id.includes('3D') ||
            id.includes('Canvas') ||
            id.includes('AR')
          ) {
            return 'app-3d';
          }

          // Authentication and user management
          if (
            id.includes('Auth') ||
            id.includes('auth') ||
            id.includes('Login') ||
            id.includes('Profile')
          ) {
            return 'app-auth';
          }

          // Crypto and token components
          if (
            id.includes('crypto') ||
            id.includes('Token') ||
            id.includes('Solana') ||
            id.includes('Wallet')
          ) {
            return 'app-crypto';
          }

          // Settings and configuration
          if (id.includes('Settings') || id.includes('Config') || id.includes('Billing')) {
            return 'app-settings';
          }

          // Documentation and help
          if (id.includes('Documentation') || id.includes('Help') || id.includes('Tutorial')) {
            return 'app-docs';
          }

          // Community and social features
          if (id.includes('Community') || id.includes('Social') || id.includes('Collaboration')) {
            return 'app-community';
          }

          // UI components
          if (id.includes('/ui/') || id.includes('/components/ui/')) {
            return 'app-ui';
          }

          // Utilities and services
          if (id.includes('/utils/') || id.includes('/services/') || id.includes('/lib/')) {
            return 'app-utils';
          }

          // Lazy loading components
          if (id.includes('/lazy/')) {
            return 'app-lazy';
          }

          // Main app code
          return 'app-main';
        },

        // Generate detailed file names for analysis
        chunkFileNames: chunkInfo => {
          return `chunks/[name]-[hash].js`;
        },

        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash].[ext]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },

        entryFileNames: 'entry/[name]-[hash].js',
      },
    },

    // Generate source maps for analysis
    sourcemap: true,

    // Lower chunk size warning for detailed analysis
    chunkSizeWarningLimit: 300,

    // Detailed minification for size analysis
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for analysis
        drop_debugger: true,
        passes: 1, // Single pass for faster analysis builds
      },
      mangle: false, // Don't mangle for easier analysis
      format: {
        comments: false,
      },
    },

    // Generate detailed reports
    reportCompressedSize: true,

    // Target modern browsers for analysis
    target: 'es2020',
  },

  // Enable detailed logging
  logLevel: 'info',
});
