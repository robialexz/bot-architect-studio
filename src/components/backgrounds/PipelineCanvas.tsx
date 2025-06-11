import React, { useEffect, useRef } from 'react';

interface PipelineCanvasProps {
  className?: string;
}

const PipelineCanvas: React.FC<PipelineCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple pipeline animation variables
    let time = 0;
    const nodes: Array<{
      x: number;
      y: number;
      size: number;
    }> = [];

    const connections: Array<{
      start: { x: number; y: number };
      end: { x: number; y: number };
      progress: number;
    }> = [];

    // Initialize simple nodes
    for (let i = 0; i < 6; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 4,
      });
    }

    // Create simple connections
    for (let i = 0; i < nodes.length - 1; i++) {
      connections.push({
        start: { x: nodes[i].x, y: nodes[i].y },
        end: { x: nodes[i + 1].x, y: nodes[i + 1].y },
        progress: Math.random(),
      });
    }

    const animate = () => {
      time += 0.01;

      // Clear canvas with subtle fade
      ctx.fillStyle = 'rgba(20, 20, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update connections
      connections.forEach(connection => {
        connection.progress += 0.01;
        if (connection.progress > 1) {
          connection.progress = 0;
        }
      });

      // Draw simple connections
      connections.forEach(connection => {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(connection.start.x, connection.start.y);
        ctx.lineTo(connection.end.x, connection.end.y);
        ctx.stroke();

        // Draw flowing dot
        const flowX = connection.start.x + (connection.end.x - connection.start.x) * connection.progress;
        const flowY = connection.start.y + (connection.end.y - connection.start.y) * connection.progress;

        ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(flowX, flowY, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw simple nodes
      nodes.forEach(node => {
        ctx.fillStyle = 'rgba(100, 150, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

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
      className={`fixed top-0 left-0 w-full h-full pointer-events-none pipeline-canvas z-[1] ${className}`}
    />
  );
};

export default PipelineCanvas;
