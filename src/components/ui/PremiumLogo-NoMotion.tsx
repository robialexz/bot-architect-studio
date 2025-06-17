import React from 'react';

interface PremiumLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

const PremiumLogoNoMotion: React.FC<PremiumLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  animated = false,
}) => {
  const sizeConfig = {
    sm: { logo: 'w-8 h-8', text: 'text-sm' },
    md: { logo: 'w-10 h-10', text: 'text-base' },
    lg: { logo: 'w-12 h-12', text: 'text-lg' },
    xl: { logo: 'w-16 h-16', text: 'text-xl' },
    xxl: { logo: 'w-24 h-24', text: 'text-2xl' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative group ${animated ? 'animate-logo-glow' : ''}`}>
        <div
          className={`${config.logo} relative z-10 rounded-xl bg-gradient-to-br from-primary via-gold to-sapphire p-2 shadow-2xl border border-white/20 group-hover:scale-105 transition-all duration-300`}
        >
          {/* FlowsyAI Logo SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white drop-shadow-lg"
            fill="currentColor"
          >
            {/* Central AI Brain/Circuit */}
            <circle cx="50" cy="50" r="8" className="fill-white/90" />
            
            {/* Neural Network Connections */}
            <g className="stroke-white/70 fill-none" strokeWidth="1.5">
              <path d="M50,42 Q35,30 20,35" />
              <path d="M50,42 Q65,30 80,35" />
              <path d="M50,58 Q35,70 20,65" />
              <path d="M50,58 Q65,70 80,65" />
              <path d="M42,50 Q30,35 15,50" />
              <path d="M58,50 Q70,35 85,50" />
              <path d="M42,50 Q30,65 15,50" />
              <path d="M58,50 Q70,65 85,50" />
            </g>
            
            {/* Connection Nodes */}
            <circle cx="20" cy="35" r="3" className="fill-white/80" />
            <circle cx="80" cy="35" r="3" className="fill-white/80" />
            <circle cx="20" cy="65" r="3" className="fill-white/80" />
            <circle cx="80" cy="65" r="3" className="fill-white/80" />
            <circle cx="15" cy="50" r="3" className="fill-white/80" />
            <circle cx="85" cy="50" r="3" className="fill-white/80" />
            
            {/* Flow Arrows */}
            <g className="fill-white/60">
              <polygon points="25,32 30,35 25,38" />
              <polygon points="75,32 80,35 75,38" />
              <polygon points="25,62 30,65 25,68" />
              <polygon points="75,62 80,65 75,68" />
            </g>
            
            {/* Central Pulse Ring */}
            <circle cx="50" cy="50" r="12" className="fill-none stroke-white/40" strokeWidth="1" />
            <circle cx="50" cy="50" r="16" className="fill-none stroke-white/20" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Enhanced Luxury Glow Effect - Only for large sizes */}
        {(size === 'xl' || size === 'xxl') && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 to-accent/30 blur-xl -z-10 scale-110 animate-pulse-glow" />
        )}

        {/* Enhanced Background Glow for larger sizes */}
        {(size === 'xl' || size === 'xxl') && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 blur-2xl -z-20 scale-125 animate-rotate-glow" />
        )}

        {/* Luxury Glow Effect for navbar logos */}
        {size !== 'xxl' && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/20 via-primary/30 to-sapphire/20 blur-lg -z-10 scale-110 animate-subtle-glow" />
        )}
      </div>

      {showText && (
        <div className={`flex flex-col ${animated ? 'animate-slide-in' : ''}`}>
          {(size === 'sm' || size === 'md') && (
            <span className={`${config.text} font-bold text-foreground tracking-tight`}>FlowsyAI</span>
          )}
          {(size === 'xl' || size === 'xxl') && (
            <>
              <span className={`${config.text} font-bold text-foreground tracking-tight`}>FlowsyAI</span>
              <span className="text-xs text-muted-foreground font-medium tracking-wide">Luxury Automation</span>
            </>
          )}
          {size === 'lg' && (
            <span className="text-base font-semibold text-foreground tracking-tight">FlowsyAI</span>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes logo-glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(var(--primary), 0.3)); }
          50% { filter: drop-shadow(0 0 16px rgba(var(--primary), 0.6)); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes rotate-glow {
          0% { opacity: 0.4; transform: rotate(0deg); }
          50% { opacity: 0.8; transform: rotate(180deg); }
          100% { opacity: 0.4; transform: rotate(360deg); }
        }
        
        @keyframes subtle-glow {
          0%, 100% { opacity: 0.3; transform: scale(1.1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-logo-glow {
          animation: logo-glow 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-rotate-glow {
          animation: rotate-glow 8s linear infinite;
        }
        
        .animate-subtle-glow {
          animation: subtle-glow 3s ease-in-out infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
};

export default PremiumLogoNoMotion;
