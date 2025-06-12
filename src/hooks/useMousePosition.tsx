import { useState, useEffect, RefObject, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  elementX: number; // Position relative to element (0-1)
  elementY: number; // Position relative to element (0-1)
  isInside: boolean;
}

/**
 * Custom hook to track mouse position globally or relative to a specific element
 *
 * @param elementRef - Optional ref to an element to track mouse position relative to
 * @param options - Additional options for tracking
 * @returns Current mouse position data
 */
export function useMousePosition(
  elementRef?: RefObject<HTMLElement>,
  options: {
    trackOnlyInside?: boolean;
  } = {}
) {
  const { trackOnlyInside = false } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    isInside: false,
  });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      const { clientX, clientY } = ev;

      let elementX = 0;
      let elementY = 0;
      let isInside = false;

      // If we have an element ref, calculate position relative to it
      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();

        // Check if mouse is inside element
        isInside =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;

        // Calculate position relative to element (0-1)
        elementX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        elementY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        // If we're only tracking when inside and mouse is outside, return early
        if (trackOnlyInside && !isInside) {
          return;
        }
      }

      setMousePosition({
        x: clientX,
        y: clientY,
        elementX,
        elementY,
        isInside,
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [elementRef, trackOnlyInside]);

  return mousePosition;
}

/**
 * Custom hook to create a magnetic effect on an element that follows the mouse
 *
 * @param options - Configuration for the magnetic effect
 * @returns Ref to attach to the element and transform values
 */
export function useMagneticEffect(
  options: {
    strength?: number;
    ease?: number;
    distance?: number;
  } = {}
) {
  const { strength = 0.5, ease = 0.1, distance = 100 } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Track the animation frame request
  const requestRef = useRef<number>();

  // Track the target position
  const targetRef = useRef({ x: 0, y: 0, scale: 1 });

  // Track current position for animation
  const currentRef = useRef({ x: 0, y: 0, scale: 1 });

  // Mouse position tracking
  const mousePosition = useMousePosition(elementRef);

  useEffect(() => {
    // Update target position based on mouse position
    if (mousePosition.isInside) {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center
      const distX = mousePosition.x - centerX;
      const distY = mousePosition.y - centerY;

      // Calculate distance ratio (0-1)
      const dist = Math.sqrt(distX * distX + distY * distY);
      const distRatio = Math.min(1, dist / distance);

      // Set target position with strength factor
      targetRef.current = {
        x: distX * strength * distRatio,
        y: distY * strength * distRatio,
        scale: 1 + 0.1 * strength * distRatio,
      };
    } else {
      // Reset when mouse leaves
      targetRef.current = { x: 0, y: 0, scale: 1 };
    }
  }, [mousePosition, strength, distance]);

  // Animation loop
  useEffect(() => {
    const animatePosition = () => {
      // Interpolate current position towards target with easing
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * ease;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * ease;
      currentRef.current.scale += (targetRef.current.scale - currentRef.current.scale) * ease;

      // Update state with new position
      setTransform({
        x: currentRef.current.x,
        y: currentRef.current.y,
        scale: currentRef.current.scale,
      });

      // Continue animation loop
      requestRef.current = requestAnimationFrame(animatePosition);
    };

    requestRef.current = requestAnimationFrame(animatePosition);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [ease]);

  return { ref: elementRef, transform };
}
