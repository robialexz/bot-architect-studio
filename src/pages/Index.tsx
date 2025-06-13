import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Direct imports for stable build
import PipelineCanvas from '@/components/backgrounds/PipelineCanvas';
import HeroSection from '@/components/landing/HeroSection';
import VisualWorkflowBuilder from '@/components/landing/VisualWorkflowBuilder';
import FeaturesSection from '@/components/landing/FeaturesSection';
import RoadmapSection from '@/components/landing/RoadmapSection';
import TokenTierSection from '@/components/landing/TokenTierSection';

// Import new landing page components
import EnhancedWaitlistCTA from '@/components/landing/EnhancedWaitlistCTA';
import VideoShowcaseSection from '@/components/landing/VideoShowcaseSection';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';

const IndexPage: React.FC = () => {
  // Debug logging for Index page
  React.useEffect(() => {
    console.log('🏠 Index page component mounted', {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    // Check if all components are available
    const components = {
      PipelineCanvas,
      HeroSection,
      VideoShowcaseSection,
      VisualWorkflowBuilder,
      TokenTierSection,
      RoadmapSection,
      EnhancedWaitlistCTA,
      FeaturesSection,
    };

    console.log('📦 Component availability check:', components);

    // Monitor for any unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      console.error('🚨 Unhandled error in Index page:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection in Index page:', {
        reason: event.reason,
        promise: event.promise,
      });
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  return (
    <div className="index-page-container relative w-full">
      {/* Pipeline Background - Simple and Clean */}
      <Suspense
        fallback={
          <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-background via-background/95 to-background/90" />
        }
      >
        <PipelineCanvas />
      </Suspense>

      {/* Page Content Sections - Transparent backgrounds to show pipeline */}
      <main className="relative z-10 w-full">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <HeroSection />
        </Suspense>

        {/* Video Showcase Section */}
        <SectionErrorBoundary sectionName="Video Showcase">
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse flex items-center justify-center"><span className="text-muted-foreground">Loading Video Showcase...</span></div>}>
            <VideoShowcaseSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Workflow Builder">
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse flex items-center justify-center"><span className="text-muted-foreground">Loading Workflow Builder...</span></div>}>
            <VisualWorkflowBuilder />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Token Tiers">
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse flex items-center justify-center"><span className="text-muted-foreground">Loading Token Tiers...</span></div>}>
            <TokenTierSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Roadmap">
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse flex items-center justify-center"><span className="text-muted-foreground">Loading Roadmap...</span></div>}>
            <RoadmapSection />
          </Suspense>
        </SectionErrorBoundary>

        {/* Enhanced Waitlist CTA - Improved conversion optimization */}
        <SectionErrorBoundary sectionName="Waitlist CTA">
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse flex items-center justify-center"><span className="text-muted-foreground">Loading Waitlist CTA...</span></div>}>
            <EnhancedWaitlistCTA />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Features">
          <Suspense fallback={<div className="h-96 bg-muted/20 animate-pulse flex items-center justify-center"><span className="text-muted-foreground">Loading Features...</span></div>}>
            <FeaturesSection />
          </Suspense>
        </SectionErrorBoundary>
      </main>
    </div>
  );
};

export default IndexPage;
