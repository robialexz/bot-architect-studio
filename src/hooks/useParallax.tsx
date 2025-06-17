import { useEffect, useState } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'horizontal' | 'vertical' | 'both';
  reverse?: boolean;
  max?: number;
}

/**
 * Custom hook for creating parallax effects based on mouse movement or scroll position
 *
 * @param type - The type of parallax effect ('mouse' or 'scroll')
 * @param options - Configuration options for the parallax effect
 * @returns An object with x and y values for positioning elements
 */
export function useParallax(type: 'mouse' | 'scroll' = 'mouse', options: ParallaxOptions = {}) {
  const { speed = 0.1, direction = 'both', reverse = false, max = 100 } = options;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (type === 'mouse') {
      const handleMouseMove = (e: MouseEvent) => {
        // Calculate mouse position relative to the center of the screen
        const x = e.clientX - window.innerWidth / 2;
        const y = e.clientY - window.innerHeight / 2;

        // Apply speed and direction constraints
        let newX = 0;
        let newY = 0;

        if (direction === 'horizontal' || direction === 'both') {
          newX = x * speed * (reverse ? -1 : 1);
          // Clamp the value to max
          newX = Math.max(Math.min(newX, max), -max);
        }

        if (direction === 'vertical' || direction === 'both') {
          newY = y * speed * (reverse ? -1 : 1);
          // Clamp the value to max
          newY = Math.max(Math.min(newY, max), -max);
        }

        setPosition({ x: newX, y: newY });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    } else if (type === 'scroll') {
      const handleScroll = () => {
        // Calculate scroll position relative to document height
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const docWidth = document.body.scrollWidth - window.innerWidth;

        // Apply speed and direction constraints
        let newX = 0;
        let newY = 0;

        if (direction === 'horizontal' || direction === 'both') {
          newX = (scrollX / docWidth) * max * (reverse ? -1 : 1);
        }

        if (direction === 'vertical' || direction === 'both') {
          newY = (scrollY / docHeight) * max * (reverse ? -1 : 1);
        }

        setPosition({ x: newX, y: newY });
      };

      window.addEventListener('scroll', handleScroll);

      // Initial calculation
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [type, speed, direction, reverse, max]);

  return position;
}
