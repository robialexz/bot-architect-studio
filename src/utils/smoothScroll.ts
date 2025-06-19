// Smooth scroll utility for enhanced navigation
export const smoothScrollTo = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

// Smooth scroll to top
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Check if element is in viewport
export const isInViewport = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Intersection Observer for scroll animations
export const createScrollObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Debounce function for scroll events
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get scroll progress (0-1)
export const getScrollProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(scrollTop / scrollHeight, 1);
};

// Easing functions for custom animations
export const easing = {
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number) => t * (2 - t),
  easeIn: (t: number) => t * t,
  bounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
};

// Custom scroll animation with easing
export const animateScroll = (
  to: number,
  duration: number = 1000,
  easingFunction: (t: number) => number = easing.easeInOut
) => {
  const start = window.pageYOffset;
  const change = to - start;
  const startTime = performance.now();

  const animateScrollStep = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFunction(progress);
    
    window.scrollTo(0, start + change * easedProgress);
    
    if (progress < 1) {
      requestAnimationFrame(animateScrollStep);
    }
  };

  requestAnimationFrame(animateScrollStep);
};

// Parallax scroll effect
export const createParallaxEffect = (
  element: HTMLElement,
  speed: number = 0.5
) => {
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * speed;
    element.style.transform = `translateY(${parallax}px)`;
  };

  const debouncedUpdate = debounce(updateParallax, 10);
  window.addEventListener('scroll', debouncedUpdate);

  return () => {
    window.removeEventListener('scroll', debouncedUpdate);
  };
};

// Reveal animation on scroll
export const createRevealOnScroll = (
  elements: NodeListOf<Element> | Element[],
  options: {
    threshold?: number;
    rootMargin?: string;
    animationClass?: string;
  } = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    animationClass = 'animate-fade-in'
  } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });

  return observer;
};

// Stagger animation for multiple elements
export const staggerAnimation = (
  elements: NodeListOf<Element> | Element[],
  delay: number = 100,
  animationClass: string = 'animate-slide-up'
) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delay);
  });
};

// Mouse parallax effect
export const createMouseParallax = (
  element: HTMLElement,
  intensity: number = 0.1
) => {
  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPos = (clientX / innerWidth - 0.5) * intensity;
    const yPos = (clientY / innerHeight - 0.5) * intensity;
    
    element.style.transform = `translate(${xPos}px, ${yPos}px)`;
  };

  document.addEventListener('mousemove', handleMouseMove);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
};

// Scroll-triggered counter animation
export const animateCounter = (
  element: HTMLElement,
  target: number,
  duration: number = 2000,
  suffix: string = ''
) => {
  const start = 0;
  const startTime = performance.now();

  const updateCounter = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(start + (target - start) * easing.easeOut(progress));
    
    element.textContent = current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
};

// Performance optimized scroll listener
export const createOptimizedScrollListener = (
  callback: () => void,
  throttleMs: number = 16
) => {
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };

  const throttledScroll = debounce(handleScroll, throttleMs);
  window.addEventListener('scroll', throttledScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', throttledScroll);
  };
};
