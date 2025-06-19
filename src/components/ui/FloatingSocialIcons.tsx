import React from 'react';
import { motion } from 'framer-motion';
import { Github, MessageCircle, Youtube } from 'lucide-react';

// Twitter/X Icon Component
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Floating Social Icons Component - Continuously Moving
const FloatingSocialIcons: React.FC = () => {
  const socialIcons = [
    { 
      icon: Youtube, 
      href: 'https://youtube.com/@flowsyai', 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/20',
      shadowColor: 'shadow-red-500/30'
    },
    { 
      icon: Github, 
      href: 'https://github.com/flowsyai', 
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-500/20',
      shadowColor: 'shadow-gray-500/30'
    },
    { 
      icon: TwitterIcon, 
      href: 'https://x.com/FlowsyAI', 
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-500/20',
      shadowColor: 'shadow-blue-500/30'
    },
    { 
      icon: MessageCircle, 
      href: 'https://t.me/+jNmtj8qUUtMxOTVk', 
      color: 'from-cyan-400 to-cyan-600',
      bgColor: 'bg-cyan-500/20',
      shadowColor: 'shadow-cyan-500/30'
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Top Row - Moving Right */}
      <div className="absolute top-20 left-0 w-full">
        <motion.div
          className="flex gap-8 items-center"
          animate={{
            x: ['-100%', '100vw']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {[...socialIcons, ...socialIcons].map((social, index) => (
            <motion.a
              key={`top-${index}`}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                pointer-events-auto flex items-center justify-center
                w-12 h-12 rounded-xl backdrop-blur-lg border border-white/20
                ${social.bgColor} hover:scale-110 transition-all duration-300
                ${social.shadowColor} hover:shadow-lg
              `}
              whileHover={{ 
                scale: 1.2, 
                rotate: 10,
                y: -5
              }}
              whileTap={{ scale: 0.9 }}
            >
              <social.icon className="w-6 h-6 text-white" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Middle Row - Moving Left */}
      <div className="absolute top-1/2 left-0 w-full">
        <motion.div
          className="flex gap-8 items-center"
          animate={{
            x: ['100vw', '-100%']
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {[...socialIcons, ...socialIcons].map((social, index) => (
            <motion.a
              key={`middle-${index}`}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                pointer-events-auto flex items-center justify-center
                w-10 h-10 rounded-lg backdrop-blur-lg border border-white/15
                ${social.bgColor} hover:scale-110 transition-all duration-300
                ${social.shadowColor} hover:shadow-lg
              `}
              whileHover={{ 
                scale: 1.3, 
                rotate: -10,
                y: -8
              }}
              whileTap={{ scale: 0.8 }}
            >
              <social.icon className="w-5 h-5 text-white" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Bottom Row - Moving Right (Slower) */}
      <div className="absolute bottom-32 left-0 w-full">
        <motion.div
          className="flex gap-12 items-center"
          animate={{
            x: ['-100%', '100vw']
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {[...socialIcons, ...socialIcons].map((social, index) => (
            <motion.a
              key={`bottom-${index}`}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                pointer-events-auto flex items-center justify-center
                w-14 h-14 rounded-2xl backdrop-blur-lg border border-white/25
                ${social.bgColor} hover:scale-110 transition-all duration-300
                ${social.shadowColor} hover:shadow-xl
              `}
              whileHover={{ 
                scale: 1.15, 
                rotate: 15,
                y: -10
              }}
              whileTap={{ scale: 0.85 }}
            >
              <social.icon className="w-7 h-7 text-white" />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Diagonal Moving Icons */}
      <div className="absolute top-40 left-0 w-full">
        <motion.div
          className="flex gap-16 items-center transform rotate-12"
          animate={{
            x: ['-50%', '150vw']
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          {socialIcons.map((social, index) => (
            <motion.a
              key={`diagonal-${index}`}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                pointer-events-auto flex items-center justify-center
                w-8 h-8 rounded-full backdrop-blur-lg border border-white/10
                ${social.bgColor} hover:scale-110 transition-all duration-300
                ${social.shadowColor} hover:shadow-lg
              `}
              whileHover={{ 
                scale: 1.4, 
                rotate: -15,
                y: -12
              }}
              whileTap={{ scale: 0.7 }}
            >
              <social.icon className="w-4 h-4 text-white" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FloatingSocialIcons;
