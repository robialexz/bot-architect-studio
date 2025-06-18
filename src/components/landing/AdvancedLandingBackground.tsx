import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
  pulse: number;
}

const AdvancedLandingBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const orbsRef = useRef<FloatingOrb[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // AI Color Palette
  const aiColors = [
    '#10B981', // ai-emerald
    '#00CCFF', // ai-electric
    '#B366FF', // ai-cyber
    '#FF33CC', // ai-plasma
    '#00FF88', // ai-mint
    '#6366F1', // ai-indigo
  ];

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: aiColors[Math.floor(Math.random() * aiColors.length)],
        opacity: Math.random() * 0.8 + 0.2,
        life: Math.random() * 1000,
        maxLife: 1000 + Math.random() * 2000,
      });
    }
    return particles;
  };

  // Initialize floating orbs
  const initOrbs = (width: number, height: number) => {
    const orbs: FloatingOrb[] = [];
    for (let i = 0; i < 8; i++) {
      orbs.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 100 + 50,
        color: aiColors[Math.floor(Math.random() * aiColors.length)],
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() * Math.PI * 2,
        pulse: Math.random() * Math.PI * 2,
      });
    }
    return orbs;
  };

  // Update dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize particles and orbs when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      particlesRef.current = initParticles(dimensions.width, dimensions.height);
      orbsRef.current = initOrbs(dimensions.width, dimensions.height);
    }
  }, [dimensions, initParticles, initOrbs]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.05)');
      gradient.addColorStop(0.3, 'rgba(0, 204, 255, 0.03)');
      gradient.addColorStop(0.6, 'rgba(179, 102, 255, 0.02)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw floating orbs
      orbsRef.current.forEach(orb => {
        orb.x += Math.cos(orb.direction) * orb.speed;
        orb.y += Math.sin(orb.direction) * orb.speed;
        orb.pulse += 0.02;

        // Bounce off edges
        if (orb.x < 0 || orb.x > canvas.width) orb.direction = Math.PI - orb.direction;
        if (orb.y < 0 || orb.y > canvas.height) orb.direction = -orb.direction;

        // Keep orbs in bounds
        orb.x = Math.max(0, Math.min(canvas.width, orb.x));
        orb.y = Math.max(0, Math.min(canvas.height, orb.y));

        // Draw orb with pulsing effect
        const pulseFactor = 1 + Math.sin(orb.pulse) * 0.3;
        const currentSize = orb.size * pulseFactor;

        const orbGradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentSize);
        orbGradient.addColorStop(0, `${orb.color}40`);
        orbGradient.addColorStop(0.5, `${orb.color}20`);
        orbGradient.addColorStop(1, `${orb.color}00`);

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Boundary conditions
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Fade out over time
        const lifeFactor = 1 - particle.life / particle.maxLife;
        particle.opacity = Math.max(0, lifeFactor * 0.8);

        // Reset particle if it's too old
        if (particle.life > particle.maxLife) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.vx = (Math.random() - 0.5) * 0.5;
          particle.vy = (Math.random() - 0.5) * 0.5;
          particle.life = 0;
          particle.color = aiColors[Math.floor(Math.random() * aiColors.length)];
        }

        // Draw particle
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            const opacity = ((80 - distance) / 80) * 0.3;
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, aiColors]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Canvas for particle system */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black opacity-90" />

      {/* Animated geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div
              className="w-full h-full border border-ai-emerald/20 rounded-full"
              style={{
                background: `conic-gradient(from ${i * 60}deg, ${aiColors[i % aiColors.length]}20, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Pulsing grid overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default AdvancedLandingBackground;
