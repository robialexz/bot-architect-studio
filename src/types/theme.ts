export interface UserContext {
  timeOfDay: 'day' | 'night';
  location: 'urban' | 'nature';
  device: 'desktop' | 'mobile' | 'vr' | 'ar';
}

export interface ShaderTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
}

export interface EnergyNetworkTheme {
  pulseSpeed: 'slow' | 'medium' | 'fast';
  pulseColor: string;
}

export interface NexusCrystalTheme {
  baseColor: string;
  emissiveColor: string;
  emissiveIntensity: number;
  scale: number;
}

export interface AppTheme {
  shader: ShaderTheme;
  energyNetwork: EnergyNetworkTheme;
  nexusCrystal: NexusCrystalTheme;
}

// Predefined theme configurations
export interface ThemeProfile {
  name: string;
  config: AppTheme;
}
