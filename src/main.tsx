import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force include all CSS classes to prevent tree-shaking in production
if (import.meta.env.PROD) {
  // Create a hidden element with all critical classes to force CSS inclusion
  const forceIncludeCSS = () => {
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = 'none';
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
    ].join(' ');
    document.body.appendChild(hiddenDiv);

    // Remove after a short delay
    setTimeout(() => {
      document.body.removeChild(hiddenDiv);
    }, 100);
  };

  // Force CSS inclusion immediately
  forceIncludeCSS();
}

// Initialize Sentry for production error tracking
import { initializeSentry } from './lib/sentry';
initializeSentry();

// CSS Loading Verification for Production
if (import.meta.env.PROD) {
  // Verify critical CSS is loaded
  const checkCSSLoaded = () => {
    const testElement = document.createElement('div');
    testElement.className = 'bg-primary text-foreground';
    document.body.appendChild(testElement);

    const styles = window.getComputedStyle(testElement);
    const hasStyles =
      styles.backgroundColor !== 'rgba(0, 0, 0, 0)' || styles.color !== 'rgb(0, 0, 0)';

    document.body.removeChild(testElement);

    if (!hasStyles) {
      console.warn('CSS styles not loaded properly, attempting to reload...');
      // Force reload if styles aren't loaded
      setTimeout(() => window.location.reload(), 1000);
    } else {
      console.log('CSS styles loaded successfully');
    }
  };

  // Check CSS after a short delay
  setTimeout(checkCSSLoaded, 500);
}

// Initialize Service Worker for caching and offline support (production only)
if (import.meta.env.PROD) {
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
  console.log('Service Worker disabled in development mode');
}

createRoot(document.getElementById('root')!).render(<App />);
