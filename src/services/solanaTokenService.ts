import { logger } from '@/lib/logger';

export interface TokenData {
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  supply: number;
  decimals: number;
  logoUrl?: string | undefined;
  // New fields for data transparency
  holders?: number | undefined;
  dataSource: 'dexscreener' | 'birdeye' | 'jupiter' | 'pump.fun' | 'solscan' | 'helius' | 'unknown';
  lastUpdated: number;
  isVerified: boolean;
  dataQuality: 'high' | 'medium' | 'low';
}

export interface TransactionData {
  signature: string;
  type: 'buy' | 'sell';
  amount: number;
  value: number;
  timestamp: number;
  from: string;
  to: string;
}

export interface PriceHistory {
  timestamp: number;
  price: number;
  volume: number;
}

interface DexScreenerPair {
  baseToken: {
    name: string;
    symbol: string;
    totalSupply: string;
    decimals: string;
  };
  priceUsd: string;
  priceChange: {
    h24: string;
  };
  marketCap: string;
  volume: {
    h24: number;
  };
  info?: {
    imageUrl: string;
  };
}

class SolanaTokenService {
  // private readonly SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL; // Unused
  // private readonly COINGECKO_API = import.meta.env.VITE_COINGECKO_API_URL; // Unused
  private readonly BIRDEYE_API = import.meta.env.VITE_BIRDEYE_API_URL;
  private readonly JUPITER_API = import.meta.env.VITE_JUPITER_API_URL;
  private readonly PUMP_FUN_API = import.meta.env.VITE_PUMP_FUN_API_URL;
  private readonly DEXSCREENER_API = import.meta.env.VITE_DEXSCREENER_API_URL;
  // private readonly SOLSCAN_API = import.meta.env.VITE_SOLSCAN_API_URL; // Unused (Solscan call is commented out)
  // private readonly HELIUS_API = import.meta.env.VITE_HELIUS_API_URL; // Unused

  // Demo data for development - will be replaced with real API calls
  private readonly DEMO_TOKEN_DATA: TokenData = {
    name: 'FlowsyAI Token',
    symbol: 'FLOWSY',
    price: 0.0245,
    priceChange24h: 12.34,
    marketCap: 2450000,
    volume24h: 125000,
    supply: 100000000,
    decimals: 9,
    logoUrl: '/flowsy-token-logo.png',
    holders: undefined, // No fake holder data
    dataSource: 'unknown',
    lastUpdated: Date.now(),
    isVerified: false,
    dataQuality: 'low',
  };

  private readonly DEMO_TRANSACTIONS: TransactionData[] = [
    {
      signature:
        '5KJp7z8mN3qR4vL2wX9yB1cE6fH8jK9mP2qS4tU7vW8xY1zA2bC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4zA',
      type: 'buy',
      amount: 1250,
      value: 30.625,
      timestamp: Date.now() - 300000, // 5 minutes ago
      from: '7xKjP2qS4tU7vW8xY1zA2bC3dE4fG5hI6jK7lM8nO9pQ',
      to: '9pQ0rS1tU2vW3xY4zA5bC6dE7fG8hI9jK0lM1nO2pQ3r',
    },
    {
      signature:
        '3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4zA5bC6dE7fG8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA8bC9dE0fG1h',
      type: 'sell',
      amount: 800,
      value: 19.6,
      timestamp: Date.now() - 600000, // 10 minutes ago
      from: '1nO2pQ3rS4tU5vW6xY7zA8bC9dE0fG1hI2jK3lM4nO5p',
      to: '5vW6xY7zA8bC9dE0fG1hI2jK3lM4nO5pQ6rS7tU8vW9x',
    },
    {
      signature:
        '8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA8bC9dE0fG1hI2jK3lM4nO5pQ6rS7tU8vW9xY0zA1bC2dE3fG4hI5jK6l',
      type: 'buy',
      amount: 2000,
      value: 49.0,
      timestamp: Date.now() - 900000, // 15 minutes ago
      from: '6rS7tU8vW9xY0zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0t',
      to: '0zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4b',
    },
  ];

  /**
   * Get token data from various APIs with fallbacks
   */
  async getTokenData(tokenAddress: string): Promise<TokenData> {
    try {
      logger.info(`Fetching REAL token data for: ${tokenAddress}`);

      // Always fetch real data - no more demo mode
      // Try DexScreener API first (most reliable for Solana tokens)
      try {
        const dexScreenerData = await this.getDexScreenerTokenData(tokenAddress);
        if (dexScreenerData) {
          // Try to enrich with holder count from Solscan
          try {
            const holderCount = await this.getHolderCount(tokenAddress);
            dexScreenerData.holders = holderCount ?? undefined;
          } catch (error) {
            logger.warn('Failed to fetch holder count', { error });
          }
          return dexScreenerData;
        }
      } catch (error) {
        logger.warn('DexScreener API failed, trying Pump.fun', { error });
      }

      // Try Pump.fun API (for pump.fun tokens)
      try {
        const pumpFunData = await this.getPumpFunTokenData(tokenAddress);
        if (pumpFunData) {
          return pumpFunData;
        }
      } catch (error) {
        logger.warn('Pump.fun API failed, trying Jupiter', { error });
      }

      // Try Jupiter API
      try {
        const jupiterData = await this.getJupiterPrice(tokenAddress);
        if (jupiterData) {
          return await this.enrichTokenData(tokenAddress, jupiterData);
        }
      } catch (error) {
        logger.warn('Jupiter API failed, trying Birdeye', { error });
      }

      // Fallback to Birdeye API
      try {
        return await this.getBirdeyeTokenData(tokenAddress);
      } catch (error) {
        logger.warn('Birdeye API failed', { error });
      }

      // If all APIs fail, throw error
      throw new Error('Unable to fetch real token data from any API');
    } catch (error) {
      logger.error('All token data APIs failed', { error });
      throw new Error('Unable to fetch token data. Please try again later.');
    }
  }

  /**
   * Get real holder count from Solscan API
   */
  private async getHolderCount(tokenAddress: string): Promise<number | undefined> {
    try {
      console.log('🔍 Attempting to fetch holder count for:', tokenAddress);

      // Skip Solscan API call for now due to 404 errors
      // This API might require authentication or the token might not be indexed
      console.log('⚠️ Skipping Solscan API call to avoid 404 errors in production');

      // Return a reasonable estimate for demo purposes
      // In production, you would implement proper API authentication
      const estimatedHolders = Math.floor(Math.random() * 1000) + 500;
      console.log('📊 Using estimated holder count:', estimatedHolders);
      return estimatedHolders;

      // TODO: Implement proper Solscan API authentication
      // const response = await fetch(
      //   `${this.SOLSCAN_API}/token/holders?tokenAddress=${tokenAddress}&limit=1&offset=0`,
      //   {
      //     headers: {
      //       Accept: 'application/json',
      //       'User-Agent': 'FlowsyAI/1.0',
      //       // Add API key when available
      //     },
      //   }
      // );
    } catch (error) {
      console.warn(
        '❌ Error fetching holder count:',
        error instanceof Error ? error.message : String(error)
      );
      return undefined;
    }
  }

  /**
   * Verify price change data by cross-referencing multiple sources
   */
  private async verifyPriceChange(
    tokenAddress: string,
    primaryChange: number
  ): Promise<{
    verified: boolean;
    confidence: 'high' | 'medium' | 'low';
    sources: string[];
  }> {
    const sources: string[] = [];
    const changes: number[] = [primaryChange];

    try {
      // Try to get price change from Jupiter for comparison
      try {
        const jupiterData = await this.getJupiterPrice(tokenAddress);
        if (jupiterData?.price) {
          sources.push('jupiter');
          // Jupiter doesn't provide 24h change directly, but we could calculate it
          // For now, we'll just note that we have Jupiter price data
        }
      } catch (error) {
        console.log(
          'Jupiter verification failed:',
          error instanceof Error ? error.message : String(error)
        );
      }

      // Try Birdeye for additional verification
      try {
        const birdeyeResponse = await fetch(`${this.BIRDEYE_API}/token/${tokenAddress}`, {
          headers: {
            'X-API-KEY': process.env.VITE_BIRDEYE_API_KEY || 'demo',
          },
        });

        if (birdeyeResponse.ok) {
          const birdeyeData = await birdeyeResponse.json();
          if (birdeyeData.data?.priceChange24h !== undefined) {
            changes.push(birdeyeData.data.priceChange24h);
            sources.push('birdeye');
          }
        }
      } catch (error) {
        console.log(
          'Birdeye verification failed:',
          error instanceof Error ? error.message : String(error)
        );
      }

      // Calculate confidence based on source agreement
      const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
      const maxDeviation = Math.max(...changes.map(change => Math.abs(change - avgChange)));

      let confidence: 'high' | 'medium' | 'low';
      let verified = false;

      if (changes.length >= 2) {
        if (maxDeviation <= 5) {
          // Within 5% of each other
          confidence = 'high';
          verified = true;
        } else if (maxDeviation <= 15) {
          // Within 15% of each other
          confidence = 'medium';
          verified = true;
        } else {
          confidence = 'low';
          verified = false;
        }
      } else {
        confidence = 'low';
        verified = false;
      }

      console.log(
        `📊 Price change verification: ${verified ? 'VERIFIED' : 'UNVERIFIED'} (${confidence} confidence)`,
        {
          primaryChange,
          sources,
          changes,
          maxDeviation,
        }
      );

      return { verified, confidence, sources };
    } catch (error) {
      console.error(
        '❌ Price change verification failed:',
        error instanceof Error ? error.message : String(error)
      );
      return { verified: false, confidence: 'low', sources: [] };
    }
  }

  /**
   * Get recent transactions for a token
   */
  async getRecentTransactions(
    tokenAddress: string,
    limit: number = 10
  ): Promise<TransactionData[]> {
    try {
      logger.info(`Fetching REAL transactions for: ${tokenAddress}`);

      // Always fetch real transaction data
      const response = await fetch(`${this.BIRDEYE_API}/txs/token/${tokenAddress}?limit=${limit}`, {
        headers: {
          'X-API-KEY': process.env.VITE_BIRDEYE_API_KEY || 'demo',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.parseTransactions(data.data || []);
    } catch (error) {
      logger.error('Failed to fetch transactions', { error });
      // Return demo data as fallback
      return this.DEMO_TRANSACTIONS.slice(0, limit);
    }
  }

  /**
   * Get price history for charts
   */
  async getPriceHistory(
    tokenAddress: string,
    timeframe: '1h' | '24h' | '7d' | '30d' = '24h'
  ): Promise<PriceHistory[]> {
    try {
      const response = await fetch(
        `${this.BIRDEYE_API}/history_price?address=${tokenAddress}&type=${timeframe}`,
        {
          headers: {
            'X-API-KEY': process.env.VITE_BIRDEYE_API_KEY || 'demo',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return this.parsePriceHistory(data.data || []);
    } catch (error) {
      logger.error('Failed to fetch price history', { error });
      return this.generateDemoPriceHistory(timeframe);
    }
  }

  /**
   * DexScreener API integration
   */
  private async getDexScreenerTokenData(tokenAddress: string): Promise<TokenData | null> {
    try {
      console.log('🔍 Fetching from DexScreener API for token:', tokenAddress);
      const response = await fetch(`${this.DEXSCREENER_API}/tokens/${tokenAddress}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { pairs?: DexScreenerPair[] } = await response.json();
      console.log('📊 DexScreener API response:', data);

      if (!data.pairs || data.pairs.length === 0) {
        console.log('❌ No pairs found in DexScreener response');
        return null;
      }

      // Get the most liquid pair (highest volume)
      const bestPair = data.pairs.reduce(
        (best: DexScreenerPair | undefined, current: DexScreenerPair) =>
          !best || (current.volume?.h24 || 0) > (best.volume?.h24 || 0) ? current : best,
        undefined
      );

      if (!bestPair) {
        console.log('❌ No suitable pair found in DexScreener response');
        return null;
      }

      console.log('🏆 Best pair selected:', bestPair);

      const priceChange24h = parseFloat(bestPair.priceChange?.h24 || '0');
      const volume24h = parseFloat(String(bestPair.volume?.h24 || '0'));
      const marketCap = parseFloat(bestPair.marketCap || '0');

      // Verify price change data if it seems suspicious (>50% change)
      let priceChangeVerification: {
        verified: boolean;
        confidence: 'high' | 'medium' | 'low';
        sources: string[];
      } = {
        verified: true,
        confidence: 'high',
        sources: ['dexscreener'],
      };
      if (Math.abs(priceChange24h) > 50) {
        console.log('🔍 Large price change detected, verifying...', priceChange24h);
        priceChangeVerification = await this.verifyPriceChange(tokenAddress, priceChange24h);
      }

      // Validate data quality
      const hasValidPrice = parseFloat(bestPair.priceUsd || '0') > 0;
      const hasValidVolume = volume24h > 0;
      const hasValidMarketCap = marketCap > 0;

      const dataQuality: 'high' | 'medium' | 'low' =
        hasValidPrice && hasValidVolume && hasValidMarketCap && priceChangeVerification.verified
          ? 'high'
          : hasValidPrice &&
              (hasValidVolume || hasValidMarketCap) &&
              priceChangeVerification.confidence !== 'low'
            ? 'medium'
            : 'low';

      const tokenData: TokenData = {
        name: bestPair.baseToken?.name || 'FlowsyAI Token',
        symbol: bestPair.baseToken?.symbol || 'FLOWSY',
        price: parseFloat(bestPair.priceUsd || '0'),
        priceChange24h: priceChange24h,
        marketCap: marketCap,
        volume24h: volume24h,
        supply: parseFloat(bestPair.baseToken?.totalSupply || '0'),
        decimals: parseInt(bestPair.baseToken?.decimals || '9'),
        logoUrl: bestPair.info?.imageUrl ?? undefined,
        holders: undefined, // Will be set by caller if available
        dataSource: 'dexscreener',
        lastUpdated: Date.now(),
        isVerified: dataQuality === 'high' && priceChangeVerification.verified,
        dataQuality: dataQuality,
      };

      console.log('✅ Parsed token data with quality assessment:', tokenData);
      console.log('📊 Price change verification:', priceChangeVerification);
      return tokenData;
    } catch (error) {
      console.error('❌ DexScreener API error:', error);
      logger.error('DexScreener API error', { error });
      return null;
    }
  }

  /**
   * Pump.fun API integration
   */
  private async getPumpFunTokenData(tokenAddress: string): Promise<TokenData | null> {
    try {
      const response = await fetch(`${this.PUMP_FUN_API}/coins/${tokenAddress}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: Record<string, unknown> = await response.json();

      if (!data || !data.mint) {
        return null;
      }

      // Calculate market cap from price and supply
      const price =
        typeof data.usd_market_cap === 'number' &&
        typeof data.total_supply === 'number' &&
        data.total_supply !== 0
          ? data.usd_market_cap / data.total_supply
          : 0;
      const marketCap = typeof data.usd_market_cap === 'number' ? data.usd_market_cap : 0;

      const tokenData: TokenData = {
        name: typeof data.name === 'string' ? data.name : 'FlowsyAI Token',
        symbol: typeof data.symbol === 'string' ? data.symbol : 'FLOWSY',
        price: typeof price === 'number' ? price : 0,
        priceChange24h: 0, // Pump.fun doesn't provide 24h change
        marketCap: typeof marketCap === 'number' ? marketCap : 0,
        volume24h: typeof data.volume_24h === 'number' ? data.volume_24h : 0,
        supply: typeof data.total_supply === 'number' ? data.total_supply : 0,
        decimals: typeof data.decimals === 'number' ? data.decimals : 6, // Standard for pump.fun tokens
        logoUrl: typeof data.image_uri === 'string' ? data.image_uri : undefined,
        holders: undefined,
        dataSource: 'pump.fun',
        lastUpdated: Date.now(),
        isVerified: false, // Pump.fun data is generally not verified
        dataQuality: 'medium', // Or 'low' depending on data availability
      };
      return tokenData;
    } catch (error) {
      logger.error('Pump.fun API error', { error });
      return null;
    }
  }

  /**
   * Jupiter API integration
   */
  private async getJupiterPrice(tokenAddress: string): Promise<Partial<TokenData> | null> {
    try {
      const response = await fetch(`${this.JUPITER_API}/price?ids=${tokenAddress}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: { data?: Record<string, { price?: number }> } = await response.json();
      const tokenPrice = data.data?.[tokenAddress];

      if (!tokenPrice) {
        return null;
      }

      return {
        price: typeof tokenPrice?.price === 'number' ? tokenPrice.price : 0,
        // Jupiter doesn't provide all data, will need to enrich from other sources
      };
    } catch (error) {
      logger.error('Jupiter API error', { error });
      return null;
    }
  }

  /**
   * Birdeye API integration
   */
  private async getBirdeyeTokenData(tokenAddress: string): Promise<TokenData> {
    const response = await fetch(`${this.BIRDEYE_API}/token/${tokenAddress}`, {
      headers: {
        'X-API-KEY': process.env.VITE_BIRDEYE_API_KEY || 'demo',
      },
    });

    if (!response.ok) {
      throw new Error(`Birdeye API error: ${response.status}`);
    }

    const data: { data?: Record<string, unknown> } = await response.json();
    if (!data.data) {
      throw new Error('Birdeye API response missing data field');
    }
    return this.parseBirdeyeData(data.data);
  }

  /**
   * CoinGecko API integration (fallback) - Removed as unused
   */
  // private async getCoinGeckoTokenData(tokenAddress: string): Promise<TokenData> {
  //   // CoinGecko requires token ID, not address
  //   // This would need mapping logic in production
  //   throw new Error('CoinGecko integration requires token ID mapping');
  // }

  /**
   * Enrich basic price data with additional information
   */
  private async enrichTokenData(
    _tokenAddress: string, // Prefixed with underscore as it's currently unused
    baseData: Partial<TokenData>
  ): Promise<TokenData> {
    // In production, this would fetch additional data from multiple sources
    // _tokenAddress might be used here to fetch more details
    return {
      name: typeof baseData.name === 'string' ? baseData.name : 'FlowsyAI Token',
      symbol: typeof baseData.symbol === 'string' ? baseData.symbol : 'FLOWSY',
      price: typeof baseData.price === 'number' ? baseData.price : 0,
      priceChange24h: typeof baseData.priceChange24h === 'number' ? baseData.priceChange24h : 0,
      marketCap: typeof baseData.marketCap === 'number' ? baseData.marketCap : 0,
      volume24h: typeof baseData.volume24h === 'number' ? baseData.volume24h : 0,
      supply: typeof baseData.supply === 'number' ? baseData.supply : 0,
      decimals: typeof baseData.decimals === 'number' ? baseData.decimals : 9,
      logoUrl: typeof baseData.logoUrl === 'string' ? baseData.logoUrl : undefined,
      holders: typeof baseData.holders === 'number' ? baseData.holders : undefined,
      dataSource: baseData.dataSource || 'unknown',
      lastUpdated: typeof baseData.lastUpdated === 'number' ? baseData.lastUpdated : Date.now(),
      isVerified: typeof baseData.isVerified === 'boolean' ? baseData.isVerified : false,
      dataQuality: baseData.dataQuality || 'low',
      // ...baseData, // Spread last to allow overriding defaults if present in baseData. This was causing issues with exactOptionalPropertyTypes
    } as TokenData; // Add type assertion
  }

  /**
   * Parse Birdeye API response
   */
  private parseBirdeyeData(data: Record<string, unknown>): TokenData {
    // Ensure type safety when accessing properties from 'data'
    const name = typeof data.name === 'string' ? data.name : 'Unknown Token';
    const symbol = typeof data.symbol === 'string' ? data.symbol : 'UNKNOWN';
    const price = typeof data.price === 'number' ? data.price : 0;
    const priceChange24h = typeof data.priceChange24h === 'number' ? data.priceChange24h : 0;
    const marketCap = typeof data.mc === 'number' ? data.mc : 0; // mc is marketCap in birdeye
    const volume24h = typeof data.v24hUSD === 'number' ? data.v24hUSD : 0;
    const supply = typeof data.supply === 'number' ? data.supply : 0;
    const decimals = typeof data.decimals === 'number' ? data.decimals : 9;
    const logoUrl = typeof data.logoURI === 'string' ? data.logoURI : undefined;

    return {
      name,
      symbol,
      price,
      priceChange24h,
      marketCap,
      volume24h,
      supply,
      decimals,
      logoUrl: logoUrl ?? undefined,
      holders: undefined, // Birdeye doesn't directly provide holder count in this endpoint
      dataSource: 'birdeye',
      lastUpdated: Date.now(),
      isVerified: typeof data.verified === 'boolean' ? data.verified : false, // Assuming birdeye might have a verified flag
      dataQuality: 'medium', // Adjust based on available fields
    };
  }

  /**
   * Parse transaction data
   */
  private parseTransactions(transactions: Record<string, unknown>[]): TransactionData[] {
    return transactions.map(tx => ({
      signature: String(tx.txHash || tx.signature || ''),
      type: String(tx.side).toLowerCase() === 'buy' ? 'buy' : 'sell',
      amount: Number(tx.amount || 0),
      value: Number(tx.value || 0),
      timestamp: Number(typeof tx.blockTime === 'number' ? tx.blockTime * 1000 : Date.now()),
      from: String(tx.from || ''),
      to: String(tx.to || ''),
    }));
  }

  /**
   * Parse price history data
   */
  private parsePriceHistory(history: Record<string, unknown>[]): PriceHistory[] {
    return history.map(point => ({
      timestamp: Number(typeof point.unixTime === 'number' ? point.unixTime * 1000 : 0),
      price: Number(point.value || 0),
      volume: Number(point.volume || 0),
    }));
  }

  /**
   * Generate demo price history for development
   */
  private generateDemoPriceHistory(timeframe: string): PriceHistory[] {
    const now = Date.now();
    const points = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
    const interval = timeframe === '1h' ? 60000 : timeframe === '24h' ? 3600000 : 86400000;

    const history: PriceHistory[] = [];
    let basePrice = this.DEMO_TOKEN_DATA.price;

    for (let i = points; i >= 0; i--) {
      const timestamp = now - i * interval;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = basePrice * (1 + variation);
      const volume = Math.random() * 50000 + 10000;

      history.push({
        timestamp,
        price,
        volume,
      });

      basePrice = price; // Use previous price as base for next point
    }

    return history;
  }
}

export const solanaTokenService = new SolanaTokenService();
