import React from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';

// Extend MotionProps to include className
interface ExtendedMotionProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
}

// Type for fallback props
interface FallbackProps {
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

// Wrapper pentru motion.div cu error boundary
export const MotionDiv = React.forwardRef<HTMLDivElement, ExtendedMotionProps>((props, ref) => {
  try {
    return <motion.div ref={ref} {...props} />;
  } catch (error) {
    console.warn('Framer Motion error:', error);
    const fallbackProps: FallbackProps = {
      className: props.className,
      children: props.children,
    };
    return <div ref={ref} {...fallbackProps} />;
  }
});

MotionDiv.displayName = 'MotionDiv';

// Wrapper pentru motion.section cu error boundary
export const MotionSection = React.forwardRef<HTMLElement, ExtendedMotionProps>((props, ref) => {
  try {
    return <motion.section ref={ref} {...props} />;
  } catch (error) {
    console.warn('Framer Motion error:', error);
    const fallbackProps: FallbackProps = {
      className: props.className,
      children: props.children,
    };
    return <section ref={ref} {...fallbackProps} />;
  }
});

MotionSection.displayName = 'MotionSection';

// Wrapper pentru motion.h1 cu error boundary
export const MotionH1 = React.forwardRef<HTMLHeadingElement, ExtendedMotionProps>((props, ref) => {
  try {
    return <motion.h1 ref={ref} {...props} />;
  } catch (error) {
    console.warn('Framer Motion error:', error);
    const fallbackProps: FallbackProps = {
      className: props.className,
      children: props.children,
    };
    return <h1 ref={ref} {...fallbackProps} />;
  }
});

MotionH1.displayName = 'MotionH1';

// Wrapper pentru motion.h2 cu error boundary
export const MotionH2 = React.forwardRef<HTMLHeadingElement, ExtendedMotionProps>((props, ref) => {
  try {
    return <motion.h2 ref={ref} {...props} />;
  } catch (error) {
    console.warn('Framer Motion error:', error);
    const fallbackProps: FallbackProps = {
      className: props.className,
      children: props.children,
    };
    return <h2 ref={ref} {...fallbackProps} />;
  }
});

MotionH2.displayName = 'MotionH2';

// Wrapper pentru motion.p cu error boundary
export const MotionP = React.forwardRef<HTMLParagraphElement, ExtendedMotionProps>((props, ref) => {
  try {
    return <motion.p ref={ref} {...props} />;
  } catch (error) {
    console.warn('Framer Motion error:', error);
    const fallbackProps: FallbackProps = {
      className: props.className,
      children: props.children,
    };
    return <p ref={ref} {...fallbackProps} />;
  }
});

MotionP.displayName = 'MotionP';

// Wrapper pentru motion.button cu error boundary
export const MotionButton = React.forwardRef<HTMLButtonElement, ExtendedMotionProps>(
  (props, ref) => {
    try {
      return <motion.button ref={ref} {...props} />;
    } catch (error) {
      console.warn('Framer Motion error:', error);
      const fallbackProps: FallbackProps = {
        className: props.className,
        children: props.children,
      };
      return <button ref={ref} {...fallbackProps} />;
    }
  }
);

MotionButton.displayName = 'MotionButton';

// Wrapper pentru AnimatePresence cu error boundary
export const SafeAnimatePresence: React.FC<{
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
}> = ({ children, mode }) => {
  try {
    return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
  } catch (error) {
    console.warn('AnimatePresence error:', error);
    return <>{children}</>;
  }
};
