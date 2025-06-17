import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Sparkles, ExternalLink, Play, Zap, Brain, Rocket, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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

// 3D Floating Particles Component
const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      opacity: number;
    }> = [];
    
    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 5,
        size: Math.random() * 3 + 1,
        color: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        
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
        const size2d = particle.size * scale;
        
        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = particle.opacity * scale;
        ctx.shadowBlur = 20;
        ctx.shadowColor = particle.color;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};





const UltraWowHeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.3),transparent_50%)]" />
      
      {/* Main Content */}
      <div className={`
        relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12
        transition-all duration-2000 ease-out
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
      `}>
        

        
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
            <span className="block bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              FlowsyAI
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent text-5xl md:text-7xl">
              AI Automation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience the future of AI automation with stunning visual workflows 
            that adapt, learn, and evolve with your business needs.
          </p>
        </div>
        

        
        {/* Premium Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {/* Primary CTA */}
          <Link to="/waitlist" className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative px-8 py-4 bg-black rounded-xl leading-none flex items-center">
              <span className="text-white font-bold text-lg mr-3">Join the Revolution</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </Link>
          
          {/* Token Purchase */}
          <a 
            href="https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-8 py-4 bg-black rounded-xl leading-none flex items-center">
              <span className="text-white font-bold text-lg mr-3">Buy $FlowAI</span>
              <ExternalLink className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
          </a>
        </div>

        {/* Social Media Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {/* Telegram Community Button */}
          <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
            <a
              href="https://t.me/+jNmtj8qUUtMxOTVk"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative"
            >
              <div className="relative backdrop-blur-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-[1px] group-hover:border-cyan-400/60 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/25">
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-xl px-5 py-3 overflow-hidden">
                  {/* Wave Animation */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 animate-pulse"></div>
                  </div>

                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                      <TelegramIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                        Community
                      </div>
                      <div className="text-xs text-white/50">Telegram</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-cyan-400/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Twitter/X Button */}
          <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
            <a
              href="https://x.com/FlowsyAI"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative"
            >
              <div className="relative backdrop-blur-lg bg-gradient-to-r from-gray-500/10 to-slate-500/10 border border-gray-500/30 rounded-xl p-[1px] group-hover:border-gray-400/60 transition-all duration-500 shadow-lg group-hover:shadow-gray-500/25">
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-xl px-5 py-3 overflow-hidden">
                  {/* Wave Animation */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 via-slate-500/20 to-gray-500/20 animate-pulse"></div>
                  </div>

                  <div className="relative z-10 flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-gray-600 to-slate-700 p-2 rounded-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <TwitterIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold bg-gradient-to-r from-gray-300 to-slate-300 bg-clip-text text-transparent">
                        Follow X
                      </div>
                      <div className="text-xs text-white/50">@FlowsyAI</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-gray-400/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Live Stats Ticker */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 px-8 py-4">
          <div className="flex items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live AI Processing</span>
            </div>
            <div className="text-sm">
              <span className="text-green-400 font-mono">2,847</span> workflows running
            </div>
            <div className="text-sm">
              <span className="text-blue-400 font-mono">99.9%</span> uptime
            </div>
            <div className="text-sm">
              <span className="text-purple-400 font-mono">50M+</span> tasks automated
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes tilt {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UltraWowHeroSection;
