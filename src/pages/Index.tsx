import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components to reduce initial bundle size
import {
  LazyPipelineCanvas,
  LazyHeroSection,
  LazyVisualWorkflowBuilder,
  LazyFeaturesSection,
  LazyRoadmapSection,
  LazyTokenTierSection,
  LazyARSection,
} from '@/components/lazy/LazyComponents';

// Import new landing page components
import EnhancedWaitlistCTA from '@/components/landing/EnhancedWaitlistCTA';
import LiveMetricsDashboard from '@/components/landing/LiveMetricsDashboard';
import VideoShowcaseSection from '@/components/landing/VideoShowcaseSection';

const IndexPage: React.FC = () => {
  return (
    <div className="index-page-container relative">
      {/* Pipeline Background - Fixed across entire page */}
      <Suspense
        fallback={
          <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-background via-background/95 to-background/90" />
        }
      >
        <LazyPipelineCanvas />
      </Suspense>

      {/* Page Content Sections - Transparent backgrounds to show pipeline */}
      <main className="relative z-10">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <LazyHeroSection />
        </Suspense>

        {/* Video Showcase Section */}
        <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <VideoShowcaseSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <LazyVisualWorkflowBuilder />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <LazyTokenTierSection />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <LazyRoadmapSection />
        </Suspense>

        {/* Live Metrics Dashboard - Repositioned lower and made smaller */}
        <Suspense fallback={<div className="h-64 bg-muted/20 animate-pulse" />}>
          <LiveMetricsDashboard />
        </Suspense>

        {/* Enhanced Waitlist CTA - Improved conversion optimization */}
        <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <EnhancedWaitlistCTA />
        </Suspense>

        <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse" />}>
          <LazyFeaturesSection />
        </Suspense>
      </main>

      {/*
        The existing H1, P, and Button elements that were directly here for the hero
        are now encapsulated within the HeroSection component.
        The design doc (landing_page_design_concept.md, Section VII.B.1) specifies:
        "The main page container (e.g., in Index.tsx) will be allowed to scroll naturally.
        The overflow: 'hidden' and height: '100vh' styles will be removed or adjusted."
        "The EnergyNetworkCanvas component will be styled with position: fixed, top: 0, left: 0,
        width: 100vw, height: 100vh, and z-index: -1"
      */}
    </div>
  );
};

export default IndexPage;
