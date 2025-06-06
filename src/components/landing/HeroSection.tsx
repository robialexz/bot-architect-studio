import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Layers,
  Camera,
  ChevronDown,
  Trophy,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumLogo from '@/components/ui/PremiumLogo';

// Simplified particles background without tsParticles
function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/10" />
      {/* Simple animated dots */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`hero-floating-dot hero-floating-dot-${i + 1}`} />
      ))}
    </div>
  );
}

const HeroSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // For parallax scrolling effects
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  // Handle video play/pause
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden pt-36 md:pt-44"
    >
      {/* Subtle Hero Enhancement - Let global background shine */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-[1]">
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-background/10"></div>
      </div>

      {/* Enhanced Floating Elements with Colors */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              i % 4 === 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : i % 4 === 1
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : i % 4 === 2
                    ? 'bg-gradient-to-r from-gold to-orange-500'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500'
            }`}
            style={{
              left: `${10 + ((i * 8) % 80)}%`,
              top: `${15 + ((i * 12) % 70)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, -10, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className="hero-content max-w-5xl px-6 py-12 md:py-16 z-[10] relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Luxury Logo Display */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <PremiumLogo size="xl" showText={true} animated={true} className="justify-center" />
        </motion.div>

        {/* Revolutionary Badge */}
        <motion.div
          className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 via-gold/20 to-sapphire/20 rounded-full px-8 py-3 mb-8 border border-primary/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-gold" />
          </motion.div>
          <span className="text-base font-bold text-foreground">REVOLUTIONARY AI PLATFORM</span>
          <motion.div
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-8 tracking-tight text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-gold mb-4">
            FlowsyAI
          </span>
          <span className="block text-foreground mb-2">The Future of</span>
          <span className="block bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
            Intelligent Automation
          </span>
        </motion.h1>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Experience AR-Powered Workflow Building
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-center">
            Build AI workflows in <span className="text-primary font-semibold">3D space</span> using
            your mobile camera. Connect{' '}
            <span className="text-gold font-semibold">real AI services</span> with gesture controls
            and watch your
            <span className="text-sapphire font-semibold"> automation come to life</span>.
          </p>
        </motion.div>

        {/* Enhanced Feature Highlights */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {[
            {
              icon: Camera,
              text: 'AR Interface',
              color: 'text-gold',
              bgColor: 'bg-gold/10',
              borderColor: 'border-gold/30',
              description: 'Mobile AR',
            },
            {
              icon: Brain,
              text: 'Real AI APIs',
              color: 'text-primary',
              bgColor: 'bg-primary/10',
              borderColor: 'border-primary/30',
              description: 'Live Services',
            },
            {
              icon: Zap,
              text: 'Instant Results',
              color: 'text-emerald-500',
              bgColor: 'bg-emerald-500/10',
              borderColor: 'border-emerald-500/30',
              description: 'Real-time',
            },
            {
              icon: Layers,
              text: '3D Workflows',
              color: 'text-sapphire',
              bgColor: 'bg-sapphire/10',
              borderColor: 'border-sapphire/30',
              description: 'Spatial UI',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-2xl border ${feature.bgColor} ${feature.borderColor} text-center group hover:scale-105 transition-all duration-300 cursor-pointer`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl ${feature.bgColor} flex items-center justify-center`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </motion.div>
              <div className={`font-bold text-sm ${feature.color} mb-1`}>{feature.text}</div>
              <div className="text-xs text-muted-foreground">{feature.description}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-primary via-sapphire to-primary text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out text-base sm:text-lg px-10 py-6 w-full sm:w-auto"
            asChild
          >
            <Link to="/waitlist">
              <span className="relative z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Camera className="mr-2 h-5 w-5" />
                Join Waitlist
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </Button>

          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-gold via-gold-light to-gold text-black font-semibold rounded-xl hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 ease-in-out text-base sm:text-lg px-10 py-6 w-full sm:w-auto"
            asChild
          >
            <Link to="/roadmap">
              <span className="relative z-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="mr-2 h-5 w-5" />
                View Roadmap
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: hasScrolled ? 0 : 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() =>
            document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <motion.div
            className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-gold" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
