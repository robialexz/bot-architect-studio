
import React, { useRef, useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  connections: number[];
}

interface EnergyNetworkCanvasProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  energyDecay?: number;
}

const EnergyNetworkCanvas: React.FC<EnergyNetworkCanvasProps> = ({
  className = '',
  particleCount = 50,
  connectionDistance = 100,
  energyDecay = 0.99,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      energy: Math.random(),
      connections: [],
    }));
  }, [particleCount, dimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const particles = particlesRef.current;

      // Update particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= dimensions.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= dimensions.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(dimensions.height, particle.y));
        }

        // Update energy
        particle.energy *= energyDecay;
        if (particle.energy < 0.1) {
          particle.energy = Math.random();
        }

        // Find connections
        particle.connections = [];
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          if (!other) continue;
          
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            particle.connections.push(j);
          }
        }
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particle.connections.forEach(connectionIndex => {
          const p1 = particles[i];
          const p2 = particles[connectionIndex];
          
          if (!p1 || !p2) return;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = (1 - distance / connectionDistance) * 0.5;

          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });
      });

      // Draw particles
      particles.forEach(particle => {
        if (!particle) return;
        
        const radius = 2 + particle.energy * 3;
        const opacity = 0.6 + particle.energy * 0.4;

        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#3b82f6';
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, connectionDistance, energyDecay]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};

export default EnergyNetworkCanvas;
