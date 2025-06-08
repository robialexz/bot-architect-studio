import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize Sentry for production error tracking
import { initializeSentry } from './lib/sentry';
initializeSentry();

// Initialize Service Worker for caching and offline support
// Temporarily disabled for Vercel deployment debugging
// import { registerSW } from './lib/serviceWorker';
// import { toast } from '@/hooks/use-toast';

// Register service worker with user notifications
// registerSW({
//   onSuccess: () => {
//     console.log('App is ready for offline use');
//   },
//   onUpdate: () => {
//     toast({
//       title: 'App Update Available',
//       description: 'A new version is available. Refresh to update.',
//       duration: 10000,
//     });
//   },
//   onOfflineReady: () => {
//     toast({
//       title: 'Ready for Offline',
//       description: 'App is cached and ready to work offline.',
//       duration: 5000,
//     });
//   },
// });

createRoot(document.getElementById('root')!).render(<App />);
