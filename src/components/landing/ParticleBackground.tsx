import React from 'react';

interface ParticleBackgroundProps {
  id?: string;
  interactive?: boolean;
  density?: number;
  color?: string[];
  connectParticles?: boolean;
  speed?: number;
  size?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  hoverEffect?: 'repulse' | 'grab' | 'bubble' | 'connect' | 'none';
  clickEffect?: 'push' | 'remove' | 'repulse' | 'bubble' | 'none';
  backgroundColor?: string;
  className?: string;
}

// Simplified version without actual particles
const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  id = 'tsparticles-custom',
  className = '',
}) => {
  // Return an empty div - particles are disabled
  return <div id={id} className={`absolute inset-0 z-0 ${className}`} />;
};

export default ParticleBackground;
