import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['48px', { fontWeight: '700', lineHeight: '1.2' }],
        h2: ['36px', { fontWeight: '700', lineHeight: '1.25' }],
        h3: ['24px', { fontWeight: '600', lineHeight: '1.3' }],
        'body-lg': ['18px', { fontWeight: '400', lineHeight: '1.6' }],
        'body-std': ['16px', { fontWeight: '400', lineHeight: '1.5' }], // Matches text-base
        caption: ['14px', { fontWeight: '400', lineHeight: '1.4' }], // Matches text-sm
      },
      colors: {
        border: 'hsl(var(--border))',
        'border-alt': 'hsl(var(--border-alt))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'secondary-accent': {
          DEFAULT: 'hsl(var(--secondary-accent))',
          foreground: 'hsl(var(--secondary-accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          alt: {
            DEFAULT: 'hsl(var(--card-alt-bg))',
            foreground: 'hsl(var(--card-foreground))', // Assuming same foreground for alt card
          },
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Premium palette colors
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          light: 'hsl(var(--gold-light))',
          dark: 'hsl(var(--gold-dark))',
        },
        platinum: {
          DEFAULT: 'hsl(var(--platinum))',
          light: 'hsl(var(--platinum-light))',
          dark: 'hsl(var(--platinum-dark))',
        },
        sapphire: {
          DEFAULT: 'hsl(var(--sapphire))',
          light: 'hsl(var(--sapphire-light))',
          dark: 'hsl(var(--sapphire-dark))',
        },
        brandBlack: '#121212', // This seems redundant if background is already #121212 via HSL
        brandYellow: '#FDD835', // This seems redundant if primary is already #FDD835 via HSL
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        gradient: 'gradient 8s ease infinite',
        'gradient-slow': 'gradient 15s ease infinite',
        'pulse-scale': 'pulse-scale 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
