import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppTheme,
  UserContext,
  ThemeProfile,
  ShaderTheme,
  EnergyNetworkTheme,
  NexusCrystalTheme,
} from '../types/theme';
import { getMockUserContext } from '../services/aiThemeService';

// Default theme if no specific profile matches
const defaultTheme: AppTheme = {
  shader: { primaryColor: '#4A90E2', secondaryColor: '#50E3C2', backgroundColor: '#F0F4F8' },
  energyNetwork: { pulseSpeed: 'medium', pulseColor: '#4A90E2' },
  nexusCrystal: {
    baseColor: '#FFFFFF',
    emissiveColor: '#4A90E2',
    emissiveIntensity: 0.6,
    scale: 1.0,
  },
};

// Predefined theme profiles
const themeProfiles: ThemeProfile[] = [
  {
    name: 'Day Urban Desktop',
    config: {
      shader: { primaryColor: '#4A90E2', secondaryColor: '#50E3C2', backgroundColor: '#E0E8F0' },
      energyNetwork: { pulseSpeed: 'fast', pulseColor: '#D0021B' },
      nexusCrystal: {
        baseColor: '#F5F5F5',
        emissiveColor: '#4A90E2',
        emissiveIntensity: 0.7,
        scale: 1.0,
      },
    },
  },
  {
    name: 'Night Nature Mobile',
    config: {
      shader: { primaryColor: '#1A237E', secondaryColor: '#7B1FA2', backgroundColor: '#0F172A' },
      energyNetwork: { pulseSpeed: 'slow', pulseColor: '#76FF03' },
      nexusCrystal: {
        baseColor: '#333333',
        emissiveColor: '#FDD835',
        emissiveIntensity: 0.8,
        scale: 0.9,
      },
    },
  },
  {
    name: 'Day Nature Desktop',
    config: {
      shader: { primaryColor: '#81C784', secondaryColor: '#AED581', backgroundColor: '#E8F5E9' },
      energyNetwork: { pulseSpeed: 'slow', pulseColor: '#29B6F6' },
      nexusCrystal: {
        baseColor: '#E0F2F1',
        emissiveColor: '#80CBC4',
        emissiveIntensity: 0.5,
        scale: 1.1,
      },
    },
  },
  {
    name: 'Night Urban Mobile',
    config: {
      shader: { primaryColor: '#F50057', secondaryColor: '#FF4081', backgroundColor: '#1A1A2E' },
      energyNetwork: { pulseSpeed: 'fast', pulseColor: '#00E5FF' },
      nexusCrystal: {
        baseColor: '#212121',
        emissiveColor: '#F50057',
        emissiveIntensity: 0.9,
        scale: 0.95,
      },
    },
  },
  {
    name: 'Day Urban VR',
    config: {
      shader: { primaryColor: '#00BCD4', secondaryColor: '#0097A7', backgroundColor: '#B2EBF2' },
      energyNetwork: { pulseSpeed: 'medium', pulseColor: '#FFEB3B' },
      nexusCrystal: {
        baseColor: '#CFD8DC',
        emissiveColor: '#00BCD4',
        emissiveIntensity: 0.7,
        scale: 1.05,
      },
    },
  },
  {
    name: 'Night Nature AR',
    config: {
      shader: { primaryColor: '#3F51B5', secondaryColor: '#5C6BC0', backgroundColor: '#1A237E' },
      energyNetwork: { pulseSpeed: 'medium', pulseColor: '#FF9800' },
      nexusCrystal: {
        baseColor: '#424242',
        emissiveColor: '#FFC107',
        emissiveIntensity: 0.8,
        scale: 0.9,
      },
    },
  },
];

interface ThemeContextType {
  theme: AppTheme;
  userContext: UserContext | null;
  isLoading: boolean;
  refreshTheme: () => Promise<void>; // Allow manual refresh
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  userContext: null,
  isLoading: true,
  refreshTheme: async () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

const determineTheme = (context: UserContext | null): AppTheme => {
  if (!context) return defaultTheme;

  // Simple matching logic, can be expanded
  if (context.timeOfDay === 'day' && context.location === 'urban' && context.device === 'desktop') {
    return themeProfiles.find(p => p.name === 'Day Urban Desktop')?.config || defaultTheme;
  }
  if (
    context.timeOfDay === 'night' &&
    context.location === 'nature' &&
    context.device === 'mobile'
  ) {
    return themeProfiles.find(p => p.name === 'Night Nature Mobile')?.config || defaultTheme;
  }
  if (
    context.timeOfDay === 'day' &&
    context.location === 'nature' &&
    context.device === 'desktop'
  ) {
    return themeProfiles.find(p => p.name === 'Day Nature Desktop')?.config || defaultTheme;
  }
  if (
    context.timeOfDay === 'night' &&
    context.location === 'urban' &&
    context.device === 'mobile'
  ) {
    return themeProfiles.find(p => p.name === 'Night Urban Mobile')?.config || defaultTheme;
  }
  if (context.timeOfDay === 'day' && context.location === 'urban' && context.device === 'vr') {
    return themeProfiles.find(p => p.name === 'Day Urban VR')?.config || defaultTheme;
  }
  if (context.timeOfDay === 'night' && context.location === 'nature' && context.device === 'ar') {
    return themeProfiles.find(p => p.name === 'Night Nature AR')?.config || defaultTheme;
  }
  // Fallback to default if no specific profile matches
  return defaultTheme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [theme, setTheme] = useState<AppTheme>(defaultTheme);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTheme = async () => {
    setIsLoading(true);
    try {
      const context = await getMockUserContext();
      setUserContext(context);
      setTheme(determineTheme(context));
    } catch (error) {
      console.error('Failed to load user context or theme:', error);
      setTheme(defaultTheme); // Fallback to default theme on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, userContext, isLoading, refreshTheme: loadTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
