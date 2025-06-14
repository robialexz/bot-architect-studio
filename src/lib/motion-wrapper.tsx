import * as React from 'react';

// CSS-ONLY MOTION WRAPPER - NO FRAMER MOTION IMPORTS
// This completely eliminates Framer Motion dependencies

// CSS-only motion props interface
interface ExtendedMotionProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  // Framer Motion props that we'll ignore but accept for compatibility
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  variants?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  whileFocus?: unknown;
  whileInView?: unknown;
  layoutId?: string;
  layout?: unknown;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onTap?: () => void;
  onTapStart?: () => void;
  onTapCancel?: () => void;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  onUpdate?: () => void;
  onDragStart?: () => void;
  onDrag?: () => void;
  onDragEnd?: () => void;
  drag?: unknown;
  dragConstraints?: unknown;
  dragElastic?: unknown;
  dragMomentum?: unknown;
  dragTransition?: unknown;
  viewport?: unknown;
  // [key: string]: unknown; // Temporarily removed to debug spread and call signature errors
}

// Safe forwardRef wrapper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeForwardRef: typeof React.forwardRef =
  React.forwardRef || ((render: any) => render as any);

// CSS-only motion component factory
const createMotionComponent = (tag: keyof JSX.IntrinsicElements) => {
  return safeForwardRef<HTMLElement, ExtendedMotionProps>((props, ref) => {
    const {
      children,
      className,
      style,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onHoverStart,
      onHoverEnd,
      onTap,
      // Ignore all Framer Motion specific props
      initial,
      animate,
      exit,
      transition,
      variants,
      whileHover,
      whileTap,
      whileFocus,
      whileInView,
      layoutId,
      layout,
      onTapStart,
      onTapCancel,
      onAnimationStart,
      onAnimationComplete,
      onUpdate,
      onDragStart,
      onDrag,
      onDragEnd,
      drag,
      dragConstraints,
      dragElastic,
      dragMomentum,
      dragTransition,
      viewport,
      ...rest
    } = props;

    // Enhanced CSS-based animations
    const motionStyle: React.CSSProperties = {
      ...style,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    // Handle hover events
    const handleMouseEnter = (event: React.MouseEvent) => {
      onMouseEnter?.(event);
      onHoverStart?.();
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
      onMouseLeave?.(event);
      onHoverEnd?.();
    };

    const handleClick = (event: React.MouseEvent) => {
      onClick?.(event);
      onTap?.();
    };

    return React.createElement(
      tag,
      {
        ref,
        className,
        style: motionStyle,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ...rest,
      },
      children as React.ReactNode // Explicit cast for children
    );
  });
};

// Export all motion components using the CSS-only factory
export const MotionDiv = createMotionComponent('div');
export const MotionSection = createMotionComponent('section');
export const MotionMain = createMotionComponent('main');
export const MotionFooter = createMotionComponent('footer');
export const MotionHeader = createMotionComponent('header');
export const MotionNav = createMotionComponent('nav');
export const MotionAside = createMotionComponent('aside');
export const MotionArticle = createMotionComponent('article');
export const MotionH1 = createMotionComponent('h1');
export const MotionH2 = createMotionComponent('h2');
export const MotionH3 = createMotionComponent('h3');
export const MotionH4 = createMotionComponent('h4');
export const MotionH5 = createMotionComponent('h5');
export const MotionH6 = createMotionComponent('h6');
export const MotionP = createMotionComponent('p');
export const MotionSpan = createMotionComponent('span');
export const MotionButton = createMotionComponent('button');
export const MotionA = createMotionComponent('a');
export const MotionImg = createMotionComponent('img');
export const MotionLi = createMotionComponent('li');
export const MotionUl = createMotionComponent('ul');
export const MotionOl = createMotionComponent('ol');
export const MotionTr = createMotionComponent('tr');
export const MotionTd = createMotionComponent('td');
export const MotionTh = createMotionComponent('th');
export const MotionTable = createMotionComponent('table');
export const MotionForm = createMotionComponent('form');
export const MotionInput = createMotionComponent('input');
export const MotionTextarea = createMotionComponent('textarea');
export const MotionLabel = createMotionComponent('label');

// SVG motion components
export const MotionSvg = createMotionComponent('svg');
export const MotionPath = createMotionComponent('path');
export const MotionCircle = createMotionComponent('circle');
export const MotionRect = createMotionComponent('rect');
export const MotionLine = createMotionComponent('line');
export const MotionPolygon = createMotionComponent('polygon');
export const MotionPolyline = createMotionComponent('polyline');
export const MotionEllipse = createMotionComponent('ellipse');
export const MotionG = createMotionComponent('g');
export const MotionDefs = createMotionComponent('defs');
export const MotionLinearGradient = createMotionComponent('linearGradient');
export const MotionRadialGradient = createMotionComponent('radialGradient');
export const MotionStop = createMotionComponent('stop');
export const MotionClipPath = createMotionComponent('clipPath');
export const MotionMask = createMotionComponent('mask');

// Set display names
MotionDiv.displayName = 'MotionDiv';
MotionSection.displayName = 'MotionSection';
MotionMain.displayName = 'MotionMain';
MotionFooter.displayName = 'MotionFooter';
MotionHeader.displayName = 'MotionHeader';
MotionNav.displayName = 'MotionNav';
MotionAside.displayName = 'MotionAside';
MotionArticle.displayName = 'MotionArticle';
MotionH1.displayName = 'MotionH1';
MotionH2.displayName = 'MotionH2';
MotionH3.displayName = 'MotionH3';
MotionH4.displayName = 'MotionH4';
MotionH5.displayName = 'MotionH5';
MotionH6.displayName = 'MotionH6';
MotionP.displayName = 'MotionP';
MotionSpan.displayName = 'MotionSpan';
MotionButton.displayName = 'MotionButton';
MotionA.displayName = 'MotionA';
MotionImg.displayName = 'MotionImg';
MotionLi.displayName = 'MotionLi';
MotionUl.displayName = 'MotionUl';
MotionOl.displayName = 'MotionOl';
MotionTr.displayName = 'MotionTr';
MotionTd.displayName = 'MotionTd';
MotionTh.displayName = 'MotionTh';
MotionTable.displayName = 'MotionTable';
MotionForm.displayName = 'MotionForm';
MotionInput.displayName = 'MotionInput';
MotionTextarea.displayName = 'MotionTextarea';
MotionLabel.displayName = 'MotionLabel';
MotionSvg.displayName = 'MotionSvg';
MotionPath.displayName = 'MotionPath';
MotionCircle.displayName = 'MotionCircle';
MotionRect.displayName = 'MotionRect';
MotionLine.displayName = 'MotionLine';
MotionPolygon.displayName = 'MotionPolygon';
MotionPolyline.displayName = 'MotionPolyline';
MotionEllipse.displayName = 'MotionEllipse';
MotionG.displayName = 'MotionG';
MotionDefs.displayName = 'MotionDefs';
MotionLinearGradient.displayName = 'MotionLinearGradient';
MotionRadialGradient.displayName = 'MotionRadialGradient';
MotionStop.displayName = 'MotionStop';
MotionClipPath.displayName = 'MotionClipPath';
MotionMask.displayName = 'MotionMask';

// CSS-only AnimatePresence replacement
export const SafeAnimatePresence: React.FC<{
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
  initial?: boolean;
  exitBeforeEnter?: boolean;
  onExitComplete?: () => void;
}> = ({ children }) => {
  // Simply render children without any animation logic
  return <>{children}</>;
};

// Export default motion object for compatibility
export const motion = {
  div: MotionDiv,
  section: MotionSection,
  main: MotionMain,
  footer: MotionFooter,
  header: MotionHeader,
  nav: MotionNav,
  aside: MotionAside,
  article: MotionArticle,
  h1: MotionH1,
  h2: MotionH2,
  h3: MotionH3,
  h4: MotionH4,
  h5: MotionH5,
  h6: MotionH6,
  p: MotionP,
  span: MotionSpan,
  button: MotionButton,
  a: MotionA,
  img: MotionImg,
  li: MotionLi,
  ul: MotionUl,
  ol: MotionOl,
  tr: MotionTr,
  td: MotionTd,
  th: MotionTh,
  table: MotionTable,
  form: MotionForm,
  input: MotionInput,
  textarea: MotionTextarea,
  label: MotionLabel,
  svg: MotionSvg,
  path: MotionPath,
  circle: MotionCircle,
  rect: MotionRect,
  line: MotionLine,
  polygon: MotionPolygon,
  polyline: MotionPolyline,
  ellipse: MotionEllipse,
  g: MotionG,
  defs: MotionDefs,
  linearGradient: MotionLinearGradient,
  radialGradient: MotionRadialGradient,
  stop: MotionStop,
  clipPath: MotionClipPath,
  mask: MotionMask,
};

// eslint-disable-next-line react-refresh/only-export-components
export default motion;
