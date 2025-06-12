/**
 * Utility functions for animations throughout the application
 */

/**
 * Creates a staggered animation for multiple elements using CSS transitions
 *
 * @param elements - Array of elements to animate
 * @param initialStyles - Initial CSS styles to apply
 * @param finalStyles - Final CSS styles to apply
 * @param staggerAmount - Time between each element's animation
 * @param options - Additional options for the animation
 */
export const staggerElements = (
  elements: HTMLElement[],
  initialStyles: Partial<CSSStyleDeclaration>,
  finalStyles: Partial<CSSStyleDeclaration>,
  staggerAmount = 0.1,
  options: {
    useObserver?: boolean;
    threshold?: number;
    delay?: number;
    duration?: number;
  } = {}
) => {
  const { useObserver = false, threshold = 0.2, delay = 0, duration = 0.5 } = options;

  // Apply initial styles to all elements
  elements.forEach(element => {
    Object.assign(element.style, initialStyles);
    element.style.transition = `all ${duration}s ease`;
  });

  if (useObserver) {
    // Create an intersection observer to trigger animations when elements come into view
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;

            // Apply final styles with staggered delay
            setTimeout(
              () => {
                Object.assign(element.style, finalStyles);
              },
              delay * 1000 + i * staggerAmount * 1000
            );

            // Unobserve after animation is triggered
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    // Observe each element
    elements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Apply final styles with staggered delay without observer
    elements.forEach((element, index) => {
      setTimeout(
        () => {
          Object.assign(element.style, finalStyles);
        },
        delay * 1000 + index * staggerAmount * 1000
      );
    });
  }
};

/**
 * Creates a reveal animation for text elements using CSS transitions
 *
 * @param element - Text element to animate
 * @param options - Animation options
 */
export const textReveal = (
  element: HTMLElement,
  options: {
    duration?: number;
    delay?: number;
    staggerAmount?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  } = {}
) => {
  const { duration = 0.8, delay = 0, staggerAmount = 0.03, direction = 'up' } = options;

  // Get the text content
  const text = element.textContent || '';

  // Clear the element
  element.textContent = '';

  // Create a wrapper for the text
  const wrapper = document.createElement('span');
  wrapper.style.display = 'inline-block';
  wrapper.style.overflow = 'hidden';

  // Create individual spans for each character
  text.split('').forEach((char, index) => {
    const charSpan = document.createElement('span');
    charSpan.style.display = 'inline-block';
    charSpan.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces

    // Set initial styles
    charSpan.style.opacity = '0';
    charSpan.style.transition = `transform ${duration}s ease, opacity ${duration}s ease`;
    charSpan.style.transitionDelay = `${delay + index * staggerAmount}s`;

    // Set initial transform based on direction
    switch (direction) {
      case 'up':
        charSpan.style.transform = 'translateY(100%)';
        break;
      case 'down':
        charSpan.style.transform = 'translateY(-100%)';
        break;
      case 'left':
        charSpan.style.transform = 'translateX(100%)';
        break;
      case 'right':
        charSpan.style.transform = 'translateX(-100%)';
        break;
    }

    wrapper.appendChild(charSpan);
  });

  // Add the wrapper to the element
  element.appendChild(wrapper);

  // Get all character spans
  const chars = Array.from(wrapper.children) as HTMLElement[];

  // Trigger animation after a small delay to ensure styles are applied
  setTimeout(() => {
    chars.forEach(char => {
      char.style.opacity = '1';
      char.style.transform = 'translate(0, 0)';
    });
  }, 10);
};

/**
 * Creates a parallax scroll effect for an element using the Intersection Observer API
 *
 * @param element - Element to apply parallax to
 * @param options - Parallax options
 */
export const createParallaxEffect = (
  element: HTMLElement,
  options: {
    speed?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  } = {}
) => {
  const { speed = 0.5, direction = 'up' } = options;

  // Set initial styles
  element.style.transition = 'transform 0.2s ease-out';
  element.style.willChange = 'transform';

  // Create scroll handler
  const handleScroll = () => {
    // Get element position relative to viewport
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how far the element is from the center of the viewport
    // normalized to a value between -1 and 1
    const fromCenter = (rect.top + rect.height / 2 - windowHeight / 2) / (windowHeight / 2);

    // Calculate transform value based on direction and speed
    let transform = '';
    const moveAmount = fromCenter * speed * 100;

    switch (direction) {
      case 'up':
        transform = `translateY(${-moveAmount}px)`;
        break;
      case 'down':
        transform = `translateY(${moveAmount}px)`;
        break;
      case 'left':
        transform = `translateX(${-moveAmount}px)`;
        break;
      case 'right':
        transform = `translateX(${moveAmount}px)`;
        break;
    }

    // Apply transform
    element.style.transform = transform;
  };

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Initial calculation
  handleScroll();

  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

/**
 * Creates a magnetic button effect
 *
 * @param button - Button element to apply effect to
 * @param options - Effect options
 */
export const createMagneticEffect = (
  button: HTMLElement,
  options: {
    strength?: number;
    ease?: number;
    radius?: number;
  } = {}
) => {
  const { strength = 0.5, ease = 0.1, radius = 150 } = options;

  let isHovered = false;
  let mouseX = 0;
  let mouseY = 0;
  let buttonX = 0;
  let buttonY = 0;
  let requestId: number | null = null;

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };

  const update = () => {
    if (!isHovered) {
      buttonX += (0 - buttonX) * ease;
      buttonY += (0 - buttonY) * ease;
    } else {
      buttonX += (mouseX - buttonX) * ease;
      buttonY += (mouseY - buttonY) * ease;
    }

    button.style.transform = `translate(${buttonX}px, ${buttonY}px)`;
    requestId = requestAnimationFrame(update);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = calculateDistance(e.clientX, e.clientY, centerX, centerY);

    if (distance < radius) {
      isHovered = true;
      mouseX = (e.clientX - centerX) * strength;
      mouseY = (e.clientY - centerY) * strength;
    } else {
      isHovered = false;
    }
  };

  const handleMouseLeave = () => {
    isHovered = false;
  };

  // Add event listeners
  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  // Start animation loop
  requestId = requestAnimationFrame(update);

  // Return cleanup function
  return () => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};
