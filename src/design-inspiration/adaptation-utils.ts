/**
 * DESIGN ADAPTATION UTILITIES
 * ===========================
 * 
 * Common utilities for adapting external design elements to FlowsyAI's brand
 */

// FlowsyAI Brand Colors
export const FLOWSY_COLORS = {
  gradients: {
    primary: 'from-blue-500 to-cyan-500',
    secondary: 'from-purple-500 to-pink-500',
    accent: 'from-emerald-500 to-teal-500',
    hero: 'from-blue-400 via-purple-400 to-cyan-400',
    background: 'from-black via-gray-900 to-black',
  },
  solid: {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    green: '#10B981',
    gray: {
      900: '#111827',
      800: '#1F2937',
      700: '#374151',
      600: '#4B5563',
      500: '#6B7280',
      400: '#9CA3AF',
      300: '#D1D5DB',
    }
  }
};

// Common animation classes for FlowsyAI
export const FLOWSY_ANIMATIONS = {
  glow: 'animate-glow',
  pulse: 'animate-pulse',
  float: 'animate-float-slow',
  gradient: 'animate-gradient-x',
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
};

// Utility functions for color adaptation
export const adaptColors = {
  // Convert generic gradient to FlowsyAI gradient
  toFlowsyGradient: (originalGradient: string): string => {
    // Map common gradients to FlowsyAI equivalents
    const gradientMap: Record<string, string> = {
      'from-blue-400 to-blue-600': FLOWSY_COLORS.gradients.primary,
      'from-purple-400 to-purple-600': FLOWSY_COLORS.gradients.secondary,
      'from-indigo-500 to-purple-600': FLOWSY_COLORS.gradients.hero,
      'from-gray-800 to-gray-900': FLOWSY_COLORS.gradients.background,
    };
    
    return gradientMap[originalGradient] || FLOWSY_COLORS.gradients.primary;
  },

  // Convert solid colors to FlowsyAI palette
  toFlowsyColor: (originalColor: string): string => {
    const colorMap: Record<string, string> = {
      'blue-500': 'blue-500',
      'purple-500': 'purple-500',
      'indigo-500': 'blue-500',
      'violet-500': 'purple-500',
      'cyan-500': 'cyan-500',
      'teal-500': 'cyan-500',
    };
    
    return colorMap[originalColor] || originalColor;
  }
};

// Utility for adapting spacing to FlowsyAI standards
export const adaptSpacing = {
  // Convert padding/margin to FlowsyAI scale
  toFlowsySpacing: (spacing: string): string => {
    // FlowsyAI uses generous spacing for premium feel
    const spacingMap: Record<string, string> = {
      'p-2': 'p-4',
      'p-4': 'p-6',
      'p-6': 'p-8',
      'py-8': 'py-12',
      'py-12': 'py-16',
      'py-16': 'py-24',
    };
    
    return spacingMap[spacing] || spacing;
  }
};

// Utility for adapting typography
export const adaptTypography = {
  // Convert text sizes to FlowsyAI scale
  toFlowsyText: (textSize: string): string => {
    const textMap: Record<string, string> = {
      'text-4xl': 'text-5xl md:text-7xl', // Hero titles
      'text-3xl': 'text-4xl md:text-5xl', // Section titles
      'text-2xl': 'text-3xl md:text-4xl', // Subsection titles
      'text-xl': 'text-xl md:text-2xl',   // Large text
    };
    
    return textMap[textSize] || textSize;
  }
};

// Template for creating FlowsyAI-styled components
export const COMPONENT_TEMPLATES = {
  card: `
    bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 
    hover:border-gray-600/50 transition-all duration-300
  `,
  
  button: {
    primary: `
      bg-gradient-to-r ${FLOWSY_COLORS.gradients.primary} 
      hover:scale-105 transition-all duration-300 
      text-white font-semibold rounded-xl px-8 py-4
    `,
    secondary: `
      border border-gray-600 text-gray-300 hover:bg-gray-700 
      transition-all duration-300 rounded-xl px-8 py-4
    `
  },
  
  section: `
    py-24 bg-gradient-to-b from-black via-gray-900 to-black
  `,
  
  container: `
    max-w-7xl mx-auto px-6
  `
};

// Helper function to merge classes
export const mergeClasses = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export default {
  FLOWSY_COLORS,
  FLOWSY_ANIMATIONS,
  adaptColors,
  adaptSpacing,
  adaptTypography,
  COMPONENT_TEMPLATES,
  mergeClasses
};
