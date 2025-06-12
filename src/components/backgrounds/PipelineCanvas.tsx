import React, { useEffect, useRef } from 'react';

interface PipelineCanvasProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface Connection {
  particle1: Particle;
  particle2: Particle;
  opacity: number;
}

const PipelineCanvas: React.FC<PipelineCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    const particles: Particle[] = [];
    const connections: Connection[] = [];
    let time = 0;
    let lastResetTime = Date.now();

    // Create floating particles
    const createParticle = (): Particle => ({
      x: (Math.random() * canvas.width) / (window.devicePixelRatio || 1),
      y: (Math.random() * canvas.height) / (window.devicePixelRatio || 1),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      hue: Math.random() * 60 + 200, // Blue to purple range
    });

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      time += 0.01;
      const currentTime = Date.now();

      const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
      const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

      // Complete reset every 50 seconds - instant and clean
      if (currentTime - lastResetTime > 50000) {
        ctx.fillStyle = 'rgb(15, 15, 20)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        particles.length = 0; // Clear all particles
        connections.length = 0; // Clear all connections
        lastResetTime = currentTime;
      } else {
        // Normal subtle fade for trail effect
        ctx.fillStyle = 'rgba(15, 15, 20, 0.05)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // Update particles
      particles.forEach(particle => {
        // Add subtle wave motion
        particle.x += particle.vx + Math.sin(time + particle.y * 0.01) * 0.1;
        particle.y += particle.vy + Math.cos(time + particle.x * 0.01) * 0.1;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvasWidth;
        if (particle.x > canvasWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvasHeight;
        if (particle.y > canvasHeight) particle.y = 0;

        // Subtle opacity pulsing
        particle.opacity = 0.3 + Math.sin(time * 2 + particle.x * 0.01) * 0.2;
      });

      // Clear connections array
      connections.length = 0;

      // Create connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            connections.push({
              particle1: particles[i],
              particle2: particles[j],
              opacity: ((120 - distance) / 120) * 0.3,
            });
          }
        }
      }

      // Draw connections
      connections.forEach(connection => {
        const gradient = ctx.createLinearGradient(
          connection.particle1.x,
          connection.particle1.y,
          connection.particle2.x,
          connection.particle2.y
        );

        gradient.addColorStop(
          0,
          `hsla(${connection.particle1.hue}, 70%, 60%, ${connection.opacity})`
        );
        gradient.addColorStop(
          1,
          `hsla(${connection.particle2.hue}, 70%, 60%, ${connection.opacity})`
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(connection.particle1.x, connection.particle1.y);
        ctx.lineTo(connection.particle2.x, connection.particle2.y);
        ctx.stroke();
      });

      // Draw particles
      particles.forEach(particle => {
        // Particle glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 70%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Particle core
        ctx.fillStyle = `hsla(${particle.hue}, 90%, 80%, ${particle.opacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-[1] bg-transparent ${className}`}
    />
  );
};

export default PipelineCanvas;
