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
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    xxl: 'w-20 h-20',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    xxl: 'text-4xl',
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
        {/* Modern FA Logo - Square Design */}
        <svg
          className={`${sizeClasses[size]} text-primary drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Square with Rounded Corners */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="18"
            fill="url(#logoGradient)"
            stroke="url(#borderGradient)"
            strokeWidth="2"
            className="group-hover:stroke-[3] transition-all duration-300"
          />

          {/* Letter "F" - Left Side */}
          <path
            d="M25 70 L25 35 L45 35 M25 52 L40 52"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Letter "A" - Right Side */}
          <path
            d="M55 70 L65 35 L75 70 M60 55 L70 55"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Flow Connection - Subtle dots between F and A */}
          <circle cx="47" cy="45" r="2" fill="white" opacity="0.7" />
          <circle cx="50" cy="50" r="2" fill="white" opacity="0.5" />
          <circle cx="53" cy="55" r="2" fill="white" opacity="0.7" />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

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
              <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase -mt-1">
                Luxury Automation
              </span>
            </>
          )}
          {size === 'lg' && (
            <span className="text-sm font-semibold text-foreground tracking-tight">FlowsyAI</span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PremiumLogo;
