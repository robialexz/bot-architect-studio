// Production-ready logging system
// Completely disables debug logs in production builds

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemoteLogging: boolean;
  productionMode: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    // Determine if we're in production
    const isProduction = import.meta.env.PROD || import.meta.env.NODE_ENV === 'production';
    const isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';

    // Get log level from environment variable
    const envLogLevel = import.meta.env.VITE_LOG_LEVEL || (isProduction ? 'ERROR' : 'DEBUG');

    this.config = {
      level: this.parseLogLevel(envLogLevel),
      enableConsole: !isProduction, // Disable console logging in production
      enableRemoteLogging: isProduction, // Enable remote logging only in production
      productionMode: isProduction,
    };

    // In production, completely silence console methods to prevent any leaks
    if (isProduction) {
      this.silenceProductionConsole();
    }
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return LogLevel.ERROR;
    }
  }

  private silenceProductionConsole() {
    // In production, replace console methods with no-ops to prevent any debug output
    if (this.config.productionMode) {
      const noop = () => {};
      console.log = noop;
      console.debug = noop;
      console.info = noop;
      // Keep console.warn and console.error for critical issues
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level && this.config.enableConsole;
  }

  private formatMessage(level: string, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;
    return `${prefix} ${message}`;
  }

  // Public logging methods
  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message), ...args);
    }

    // Always log errors to remote service in production
    if (this.config.productionMode && this.config.enableRemoteLogging) {
      this.sendToRemoteLogger('ERROR', message, args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message), ...args);
    }
  }

  // Authentication-specific logging methods
  auth = {
    error: (message: string, ...args: unknown[]) => this.error(`[AUTH] ${message}`, ...args),
    warn: (message: string, ...args: unknown[]) => this.warn(`[AUTH] ${message}`, ...args),
    info: (message: string, ...args: unknown[]) => this.info(`[AUTH] ${message}`, ...args),
    debug: (message: string, ...args: unknown[]) => this.debug(`[AUTH] ${message}`, ...args),
  };

  // Workflow-specific logging methods
  workflow = {
    error: (message: string, ...args: unknown[]) => this.error(`[WORKFLOW] ${message}`, ...args),
    warn: (message: string, ...args: unknown[]) => this.warn(`[WORKFLOW] ${message}`, ...args),
    info: (message: string, ...args: unknown[]) => this.info(`[WORKFLOW] ${message}`, ...args),
    debug: (message: string, ...args: unknown[]) => this.debug(`[WORKFLOW] ${message}`, ...args),
  };

  private async sendToRemoteLogger(level: string, message: string, args: unknown[]): Promise<void> {
    try {
      // In a real application, send to logging service like Sentry, LogRocket, etc.
      // For now, we'll just store critical errors locally
      const errorData = {
        level,
        message,
        args,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Store in localStorage for now (in production, send to remote service)
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(errorData);

      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }

      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (error) {
      // Silently fail - don't let logging errors break the app
    }
  }

  // Method to get stored errors (for debugging in production)
  getStoredErrors(): unknown[] {
    try {
      return JSON.parse(localStorage.getItem('app_errors') || '[]');
    } catch {
      return [];
    }
  }

  // Method to clear stored errors
  clearStoredErrors(): void {
    localStorage.removeItem('app_errors');
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience methods for backward compatibility
export const log = {
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  info: logger.info.bind(logger),
  debug: logger.debug.bind(logger),
  auth: logger.auth,
  workflow: logger.workflow,
};

// Development-only console replacement
export const devConsole = {
  log: (...args: unknown[]) => logger.debug('', ...args),
  error: (...args: unknown[]) => logger.error('', ...args),
  warn: (...args: unknown[]) => logger.warn('', ...args),
  info: (...args: unknown[]) => logger.info('', ...args),
};
