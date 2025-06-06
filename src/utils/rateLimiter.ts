/**
 * Simple client-side rate limiter to prevent spam submissions
 * Note: This is not a security measure, just UX improvement
 * Real rate limiting should be implemented on the server side
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 3, windowMs: number = 60000) {
    // 3 attempts per minute
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if an action is allowed for a given key
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      // First attempt
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (now > entry.resetTime) {
      // Window has expired, reset
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      // Rate limit exceeded
      return false;
    }

    // Increment count
    entry.count++;
    this.storage.set(key, entry);
    return true;
  }

  /**
   * Get remaining time until rate limit resets
   */
  getResetTime(key: string): number {
    const entry = this.storage.get(key);
    if (!entry) return 0;

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  /**
   * Get remaining attempts for a key
   */
  getRemainingAttempts(key: string): number {
    const entry = this.storage.get(key);
    if (!entry) return this.maxAttempts;

    const now = Date.now();
    if (now > entry.resetTime) {
      return this.maxAttempts;
    }

    return Math.max(0, this.maxAttempts - entry.count);
  }

  /**
   * Clear rate limit for a key (useful for successful submissions)
   */
  clear(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Create a global rate limiter instance for waitlist submissions
export const waitlistRateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute

// Utility function to get a client identifier
export function getClientId(): string {
  // Use a combination of factors to create a semi-unique client ID
  // This is not foolproof but provides basic protection
  const factors = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ];

  // Create a simple hash
  let hash = 0;
  const str = factors.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

// Utility function to format time remaining
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

// Clean up expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      waitlistRateLimiter.cleanup();
    },
    5 * 60 * 1000
  );
}
