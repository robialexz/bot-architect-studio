import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add error handling for debugging
console.log('🚀 FlowsyAI main.tsx starting...');
console.log('🌍 Environment info:', {
  location: window.location.href,
  userAgent: navigator.userAgent,
  timestamp: new Date().toISOString(),
});

// Verify React is properly loaded
console.log('🔍 React availability check:', {
  createRoot: typeof createRoot,
  React: typeof React,
  hasCreateContext: typeof React !== 'undefined' && typeof React.createContext === 'function',
});

// Check if DOM is ready
console.log('📄 DOM readiness check:', {
  readyState: document.readyState,
  rootElement: !!document.getElementById('root'),
  bodyLoaded: !!document.body,
});

try {
  // Mount React app immediately
  console.log('🔄 Mounting React app...');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ Root element not found in DOM');
    throw new Error('Root element not found');
  }

  console.log('✅ Root element found:', rootElement);
  console.log('🔧 Creating React root...');
  const root = createRoot(rootElement);

  console.log('🎨 Rendering App component...');
  root.render(<App />);
  console.log('✅ React app mounted successfully');

  // Remove loading fallback if it exists
  setTimeout(() => {
    const fallback = document.getElementById('loading-fallback');
    if (fallback) {
      console.log('🧹 Removing loading fallback');
      fallback.remove();
    }
  }, 100);

  // Initialize additional services after app is mounted
  setTimeout(() => {
    // Initialize Sentry for production error tracking
    import('./lib/sentry')
      .then(({ initializeSentry }) => {
        initializeSentry();
        console.log('✅ Sentry initialized');
      })
      .catch(error => {
        console.warn('⚠️ Sentry initialization failed:', error);
      });

    // Initialize Service Worker for caching and offline support
    import('./lib/serviceWorker')
      .then(({ registerSW }) => {
        registerSW({
          onSuccess: () => {
            console.log('App is ready for offline use');
          },
          onUpdate: () => {
            console.log('App update available - refresh to update');
            // Show browser notification instead of toast
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('FlowsyAI Update Available', {
                body: 'A new version is available. Refresh to update.',
                icon: '/favicon.ico'
              });
            }
          },
          onOfflineReady: () => {
            console.log('App is cached and ready to work offline');
            // Show browser notification instead of toast
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('FlowsyAI Ready for Offline', {
                body: 'App is cached and ready to work offline.',
                icon: '/favicon.ico'
              });
            }
          },
        });
        console.log('✅ Service Worker registered');
      })
      .catch(error => {
        console.warn('⚠️ Service Worker registration failed:', error);
      });
  }, 1000);
} catch (error) {
  console.error('❌ Critical error in main.tsx:', error);

  // Fallback: show error message in the root div
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: red;">FlowsyAI Loading Error</h1>
        <p>There was an error loading the application:</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error.message}</pre>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
}
