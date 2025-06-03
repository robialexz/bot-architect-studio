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

export const LazyVisualWorkflowBuilder = createLazyComponent(
  () => import('@/components/landing/VisualWorkflowBuilder'),
  'Visual Workflow Builder'
);

// Lazy load complex workflow components
export const LazyEnhancedWorkflowBuilder = createLazyComponent(
  () => import('@/components/EnhancedWorkflowBuilder'),
  'Enhanced Workflow Builder'
);

export const LazyWorkflowCanvas = createLazyComponent(
  () => import('@/components/workflow/WorkflowCanvas'),
  'Workflow Canvas'
);

// Lazy load AI components
export const LazyAIAgentTester = createLazyComponent(
  () => import('@/components/AIAgentTester'),
  'AI Agent Tester'
);

export const LazyAIModelConfigWizard = createLazyComponent(
  () => import('@/components/AIModelConfigWizard'),
  'AI Model Config Wizard'
);

export const LazyVoiceCommandsPanel = createLazyComponent(
  () => import('@/components/VoiceCommandsPanel'),
  'Voice Commands Panel'
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
export const LazyFeedbackSystem = createLazyComponent(
  () => import('@/components/FeedbackSystem'),
  'Feedback System'
);

export const LazyOnboardingFlow = createLazyComponent(
  () => import('@/components/OnboardingFlow'),
  'Onboarding Flow'
);

export const LazyWorkflowOnboarding = createLazyComponent(
  () => import('@/components/WorkflowOnboarding'),
  'Workflow Onboarding'
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

// Preload critical components on app start
export const preloadCriticalComponents = () => {
  // Preload components likely to be used soon
  preloadComponent(() => import('@/components/workflow/WorkflowCanvas'));
  preloadComponent(() => import('@/components/EnhancedWorkflowBuilder'));
  // Analytics components will be added when available
};
