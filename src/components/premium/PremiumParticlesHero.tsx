"use client";

import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Zap, 
  Star,
  Globe,
  Cpu,
  Brain
} from "lucide-react";

// Floating Particle Component
function FloatingParticle({ 
  delay = 0, 
  duration = 20, 
  size = 4,
  color = "bg-blue-400"
}: {
  delay?: number;
  duration?: number;
  size?: number;
  color?: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-60`}
      style={{
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [-20, -100, -20],
        x: [-10, 10, -10],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Glass Card Component
function GlassCard({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      className={`
        relative backdrop-blur-xl bg-white/5 border border-white/10 
        rounded-2xl p-6 shadow-2xl hover:bg-white/10 
        transition-all duration-500 group
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export default function PremiumParticlesHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity }}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/30 to-purple-950/30"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 transition-all duration-1000"
          style={{
            transform: `translate(${(mousePosition.x - 50) * 0.02}px, ${(mousePosition.y - 50) * 0.02}px)`,
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            duration={15 + Math.random() * 10}
            size={2 + Math.random() * 4}
            color={
              i % 3 === 0 ? "bg-blue-400" : 
              i % 3 === 1 ? "bg-purple-400" : "bg-cyan-400"
            }
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left Content */}
          <motion.div 
            style={{ y: y1 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border-blue-400/30 px-4 py-2 text-sm backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                FlowsyAI Revolution
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
                <span className="block bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-2">
                  The Future of
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Automation
                </span>
              </h1>
              
              <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                Experience the next generation of intelligent automation that transforms 
                complex workflows into seamless, powerful solutions.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl shadow-blue-500/30"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="bg-white/5 hover:bg-white/10 text-white border-white/20 hover:border-white/40 font-bold px-8 py-4 rounded-xl backdrop-blur-sm"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Cards */}
          <motion.div 
            style={{ y: y2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              
              {/* AI Brain Card */}
              <GlassCard delay={0.3} className="col-span-2">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                    <Brain className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Neural Processing</h3>
                    <p className="text-white/60 text-sm">Advanced AI decision making</p>
                  </div>
                </div>
              </GlassCard>

              {/* Performance Card */}
              <GlassCard delay={0.5}>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-white/60 text-sm">Uptime</div>
                </div>
              </GlassCard>

              {/* Speed Card */}
              <GlassCard delay={0.7}>
                <div className="text-center">
                  <Cpu className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">10x</div>
                  <div className="text-white/60 text-sm">Faster</div>
                </div>
              </GlassCard>

              {/* Global Card */}
              <GlassCard delay={0.9} className="col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-green-400" />
                    <span className="text-white font-medium">Global Network</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Floating Glow Effect */}
            <div 
              className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50 transition-all duration-1000"
              style={{
                transform: `translate(${(mousePosition.x - 50) * 0.05}px, ${(mousePosition.y - 50) * 0.05}px)`,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </motion.div>
  );
}
