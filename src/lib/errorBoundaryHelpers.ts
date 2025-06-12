import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Higher-order component for easier usage
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<React.ComponentProps<typeof ErrorBoundary>, 'children'>
) => {
  const WrappedComponent = (props: P) =>
    React.createElement(ErrorBoundary, errorBoundaryProps, React.createElement(Component, props));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Async error boundary for handling async errors
export const AsyncErrorBoundary: React.FC<React.ComponentProps<typeof ErrorBoundary>> = ({
  children,
  ...props
}) => {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // You could trigger the error boundary here if needed
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return React.createElement(ErrorBoundary, props, children);
};
