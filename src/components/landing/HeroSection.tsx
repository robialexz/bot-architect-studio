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
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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
      className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden premium-hero-bg"
    >
      {/* Particles Animation */}
      <ParticlesBackground />

      {/* Enhanced Background - No problematic video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background z-10"></div>

        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-gold/20 animate-pulse"></div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/30 rounded-full animate-spin-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-gold/30 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/20 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Simplified Floating Elements - Better Performance */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`hero-floating-element hero-floating-element-${i + 1} ${i % 3 === 0 ? 'bg-primary/20' : i % 3 === 1 ? 'bg-gold/20' : 'bg-platinum/20'}`}
          />
        ))}
      </div>

      {/* Glowing Lines */}
      <div className="absolute inset-0 z-5">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        ></motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        ></motion.div>
        <motion.div
          style={{ x: y1 }}
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"
        ></motion.div>
        <motion.div
          style={{ x: y2 }}
          className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent"
        ></motion.div>
      </div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className="hero-content max-w-5xl px-6 py-12 md:py-16 z-20 relative"
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

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 tracking-tight text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <span className="block text-foreground">The Future of</span>
          <span className="block bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
            Intelligent Automation
          </span>
          <span className="block text-lg sm:text-xl md:text-2xl font-normal text-muted-foreground mt-4">
            Experience AR-powered workflow building
          </span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Build AI workflows in 3D space using your mobile camera. Connect real AI services with
          gesture controls and watch your automation come to life.
        </motion.p>

        {/* Feature Highlights */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: Camera, text: 'AR Interface', color: 'text-gold' },
            { icon: Brain, text: 'Real AI APIs', color: 'text-primary' },
            { icon: Zap, text: 'Instant Results', color: 'text-emerald' },
            { icon: Layers, text: '3D Workflows', color: 'text-sapphire' },
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium">
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className="text-foreground">{feature.text}</span>
            </div>
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
          <span className="text-sm text-muted-foreground">Discover Excellence</span>
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
