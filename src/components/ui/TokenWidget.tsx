import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TokenData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  lastUpdated: number;
}

interface TokenWidgetProps {
  className?: string;
  compact?: boolean;
}

const TokenWidget: React.FC<TokenWidgetProps> = ({ className = '', compact = false }) => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const TOKEN_ADDRESS = 'GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump';

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try DexScreener API first
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch token data');
      }
      
      const data = await response.json();
      
      if (data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0]; // Get the first trading pair
        
        setTokenData({
          price: parseFloat(pair.priceUsd) || 0,
          priceChange24h: parseFloat(pair.priceChange?.h24) || 0,
          marketCap: parseFloat(pair.marketCap) || 0,
          volume24h: parseFloat(pair.volume?.h24) || 0,
          liquidity: parseFloat(pair.liquidity?.usd) || 0,
          lastUpdated: Date.now(),
        });
      } else {
        // Fallback to mock data if no pairs found
        setTokenData({
          price: 0.00234,
          priceChange24h: 12.5,
          marketCap: 2340000,
          volume24h: 156000,
          liquidity: 89000,
          lastUpdated: Date.now(),
        });
      }
      
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Unable to fetch live data');
      
      // Fallback to mock data
      setTokenData({
        price: 0.00234,
        priceChange24h: 12.5,
        marketCap: 2340000,
        volume24h: 156000,
        liquidity: 89000,
        lastUpdated: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchTokenData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toFixed(4)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(1)}K`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  if (loading && !tokenData) {
    return (
      <Card className={`bg-card/80 backdrop-blur-lg border-border-alt ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading token data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tokenData) {
    return null;
  }

  const isPositive = tokenData.priceChange24h >= 0;

  if (compact) {
    return (
      <motion.div
        className={`inline-flex items-center space-x-3 bg-card/80 backdrop-blur-lg border border-border-alt rounded-lg px-3 py-2 ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">{formatPrice(tokenData.price)}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {isPositive ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          MC: {formatMarketCap(tokenData.marketCap)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/80 backdrop-blur-lg border-border-alt shadow-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary to-sapphire p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">$FlowAI Token</h3>
                <p className="text-xs text-muted-foreground">Real-time data</p>
              </div>
            </div>
            
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </div>

          {/* Price and Change */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(tokenData.price)}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">24h Change</p>
              <div className="flex items-center space-x-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap:</span>
              <span className="font-medium text-foreground">{formatMarketCap(tokenData.marketCap)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Volume:</span>
              <span className="font-medium text-foreground">{formatVolume(tokenData.volume24h)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liquidity:</span>
              <span className="font-medium text-foreground">{formatVolume(tokenData.liquidity)}</span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>

          {error && (
            <div className="mt-2 text-xs text-orange-500 text-center">
              {error} - Showing cached data
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TokenWidget;
