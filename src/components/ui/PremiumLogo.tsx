import React from 'react';
import { motion } from 'framer-motion';

interface PremiumLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const PremiumLogo: React.FC<PremiumLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  animated = true,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-4',
    md: 'w-24 h-6',
    lg: 'w-32 h-8',
    xl: 'w-48 h-12',
    xxl: 'w-64 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
    xxl: 'text-3xl',
  };

  const logoVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  const pathVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: 'easeInOut',
        delay: 0.2,
      },
    },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        variants={animated ? logoVariants : undefined}
        initial="initial"
        whileHover={animated ? 'hover' : undefined}
        className="relative group"
      >
        {/* FlowsyAI Animated Logo Video */}
        <div
          className={`${sizeClasses[size]} rounded-lg overflow-hidden border border-primary/20 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster="/flowsy-logo.svg"
          >
            <source src="/background-animation.mp4" type="video/mp4" />
            {/* Fallback to static logo */}
            <img
              src="/flowsy-new-logo.png"
              alt="FlowsyAI Logo"
              className="w-full h-full object-contain"
            />
          </video>
        </div>

        {/* Luxury Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 to-accent/30 blur-xl -z-10 opacity-20 group-hover:opacity-60 transition-all duration-500 scale-110" />

        {/* Enhanced Background Glow for larger sizes */}
        {(size === 'xl' || size === 'xxl') && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 blur-2xl -z-20 opacity-40 group-hover:opacity-80 transition-all duration-700 scale-125" />
        )}
      </motion.div>

      {showText && (
        <motion.div
          initial={animated ? { opacity: 0, x: -10 } : undefined}
          animate={animated ? { opacity: 1, x: 0 } : undefined}
          transition={animated ? { delay: 0.5, duration: 0.5 } : undefined}
          className="flex flex-col"
        >
          {(size === 'xl' || size === 'xxl') && (
            <>
              <span className={`font-bold text-foreground tracking-tight ${textSizeClasses[size]}`}>
                FlowsyAI
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase -mt-1">
                Luxury Automation
              </span>
            </>
          )}
          {size === 'lg' && (
            <span className="text-base font-semibold text-foreground tracking-tight">FlowsyAI</span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PremiumLogo;
