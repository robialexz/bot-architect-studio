import { securityConfig, isProduction } from './env';
import { logger } from './logger';

interface SecurityPolicy {
  contentSecurityPolicy: string;
  permissions: string;
  referrerPolicy: string;
  crossOriginEmbedderPolicy: string;
  crossOriginOpenerPolicy: string;
  crossOriginResourcePolicy: string;
}

class SecurityManager {
  private nonce: string;
  private policy: SecurityPolicy;

  constructor() {
    this.nonce = this.generateNonce();
    this.policy = this.createSecurityPolicy();
    this.initializeSecurity();
  }

  private generateNonce(): string {
    if (securityConfig.cspNonce) {
      return securityConfig.cspNonce;
    }

    // Generate a random nonce for CSP
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  private createSecurityPolicy(): SecurityPolicy {
    const allowedOrigins =
      securityConfig.allowedOrigins.length > 0 ? securityConfig.allowedOrigins.join(' ') : "'self'";

    // Note: frame-ancestors directive is removed from meta CSP as it's only effective in HTTP headers
    // This prevents the console error about frame-ancestors being ignored in meta elements
    return {
      contentSecurityPolicy: isProduction
        ? [
            `default-src 'self'`,
            `script-src 'self' 'nonce-${this.nonce}' 'strict-dynamic'`,
            `style-src 'self' 'nonce-${this.nonce}' https://fonts.googleapis.com`,
            `style-src-elem 'self' 'nonce-${this.nonce}' https://fonts.googleapis.com`,
            `font-src 'self' https://fonts.gstatic.com data:`,
            `img-src 'self' data: https: blob:`,
            `media-src 'self' data: https: blob:`,
            `connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://*.supabase.co wss://*.supabase.co ${allowedOrigins}`,
            `worker-src 'self' blob:`,
            `child-src 'self'`,
            `frame-src 'none'`,
            `object-src 'none'`,
            `base-uri 'self'`,
            `form-action 'self'`,
            `manifest-src 'self'`,
            'upgrade-insecure-requests',
            'block-all-mixed-content',
          ].join('; ')
        : [
            `default-src 'self'`,
            `script-src 'self' 'unsafe-eval' 'unsafe-inline'`,
            `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
            `style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com`,
            `font-src 'self' https://fonts.gstatic.com data:`,
            `img-src 'self' data: https: blob:`,
            `media-src 'self' data: https: blob:`,
            `connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://*.supabase.co wss://*.supabase.co ${allowedOrigins}`,
            `worker-src 'self' blob:`,
            `child-src 'self'`,
            `frame-src 'none'`,
            `object-src 'none'`,
            `base-uri 'self'`,
            `form-action 'self'`,
            `manifest-src 'self'`,
          ].join('; '),

      permissions: [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
      ].join(', '),

      referrerPolicy: 'strict-origin-when-cross-origin',
      crossOriginEmbedderPolicy: 'require-corp',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'same-origin',
    };
  }

  private initializeSecurity() {
    if (typeof document === 'undefined') return;

    // Set security headers via meta tags (for client-side)
    this.setMetaTag('Content-Security-Policy', this.policy.contentSecurityPolicy);
    this.setMetaTag('Permissions-Policy', this.policy.permissions);
    this.setMetaTag('Referrer-Policy', this.policy.referrerPolicy);

    // Monitor CSP violations
    this.setupCSPViolationReporting();

    // Prevent clickjacking
    this.preventClickjacking();

    // Secure cookies
    this.secureCookies();

    // Input sanitization
    this.setupInputSanitization();

    logger.info('Security policies initialized', {
      nonce: this.nonce,
      isProduction,
      allowedOrigins: securityConfig.allowedOrigins,
    });
  }

  private setMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[http-equiv="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.httpEquiv = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  private setupCSPViolationReporting() {
    document.addEventListener('securitypolicyviolation', event => {
      logger.error('CSP Violation', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
      });
    });
  }

  private preventClickjacking() {
    // Prevent the page from being embedded in frames
    if (window.self !== window.top) {
      logger.warn('Potential clickjacking attempt detected');
      window.top!.location = window.self.location;
    }
  }

  private secureCookies() {
    // Override document.cookie to ensure secure flags
    const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');

    if (originalCookieDescriptor) {
      Object.defineProperty(document, 'cookie', {
        get: originalCookieDescriptor.get,
        set: function (value: string) {
          if (isProduction && !value.includes('Secure')) {
            value += '; Secure';
          }
          if (!value.includes('SameSite')) {
            value += '; SameSite=Strict';
          }
          originalCookieDescriptor.set!.call(this, value);
        },
        configurable: true,
      });
    }
  }

  private setupInputSanitization() {
    // Monitor for potential XSS attempts
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name: string, value: string) {
      if (name.toLowerCase().startsWith('on') && typeof value === 'string') {
        logger.warn('Potential XSS attempt blocked', {
          element: this.tagName,
          attribute: name,
          value,
        });
        return;
      }
      return originalSetAttribute.call(this, name, value);
    };
  }

  // Public API
  getNonce(): string {
    return this.nonce;
  }

  getPolicy(): SecurityPolicy {
    return { ...this.policy };
  }

  sanitizeHTML(html: string): string {
    // Basic HTML sanitization
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url);

      // Block dangerous protocols
      const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
      if (dangerousProtocols.some(protocol => parsed.protocol === protocol)) {
        logger.warn('Dangerous URL protocol blocked', { url, protocol: parsed.protocol });
        return '#';
      }

      return url;
    } catch {
      logger.warn('Invalid URL blocked', { url });
      return '#';
    }
  }

  validateOrigin(origin: string): boolean {
    if (securityConfig.allowedOrigins.length === 0) return true;
    return securityConfig.allowedOrigins.includes(origin);
  }

  // Rate limiting for API calls
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      logger.warn('Rate limit exceeded', { key, count: record.count, limit });
      return false;
    }

    record.count++;
    return true;
  }

  // Secure random string generation
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate and sanitize user input
  validateInput(input: string, type: 'email' | 'url' | 'text' | 'number'): boolean {
    switch (type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      case 'url':
        try {
          new URL(input);
          return true;
        } catch {
          return false;
        }
      case 'text':
        return input.length > 0 && input.length < 10000;
      case 'number':
        return !isNaN(Number(input));
      default:
        return false;
    }
  }
}

// Create singleton instance
export const securityManager = new SecurityManager();

// React hook for security utilities
export function useSecurity() {
  const sanitizeHTML = (html: string) => securityManager.sanitizeHTML(html);
  const sanitizeURL = (url: string) => securityManager.sanitizeURL(url);
  const validateInput = (
    input: string,
    type: Parameters<typeof securityManager.validateInput>[1]
  ) => securityManager.validateInput(input, type);
  const generateToken = (length?: number) => securityManager.generateSecureToken(length);

  return {
    sanitizeHTML,
    sanitizeURL,
    validateInput,
    generateToken,
    nonce: securityManager.getNonce(),
  };
}

export default securityManager;
