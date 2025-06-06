/**
 * Utility functions for formatting numbers, currencies, and percentages
 */

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  }
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 6, showSymbol = true } = options || {};

  // Handle very small numbers
  if (value < 0.000001 && value > 0) {
    return showSymbol ? `$${value.toExponential(2)}` : value.toExponential(2);
  }

  // Handle normal numbers
  const formatter = new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: value < 1 ? Math.min(maximumFractionDigits, 4) : minimumFractionDigits,
    maximumFractionDigits: value < 1 ? maximumFractionDigits : Math.max(minimumFractionDigits, 2),
  });

  return formatter.format(value);
}

/**
 * Format a percentage with proper sign and color coding
 */
export function formatPercentage(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  }
): string {
  const { minimumFractionDigits = 2, maximumFractionDigits = 2, showSign = true } = options || {};

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay: showSign ? 'always' : 'auto',
  });

  return formatter.format(value / 100);
}

/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 */
export function formatLargeNumber(
  value: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showFullNumber?: boolean;
  }
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    showFullNumber = false,
  } = options || {};

  if (showFullNumber || value < 1000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  const suffixes = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];

  for (const { value: threshold, suffix } of suffixes) {
    if (value >= threshold) {
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(value / threshold);

      return `${formatted}${suffix}`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a token amount with proper decimal places
 */
export function formatTokenAmount(
  amount: number,
  decimals: number = 9,
  options?: {
    maximumFractionDigits?: number;
    showFullPrecision?: boolean;
  }
): string {
  const { maximumFractionDigits = 4, showFullPrecision = false } = options || {};

  // Convert from smallest unit to token amount
  const tokenAmount = amount / Math.pow(10, decimals);

  if (showFullPrecision) {
    return tokenAmount.toFixed(decimals);
  }

  // For display, limit decimal places based on magnitude
  let fractionDigits = maximumFractionDigits;

  if (tokenAmount >= 1000) {
    fractionDigits = 0;
  } else if (tokenAmount >= 1) {
    fractionDigits = 2;
  } else if (tokenAmount >= 0.01) {
    fractionDigits = 4;
  } else {
    fractionDigits = 6;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(tokenAmount);
}

/**
 * Format time duration in a human-readable format
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format a timestamp as a relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const intervals = [
    { unit: 'year', ms: 31536000000 },
    { unit: 'month', ms: 2628000000 },
    { unit: 'day', ms: 86400000 },
    { unit: 'hour', ms: 3600000 },
    { unit: 'minute', ms: 60000 },
    { unit: 'second', ms: 1000 },
  ] as const;

  for (const { unit, ms } of intervals) {
    const value = Math.floor(diff / ms);
    if (value !== 0) {
      return rtf.format(-value, unit);
    }
  }

  return 'just now';
}

/**
 * Format a Solana address for display (truncated with ellipsis)
 */
export function formatAddress(
  address: string,
  options?: {
    startChars?: number;
    endChars?: number;
    showFullOnHover?: boolean;
  }
): string {
  const { startChars = 4, endChars = 4 } = options || {};

  if (address.length <= startChars + endChars) {
    return address;
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format market cap with appropriate suffix and currency
 */
export function formatMarketCap(value: number): string {
  if (value === 0) return '$0';

  return `$${formatLargeNumber(value, { maximumFractionDigits: 1 })}`;
}

/**
 * Format volume with appropriate suffix and currency
 */
export function formatVolume(value: number): string {
  if (value === 0) return '$0';

  return `$${formatLargeNumber(value, { maximumFractionDigits: 1 })}`;
}

/**
 * Get color class based on percentage change
 */
export function getChangeColor(change: number): string {
  if (change > 0) return 'text-emerald-400';
  if (change < 0) return 'text-red-400';
  return 'text-muted-foreground';
}

/**
 * Get trend icon based on percentage change
 */
export function getTrendDirection(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

/**
 * Format price with dynamic precision based on value
 */
export function formatPrice(price: number): string {
  if (price === 0) return '$0.00';

  if (price >= 1000) {
    return formatCurrency(price, { maximumFractionDigits: 2 });
  } else if (price >= 1) {
    return formatCurrency(price, { maximumFractionDigits: 4 });
  } else if (price >= 0.01) {
    return formatCurrency(price, { maximumFractionDigits: 6 });
  } else {
    return formatCurrency(price, { maximumFractionDigits: 8 });
  }
}

/**
 * Validate if a string is a valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  // Basic validation for Solana address format
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Format number with commas for thousands separator
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
