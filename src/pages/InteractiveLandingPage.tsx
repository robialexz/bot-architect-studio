import React from 'react';
import HeroSection3D from '@/components/landing/HeroSection3D';
import EnhancedFeaturesSection from '@/components/landing/EnhancedFeaturesSection';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import AnimatedCTA from '@/components/landing/AnimatedCTA';
import { LazyRoadmapSection, LazyTokenTierSection } from '@/components/lazy/LazyComponents';
import ComingSoonModal from '@/components/ui/ComingSoonModal';
import { useComingSoon } from '@/hooks/useComingSoon';

const InteractiveLandingPage: React.FC = () => {
  const { isModalOpen, modalConfig, hideComingSoon, comingSoonHandlers } = useComingSoon();

  return (
    <div className="page-wrapper bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <HeroSection3D />

      {/* Features Section */}
      <EnhancedFeaturesSection />

      {/* Interactive Demo Section */}
      <InteractiveDemo />

      {/* Development Roadmap Section */}
      <LazyRoadmapSection />

      {/* Token-Based Tier System */}
      <LazyTokenTierSection />

      {/* Testimonials Section - Placeholder for now */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="block">What Our Clients</span>
              <span className="premium-gradient-text">Are Saying</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how our platform is transforming businesses across industries.
            </p>
          </div>

          {/* Testimonial cards would go here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  <div>
                    <h4 className="font-medium">Client Name</h4>
                    <p className="text-sm text-muted-foreground">Position, Company</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Maecenas
                  vel magna vel nisi efficitur rhoncus in vel nibh."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Placeholder for now */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="block">Flexible</span>
              <span className="premium-gradient-text">Pricing Options</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that best fits your business needs and scale as you grow.
            </p>
          </div>

          {/* Pricing cards would go here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {['Starter', 'Professional', 'Enterprise'].map((tier, i) => (
              <div
                key={tier}
                className={`bg-card/50 backdrop-blur-sm border ${
                  i === 1 ? 'border-gold/30 ring-2 ring-gold/20' : 'border-border'
                } rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl relative ${
                  i === 1 ? 'md:-mt-4 md:mb-4' : ''
                }`}
              >
                {i === 1 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-background text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{tier}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">
                    ${i === 0 ? '49' : i === 1 ? '99' : '249'}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-sm">Feature {j + 1}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`w-full py-2 rounded-lg font-medium ${
                    i === 1
                      ? 'bg-gradient-to-r from-gold to-primary text-background'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => comingSoonHandlers.trial()}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedCTA />

      {/* FAQ Section - Placeholder for now */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="block">Frequently Asked</span>
              <span className="premium-gradient-text">Questions</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about our platform.
            </p>
          </div>

          {/* FAQ accordion would go here */}
          <div className="max-w-3xl mx-auto space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  className="flex justify-between items-center w-full p-4 text-left"
                >
                  <span className="font-medium">Question {i + 1}?</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="px-4 pb-4 hidden">
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
                    Maecenas vel magna vel nisi efficitur rhoncus in vel nibh.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={hideComingSoon}
        feature={modalConfig.feature}
        expectedDate={modalConfig.expectedDate}
        description={modalConfig.description}
      />
    </div>
  );
};

export default InteractiveLandingPage;
