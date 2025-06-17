import { logger } from './logger';
import { features } from './env';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

interface NavigationTiming {
  dns: number;
  tcp: number;
  ssl: number;
  ttfb: number;
  download: number;
  domInteractive: number;
  domComplete: number;
  loadComplete: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = features.performanceMonitoring;
    if (this.isEnabled && typeof window !== 'undefined') {
      this.initializeObservers();
      this.measureNavigationTiming();
      this.measureWebVitals();
    }
  }

  private initializeObservers() {
    // Observe Long Tasks (> 50ms)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            this.recordMetric('long-task', entry.duration, 'ms', {
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // Long tasks not supported
      }

      // Observe Layout Shifts
      try {
        const layoutShiftObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & {
              hadRecentInput: boolean;
              value: number;
            };
            if (!layoutShiftEntry.hadRecentInput) {
              this.recordMetric('layout-shift', layoutShiftEntry.value, 'score', {
                startTime: entry.startTime,
              });
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        // Layout shift not supported
      }

      // Observe Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { element?: Element };
          this.recordMetric('largest-contentful-paint', lastEntry.startTime, 'ms', {
            element: lastEntry.element?.tagName,
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        // LCP not supported
      }

      // Observe First Input Delay
      try {
        const fidObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as PerformanceEntry & { processingStart: number };
            this.recordMetric(
              'first-input-delay',
              fidEntry.processingStart - entry.startTime,
              'ms',
              {
                eventType: entry.name,
              }
            );
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        // FID not supported
      }
    }
  }

  private measureNavigationTiming() {
    if (typeof window === 'undefined' || !window.performance?.timing) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const navigationStart = timing.navigationStart;

        const metrics: NavigationTiming = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          tcp: timing.connectEnd - timing.connectStart,
          ssl:
            timing.secureConnectionStart > 0 ? timing.connectEnd - timing.secureConnectionStart : 0,
          ttfb: timing.responseStart - navigationStart,
          download: timing.responseEnd - timing.responseStart,
          domInteractive: timing.domInteractive - navigationStart,
          domComplete: timing.domComplete - navigationStart,
          loadComplete: timing.loadEventEnd - navigationStart,
        };

        Object.entries(metrics).forEach(([key, value]) => {
          this.recordMetric(`navigation-${key}`, value, 'ms');
        });

        logger.performance.pageLoad(window.location.pathname, metrics.loadComplete);
      }, 0);
    });
  }

  private measureWebVitals() {
    // Core Web Vitals thresholds
    const thresholds = {
      'largest-contentful-paint': { good: 2500, poor: 4000 },
      'first-input-delay': { good: 100, poor: 300 },
      'cumulative-layout-shift': { good: 0.1, poor: 0.25 },
    };

    // Check thresholds and log warnings
    setTimeout(() => {
      this.metrics.forEach(metric => {
        const threshold = thresholds[metric.name as keyof typeof thresholds];
        if (threshold) {
          if (metric.value > threshold.poor) {
            logger.warn(`Poor ${metric.name}: ${metric.value}${metric.unit}`, { metric });
          } else if (metric.value > threshold.good) {
            logger.info(`Needs improvement ${metric.name}: ${metric.value}${metric.unit}`, {
              metric,
            });
          }
        }
      });
    }, 5000);
  }

  private recordMetric(
    name: string,
    value: number,
    unit: string,
    context?: Record<string, unknown>
  ) {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      context,
    };

    this.metrics.push(metric);

    // Log significant metrics
    if (value > 100 || ['long-task', 'layout-shift'].includes(name)) {
      logger.debug(`Performance metric: ${name}`, metric);
    }
  }

  // Public API
  startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, 'ms');
      return duration;
    };
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const endTimer = this.startTimer(name);
    return fn().finally(() => {
      endTimer();
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    const endTimer = this.startTimer(name);
    try {
      return fn();
    } finally {
      endTimer();
    }
  }

  markFeatureUsage(feature: string, context?: Record<string, unknown>) {
    this.recordMetric(`feature-${feature}`, 1, 'count', context);
    logger.info(`Feature used: ${feature}`, context);
  }

  // Track bundle size and load times
  trackBundleMetrics() {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      totalSize += size;

      if (resource.name.includes('.js')) {
        jsSize += size;
      } else if (resource.name.includes('.css')) {
        cssSize += size;
      }
    });

    this.recordMetric('bundle-total-size', totalSize, 'bytes');
    this.recordMetric('bundle-js-size', jsSize, 'bytes');
    this.recordMetric('bundle-css-size', cssSize, 'bytes');
  }

  // Track API performance
  trackAPICall(endpoint: string, duration: number, status: number, size?: number) {
    this.recordMetric('api-call-duration', duration, 'ms', {
      endpoint,
      status: status.toString(),
      size,
    });
  }

  // Generate performance report
  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.getMetrics(),
      summary: {
        totalMetrics: this.metrics.length,
        averageLoadTime: this.getAverageMetric('navigation-loadComplete'),
        averageLCP: this.getAverageMetric('largest-contentful-paint'),
        averageFID: this.getAverageMetric('first-input-delay'),
        layoutShifts: this.getMetricsByName('layout-shift').length,
        longTasks: this.getMetricsByName('long-task').length,
      },
    };

    return JSON.stringify(report, null, 2);
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return null;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for component performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const measureRender = () => {
    return performanceMonitor.startTimer(`component-render-${componentName}`);
  };

  const measureEffect = (effectName: string) => {
    return performanceMonitor.startTimer(`component-effect-${componentName}-${effectName}`);
  };

  const markInteraction = (interaction: string, context?: Record<string, unknown>) => {
    performanceMonitor.recordMetric(
      `interaction-${componentName}-${interaction}`,
      1,
      'count',
      context
    );
  };

  return {
    measureRender,
    measureEffect,
    markInteraction,
  };
}

// Higher-order component for automatic performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const name = componentName || Component.displayName || Component.name || 'Unknown';

  const WrappedComponent = (props: P) => {
    const endTimer = performanceMonitor.startTimer(`component-render-${name}`);

    React.useEffect(() => {
      endTimer();
    });

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${name})`;
  return WrappedComponent;
}

export default performanceMonitor;
