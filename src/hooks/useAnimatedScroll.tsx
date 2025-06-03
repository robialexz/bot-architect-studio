import { useEffect, useState, useRef, RefObject } from 'react';

interface AnimatedScrollOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for detecting when an element enters the viewport
 * and triggering animations based on scroll position
 *
 * @param options - Configuration options for the Intersection Observer
 * @returns An object with the ref to attach to the element and the entry state
 */
export function useAnimatedScroll(options: AnimatedScrollOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = false } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);

        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          setIsVisible(true);

          if (triggerOnce && !hasTriggered) {
            setHasTriggered(true);
          }
        } else {
          if (!triggerOnce || !hasTriggered) {
            setIsVisible(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    ref: elementRef as RefObject<HTMLElement>,
    entry,
    isVisible,
  };
}

/**
 * Custom hook for creating scroll-triggered animations with progress tracking
 *
 * @param options - Configuration options for the scroll tracking
 * @returns An object with the ref, progress value, and visibility state
 */
export function useScrollProgress(
  options: {
    start?: number; // 0 to 1, percentage of element height from top when animation starts
    end?: number; // 0 to 1, percentage of element height from top when animation ends
    clamp?: boolean; // Whether to clamp progress between 0 and 1
  } = {}
) {
  const { start = 0, end = 1, clamp = true } = options;

  const [progress, setProgress] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate the start and end positions in pixels
      const startPos = windowHeight - rect.height * start;
      const endPos = windowHeight - rect.height * end;
      const range = startPos - endPos;

      // Calculate progress based on element position
      let currentProgress = (startPos - rect.top) / range;

      // Clamp progress between 0 and 1 if requested
      if (clamp) {
        currentProgress = Math.max(0, Math.min(1, currentProgress));
      }

      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [start, end, clamp]);

  return {
    ref: elementRef as RefObject<HTMLElement>,
    progress,
  };
}
