import * as React from 'react';

/**
 * Safe forwardRef utility that provides a fallback when React.forwardRef is undefined
 * This prevents the "Cannot read properties of undefined (reading 'forwardRef')" error
 * that can occur in certain build environments or when React is not properly loaded.
 */
export const safeForwardRef = (() => {
  try {
    // Check if React is available and has forwardRef
    if (typeof React !== 'undefined' && React && typeof React.forwardRef === 'function') {
      return React.forwardRef;
    }

    // Check global React
    if (typeof window !== 'undefined' && (window as any).React?.forwardRef) {
      return (window as any).React.forwardRef;
    }

    // Fallback: return a function that just returns the render function
    console.warn('React.forwardRef not available, using fallback');
    return (render: any) => render;
  } catch (error) {
    console.warn('Error accessing React.forwardRef, using fallback:', error);
    return (render: any) => render;
  }
})();

/**
 * Type-safe wrapper for React.forwardRef with error handling
 */
export function createSafeForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
) {
  try {
    return safeForwardRef<T, P>(render);
  } catch (error) {
    console.warn('forwardRef error, falling back to regular component:', error);
    return render as any;
  }
}

export default safeForwardRef;
