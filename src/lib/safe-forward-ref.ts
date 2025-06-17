import * as React from 'react';

/**
 * Safe forwardRef utility that provides a fallback when React.forwardRef is undefined
 * This prevents the "Cannot read properties of undefined (reading 'forwardRef')" error
 * that can occur in certain build environments or when React is not properly loaded.
 */
export const safeForwardRef: typeof React.forwardRef =
  React.forwardRef || ((render: React.ForwardRefRenderFunction<unknown, unknown>) => render as React.ForwardRefExoticComponent<unknown>);

/**
 * Type-safe wrapper for React.forwardRef with error handling
 */
export function createSafeForwardRef<T, P>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
) {
  try {
    // @ts-expect-error Type mismatch if P is not an object, but this is a fallback
    return safeForwardRef<T, P>(render);
  } catch (error) {
    console.warn('forwardRef error, falling back to regular component:', error);
    return render as React.ForwardRefExoticComponent<P>; // Fallback with proper typing
  }
}

export default safeForwardRef;
