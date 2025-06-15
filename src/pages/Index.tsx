
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Removed
import { PlayCircle } from 'lucide-react'; // Removed Bug, ExternalLink

// CRITICAL: Import components without Framer Motion to avoid React dependency issues
// Direct imports for stable build - NO FRAMER MOTION
import PipelineCanvas from '@/components/backgrounds/PipelineCanvas';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';

// Direct imports - NO LAZY LOADING to avoid Framer Motion issues
import HeroSection from '@/components/landing/HeroSection-NoMotion';
import DetailedRoadmapSection from '@/components/landing/DetailedRoadmapSection';
import TokenomicsSection from '@/components/landing/TokenomicsSection';
import VisualWorkflowBuilder from '@/components/landing/VisualWorkflowBuilder';

// Create simple placeholder components without Framer Motion
const SimpleSection: React.FC<{
  title: string;
  description: string;
  onClick?: () => void;
  isClickable?: boolean;
}> = ({ title, description, onClick, isClickable }) => (
  <section
    className={`py-16 bg-background/50 transition-all duration-500 ease-out group ${isClickable ? 'cursor-pointer hover:bg-background/60' : 'hover:shadow-2xl hover:scale-[1.01]'}`}
    onClick={onClick}
  >
    <div className="container mx-auto px-6 text-center">
      <div className="flex justify-center items-center mb-4 group-hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
          {title}
        </h2>
        {isClickable && (
          <PlayCircle className="ml-3 h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
        )}
      </div>
      <p className="text-muted-foreground max-w-2xl mx-auto group-hover:text-foreground/90 transition-colors duration-300">
        {description}
      </p>
      {isClickable && (
        <p className="mt-4 text-sm text-primary font-semibold group-hover:underline">
          (Click to Launch Interactive Demo)
        </p>
      )}
    </div>
  </section>
);

const EnhancedWaitlistCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      console.log('Waitlist submission:', email);
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
          Join the Revolution
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Don't miss out on the AI automation revolution! Join the FlowsyAI waitlist today for
          exclusive early access, special pre-launch offers, and updates on our development
          progress. Be the first to harness the power of intelligent automation.
        </p>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 items-center p-2 bg-card/50 border border-border rounded-xl shadow-lg backdrop-blur-sm"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-grow px-4 py-3 rounded-lg bg-background/70 border border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full sm:w-auto"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-md hover:shadow-lg"
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <div className="max-w-md mx-auto p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-emerald-400">Thank You!</h3>
            <p className="text-muted-foreground">
              You've been added to the waitlist. We'll keep you updated!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

const IndexPage: React.FC = () => {
  useEffect(() => {
    console.log('🏠 Index page component mounted', {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    const components = {
      PipelineCanvas,
      HeroSection,
      VisualWorkflowBuilder,
      DetailedRoadmapSection,
      TokenomicsSection,
      EnhancedWaitlistCTA,
    };

    console.log('📦 Component availability check:', components);

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
      <PipelineCanvas />
      <main className="relative z-10 w-full">
        <HeroSection />
        <SectionErrorBoundary sectionName="Workflow Builder">
          <VisualWorkflowBuilder />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Tokenomics">
          <TokenomicsSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Roadmap">
          <DetailedRoadmapSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Waitlist CTA">
          <EnhancedWaitlistCTA />
        </SectionErrorBoundary>
      </main>
    </div>
  );
};

export default IndexPage;
