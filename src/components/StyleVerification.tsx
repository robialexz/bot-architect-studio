import React, { useEffect, useState } from 'react';

interface StyleVerificationProps {
  onStylesLoaded?: () => void;
}

const StyleVerification: React.FC<StyleVerificationProps> = ({ onStylesLoaded }) => {
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const verifyStyles = () => {
      // Create test elements to verify critical styles are loaded
      const testElement = document.createElement('div');
      testElement.className = 'bg-primary text-foreground p-4 rounded-lg';
      testElement.style.position = 'absolute';
      testElement.style.top = '-9999px';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);

      const styles = window.getComputedStyle(testElement);

      // Check if Tailwind and custom styles are loaded
      const hasBackground =
        styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasColor = styles.color !== 'rgb(0, 0, 0)' && styles.color !== 'rgba(0, 0, 0, 0)';
      const hasPadding = styles.padding !== '0px';
      const hasBorderRadius = styles.borderRadius !== '0px';

      document.body.removeChild(testElement);

      const allStylesLoaded = hasBackground && hasColor && hasPadding && hasBorderRadius;

      if (allStylesLoaded) {
        console.log('✅ All critical styles loaded successfully');
        setStylesLoaded(true);
        onStylesLoaded?.();
      } else {
        console.warn('⚠️ Some styles not loaded:', {
          hasBackground,
          hasColor,
          hasPadding,
          hasBorderRadius,
        });

        // Retry up to 3 times
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            verifyStyles();
          }, 1000);
        } else {
          console.error('❌ Failed to load styles after 3 retries');
          // Force reload as last resort
          if (import.meta.env.PROD) {
            window.location.reload();
          }
        }
      }
    };

    // Initial check after a short delay
    const timer = setTimeout(verifyStyles, 100);

    return () => clearTimeout(timer);
  }, [retryCount, onStylesLoaded]);

  // Don't render anything in production if styles are loaded
  if (import.meta.env.PROD && stylesLoaded) {
    return null;
  }

  // Show loading indicator in development or if styles aren't loaded
  if (!stylesLoaded) {
    return (
      <div
        className="fixed top-4 right-4 z-[9999] bg-yellow-500 text-black px-3 py-2 rounded-lg text-sm font-medium"
        style={{
          // Inline styles as fallback
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999,
          backgroundColor: '#eab308',
          color: '#000',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        Loading styles... ({retryCount}/3)
      </div>
    );
  }

  return null;
};

export default StyleVerification;
