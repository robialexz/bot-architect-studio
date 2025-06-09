import React, { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AssistantProvider } from './contexts/AssistantContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import LandingLayout from './components/LandingLayout';

import { AuthenticatedRoute, PublicRoute } from './components/auth/authHelpers';
import { Loader2 } from 'lucide-react';

// Import critical pages immediately (landing pages and auth)
import Index from './pages/Index';
import SimpleLandingPage from './pages/SimpleLandingPage';
import InteractiveLandingPage from './pages/InteractiveLandingPage';
import MinimalistLandingPage from './pages/MinimalistLandingPage';
import AuthPageSimple from './pages/AuthPageSimple';
import NotFound from './pages/NotFound';
import UITest from './pages/UITest';

// Public pages
import PlatformShowcase from './pages/PlatformShowcase';
import RoadmapPage from './pages/RoadmapPage';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import Documentation from './pages/Documentation';
import Waitlist from './pages/Waitlist';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Authenticated pages
import WorkflowBuilder from './pages/WorkflowBuilder';
import AIEcosystemPlayground from './pages/AIEcosystemPlayground';
import WorkflowTemplatesGallery from './pages/WorkflowTemplatesGallery';
import WorkflowMarketplace from './pages/WorkflowMarketplace';
import WorkflowAnalytics from './pages/WorkflowAnalytics';
import MyProjectsPage from './pages/MyProjectsPage';
import Settings from './pages/Settings';
import BillingPage from './pages/BillingPage';
import SecurityDashboard from './pages/SecurityDashboard';
import WorkflowCollaboration from './pages/WorkflowCollaboration';
import AIOptimizationHub from './pages/AIOptimizationHub';

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

// Create a stable QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408, 429
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false;
          }
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  // Log app initialization
  React.useEffect(() => {
    console.log('Application initialized', {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });

    // Handle chunk loading failures (common in production with lazy loading)
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error;
      if (error && error.message && error.message.includes('Loading chunk')) {
        console.warn('Chunk loading failed, reloading page', { error: error.message });
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
          console.warn('Dynamic import failed, reloading page', { error: event.reason.message });
          event.preventDefault(); // Prevent the error from being logged to console
          window.location.reload();
        }
      }
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application error boundary triggered', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AssistantProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public Routes with Landing Layout */}
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Index />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/simple"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <SimpleLandingPage />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/interactive"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <InteractiveLandingPage />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/minimalist"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <MinimalistLandingPage />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <PublicRoute>
                        <LandingLayout showNavbar={false} showFooter={false} showFeedback={false}>
                          <AuthPageSimple />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/test"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <UITest />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />

                  {/* Public Navigation Pages */}
                  <Route
                    path="/platform-showcase"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <PlatformShowcase />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/roadmap"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <RoadmapPage />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/pricing"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Pricing />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/features"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Features />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/documentation"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Documentation />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/waitlist"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Waitlist />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <About />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Contact />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Privacy />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <PublicRoute>
                        <LandingLayout>
                          <Terms />
                        </LandingLayout>
                      </PublicRoute>
                    }
                  />

                  {/* Authenticated Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <AccountDashboard />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <AccountDashboard />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/workflow-builder"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <WorkflowBuilder />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/ai-ecosystem-playground"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <AIEcosystemPlayground />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/workflow-templates"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <WorkflowTemplatesGallery />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/workflow-marketplace"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <WorkflowMarketplace />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/workflow-analytics"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <WorkflowAnalytics />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <MyProjectsPage />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <Settings />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <BillingPage />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/security-dashboard"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <SecurityDashboard />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/workflow-collaboration"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <WorkflowCollaboration />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/ai-optimization"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <AIOptimizationHub />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <AuthenticatedRoute>
                        <Layout>
                          <Suspense
                            fallback={
                              <div className="flex items-center justify-center min-h-screen">
                                <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                            }
                          >
                            <WorkflowAnalytics />
                          </Suspense>
                        </Layout>
                      </AuthenticatedRoute>
                    }
                  />

                  {/* Redirect old routes */}
                  <Route path="/login" element={<Navigate to="/auth" replace />} />
                  <Route path="/register" element={<Navigate to="/auth" replace />} />

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AssistantProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
