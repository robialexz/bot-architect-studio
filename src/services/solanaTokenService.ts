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
      // For demo purposes, return demo data
      if (tokenAddress === 'DEMO_TOKEN') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add some randomness to make it feel live
        const priceVariation = (Math.random() - 0.5) * 0.002; // ±0.1% variation
        const volumeVariation = (Math.random() - 0.5) * 0.1; // ±5% variation

        return {
          ...this.DEMO_TOKEN_DATA,
          price: this.DEMO_TOKEN_DATA.price + priceVariation,
          volume24h: this.DEMO_TOKEN_DATA.volume24h * (1 + volumeVariation),
          priceChange24h: this.DEMO_TOKEN_DATA.priceChange24h + (Math.random() - 0.5) * 2,
        };
      }

      // Try Jupiter API first (fastest for Solana tokens)
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
        logger.warn('Birdeye API failed, trying CoinGecko:', error);
      }

      // Final fallback to CoinGecko
      return await this.getCoinGeckoTokenData(tokenAddress);
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
      // For demo purposes, return demo transactions
      if (tokenAddress === 'DEMO_TOKEN') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.DEMO_TRANSACTIONS.slice(0, limit);
      }

      // In production, this would call Solana RPC or indexer APIs
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
  private parseBirdeyeData(data: any): TokenData {
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
  private parseTransactions(transactions: any[]): TransactionData[] {
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
  private parsePriceHistory(history: any[]): PriceHistory[] {
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
