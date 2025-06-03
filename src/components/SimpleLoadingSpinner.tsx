import React from 'react';

interface SimpleLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SimpleLoadingSpinner: React.FC<SimpleLoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div
          className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin`}
        />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default SimpleLoadingSpinner;
