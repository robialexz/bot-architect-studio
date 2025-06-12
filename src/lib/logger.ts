import { env, isProduction } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  stack?: string;
}

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  maxRetries: number;
  batchSize: number;
  flushInterval: number;
}

class Logger {
  private config: LoggerConfig;
  private logQueue: LogEntry[] = [];
  private flushTimer: number | null = null;
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: this.getLogLevel(),
      enableConsole: !isProduction,
      enableRemote: isProduction,
      remoteEndpoint: env.VITE_LOG_ENDPOINT,
      maxRetries: 3,
      batchSize: 10,
      flushInterval: 5000,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.startFlushTimer();

    // Handle page unload to flush remaining logs
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }

  private getLogLevel(): LogLevel {
    const envLevel = env.VITE_LOG_LEVEL?.toLowerCase() as LogLevel;
    return envLevel || (isProduction ? 'warn' : 'debug');
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.config.level);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      sessionId: this.sessionId,
      userId: this.getCurrentUserId(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      stack: level === 'error' ? new Error().stack : undefined,
    };
  }

  private getCurrentUserId(): string | undefined {
    // Get user ID from auth context or localStorage
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).id : undefined;
    } catch {
      return undefined;
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context);

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.logQueue.push(entry);
      if (this.logQueue.length >= this.config.batchSize) {
        this.flush();
      }
    }
  }

  private logToConsole(entry: LogEntry) {
    const { level, message, context, timestamp } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, context);
        break;
      case 'info':
        console.info(prefix, message, context);
        break;
      case 'warn':
        console.warn(prefix, message, context);
        break;
      case 'error':
        console.error(prefix, message, context);
        break;
    }
  }

  private async sendLogsToRemote(logs: LogEntry[], retryCount = 0): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      const response = await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (retryCount < this.config.maxRetries) {
        setTimeout(
          () => {
            this.sendLogsToRemote(logs, retryCount + 1);
          },
          Math.pow(2, retryCount) * 1000
        ); // Exponential backoff
      } else {
        console.error('Failed to send logs after max retries:', error);
      }
    }
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private flush() {
    if (this.logQueue.length === 0) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    if (this.config.enableRemote) {
      this.sendLogsToRemote(logsToSend);
    }
  }

  // Public API
  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }

  // Specialized logging methods
  auth = {
    login: (userId: string, method: string) => {
      this.info('User login', { userId, method, event: 'auth.login' });
    },
    logout: (userId: string) => {
      this.info('User logout', { userId, event: 'auth.logout' });
    },
    signup: (userId: string, method: string) => {
      this.info('User signup', { userId, method, event: 'auth.signup' });
    },
    error: (error: string, context?: Record<string, unknown>) => {
      this.error('Authentication error', { error, event: 'auth.error', ...context });
    },
  };

  api = {
    request: (method: string, url: string, duration?: number) => {
      this.debug('API request', { method, url, duration, event: 'api.request' });
    },
    response: (method: string, url: string, status: number, duration: number) => {
      this.info('API response', { method, url, status, duration, event: 'api.response' });
    },
    error: (method: string, url: string, error: string, status?: number) => {
      this.error('API error', { method, url, error, status, event: 'api.error' });
    },
  };

  workflow = {
    create: (workflowId: string, name: string) => {
      this.info('Workflow created', { workflowId, name, event: 'workflow.create' });
    },
    execute: (workflowId: string, duration?: number) => {
      this.info('Workflow executed', { workflowId, duration, event: 'workflow.execute' });
    },
    error: (workflowId: string, error: string, step?: string) => {
      this.error('Workflow error', { workflowId, error, step, event: 'workflow.error' });
    },
  };

  performance = {
    pageLoad: (page: string, duration: number) => {
      this.info('Page load', { page, duration, event: 'performance.pageLoad' });
    },
    componentRender: (component: string, duration: number) => {
      this.debug('Component render', { component, duration, event: 'performance.componentRender' });
    },
  };

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Create singleton instance
export const logger = new Logger();

// Export types for external use
export type { LogLevel, LogEntry, LoggerConfig };
