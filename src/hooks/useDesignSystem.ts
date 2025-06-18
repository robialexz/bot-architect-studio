import { useMemo } from 'react';

export type GlassVariant = 'subtle' | 'medium' | 'strong' | 'accent';
export type GlassSize = 'sm' | 'md' | 'lg' | 'xl';
export type GradientVariant = 'primary' | 'secondary' | 'accent' | 'none';

interface DesignSystemConfig {
  glassmorphism: {
    variant: GlassVariant;
    size: GlassSize;
    gradient: GradientVariant;
    hoverEffect: boolean;
  };
  animations: {
    enabled: boolean;
    duration: 'fast' | 'medium' | 'slow';
    easing: 'ease-out' | 'ease-in-out' | 'spring';
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

const defaultConfig: DesignSystemConfig = {
  glassmorphism: {
    variant: 'medium',
    size: 'md',
    gradient: 'none',
    hoverEffect: true,
  },
  animations: {
    enabled: true,
    duration: 'medium',
    easing: 'ease-out',
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
  },
};

export const useDesignSystem = (config?: Partial<DesignSystemConfig>) => {
  const mergedConfig = useMemo(
    () => ({
      ...defaultConfig,
      ...config,
      glassmorphism: {
        ...defaultConfig.glassmorphism,
        ...config?.glassmorphism,
      },
      animations: {
        ...defaultConfig.animations,
        ...config?.animations,
      },
      accessibility: {
        ...defaultConfig.accessibility,
        ...config?.accessibility,
      },
    }),
    [config]
  );

  // Glass card class generator
  const getGlassCardClasses = useMemo(() => {
    return (
      variant?: GlassVariant,
      size?: GlassSize,
      gradient?: GradientVariant,
      customClasses?: string
    ) => {
      const variantClass = {
        subtle: 'glass-card-subtle',
        medium: 'glass-card-base',
        strong: 'glass-card-strong',
        accent: 'glass-card-accent',
      }[variant || mergedConfig.glassmorphism.variant];

      const sizeClass = {
        sm: 'glass-card-sm',
        md: 'glass-card-md',
        lg: 'glass-card-lg',
        xl: 'glass-card-xl',
      }[size || mergedConfig.glassmorphism.size];

      const gradientClass = {
        primary: 'glass-accent-primary',
        secondary: 'glass-accent-sapphire',
        accent: 'glass-accent-gold',
        none: '',
      }[gradient || mergedConfig.glassmorphism.gradient];

      const hoverClass = mergedConfig.glassmorphism.hoverEffect ? '' : 'hover:transform-none';
      const motionClass = mergedConfig.accessibility.reducedMotion
        ? 'motion-reduce:transition-none'
        : '';

      return [variantClass, sizeClass, gradientClass, hoverClass, motionClass, customClasses]
        .filter(Boolean)
        .join(' ');
    };
  }, [mergedConfig]);

  // Glass button class generator
  const getGlassButtonClasses = useMemo(() => {
    return (
      variant?: 'glass' | 'glass-accent' | 'glass-primary' | 'glass-secondary',
      size?: 'sm' | 'md' | 'lg' | 'xl',
      customClasses?: string
    ) => {
      const variantClass = {
        glass: 'glass-button',
        'glass-accent': 'glass-button glass-accent-primary',
        'glass-primary': 'glass-button glass-accent-primary border-primary/30',
        'glass-secondary': 'glass-button glass-accent-sapphire border-sapphire/30',
      }[variant || 'glass'];

      const sizeClass = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
      }[size || 'md'];

      const motionClass = mergedConfig.accessibility.reducedMotion
        ? 'motion-reduce:transition-none'
        : '';

      return [variantClass, sizeClass, motionClass, customClasses].filter(Boolean).join(' ');
    };
  }, [mergedConfig]);

  // Animation configuration
  const getAnimationConfig = useMemo(() => {
    if (!mergedConfig.animations.enabled || mergedConfig.accessibility.reducedMotion) {
      return {
        initial: {},
        animate: {},
        transition: { duration: 0 },
      };
    }

    const duration = {
      fast: 0.15,
      medium: 0.3,
      slow: 0.5,
    }[mergedConfig.animations.duration];

    const easing = {
      'ease-out': [0.25, 0.46, 0.45, 0.94],
      'ease-in-out': [0.4, 0, 0.2, 1],
      spring: [0.68, -0.55, 0.265, 1.55],
    }[mergedConfig.animations.easing];

    return {
      duration,
      ease: easing,
    };
  }, [mergedConfig]);

  // Responsive breakpoints
  const breakpoints = useMemo(
    () => ({
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    }),
    []
  );

  // Color palette
  const colors = useMemo(
    () => ({
      primary: 'hsl(var(--primary))',
      sapphire: 'hsl(var(--sapphire))',
      gold: 'hsl(var(--gold))',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: 'hsl(var(--card))',
      border: 'hsl(var(--border))',
      muted: 'hsl(var(--muted))',
      'muted-foreground': 'hsl(var(--muted-foreground))',
    }),
    []
  );

  // Spacing scale
  const spacing = useMemo(
    () => ({
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
      '2xl': '3rem',
      '3xl': '4rem',
    }),
    []
  );

  return {
    config: mergedConfig,
    getGlassCardClasses,
    getGlassButtonClasses,
    getAnimationConfig,
    breakpoints,
    colors,
    spacing,
    // Utility functions
    isReducedMotion: mergedConfig.accessibility.reducedMotion,
    isHighContrast: mergedConfig.accessibility.highContrast,
    animationsEnabled: mergedConfig.animations.enabled && !mergedConfig.accessibility.reducedMotion,
  };
};

// Preset configurations for common use cases
export const designSystemPresets = {
  default: defaultConfig,

  subtle: {
    ...defaultConfig,
    glassmorphism: {
      ...defaultConfig.glassmorphism,
      variant: 'subtle' as GlassVariant,
    },
  },

  strong: {
    ...defaultConfig,
    glassmorphism: {
      ...defaultConfig.glassmorphism,
      variant: 'strong' as GlassVariant,
    },
  },

  accessible: {
    ...defaultConfig,
    animations: {
      ...defaultConfig.animations,
      enabled: false,
    },
    accessibility: {
      reducedMotion: true,
      highContrast: true,
    },
  },

  performance: {
    ...defaultConfig,
    animations: {
      ...defaultConfig.animations,
      duration: 'fast' as const,
    },
    glassmorphism: {
      ...defaultConfig.glassmorphism,
      variant: 'subtle' as GlassVariant,
      hoverEffect: false,
    },
  },
} as const;
