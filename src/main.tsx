import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force include all CSS classes to prevent tree-shaking in production
if (import.meta.env.PROD) {
  // Create a hidden element with all critical classes to force CSS inclusion
  const forceIncludeCSS = () => {
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = 'none';
    hiddenDiv.style.position = 'absolute';
    hiddenDiv.style.top = '-9999px';
    hiddenDiv.style.left = '-9999px';
    hiddenDiv.className = [
      'hero-floating-dot',
      'hero-floating-dot-1',
      'hero-floating-dot-2',
      'hero-floating-dot-3',
      'hero-floating-dot-4',
      'hero-floating-dot-5',
      'hero-floating-dot-6',
      'hero-floating-dot-7',
      'hero-floating-dot-8',
      'luxury-glow',
      'animate-luxury-glow',
      'animate-luxury-shimmer',
      'animate-luxury-pulse',
      'glass-card',
      'pulsating-gradient-bg',
      'subtle-pulsating-gradient-bg',
      'pipeline-canvas',
      'gradient-text',
      'agent-card',
      'connection-line',
      'glow-effect',
      'workflow-canvas',
      'float-animation',
      'logo-video',
      'hero-video',
      'animate-float',
      'animate-pulse',
      'animate-fade-in',
      'animate-slide-up',
      'animate-slide-down',
      'glass-effect',
      'card-hover',
      'premium-card',
      'roadmap-card',
      'milestone-card',
      'progress-bar',
      'progress-fill',
      'bg-gradient-to-r',
      'from-primary',
      'to-gold',
      'text-primary',
      'text-gold',
      'border-primary',
      'bg-primary',
      'bg-gold',
      'shadow-primary',
      'hover:bg-primary',
      'hover:shadow-xl',
      'hover:shadow-primary',
      'bg-clip-text',
      'text-transparent',
    ].join(' ');
    document.body.appendChild(hiddenDiv);

    // Remove after a short delay
    setTimeout(() => {
      if (document.body.contains(hiddenDiv)) {
        document.body.removeChild(hiddenDiv);
      }
    }, 100);
  };

  // Force CSS inclusion immediately
  forceIncludeCSS();
}

// Initialize Sentry for production error tracking
import { initializeSentry } from './lib/sentry';
initializeSentry();

// CSS Loading Verification for Production (SIMPLIFIED)
if (import.meta.env.PROD) {
  console.log('🔍 FlowsyAI Production Mode - CSS verification enabled');

  // Simple CSS check after page load
  setTimeout(() => {
    const testElement = document.createElement('div');
    testElement.className = 'bg-primary';
    testElement.style.position = 'absolute';
    testElement.style.top = '-9999px';
    document.body.appendChild(testElement);

    const styles = window.getComputedStyle(testElement);
    const hasStyles = styles.backgroundColor !== 'rgba(0, 0, 0, 0)';

    document.body.removeChild(testElement);

    if (hasStyles) {
      console.log('✅ CSS loaded successfully');
    } else {
      console.warn('⚠️ CSS may not be loaded properly');
    }
  }, 1000);
}

// Initialize Service Worker for caching and offline support (DISABLED FOR DEPLOYMENT DEBUGGING)
// eslint-disable-next-line no-constant-condition
if (false) {
  import('./lib/serviceWorker').then(({ registerSW }) => {
    import('@/hooks/use-toast').then(({ toast }) => {
      // Register service worker with user notifications
      registerSW({
        onSuccess: () => {
          console.log('App is ready for offline use');
        },
        onUpdate: () => {
          toast({
            title: 'App Update Available',
            description: 'A new version is available. Refresh to update.',
            duration: 10000,
          });
        },
        onOfflineReady: () => {
          toast({
            title: 'Ready for Offline',
            description: 'App is cached and ready to work offline.',
            duration: 5000,
          });
        },
      });
    });
  });
} else {
  console.log('Service Worker disabled for debugging deployment issues');
}

// Enhanced React initialization with error handling
console.log('🚀 Starting FlowsyAI React application...');
console.log('🔍 Environment debug:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  BASE_URL: import.meta.env.BASE_URL,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT_SET',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  location: window.location.href,
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

console.log('✅ Root element found, creating React root...');

try {
  const root = createRoot(rootElement);
  console.log('✅ React root created, rendering App...');

  root.render(<App />);
  console.log('✅ App rendered successfully');

  // Remove loading fallback after successful render
  setTimeout(() => {
    const fallback = document.getElementById('loading-fallback');
    if (fallback) {
      fallback.remove();
      console.log('✅ Loading fallback removed');
    }
  }, 100);
} catch (error) {
  console.error('❌ Failed to render React app:', error);

  // Show error in the UI
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.innerHTML = `
      <div class="text-center">
        <div class="text-3xl font-bold mb-4 text-red-500">Application Error</div>
        <div class="text-lg mb-4">Failed to load FlowsyAI</div>
        <div class="text-sm text-gray-600 mb-4">${error.message}</div>
        <button onclick="window.location.reload()" class="bg-primary text-white px-4 py-2 rounded">
          Reload Page
        </button>
      </div>
    `;
  }
}
