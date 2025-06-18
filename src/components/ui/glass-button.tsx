import React from 'react';
import { MotionDiv } from '@/lib/motion-wrapper';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface GlassButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'glass' | 'glass-accent' | 'glass-primary' | 'glass-secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  gradient?: 'primary' | 'secondary' | 'accent' | 'none';
  glow?: boolean;
  children: React.ReactNode;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant = 'glass',
      size = 'md',
      icon,
      iconPosition = 'left',
      gradient = 'none',
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      glass: 'glass-button',
      'glass-accent': 'glass-button glass-accent-primary',
      'glass-primary': 'glass-button glass-accent-primary border-primary/30',
      'glass-secondary': 'glass-button glass-accent-sapphire border-sapphire/30',
    };

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
    };

    const gradientClasses = {
      primary:
        'bg-gradient-to-r from-primary/20 to-sapphire/20 hover:from-primary/30 hover:to-sapphire/30',
      secondary:
        'bg-gradient-to-r from-sapphire/20 to-gold/20 hover:from-sapphire/30 hover:to-gold/30',
      accent: 'bg-gradient-to-r from-gold/20 to-primary/20 hover:from-gold/30 hover:to-primary/30',
      none: '',
    };

    const glowClasses = glow
      ? 'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
      : '';

    const buttonContent = (
      <button
        ref={ref}
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          gradientClasses[gradient],
          glowClasses,
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </button>
    );

    return (
      <MotionDiv
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {buttonContent}
      </MotionDiv>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton };
export type { GlassButtonProps };
