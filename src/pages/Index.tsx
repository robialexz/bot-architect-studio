import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components to reduce initial bundle size
import {
  LazyEnergyNetworkCanvas,
  LazyHeroSection,
  LazyVisualWorkflowBuilder,
  LazyFeaturesSection,
  LazyRoadmapSection,
  LazyTokenTierSection,
  LazyARSection,
  LazyNexusAssistantUI
} from '@/components/lazy/LazyComponents';

// Import new landing page components
import EnhancedWaitlistCTA from '@/components/landing/EnhancedWaitlistCTA';
import LiveMetricsDashboard from '@/components/landing/LiveMetricsDashboard';

import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const IndexPage: React.FC = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  return (
    <div className="index-page-container">
      <div className="index-page-background">
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-background via-background/95 to-background/90" />}>
          <LazyEnergyNetworkCanvas />
        </Suspense>
      </div>

      {/* Page Content Sections */}
      <main className="bg-background">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
          <LazyHeroSection />
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

      {/* Floating Assistant Button */}
      <Button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        {showAssistant ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Conditional Assistant UI - Lazy loaded */}
      {showAssistant && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Loader2 className="h-8 w-8 animate-spin text-white" /></div>}>
          <LazyNexusAssistantUI />
        </Suspense>
      )}
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
