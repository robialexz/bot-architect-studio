import React from 'react';
import EnergyNetworkCanvas from '@/components/EnergyNetworkCanvas';

import HeroSection from '@/components/landing/HeroSection';

import VisualWorkflowBuilder from '@/components/landing/VisualWorkflowBuilder';
import FeaturesSection from '@/components/landing/FeaturesSection';
import RoadmapSection from '@/components/landing/RoadmapSection';
import TokenTierSection from '@/components/landing/TokenTierSection';


import ARSection from '@/components/landing/ARSection';
import NexusAssistantUI from '@/components/NexusAssistantUI';

import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

const IndexPage: React.FC = () => {
  const [showAssistant, setShowAssistant] = useState(false);
  return (
    <div className="index-page-container">
      <div className="index-page-background">
        <EnergyNetworkCanvas />
      </div>

      {/* Page Content Sections */}
      <main className="bg-background">
        <HeroSection />



        <VisualWorkflowBuilder />
        <RoadmapSection />
        <ARSection />
        <TokenTierSection />
        <FeaturesSection />
      </main>

      {/* Floating Assistant Button */}
      <Button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        {showAssistant ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Conditional Assistant UI */}
      {showAssistant && <NexusAssistantUI />}
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
