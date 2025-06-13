import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, ExternalLink } from 'lucide-react';

// CRITICAL: Import components without Framer Motion to avoid React dependency issues
// Direct imports for stable build - NO FRAMER MOTION
import PipelineCanvas from '@/components/backgrounds/PipelineCanvas';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';

// Direct imports - NO LAZY LOADING to avoid Framer Motion issues
import HeroSection from '@/components/landing/HeroSection-NoMotion';
import VideoShowcaseSection from '@/components/landing/VideoShowcaseSection-NoMotion';

// Create simple placeholder components without Framer Motion
const SimpleSection: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <section className="py-16 bg-background/50">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  </section>
);

const VisualWorkflowBuilder = () => (
  <SimpleSection
    title="Visual Workflow Builder"
    description="Build powerful AI workflows with our intuitive drag-and-drop interface. Coming soon with advanced automation capabilities."
  />
);

const FeaturesSection = () => (
  <SimpleSection
    title="Advanced Features"
    description="Discover the cutting-edge capabilities that make FlowsyAI the ultimate automation platform for modern businesses."
  />
);

const RoadmapSection = () => (
  <SimpleSection
    title="Development Roadmap"
    description="Follow our journey as we build the future of AI automation. See what's coming next and join our community."
  />
);

const TokenTierSection = () => (
  <SimpleSection
    title="Token Tiers"
    description="Choose the perfect tier for your automation needs. From starter to enterprise, we have options for everyone."
  />
);

const EnhancedWaitlistCTA = () => (
  <SimpleSection
    title="Join the Revolution"
    description="Be among the first to experience the future of AI automation. Join our waitlist and get early access."
  />
);

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDiagnosticButton, setShowDiagnosticButton] = useState(false);

  // Show diagnostic button after 3 seconds to allow page to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDiagnosticButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
      <PipelineCanvas />

      {/* Page Content Sections - Transparent backgrounds to show pipeline */}
      <main className="relative z-10 w-full">
        <HeroSection />

        {/* Video Showcase Section */}
        <SectionErrorBoundary sectionName="Video Showcase">
          <VideoShowcaseSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Workflow Builder">
          <VisualWorkflowBuilder />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Token Tiers">
          <TokenTierSection />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Roadmap">
          <RoadmapSection />
        </SectionErrorBoundary>

        {/* Enhanced Waitlist CTA - Improved conversion optimization */}
        <SectionErrorBoundary sectionName="Waitlist CTA">
          <EnhancedWaitlistCTA />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="Features">
          <FeaturesSection />
        </SectionErrorBoundary>
      </main>

      {/* Diagnostic Button - Appears after page loads */}
      {showDiagnosticButton && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => navigate('/debug')}
            className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-red-500 hover:border-red-400"
            title="Open diagnostic tools to debug deployment issues"
          >
            <Bug className="w-4 h-4 group-hover:animate-pulse" />
            <span className="font-medium">Run Diagnostics</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </button>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
