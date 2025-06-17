import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

interface AnimatedFlowsyAILogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  animated?: boolean;
}

const AnimatedFlowsyAILogo: React.FC<AnimatedFlowsyAILogoProps> = ({
  className = '',
  size = 'md',
  showIcon = true,
  animated = true,
}) => {
  const [currentGlowIndex, setCurrentGlowIndex] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);
  const letters = ['F', 'l', 'o', 'w', 's', 'y', 'A', 'I'];

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'gap-2',
      icon: 'w-7 h-7',
      text: 'text-xl',
      subtitle: 'text-xs',
      letterSpacing: 'tracking-wide',
    },
    md: {
      container: 'gap-3',
      icon: 'w-9 h-9',
      text: 'text-3xl',
      subtitle: 'text-sm',
      letterSpacing: 'tracking-wide',
    },
    lg: {
      container: 'gap-4',
      icon: 'w-12 h-12',
      text: 'text-4xl',
      subtitle: 'text-base',
      letterSpacing: 'tracking-wider',
    },
    xl: {
      container: 'gap-5',
      icon: 'w-14 h-14',
      text: 'text-5xl',
      subtitle: 'text-lg',
      letterSpacing: 'tracking-widest',
    },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    if (!animated) return;

    const animationCycle = () => {
      setIsGlowing(true);
      setCurrentGlowIndex(0);

      // Animate through each letter
      const letterInterval = setInterval(() => {
        setCurrentGlowIndex(prev => {
          if (prev >= letters.length - 1) {
            clearInterval(letterInterval);
            // After all letters have glowed, dim them and restart cycle
            setTimeout(() => {
              setIsGlowing(false);
              setTimeout(animationCycle, 1000); // Wait before next cycle
            }, 1000); // Keep all letters glowing for a moment
            return prev;
          }
          return prev + 1;
        });
      }, 250); // 250ms per letter for smooth progression
    };

    // Start the animation cycle
    const initialDelay = setTimeout(animationCycle, 500);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [animated, letters.length]);

  return (
    <div className={`flex items-center ${config.container} ${className} relative`}>
      {/* AI Bot Icon with simple animation */}
      {showIcon && (
        <div className="relative group">
          <Bot
            className={`${config.icon} text-blue-400 group-hover:text-blue-300 transition-all duration-500 group-hover:rotate-12 drop-shadow-lg`}
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))',
            }}
          />
        </div>
      )}

      {/* FlowsyAI Text Logo with Simple Glow Animation */}
      <div className="flex flex-col">
        <div className={`flex items-center ${config.letterSpacing} relative`}>
          {letters.map((letter, index) => {
            const isCurrentlyGlowing = animated && isGlowing && index <= currentGlowIndex;
            const shouldGlow = animated ? isCurrentlyGlowing : true;

            return (
              <span
                key={index}
                className={`${config.text} font-bold relative inline-block transition-all duration-300 ease-out`}
                style={{
                  background: `linear-gradient(135deg,
                    ${index < 4 ? '#3B82F6' : '#A855F7'} 0%,
                    ${index < 4 ? '#8B5CF6' : '#06B6D4'} 50%,
                    ${index < 4 ? '#06B6D4' : '#3B82F6'} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: shouldGlow
                    ? `drop-shadow(0 0 8px ${index < 4 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(168, 85, 247, 0.8)'}) drop-shadow(0 0 16px ${index < 4 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(168, 85, 247, 0.4)'})`
                    : `drop-shadow(0 0 2px ${index < 4 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)'})`,
                  textShadow: shouldGlow
                    ? `0 0 10px ${index < 4 ? 'rgba(59, 130, 246, 0.6)' : 'rgba(168, 85, 247, 0.6)'}, 0 0 20px ${index < 4 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`
                    : 'none',
                  opacity: shouldGlow ? 1 : 0.6,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        {/* Subtitle */}
        <span
          className={`${config.subtitle} text-white/70 group-hover:text-white/90 transition-all duration-500 font-semibold ${config.letterSpacing}`}
          style={{
            background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          AI Workflow Studio
        </span>
      </div>
    </div>
  );
};

export default AnimatedFlowsyAILogo;
