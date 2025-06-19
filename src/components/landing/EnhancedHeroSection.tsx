import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ExternalLink, Star, Layers, Bot, Brain, Zap, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

// Social Media Icons
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Enhanced 3D Floating Particles with Premium Effects
const PremiumParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    
    const particles: Array<{
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      size: number; color: string; opacity: number;
      pulse: number; pulseSpeed: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }> = [];
    
    // Create premium particles with trails
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 5 + 1,
        color: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'][Math.floor(Math.random() * 7)],
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        trail: []
      });
    }
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position and pulse
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        particle.pulse += particle.pulseSpeed;
        
        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: 0.5 });
        if (particle.trail.length > 10) particle.trail.shift();
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.z < 0) particle.z = 1000;
        if (particle.z > 1000) particle.z = 0;
        
        // 3D perspective
        const scale = 1000 / (1000 + particle.z);
        const x2d = particle.x * scale;
        const y2d = particle.y * scale;
        const pulseSize = Math.sin(particle.pulse) * 0.6 + 1.2;
        const size2d = particle.size * scale * pulseSize;
        
        // Draw trail
        particle.trail.forEach((point, index) => {
          const trailScale = 1000 / (1000 + particle.z);
          const trailX = point.x * trailScale;
          const trailY = point.y * trailScale;
          const trailOpacity = (index / particle.trail.length) * 0.3;
          
          ctx.save();
          ctx.globalAlpha = trailOpacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(trailX, trailY, size2d * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        
        // Draw main particle with enhanced glow
        ctx.save();
        ctx.globalAlpha = particle.opacity * scale * (Math.sin(particle.pulse) * 0.4 + 0.8);
        ctx.shadowBlur = 40 * scale;
        ctx.shadowColor = particle.color;
        
        // Create radial gradient for premium look
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size2d * 3);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.4, particle.color + '80');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// Professional Animated Background
const ProfessionalBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* Professional gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950" />

      {/* Subtle animated grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="professionalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5">
              <animate attributeName="stroke-opacity" values="0.05;0.15;0.05" dur="8s" repeatCount="indefinite" />
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#professionalGrid)" />
      </svg>

      {/* Professional geometric shapes */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 border border-blue-500/20 rounded-lg"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute bottom-32 left-20 w-24 h-24 border border-cyan-500/20 rounded-full"
        animate={{
          rotate: [360, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Subtle light rays */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-blue-500/20 via-transparent to-transparent transform -translate-x-1/2" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent transform -translate-y-1/2" />

      {/* Professional floating elements */}
      <motion.div
        className="absolute top-1/3 left-1/5 w-2 h-2 bg-blue-400/60 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full"
        animate={{
          y: [0, -15, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400/60 rounded-full"
        animate={{
          y: [0, -25, 0],
          opacity: [0.5, 0.9, 0.5]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
};

// Premium Feature Icons Component
const FeatureIcons: React.FC = () => {
  const icons = [
    { Icon: Brain, color: 'text-blue-400', delay: 0, name: 'AI Intelligence' },
    { Icon: Zap, color: 'text-yellow-400', delay: 0.2, name: 'Lightning Fast' },
    { Icon: Rocket, color: 'text-purple-400', delay: 0.4, name: 'Rapid Deploy' },
    { Icon: Bot, color: 'text-cyan-400', delay: 0.6, name: 'Smart Automation' },
    { Icon: Layers, color: 'text-green-400', delay: 0.8, name: 'Multi-Layer' },
    { Icon: Star, color: 'text-pink-400', delay: 1.0, name: 'Premium Quality' }
  ];

  return (
    <motion.div 
      className="flex flex-wrap justify-center items-center gap-6 mb-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      {icons.map(({ Icon, color, delay, name }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            delay: delay + 1.5,
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 12
          }}
          whileHover={{ 
            scale: 1.3, 
            rotate: 360,
            transition: { duration: 0.4 }
          }}
          className="relative group cursor-pointer"
          title={name}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-5 group-hover:border-white/40 group-hover:bg-white/10 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
            <Icon className={`w-7 h-7 ${color} group-hover:scale-125 transition-transform duration-500`} />
          </div>
          
          {/* Tooltip */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/20">
            {name}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const EnhancedHeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div 
      className="min-h-screen w-full relative overflow-hidden bg-black"
      style={{ opacity }}
    >
      {/* Professional Background Layers */}
      <ProfessionalBackground />
      <PremiumParticles />
      
      {/* Premium Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.4),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.4),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)]" />
      
      {/* Main Content */}
      <motion.div 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ y: y1 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 100 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Feature Icons */}
        <FeatureIcons />
        
        {/* Enhanced Hero Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <motion.span 
              className="block bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              FlowsyAI
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-4xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              AI Automation Revolution
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Experience the future of AI automation with stunning visual workflows 
            that adapt, learn, and evolve with your business needs. 
            <span className="text-cyan-300 font-semibold">Join the revolution today.</span>
          </motion.p>
        </motion.div>
        
        {/* Enhanced Action Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {/* Primary CTA */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/waitlist" className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative px-10 py-5 bg-black rounded-2xl leading-none flex items-center border border-white/20 group-hover:border-white/40 transition-all duration-300">
                <span className="text-white font-bold text-xl mr-4">Join the Revolution</span>
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          </motion.div>
          
          {/* Token Purchase */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-10 py-5 bg-black rounded-2xl leading-none flex items-center border border-emerald-500/30 group-hover:border-emerald-400/60 transition-all duration-300">
                <span className="text-white font-bold text-xl mr-4">Buy $FlowAI Token</span>
                <ExternalLink className="w-6 h-6 text-white group-hover:scale-125 transition-transform duration-300" />
              </div>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedHeroSection;
