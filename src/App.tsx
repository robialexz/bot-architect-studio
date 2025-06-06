import React, { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { preloadCriticalComponents } from './components/lazy/LazyComponents';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AssistantProvider } from './contexts/AssistantContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';

import { AuthenticatedRoute, PublicRoute } from './components/auth/authHelpers';
import { Loader2 } from 'lucide-react';

// Initialize enterprise monitoring and security
import { logger } from './lib/logger';
import { performanceMonitor } from './lib/performance';
import { healthMonitor } from './lib/health';
import './lib/security'; // Initialize security policies

// Import critical pages immediately (landing pages and auth)
import Index from './pages/Index';
import SimpleLandingPage from './pages/SimpleLandingPage';
import InteractiveLandingPage from './pages/InteractiveLandingPage';
import MinimalistLandingPage from './pages/MinimalistLandingPage';
import AuthPageSimple from './pages/AuthPageSimple';
import NotFound from './pages/NotFound';
import VideoShowcase from './pages/VideoShowcase';

// Lazy load heavy authenticated pages for better performance with error handling
const AccountDashboard = lazy(() =>
  import('./pages/AccountDashboard').catch(error => {
    console.error('Failed to load AccountDashboard:', error);
    // Return a fallback component
    return {
      default: () => (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Failed to load dashboard</h2>
          <p className="text-muted-foreground mb-4">Please refresh the page to try again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Refresh Page
          </button>
        </div>
      ),
    };
  })
);

const WorkflowBuilder = lazy(() =>
  import('./pages/WorkflowBuilder').catch(error => {
    console.error('Failed to load WorkflowBuilder:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load Workflow Builder. Please refresh.</div>
      ),
    };
  })
);

const AnalyticsDashboard = lazy(() =>
  import('./pages/AnalyticsDashboard').catch(error => {
    console.error('Failed to load AnalyticsDashboard:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load Analytics. Please refresh.</div>
      ),
    };
  })
);

const AIAgentHub = lazy(() =>
  import('./pages/AIAgentHub').catch(error => {
    console.error('Failed to load AIAgentHub:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load AI Agent Hub. Please refresh.</div>
      ),
    };
  })
);

const CollaborationHub = lazy(() =>
  import('./pages/CollaborationHub').catch(error => {
    console.error('Failed to load CollaborationHub:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load Collaboration Hub. Please refresh.</div>
      ),
    };
  })
);

const AIOptimizationHub = lazy(() =>
  import('./pages/AIOptimizationHub').catch(error => {
    console.error('Failed to load AIOptimizationHub:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load AI Optimization Hub. Please refresh.</div>
      ),
    };
  })
);

const MyProjectsPage = lazy(() =>
  import('./pages/MyProjectsPage').catch(error => {
    console.error('Failed to load MyProjectsPage:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load My Projects. Please refresh.</div>
      ),
    };
  })
);

const BillingPage = lazy(() =>
  import('./pages/BillingPage').catch(error => {
    console.error('Failed to load BillingPage:', error);
    return {
      default: () => <div className="p-8 text-center">Failed to load Billing. Please refresh.</div>,
    };
  })
);

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').catch(error => {
    console.error('Failed to load DashboardPage:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load Dashboard. Please refresh.</div>
      ),
    };
  })
);

const WorkflowsPage = lazy(() =>
  import('./pages/WorkflowsPage').catch(error => {
    console.error('Failed to load WorkflowsPage:', error);
    return {
      default: () => (
        <div className="p-8 text-center">Failed to load Workflows. Please refresh.</div>
      ),
    };
  })
);
const WorkflowStudio = lazy(() => import('./pages/WorkflowStudio'));

// Lazy load other pages
const AIEcosystemPlayground = lazy(() => import('./pages/AIEcosystemPlayground'));
const Templates = lazy(() => import('./pages/Templates'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Resources = lazy(() => import('./pages/Resources'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Tutorials = lazy(() => import('./pages/Tutorials'));
const Community = lazy(() => import('./pages/Community'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const WaitlistPage = lazy(() => import('./pages/WaitlistPage'));
const WaitlistAdmin = lazy(() => import('./pages/WaitlistAdmin'));
const WaitlistUnsubscribe = lazy(() => import('./pages/WaitlistUnsubscribe'));
const Settings = lazy(() => import('./pages/Settings'));
const MyAgents = lazy(() => import('./pages/MyAgents'));
const Wallet = lazy(() => import('./pages/Wallet'));

const AuthDebugPage = lazy(() => import('./pages/AuthDebugPage'));
const WorkflowTemplatesGallery = lazy(() => import('./pages/WorkflowTemplatesGallery'));
const WorkflowAnalytics = lazy(() => import('./pages/WorkflowAnalytics'));
const WorkflowCollaboration = lazy(() => import('./pages/WorkflowCollaboration'));
const WorkflowMarketplace = lazy(() => import('./pages/WorkflowMarketplace'));
const SecurityDashboard = lazy(() => import('./pages/SecurityDashboard'));
const PlatformShowcase = lazy(() => import('./pages/PlatformShowcase'));
const ARWorkflow = lazy(() => import('./pages/ARWorkflow'));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Optimized QueryClient configuration for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  // Log app initialization
  React.useEffect(() => {
    logger.info('Application initialized', {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

    // Preload critical components for better performance
    preloadCriticalComponents();

    // Handle chunk loading failures (common in production with lazy loading)
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error;
      if (error && error.message && error.message.includes('Loading chunk')) {
        logger.warn('Chunk loading failed, reloading page', { error: error.message });
        // Reload the page to get fresh chunks
        window.location.reload();
      }
    };

    // Handle unhandled promise rejections (like failed dynamic imports)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === 'object' && event.reason.message) {
        if (
          event.reason.message.includes('Failed to fetch dynamically imported module') ||
          event.reason.message.includes('Loading chunk')
        ) {
          logger.warn('Dynamic import failed, reloading page', { error: event.reason.message });
          event.preventDefault(); // Prevent the error from being logged to console
          window.location.reload();
        }
      }
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Run initial health check
    healthMonitor.quickHealthCheck().then(result => {
      if (result.status === 'unhealthy') {
        logger.warn('Initial health check failed', result);
      }
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      performanceMonitor.destroy();
      healthMonitor.destroy();
      logger.destroy();
    };
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('Application error boundary triggered', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ThemeProvider>
            {' '}
            {/* Added ThemeProvider wrapper */}
            <AssistantProvider>
              {' '}
              {/* Wrap with AssistantProvider */}
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <Layout>
                  {' '}
                  {/* Added Layout wrapper */}
                  <Routes>
                    {' '}
                    {/* Added future flags to eliminate React Router warnings */}
                    {/* Public routes - accessible to all users */}
                    <Route path="/" element={<Index />} />
                    <Route path="/minimalist" element={<MinimalistLandingPage />} />
                    <Route path="/interactive" element={<InteractiveLandingPage />} />
                    <Route path="/simple" element={<SimpleLandingPage />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/documentation" element={<Documentation />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/videos" element={<VideoShowcase />} />
                    <Route
                      path="/ar-workflow"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <ARWorkflow />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/auth"
                      element={
                        <PublicRoute>
                          <AuthPageSimple />
                        </PublicRoute>
                      }
                    />
                    {/* Authenticated routes with lazy loading */}
                    <Route
                      path="/account"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <AccountDashboard />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route path="/builder" element={<Navigate to="/workflow-builder" replace />} />
                    <Route
                      path="/workflow-builder"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <WorkflowBuilder />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/projects"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <MyProjectsPage />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/billing"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <BillingPage />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <Settings />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <Settings />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <AnalyticsDashboard />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/collaboration"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <CollaborationHub />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/ai-optimization"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <AIOptimizationHub />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/ai-agents"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <AIAgentHub />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/ai-workflow-studio/:workflowId?"
                      element={<Navigate to="/workflow-builder" replace />}
                    />
                    <Route
                      path="/ai-ecosystem-playground"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <AIEcosystemPlayground />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/workflow-templates"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <WorkflowTemplatesGallery />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/workflow-analytics"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <WorkflowAnalytics />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/workflow-collaboration"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <WorkflowCollaboration />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/workflow-marketplace"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <WorkflowMarketplace />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/security-dashboard"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <SecurityDashboard />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/platform-showcase"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <PlatformShowcase />
                        </Suspense>
                      }
                    />
                    {/* Legacy routes - keep for backward compatibility */}
                    <Route
                      path="/dashboard"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <DashboardPage />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/workflows"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <WorkflowsPage />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/studio"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <WorkflowStudio />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    {/* Other routes - Protected */}
                    <Route
                      path="/my-agents"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <MyAgents />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    <Route
                      path="/wallet"
                      element={
                        <AuthenticatedRoute>
                          <Suspense fallback={<PageLoader />}>
                            <Wallet />
                          </Suspense>
                        </AuthenticatedRoute>
                      }
                    />
                    {/* Public routes with lazy loading */}
                    <Route
                      path="/templates"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Templates />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/documentation"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Documentation />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/resources"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Resources />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/features"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Features />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/pricing"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Pricing />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/auth-debug"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <AuthDebugPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <About />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Contact />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/privacy"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Privacy />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/terms"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Terms />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/tutorials"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Tutorials />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/community"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <Community />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/roadmap"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <RoadmapPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/waitlist"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <WaitlistPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/admin/waitlist"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <WaitlistAdmin />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/waitlist/unsubscribe"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <WaitlistUnsubscribe />
                        </Suspense>
                      }
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>{' '}
                {/* Closed Layout wrapper */}
              </BrowserRouter>
            </AssistantProvider>
          </ThemeProvider>{' '}
          {/* Closed ThemeProvider wrapper */}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
