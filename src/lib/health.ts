import { supabase } from './supabase';
import { logger } from './logger';
import { env, isProduction } from './env';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  error?: string;
  details?: Record<string, unknown>;
}

interface SystemHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  environment: string;
  checks: HealthCheck[];
  uptime: number;
}

class HealthMonitor {
  private startTime: number;
  private checkInterval: NodeJS.Timeout | null = null;
  private lastHealthCheck: SystemHealth | null = null;

  constructor() {
    this.startTime = Date.now();
    if (isProduction) {
      this.startPeriodicChecks();
    }
  }

  private startPeriodicChecks() {
    // Run health checks every 5 minutes in production
    this.checkInterval = setInterval(
      () => {
        this.runHealthChecks().catch(error => {
          logger.error('Health check failed', { error: error.message });
        });
      },
      5 * 60 * 1000
    );
  }

  private async checkDatabase(): Promise<HealthCheck> {
    const start = Date.now();

    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1).single();

      const responseTime = Date.now() - start;

      if (error) {
        return {
          name: 'database',
          status: 'unhealthy',
          responseTime,
          error: error.message,
        };
      }

      return {
        name: 'database',
        status: responseTime > 1000 ? 'degraded' : 'healthy',
        responseTime,
        details: { queryExecuted: true },
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkAuth(): Promise<HealthCheck> {
    const start = Date.now();

    try {
      const { data, error } = await supabase.auth.getSession();
      const responseTime = Date.now() - start;

      if (error) {
        return {
          name: 'auth',
          status: 'unhealthy',
          responseTime,
          error: error.message,
        };
      }

      return {
        name: 'auth',
        status: responseTime > 500 ? 'degraded' : 'healthy',
        responseTime,
        details: { sessionChecked: true },
      };
    } catch (error) {
      return {
        name: 'auth',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private checkMemory(): HealthCheck {
    const start = Date.now();

    try {
      if ('memory' in performance) {
        const memory = (
          performance as Performance & {
            memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
          }
        ).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

        const usagePercent = (usedMB / limitMB) * 100;

        return {
          name: 'memory',
          status: usagePercent > 90 ? 'unhealthy' : usagePercent > 70 ? 'degraded' : 'healthy',
          responseTime: Date.now() - start,
          details: {
            usedMB: Math.round(usedMB),
            totalMB: Math.round(totalMB),
            limitMB: Math.round(limitMB),
            usagePercent: Math.round(usagePercent),
          },
        };
      }

      return {
        name: 'memory',
        status: 'healthy',
        responseTime: Date.now() - start,
        details: { supported: false },
      };
    } catch (error) {
      return {
        name: 'memory',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private checkLocalStorage(): HealthCheck {
    const start = Date.now();

    try {
      const testKey = '__health_check__';
      const testValue = 'test';

      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved !== testValue) {
        throw new Error('LocalStorage read/write mismatch');
      }

      return {
        name: 'localStorage',
        status: 'healthy',
        responseTime: Date.now() - start,
        details: { readWrite: true },
      };
    } catch (error) {
      return {
        name: 'localStorage',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private checkNetworkConnectivity(): HealthCheck {
    const start = Date.now();

    try {
      const online = navigator.onLine;
      const connection = (
        navigator as Navigator & {
          connection?: { effectiveType?: string; downlink?: number; rtt?: number };
        }
      ).connection;

      return {
        name: 'network',
        status: online ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - start,
        details: {
          online,
          effectiveType: connection?.effectiveType,
          downlink: connection?.downlink,
          rtt: connection?.rtt,
        },
      };
    } catch (error) {
      return {
        name: 'network',
        status: 'unhealthy',
        responseTime: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async runHealthChecks(): Promise<SystemHealth> {
    const checks: HealthCheck[] = [];

    // Run all health checks
    const [database, auth, memory, localStorage, network] = await Promise.all([
      this.checkDatabase(),
      this.checkAuth(),
      this.checkMemory(),
      this.checkLocalStorage(),
      this.checkNetworkConnectivity(),
    ]);

    checks.push(database, auth, memory, localStorage, network);

    // Determine overall system status
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');

    let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
    if (hasUnhealthy) {
      overallStatus = 'unhealthy';
    } else if (hasDegraded) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    const health: SystemHealth = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: env.VITE_APP_VERSION,
      environment: env.NODE_ENV,
      checks,
      uptime: Date.now() - this.startTime,
    };

    this.lastHealthCheck = health;

    // Log health status
    if (overallStatus === 'unhealthy') {
      logger.error('System health check failed', { health });
    } else if (overallStatus === 'degraded') {
      logger.warn('System health degraded', { health });
    } else {
      logger.info('System health check passed', {
        status: overallStatus,
        uptime: health.uptime,
        checksCount: checks.length,
      });
    }

    return health;
  }

  getLastHealthCheck(): SystemHealth | null {
    return this.lastHealthCheck;
  }

  getUptime(): number {
    return Date.now() - this.startTime;
  }

  // Quick health check for critical systems only
  async quickHealthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: string[] }> {
    const issues: string[] = [];

    try {
      // Check if we can reach Supabase
      const { error } = await supabase.auth.getSession();
      if (error) {
        issues.push(`Auth service: ${error.message}`);
      }
    } catch (error) {
      issues.push(`Auth service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Check localStorage
    try {
      localStorage.setItem('__quick_check__', 'test');
      localStorage.removeItem('__quick_check__');
    } catch (error) {
      issues.push('LocalStorage not available');
    }

    // Check network
    if (!navigator.onLine) {
      issues.push('Network offline');
    }

    return {
      status: issues.length === 0 ? 'healthy' : 'unhealthy',
      details: issues,
    };
  }

  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Create singleton instance
export const healthMonitor = new HealthMonitor();

// React hook for health monitoring
export function useHealthMonitor() {
  const [health, setHealth] = React.useState<SystemHealth | null>(null);
  const [loading, setLoading] = React.useState(false);

  const runCheck = async () => {
    setLoading(true);
    try {
      const result = await healthMonitor.runHealthChecks();
      setHealth(result);
    } catch (error) {
      logger.error('Health check failed', { error });
    } finally {
      setLoading(false);
    }
  };

  const quickCheck = async () => {
    return await healthMonitor.quickHealthCheck();
  };

  React.useEffect(() => {
    // Get last health check on mount
    const lastCheck = healthMonitor.getLastHealthCheck();
    if (lastCheck) {
      setHealth(lastCheck);
    }
  }, []);

  return {
    health,
    loading,
    runCheck,
    quickCheck,
    uptime: healthMonitor.getUptime(),
  };
}

export default healthMonitor;
