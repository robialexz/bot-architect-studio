import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialIconsProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const SocialIcons: React.FC<SocialIconsProps> = ({
  className = '',
  size = 'lg',
  variant = 'outline',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleTelegramClick = () => {
    // FlowsyAI Telegram community link
    window.open('https://t.me/FlowsyAIChat', '_blank', 'noopener,noreferrer');
  };

  const handleDexScreenerClick = () => {
    // FlowsyAI DexScreener token page
    window.open(
      'https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Telegram Community Button */}
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleTelegramClick}
          className={`
            group relative overflow-hidden
            ${
              variant === 'outline'
                ? 'border-primary/30 hover:border-primary/60 hover:bg-primary/10'
                : ''
            }
            ${sizeClasses[size]}
            transition-all duration-300 ease-in-out
            hover:shadow-lg hover:shadow-primary/20
          `}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <MessageCircle
              className={`${iconSizes[size]} group-hover:scale-110 transition-transform duration-300`}
            />
            <span className="hidden sm:inline font-medium">Join Community</span>
            <span className="sm:hidden font-medium">Telegram</span>
          </span>

          {/* Hover effect background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-sapphire/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
        </Button>
      </motion.div>

      {/* DexScreener Token Button */}
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant={variant}
          size={size}
          onClick={handleDexScreenerClick}
          className={`
            group relative overflow-hidden
            ${variant === 'outline' ? 'border-gold/30 hover:border-gold/60 hover:bg-gold/10' : ''}
            ${sizeClasses[size]}
            transition-all duration-300 ease-in-out
            hover:shadow-lg hover:shadow-gold/20
          `}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <TrendingUp
              className={`${iconSizes[size]} group-hover:scale-110 transition-transform duration-300`}
            />
            <span className="hidden sm:inline font-medium">Buy $FlowAI</span>
            <span className="sm:hidden font-medium">$FlowAI</span>
          </span>

          {/* Hover effect background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gold/20 to-gold-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
        </Button>
      </motion.div>
    </div>
  );
};

export default SocialIcons;
