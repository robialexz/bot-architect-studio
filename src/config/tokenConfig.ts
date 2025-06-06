/**
 * Token configuration for FlowsyAI Solana token
 * Update these values when the actual token is deployed
 */

export interface TokenConfig {
  // Token Contract Information
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;

  // Visual Assets
  logoUrl: string;
  bannerImageUrl?: string;

  // Trading Links
  dexScreenerUrl: string;
  raydiumUrl: string;
  jupiterUrl: string;
  solscanUrl: string;

  // Social Links
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;

  // Launch Information
  launchDate?: string;
  isLaunched: boolean;
  isPreLaunch: boolean;

  // Display Settings
  showInBanner: boolean;
  showTransactions: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in milliseconds

  // API Configuration
  enableLiveData: boolean;
  fallbackToDemo: boolean;
}

// Main token configuration
export const FLOWSY_TOKEN_CONFIG: TokenConfig = {
  // Contract Information (UPDATE WHEN TOKEN IS DEPLOYED)
  contractAddress: 'DEMO_TOKEN', // Replace with actual Solana token address
  name: 'FlowsyAI Token',
  symbol: 'FLOWSY',
  decimals: 9,

  // Visual Assets
  logoUrl: '/flowsy-token-logo.png', // Add actual logo to public folder
  bannerImageUrl: '/flowsy-token-banner.png',

  // Trading Links (UPDATE WITH ACTUAL TOKEN ADDRESS)
  dexScreenerUrl: 'https://dexscreener.com/solana/DEMO_TOKEN',
  raydiumUrl: 'https://raydium.io/swap/?inputCurrency=sol&outputCurrency=DEMO_TOKEN',
  jupiterUrl: 'https://jup.ag/swap/SOL-DEMO_TOKEN',
  solscanUrl: 'https://solscan.io/token/DEMO_TOKEN',

  // Social Links
  website: 'https://flowsyai.com',
  twitter: 'https://twitter.com/FlowsyAI',
  telegram: 'https://t.me/FlowsyAI',
  discord: 'https://discord.gg/FlowsyAI',

  // Launch Information
  launchDate: '2025-02-01', // Update with actual launch date
  isLaunched: false, // Set to true when token is live
  isPreLaunch: true, // Set to false after launch

  // Display Settings
  showInBanner: true,
  showTransactions: true,
  autoRefresh: true,
  refreshInterval: 60000, // 60 seconds

  // API Configuration
  enableLiveData: false, // Set to true when APIs are configured
  fallbackToDemo: true, // Show demo data when live data fails
};

// Environment-specific overrides
export const getTokenConfig = (): TokenConfig => {
  const config = { ...FLOWSY_TOKEN_CONFIG };

  // Production overrides
  if (import.meta.env.PROD) {
    // In production, you might want different settings
    config.fallbackToDemo = false;
    config.enableLiveData = true;
  }

  // Development overrides
  if (import.meta.env.DEV) {
    // In development, always use demo data
    config.enableLiveData = false;
    config.fallbackToDemo = true;
  }

  return config;
};

// Utility functions for token configuration
export const isTokenLaunched = (): boolean => {
  return getTokenConfig().isLaunched;
};

export const isPreLaunch = (): boolean => {
  return getTokenConfig().isPreLaunch;
};

export const getTokenAddress = (): string => {
  return getTokenConfig().contractAddress;
};

export const getTradingLinks = () => {
  const config = getTokenConfig();
  return {
    dexScreener: config.dexScreenerUrl,
    raydium: config.raydiumUrl,
    jupiter: config.jupiterUrl,
    solscan: config.solscanUrl,
  };
};

export const getSocialLinks = () => {
  const config = getTokenConfig();
  return {
    website: config.website,
    twitter: config.twitter,
    telegram: config.telegram,
    discord: config.discord,
  };
};

// Token launch countdown utility
export const getLaunchCountdown = (): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLaunched: boolean;
} => {
  const config = getTokenConfig();

  if (config.isLaunched || !config.launchDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLaunched: true,
    };
  }

  const now = new Date().getTime();
  const launchTime = new Date(config.launchDate).getTime();
  const difference = launchTime - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isLaunched: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isLaunched: false,
  };
};

// Validation functions
export const validateTokenAddress = (address: string): boolean => {
  // Basic Solana address validation
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

export const updateTokenConfig = (updates: Partial<TokenConfig>): void => {
  // This would be used to update configuration at runtime
  // In a real implementation, this might update a database or config service
  console.warn('updateTokenConfig called with:', updates);
  console.warn('This is a placeholder - implement actual config update logic');
};

// Export default configuration
export default FLOWSY_TOKEN_CONFIG;
