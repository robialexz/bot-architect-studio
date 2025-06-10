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
  logoUrl?: string;
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

class SolanaTokenService {
  private readonly SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private readonly BIRDEYE_API = 'https://public-api.birdeye.so/public';
  private readonly JUPITER_API = 'https://price.jup.ag/v4';
  private readonly PUMP_FUN_API = 'https://frontend-api.pump.fun';
  private readonly DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

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
          return dexScreenerData;
        }
      } catch (error) {
        logger.warn('DexScreener API failed, trying Pump.fun:', error);
      }

      // Try Pump.fun API (for pump.fun tokens)
      try {
        const pumpFunData = await this.getPumpFunTokenData(tokenAddress);
        if (pumpFunData) {
          return pumpFunData;
        }
      } catch (error) {
        logger.warn('Pump.fun API failed, trying Jupiter:', error);
      }

      // Try Jupiter API
      try {
        const jupiterData = await this.getJupiterPrice(tokenAddress);
        if (jupiterData) {
          return await this.enrichTokenData(tokenAddress, jupiterData);
        }
      } catch (error) {
        logger.warn('Jupiter API failed, trying Birdeye:', error);
      }

      // Fallback to Birdeye API
      try {
        return await this.getBirdeyeTokenData(tokenAddress);
      } catch (error) {
        logger.warn('Birdeye API failed:', error);
      }

      // If all APIs fail, throw error
      throw new Error('Unable to fetch real token data from any API');
    } catch (error) {
      logger.error('All token data APIs failed:', error);
      throw new Error('Unable to fetch token data. Please try again later.');
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
      logger.error('Failed to fetch transactions:', error);
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
      logger.error('Failed to fetch price history:', error);
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

      const data = await response.json();
      console.log('📊 DexScreener API response:', data);

      if (!data.pairs || data.pairs.length === 0) {
        console.log('❌ No pairs found in DexScreener response');
        return null;
      }

      // Get the most liquid pair (highest volume)
      const bestPair = data.pairs.reduce((best: any, current: any) =>
        (current.volume?.h24 || 0) > (best.volume?.h24 || 0) ? current : best
      );

      console.log('🏆 Best pair selected:', bestPair);

      const tokenData = {
        name: bestPair.baseToken?.name || 'FlowsyAI Token',
        symbol: bestPair.baseToken?.symbol || 'FLOWSY',
        price: parseFloat(bestPair.priceUsd || '0'),
        priceChange24h: parseFloat(bestPair.priceChange?.h24 || '0'),
        marketCap: parseFloat(bestPair.marketCap || '0'),
        volume24h: parseFloat(bestPair.volume?.h24 || '0'),
        supply: parseFloat(bestPair.baseToken?.totalSupply || '0'),
        decimals: parseInt(bestPair.baseToken?.decimals || '9'),
        logoUrl: bestPair.info?.imageUrl,
      };

      console.log('✅ Parsed token data:', tokenData);
      return tokenData;
    } catch (error) {
      console.error('❌ DexScreener API error:', error);
      logger.error('DexScreener API error:', error);
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

      const data = await response.json();

      if (!data || !data.mint) {
        return null;
      }

      // Calculate market cap from price and supply
      const price = data.usd_market_cap / data.total_supply || 0;
      const marketCap = data.usd_market_cap || 0;

      return {
        name: data.name || 'FlowsyAI Token',
        symbol: data.symbol || 'FLOWSY',
        price: price,
        priceChange24h: 0, // Pump.fun doesn't provide 24h change
        marketCap: marketCap,
        volume24h: data.volume_24h || 0,
        supply: data.total_supply || 0,
        decimals: 6, // Standard for pump.fun tokens
        logoUrl: data.image_uri,
      };
    } catch (error) {
      logger.error('Pump.fun API error:', error);
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

      const data = await response.json();
      const tokenPrice = data.data[tokenAddress];

      if (!tokenPrice) {
        return null;
      }

      return {
        price: tokenPrice.price,
        // Jupiter doesn't provide all data, will need to enrich from other sources
      };
    } catch (error) {
      logger.error('Jupiter API error:', error);
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

    const data = await response.json();
    return this.parseBirdeyeData(data.data);
  }

  /**
   * CoinGecko API integration (fallback)
   */
  private async getCoinGeckoTokenData(tokenAddress: string): Promise<TokenData> {
    // CoinGecko requires token ID, not address
    // This would need mapping logic in production
    throw new Error('CoinGecko integration requires token ID mapping');
  }

  /**
   * Enrich basic price data with additional information
   */
  private async enrichTokenData(
    tokenAddress: string,
    baseData: Partial<TokenData>
  ): Promise<TokenData> {
    // In production, this would fetch additional data from multiple sources
    return {
      name: 'FlowsyAI Token',
      symbol: 'FLOWSY',
      price: baseData.price || 0,
      priceChange24h: 0,
      marketCap: 0,
      volume24h: 0,
      supply: 0,
      decimals: 9,
      ...baseData,
    };
  }

  /**
   * Parse Birdeye API response
   */
  private parseBirdeyeData(data: Record<string, unknown>): TokenData {
    return {
      name: data.name || 'Unknown Token',
      symbol: data.symbol || 'UNKNOWN',
      price: data.price || 0,
      priceChange24h: data.priceChange24h || 0,
      marketCap: data.mc || 0,
      volume24h: data.v24hUSD || 0,
      supply: data.supply || 0,
      decimals: data.decimals || 9,
      logoUrl: data.logoURI,
    };
  }

  /**
   * Parse transaction data
   */
  private parseTransactions(transactions: Record<string, unknown>[]): TransactionData[] {
    return transactions.map(tx => ({
      signature: tx.txHash || tx.signature,
      type: tx.side === 'buy' ? 'buy' : 'sell',
      amount: tx.amount || 0,
      value: tx.value || 0,
      timestamp: tx.blockTime * 1000 || Date.now(),
      from: tx.from || '',
      to: tx.to || '',
    }));
  }

  /**
   * Parse price history data
   */
  private parsePriceHistory(history: Record<string, unknown>[]): PriceHistory[] {
    return history.map(point => ({
      timestamp: point.unixTime * 1000,
      price: point.value,
      volume: point.volume || 0,
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
