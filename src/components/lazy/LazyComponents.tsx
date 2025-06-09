import { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component for heavy components
const ComponentLoader = ({ name }: { name: string }) => (
  <div className="min-h-[400px] flex items-center justify-center bg-background/50 rounded-lg border border-border">
    <div className="text-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-sm text-muted-foreground">Loading {name}...</p>
    </div>
  </div>
);

// Error boundary for lazy components
const LazyErrorBoundary = ({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// HOC for creating lazy components with proper error handling
export const createLazyComponent = <T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) => {
  const LazyComponent = lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <LazyErrorBoundary fallback={<ComponentLoader name={componentName} />}>
      <LazyComponent {...props} />
    </LazyErrorBoundary>
  );
};

// Lazy load heavy components
export const LazyEnergyNetworkCanvas = createLazyComponent(
  () => import('@/components/EnergyNetworkCanvas'),
  'Energy Network'
);

// LazyPipelineCanvas removed - now imported statically in Index.tsx

export const LazyNexusCrystal = createLazyComponent(
  () => import('@/components/NexusCrystal'),
  'Nexus Crystal'
);

// Note: Analytics components will be added when the analytics directory is created

// Lazy load particle systems
export const LazyParticleBackground = createLazyComponent(
  () => import('@/components/landing/ParticleBackground'),
  'Particle Background'
);

// LazyVisualWorkflowBuilder removed - now imported statically in Index.tsx

// Lazy load complex workflow components (only those not statically imported)
export const LazyWorkflowCanvas = createLazyComponent(
  () => import('@/components/workflow/WorkflowCanvas'),
  'Workflow Canvas'
);

// Note: EnhancedWorkflowBuilder, AIModelConfigWizard, VoiceCommandsPanel, WorkflowOnboarding
// are now imported statically in WorkflowBuilder.tsx for better performance

// Lazy load AI components
export const LazyAIAgentTester = createLazyComponent(
  () => import('@/components/AIAgentTester'),
  'AI Agent Tester'
);

// Lazy load complex forms and modals
export const LazyCreateAgentModal = createLazyComponent(
  () => import('@/components/CreateAgentModal'),
  'Create Agent Modal'
);

export const LazyAIAgentModal = createLazyComponent(
  () => import('@/components/AIAgentModal'),
  'AI Agent Modal'
);

// Lazy load dashboard components
export const LazyDashboardSkeleton = createLazyComponent(
  () => import('@/components/DashboardSkeleton'),
  'Dashboard Skeleton'
);

export const LazyAchievementSystem = createLazyComponent(
  () => import('@/components/AchievementSystem'),
  'Achievement System'
);

export const LazyDailyChallenges = createLazyComponent(
  () => import('@/components/DailyChallenges'),
  'Daily Challenges'
);

export const LazyTokenManager = createLazyComponent(
  () => import('@/components/TokenManager'),
  'Token Manager'
);

// Lazy load feedback and onboarding
export const LazyOnboardingFlow = createLazyComponent(
  () => import('@/components/OnboardingFlow'),
  'Onboarding Flow'
);

// Lazy load crypto and token components
export const LazySolanaTokenWidget = createLazyComponent(
  () => import('@/components/crypto/SolanaTokenWidget'),
  'Solana Token Widget'
);

export const LazyTokenBanner = createLazyComponent(
  () => import('@/components/crypto/TokenBanner'),
  'Token Banner'
);

export const LazyInteractiveTokenDemo = createLazyComponent(
  () => import('@/components/crypto/InteractiveTokenDemo'),
  'Interactive Token Demo'
);

// Lazy load 3D and visualization components (largest contributors to bundle size)
export const LazyNexusAssistantUI = createLazyComponent(
  () => import('@/components/NexusAssistantUI'),
  'Nexus Assistant UI'
);

// These components are already exported above, removing duplicates

// Lazy load chart and analytics components
export const LazyAreaChart = createLazyComponent(
  () => import('recharts').then(module => ({ default: module.AreaChart })),
  'Area Chart'
);

// Note: Landing page sections (HeroSection, FeaturesSection, RoadmapSection, TokenTierSection)
// are now imported statically in their respective pages for better performance

// Note: Complex page components (AIEcosystemPlayground, WorkflowMarketplace, Documentation, PlatformShowcase)
// are now imported statically in App.tsx for better routing performance

export const LazyARSection = createLazyComponent(
  () => import('@/components/landing/ARSection'),
  'AR Section'
);

// Lazy load complex page components that are not in main routes
export const LazyWorkflowStudio = createLazyComponent(
  () => import('@/pages/WorkflowStudio'),
  'Workflow Studio'
);

// Utility function to preload components
export const preloadComponent = (importFn: () => Promise<{ default: ComponentType<unknown> }>) => {
  // Preload on idle or user interaction
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFn());
  } else {
    setTimeout(() => importFn(), 100);
  }
};

// Preload components based on user behavior
export const preloadOnHover = (importFn: () => Promise<{ default: ComponentType<unknown> }>) => {
  let isPreloaded = false;
  return () => {
    if (!isPreloaded) {
      isPreloaded = true;
      preloadComponent(importFn);
    }
  };
};

// Preload critical components on app start
export const preloadCriticalComponents = () => {
  // Preload components likely to be used soon
  preloadComponent(() => import('@/components/workflow/WorkflowCanvas'));

  // Preload token components for landing page
  preloadComponent(() => import('@/components/crypto/TokenBanner'));

  // Note: Most components are now loaded statically for better performance
};

// Preload components for specific routes
export const preloadRouteComponents = (route: string) => {
  switch (route) {
    case '/studio':
      preloadComponent(() => import('@/pages/WorkflowStudio'));
      preloadComponent(() => import('@/components/workflow/WorkflowCanvas'));
      break;
    case '/playground':
      preloadComponent(() => import('@/components/NexusCrystal'));
      preloadComponent(() => import('@/components/EnergyNetworkCanvas'));
      break;
    default:
      // Preload common components
      preloadCriticalComponents();
  }
};

// Preload components when user shows intent (hover, focus, etc.)
export const createPreloadTrigger = (
  importFn: () => Promise<{ default: ComponentType<unknown> }>
) => {
  let isPreloaded = false;

  const preload = () => {
    if (!isPreloaded) {
      isPreloaded = true;
      preloadComponent(importFn);
    }
  };

  return {
    onMouseEnter: preload,
    onFocus: preload,
    onTouchStart: preload,
  };
};
