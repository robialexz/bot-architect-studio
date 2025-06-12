import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is available globally before any components load
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Add error handling for debugging
console.log('🚀 FlowsyAI main.tsx starting...');

// Add timeout protection for React loading
const REACT_LOAD_TIMEOUT = 10000; // 10 seconds

const mountReactApp = () => {
  try {
    // Mount React app immediately
    console.log('🔄 Mounting React app...');
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('✅ React app mounted successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to mount React app:', error);

    // Show fallback UI
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          padding: 2rem;
        ">
          <h1 style="color: #ef4444; margin-bottom: 1rem;">Failed to Load Application</h1>
          <p style="color: #6b7280; margin-bottom: 2rem;">
            There was an error loading FlowsyAI. Please try refreshing the page.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
            "
          >
            Refresh Page
          </button>
        </div>
      `;
    }
    return false;
  }
};

// Try to mount React app with timeout protection
const mountSuccess = mountReactApp();

if (mountSuccess) {
  // Set up a timeout to detect if React fails to initialize
  const timeoutId = setTimeout(() => {
    console.warn('⚠️  React app may have failed to initialize within timeout');
    // Check if the app actually loaded by looking for React-rendered content
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement.children.length === 0) {
      console.error('❌ React app failed to render content, showing fallback');
      rootElement.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          padding: 2rem;
        ">
          <h1 style="color: #f59e0b; margin-bottom: 1rem;">Loading Timeout</h1>
          <p style="color: #6b7280; margin-bottom: 2rem;">
            FlowsyAI is taking longer than expected to load. Please try refreshing the page.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              background: #3b82f6;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
            "
          >
            Refresh Page
          </button>
        </div>
      `;
    }
  }, REACT_LOAD_TIMEOUT);

  // Clear timeout if React successfully renders
  const observer = new MutationObserver(() => {
    const rootElement = document.getElementById('root');
    if (rootElement && rootElement.children.length > 0) {
      clearTimeout(timeoutId);
      observer.disconnect();
      console.log('✅ React app successfully rendered content');
    }
  });

  const rootElement = document.getElementById('root');
  if (rootElement) {
    observer.observe(rootElement, { childList: true, subtree: true });
  }
}

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
          console.log('App update available');
        },
        onOfflineReady: () => {
          console.log('App is ready for offline use');
        },
      });
      console.log('✅ Service Worker registered');
    })
    .catch(error => {
      console.warn('⚠️ Service Worker registration failed:', error);
    });
}, 1000);
