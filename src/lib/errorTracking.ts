/**
 * Production Error Tracking System
 * Captures, categorizes, and reports runtime errors
 */

import { logger } from './logger';
import { performanceMonitor } from './performance';

interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  breadcrumbs: Breadcrumb[];
}

interface Breadcrumb {
  timestamp: number;
  category: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

enum ErrorCategory {
  JAVASCRIPT = 'javascript',
  NETWORK = 'network',
  PROMISE = 'promise',
  RESOURCE = 'resource',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
}

enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

class ErrorTracker {
  private errors: ErrorReport[] = [];
  private breadcrumbs: Breadcrumb[] = [];
  private sessionId: string;
  private isProduction = import.meta.env.PROD;
  private maxBreadcrumbs = 50;
  private maxErrors = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeErrorHandlers();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Global JavaScript errors
    window.addEventListener('error', event => {
      this.captureError(event.error || new Error(event.message), {
        category: ErrorCategory.JAVASCRIPT,
        severity: ErrorSeverity.HIGH,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.captureError(new Error(event.reason), {
        category: ErrorCategory.PROMISE,
        severity: ErrorSeverity.HIGH,
        context: {
          reason: event.reason,
        },
      });
    });

    // Resource loading errors
    window.addEventListener(
      'error',
      event => {
        if (event.target !== window) {
          const target = event.target as HTMLElement | null;
          this.captureError(
            new Error(
              `Resource failed to load: ${(target as HTMLImageElement)?.src || (target as HTMLLinkElement)?.href}`
            ),
            {
              category: ErrorCategory.RESOURCE,
              severity: ErrorSeverity.MEDIUM,
              context: {
                element: target?.tagName,
                src: (target as HTMLImageElement)?.src || (target as HTMLLinkElement)?.href,
              },
            }
          );
        }
      },
      true
    );

    // Network errors (fetch failures)
    this.interceptFetch();
  }

  private interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();

      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;

        // Track API performance
        performanceMonitor.trackAPICall(args[0].toString(), duration, response.status);

        // Track failed requests
        if (!response.ok) {
          this.captureError(new Error(`HTTP ${response.status}: ${response.statusText}`), {
            category: ErrorCategory.NETWORK,
            severity: response.status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
            context: {
              url: args[0].toString(),
              status: response.status,
              statusText: response.statusText,
              duration,
            },
          });
        }

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;

        this.captureError(error as Error, {
          category: ErrorCategory.NETWORK,
          severity: ErrorSeverity.HIGH,
          context: {
            url: args[0].toString(),
            duration,
          },
        });

        throw error;
      }
    };
  }

  captureError(
    error: Error,
    options?: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      context?: Record<string, unknown>;
      userId?: string;
    }
  ) {
    const errorReport: ErrorReport = {
      id: this.generateErrorId(),
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: options?.userId,
      sessionId: this.sessionId,
      category: options?.category || ErrorCategory.JAVASCRIPT,
      severity: options?.severity || this.determineSeverity(error),
      context: options?.context,
      breadcrumbs: [...this.breadcrumbs],
    };

    this.errors.push(errorReport);

    // Keep only recent errors to prevent memory leaks
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log error based on severity
    if (errorReport.severity === ErrorSeverity.CRITICAL) {
      logger.error('Critical error captured', errorReport);
    } else if (errorReport.severity === ErrorSeverity.HIGH) {
      logger.error('High severity error captured', errorReport);
    } else {
      logger.warn('Error captured', errorReport);
    }

    // In production, send to external service
    if (this.isProduction) {
      this.sendToExternalService(errorReport);
    }

    return errorReport.id;
  }

  addBreadcrumb(
    category: string,
    message: string,
    level: Breadcrumb['level'] = 'info',
    data?: Record<string, unknown>
  ) {
    const breadcrumb: Breadcrumb = {
      timestamp: Date.now(),
      category,
      message,
      level,
      data,
    };

    this.breadcrumbs.push(breadcrumb);

    // Keep only recent breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }

  private determineSeverity(error: Error): ErrorSeverity {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return ErrorSeverity.HIGH;
    }

    if (message.includes('chunk') || message.includes('loading')) {
      return ErrorSeverity.MEDIUM;
    }

    if (message.includes('permission') || message.includes('security')) {
      return ErrorSeverity.CRITICAL;
    }

    return ErrorSeverity.MEDIUM;
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async sendToExternalService(errorReport: ErrorReport) {
    try {
      // In a real application, you would send to services like:
      // - Sentry
      // - Bugsnag
      // - LogRocket
      // - Custom error reporting endpoint

      // Example implementation:
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });

      console.log('Error would be sent to external service:', errorReport);
    } catch (sendError) {
      logger.error('Failed to send error to external service', sendError);
    }
  }

  // Public API
  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  getErrorsByCategory(category: ErrorCategory): ErrorReport[] {
    return this.errors.filter(error => error.category === category);
  }

  getErrorsBySeverity(severity: ErrorSeverity): ErrorReport[] {
    return this.errors.filter(error => error.severity === severity);
  }

  clearErrors() {
    this.errors = [];
  }

  clearBreadcrumbs() {
    this.breadcrumbs = [];
  }

  setUserId(userId: string) {
    this.addBreadcrumb('user', `User ID set: ${userId}`, 'info');
  }

  // Generate error summary report
  generateErrorReport(): string {
    const summary = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      totalErrors: this.errors.length,
      errorsByCategory: Object.values(ErrorCategory).reduce(
        (acc, category) => {
          acc[category] = this.getErrorsByCategory(category).length;
          return acc;
        },
        {} as Record<string, number>
      ),
      errorsBySeverity: Object.values(ErrorSeverity).reduce(
        (acc, severity) => {
          acc[severity] = this.getErrorsBySeverity(severity).length;
          return acc;
        },
        {} as Record<string, number>
      ),
      recentErrors: this.errors.slice(-10),
      breadcrumbs: this.breadcrumbs.slice(-20),
    };

    return JSON.stringify(summary, null, 2);
  }
}

// Create singleton instance
export const errorTracker = new ErrorTracker();

// React error boundary hook
export function useErrorHandler() {
  return {
    captureError: (error: Error, context?: Record<string, unknown>) => {
      errorTracker.captureError(error, { context });
    },
    addBreadcrumb: (message: string, category = 'user', data?: Record<string, unknown>) => {
      errorTracker.addBreadcrumb(category, message, 'info', data);
    },
  };
}

// Higher-order component for error boundary
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallbackComponent?: React.ComponentType<{ error: Error; errorId: string }>
) {
  const ErrorBoundaryComponent = (props: P) => {
    const [error, setError] = React.useState<Error | null>(null);
    const [errorId, setErrorId] = React.useState<string>('');

    React.useEffect(() => {
      const handleError = (error: Error) => {
        const id = errorTracker.captureError(error, {
          context: { component: WrappedComponent.displayName || WrappedComponent.name },
        });
        setError(error);
        setErrorId(id);
      };

      // This would be implemented with React Error Boundary in a real scenario
      window.addEventListener('error', event => {
        handleError(event.error);
      });

      return () => {
        window.removeEventListener('error', handleError);
      };
    }, []);

    if (error) {
      if (fallbackComponent) {
        return React.createElement(fallbackComponent, { error, errorId });
      }
      return React.createElement(
        'div',
        {
          style: { padding: '20px', border: '1px solid red', borderRadius: '4px' },
        },
        `Error: ${error.message} (ID: ${errorId})`
      );
    }

    return React.createElement(WrappedComponent, props);
  };

  ErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  return ErrorBoundaryComponent;
}

export { ErrorCategory, ErrorSeverity };
export default errorTracker;
