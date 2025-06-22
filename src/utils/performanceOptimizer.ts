/**
 * Performance Optimizer for FlowsyAI
 * Optimizes frontend-backend integration performance
 */

import { logger } from '@/lib/logger';

// Performance metrics interface
export interface PerformanceMetrics {
  apiResponseTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
}

// Optimization configuration
export interface OptimizationConfig {
  enableCaching: boolean;
  enableCompression: boolean;
  enableLazyLoading: boolean;
  enableServiceWorker: boolean;
  maxCacheSize: number;
  cacheExpiry: number;
  batchSize: number;
  debounceDelay: number;
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    apiResponseTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    cacheHitRate: 0,
    errorRate: 0,
    throughput: 0,
  };

  private config: OptimizationConfig = {
    enableCaching: true,
    enableCompression: true,
    enableLazyLoading: true,
    enableServiceWorker: false,
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
    batchSize: 10,
    debounceDelay: 300,
  };

  private cache = new Map<string, { data: any; timestamp: number; hits: number }>();
  private requestQueue: Array<{ request: Function; resolve: Function; reject: Function }> = [];
  private isProcessingQueue = false;

  /**
   * Initialize performance monitoring
   */
  initialize(): void {
    this.setupPerformanceObserver();
    this.setupMemoryMonitoring();
    this.setupErrorTracking();
    this.startMetricsCollection();
    
    logger.info('Performance optimizer initialized');
  }

  /**
   * Setup performance observer for monitoring
   */
  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.metrics.renderTime = entry.duration;
          } else if (entry.entryType === 'measure') {
            if (entry.name.includes('api-call')) {
              this.metrics.apiResponseTime = entry.duration;
            }
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'measure'] });
    }
  }

  /**
   * Setup memory monitoring
   */
  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
      }, 10000); // Every 10 seconds
    }
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking(): void {
    let errorCount = 0;
    let totalRequests = 0;

    window.addEventListener('error', () => {
      errorCount++;
      this.metrics.errorRate = errorCount / Math.max(totalRequests, 1);
    });

    // Track API requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      totalRequests++;
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          errorCount++;
        }
        this.metrics.errorRate = errorCount / totalRequests;
        return response;
      } catch (error) {
        errorCount++;
        this.metrics.errorRate = errorCount / totalRequests;
        throw error;
      }
    };
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Collect current metrics
   */
  private collectMetrics(): void {
    // Calculate cache hit rate
    const totalCacheAccess = Array.from(this.cache.values()).reduce((sum, item) => sum + item.hits, 0);
    const cacheHits = Array.from(this.cache.values()).filter(item => item.hits > 0).length;
    this.metrics.cacheHitRate = totalCacheAccess > 0 ? cacheHits / totalCacheAccess : 0;

    // Log metrics
    logger.debug('Performance metrics:', this.metrics);
  }

  /**
   * Optimize API request with caching
   */
  async optimizeApiRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    options: { ttl?: number; forceRefresh?: boolean } = {}
  ): Promise<T> {
    const { ttl = this.config.cacheExpiry, forceRefresh = false } = options;

    // Check cache first
    if (!forceRefresh && this.config.enableCaching) {
      const cached = this.cache.get(key);
      if (cached && Date.now() - cached.timestamp < ttl) {
        cached.hits++;
        logger.debug(`Cache hit for key: ${key}`);
        return cached.data;
      }
    }

    // Make request with performance tracking
    const startTime = performance.now();
    performance.mark(`api-call-${key}-start`);

    try {
      const data = await requestFn();
      
      const endTime = performance.now();
      performance.mark(`api-call-${key}-end`);
      performance.measure(`api-call-${key}`, `api-call-${key}-start`, `api-call-${key}-end`);

      // Cache the result
      if (this.config.enableCaching) {
        this.setCache(key, data);
      }

      // Update throughput
      this.metrics.throughput = 1000 / (endTime - startTime); // requests per second

      logger.debug(`API request completed for key: ${key} in ${endTime - startTime}ms`);
      return data;

    } catch (error) {
      logger.error(`API request failed for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Batch multiple requests for efficiency
   */
  async batchRequests<T>(
    requests: Array<() => Promise<T>>,
    options: { maxConcurrency?: number; delay?: number } = {}
  ): Promise<T[]> {
    const { maxConcurrency = this.config.batchSize, delay = 0 } = options;
    const results: T[] = [];

    for (let i = 0; i < requests.length; i += maxConcurrency) {
      const batch = requests.slice(i, i + maxConcurrency);
      
      const batchResults = await Promise.allSettled(
        batch.map(request => request())
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          logger.error('Batch request failed:', result.reason);
          throw result.reason;
        }
      }

      // Add delay between batches if specified
      if (delay > 0 && i + maxConcurrency < requests.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return results;
  }

  /**
   * Debounce function calls for performance
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number = this.config.debounceDelay
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  /**
   * Throttle function calls
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Set cache with size management
   */
  private setCache(key: string, data: any): void {
    // Check cache size limit
    if (this.getCacheSize() > this.config.maxCacheSize) {
      this.evictOldestCache();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    });
  }

  /**
   * Get current cache size
   */
  private getCacheSize(): number {
    return JSON.stringify(Array.from(this.cache.entries())).length;
  }

  /**
   * Evict oldest cache entries
   */
  private evictOldestCache(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest 25% of entries
    const toRemove = Math.ceil(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    logger.debug(`Evicted ${toRemove} cache entries`);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.apiResponseTime > 2000) {
      recommendations.push('Consider enabling request caching or using a CDN');
    }

    if (this.metrics.memoryUsage > 100 * 1024 * 1024) { // 100MB
      recommendations.push('Memory usage is high, consider lazy loading components');
    }

    if (this.metrics.cacheHitRate < 0.5) {
      recommendations.push('Cache hit rate is low, review caching strategy');
    }

    if (this.metrics.errorRate > 0.05) { // 5%
      recommendations.push('Error rate is high, implement better error handling');
    }

    if (this.metrics.renderTime > 3000) {
      recommendations.push('Page load time is slow, optimize bundle size');
    }

    return recommendations;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('Performance optimizer configuration updated', this.config);
  }

  /**
   * Generate performance report
   */
  generateReport(): {
    metrics: PerformanceMetrics;
    recommendations: string[];
    cacheStats: {
      size: number;
      entries: number;
      hitRate: number;
    };
    config: OptimizationConfig;
  } {
    return {
      metrics: this.getMetrics(),
      recommendations: this.getRecommendations(),
      cacheStats: {
        size: this.getCacheSize(),
        entries: this.cache.size,
        hitRate: this.metrics.cacheHitRate
      },
      config: this.config
    };
  }
}

// Create singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

// Export utility functions
export const optimizeApiRequest = performanceOptimizer.optimizeApiRequest.bind(performanceOptimizer);
export const batchRequests = performanceOptimizer.batchRequests.bind(performanceOptimizer);
export const debounce = performanceOptimizer.debounce.bind(performanceOptimizer);
export const throttle = performanceOptimizer.throttle.bind(performanceOptimizer);

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  performanceOptimizer.initialize();
}

export default performanceOptimizer;
