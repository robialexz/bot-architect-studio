/**
 * Sentry Error Tracking Integration
 * Production-ready error monitoring and performance tracking
 */

import * as Sentry from '@sentry/react';
import React, { useEffect, useCallback } from 'react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom';

interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  sampleRate: number;
  tracesSampleRate: number;
  enableInDevMode: boolean;
}

const defaultConfig: SentryConfig = {
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.VITE_APP_ENV || 'development',
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  sampleRate: import.meta.env.PROD ? 1.0 : 0.1,
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  enableInDevMode: false,
};

export function initializeSentry(config: Partial<SentryConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  // Only initialize Sentry if DSN is provided and we're in production or dev mode is enabled
  if (!finalConfig.dsn || (!import.meta.env.PROD && !finalConfig.enableInDevMode)) {
    console.log('Sentry not initialized: Missing DSN or not in production mode');
    return;
  }

  Sentry.init({
    dsn: finalConfig.dsn,
    environment: finalConfig.environment,
    release: finalConfig.release,

    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration({
        // Set up automatic route change tracking for React Router
        // Router instrumentation is now handled automatically
      }),
    ],

    // Error Sampling
    sampleRate: finalConfig.sampleRate,

    // Performance Sampling
    tracesSampleRate: finalConfig.tracesSampleRate,

    // Additional Configuration
    beforeSend(event, hint) {
      // Filter out development errors
      if (finalConfig.environment === 'development') {
        console.log('Sentry Event (Dev Mode):', event);
      }

      // Filter out specific errors
      if (event.exception) {
        const error = hint.originalException;

        // Skip network errors that are not actionable
        if (error instanceof Error) {
          if (
            error.message.includes('Network Error') ||
            error.message.includes('Failed to fetch')
          ) {
            return null;
          }
        }
      }

      return event;
    },

    // User Context
    initialScope: {
      tags: {
        component: 'bot-architect-studio',
        version: finalConfig.release,
      },
    },
  });

  console.log(`Sentry initialized for ${finalConfig.environment} environment`);
}

// Error Boundary Component
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Performance Monitoring Helpers
export const sentryPerformance = {
  // Start a performance span
  startSpan: (name: string, op: string = 'navigation') => {
    return Sentry.startSpan({ name, op }, () => {});
  },

  // Track component render performance
  trackComponentRender: (componentName: string) => {
    return Sentry.startSpan({ name: componentName, op: 'react.render' }, () => {});
  },

  // Track API call performance
  trackAPICall: async <T>(endpoint: string, apiCall: () => Promise<T>): Promise<T> => {
    return Sentry.startSpan(
      {
        name: `API ${endpoint}`,
        op: 'http.client',
      },
      async () => {
        try {
          const result = await apiCall();
          return result;
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      }
    );
  },
};

// User Context Management
export const sentryUser = {
  setUser: (user: { id: string; email?: string; username?: string }) => {
    Sentry.setUser(user);
  },

  clearUser: () => {
    Sentry.setUser(null);
  },

  addBreadcrumb: (
    message: string,
    category: string = 'user',
    level: 'info' | 'warning' | 'error' | 'debug' = 'info'
  ) => {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
    });
  },
};

// Manual Error Reporting
export const sentryCapture = {
  exception: (error: Error, context?: Record<string, unknown>) => {
    Sentry.withScope(scope => {
      if (context) {
        scope.setContext('additional', context);
      }
      Sentry.captureException(error);
    });
  },

  message: (message: string, level: 'info' | 'warning' | 'error' | 'debug' = 'info') => {
    Sentry.captureMessage(message, level);
  },

  event: (event: Sentry.Event) => {
    Sentry.captureEvent(event);
  },
};

// React Hook for Sentry Integration
export function useSentry() {
  const trackError = useCallback((error: Error, context?: Record<string, unknown>) => {
    sentryCapture.exception(error, context);
  }, []);

  const trackMessage = useCallback(
    (message: string, level?: 'info' | 'warning' | 'error' | 'debug') => {
      sentryCapture.message(message, level);
    },
    []
  );

  const addBreadcrumb = useCallback((message: string, category?: string) => {
    sentryUser.addBreadcrumb(message, category);
  }, []);

  return {
    trackError,
    trackMessage,
    addBreadcrumb,
  };
}

export default {
  initializeSentry,
  SentryErrorBoundary,
  sentryPerformance,
  sentryUser,
  sentryCapture,
  useSentry,
};
