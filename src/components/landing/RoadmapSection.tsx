'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  Rocket, 
  TrendingUp,
  Brain,
  Building,
  Globe
} from 'lucide-react';

const MotionDiv = motion.div;

interface RoadmapSectionProps {
  compact?: boolean;
}

// Simplified roadmap data
const roadmapPhases = [
  {
    id: 'aggressive-marketing',
    title: 'Aggressive Marketing',
    subtitle: 'High-Impact Launch Campaign',
    description: 'Launch comprehensive marketing campaign across all channels to build massive awareness and drive early adoption.',
    icon: '🚀',
    status: 'critical' as const,
    priority: 'high' as const,
    progress: 85,
    investment: '$50,000',
    expectedROI: '500%+',
    duration: '90 days',
    timeline: 'September - November 2025',
    color: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-500/20 to-orange-500/20'
  },
  {
    id: 'platform-beta',
    title: 'Platform Beta Launch',
    subtitle: 'Beta Release & Testing',
    description: 'Launch beta version of the AI platform to our community, gather feedback and iterate rapidly based on user input.',
    icon: '🧠',
    status: 'in-progress' as const,
    priority: 'high' as const,
    progress: 65,
    investment: '$75,000',
    expectedROI: '300%+',
    duration: '90 days',
    timeline: 'December 2025 - February 2026',
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: 'growth-monetization',
    title: 'Growth & Monetization',
    subtitle: 'Sustainable Business',
    description: 'Scale platform to 5K+ users, implement basic subscription model, and achieve initial revenue streams.',
    icon: '📈',
    status: 'upcoming' as const,
    priority: 'medium' as const,
    progress: 0,
    investment: '$75,000',
    expectedROI: '400%+',
    duration: '6 months',
    timeline: 'March - August 2026',
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    id: 'enterprise-expansion',
    title: 'Enterprise Expansion',
    subtitle: 'B2B Market Entry',
    description: 'Expand into enterprise market with advanced features, custom integrations, and dedicated support.',
    icon: '🏢',
    status: 'upcoming' as const,
    priority: 'medium' as const,
    progress: 0,
    investment: '$100,000',
    expectedROI: '600%+',
    duration: '6 months',
    timeline: 'September 2026 - February 2027',
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    id: 'global-domination',
    title: 'Global Domination',
    subtitle: 'Market Leadership',
    description: 'Achieve market leadership position with global expansion, strategic acquisitions, and IPO preparation.',
    icon: '🌍',
    status: 'upcoming' as const,
    priority: 'low' as const,
    progress: 0,
    investment: '$200,000',
    expectedROI: '1000%+',
    duration: '12 months',
    timeline: 'March 2027 - February 2028',
    color: 'from-gold to-yellow-500',
    bgGradient: 'from-gold/20 to-yellow-500/20'
  }
];

const RoadmapSection: React.FC<RoadmapSectionProps> = ({ compact = false }) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('aggressive-marketing');
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const getTotalInvestment = () => {
    return roadmapPhases.reduce((total, phase) => {
      const investment = parseInt(phase.investment.replace(/[$,]/g, ''));
      return total + investment;
    }, 0);
  };

  return (
    <section className={`${compact ? 'py-8 md:py-12' : 'py-20 md:py-32'} relative overflow-hidden`}>
      <MotionDiv
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <MotionDiv
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="block text-foreground">FlowsyAI</span>
              <span className="block bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
                Launch Strategy
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              Our aggressive go-to-market strategy with{' '}
              <span className="text-primary font-semibold">
                ${getTotalInvestment().toLocaleString()}
              </span>{' '}
              total investment to achieve{' '}
              <span className="text-gold font-semibold">$10M+ valuation</span> and become the leading
              AI workflow automation platform.
            </p>
          </MotionDiv>

          {/* Roadmap Cards Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {roadmapPhases.map((phase, index) => (
                <MotionDiv
                  key={phase.id}
                  initial={{
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="group"
                >
                  <MotionDiv
                    className={`relative h-80 rounded-3xl premium-card p-6 cursor-pointer overflow-hidden ${
                      expandedPhase === phase.id
                        ? `bg-gradient-to-br ${phase.bgGradient} border-2 border-primary/50`
                        : 'bg-background/80 backdrop-blur-xl border border-border/30'
                    }`}
                    onClick={() => togglePhase(phase.id)}
                    onHoverStart={() => setHoveredPhase(phase.id)}
                    onHoverEnd={() => setHoveredPhase(null)}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background Gradient Animation */}
                    <MotionDiv
                      className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <MotionDiv
                        className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${phase.color} text-white shadow-lg`}
                        animate={
                          phase.status === 'in-progress' || phase.status === 'critical'
                            ? { scale: [1, 1.1, 1] }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      >
                        {phase.status === 'critical' && '🔥 CRITICAL'}
                        {phase.status === 'in-progress' && '⚡ ACTIVE'}
                        {phase.status === 'upcoming' && '⭐ UPCOMING'}
                        {phase.status === 'completed' && '✅ DONE'}
                      </MotionDiv>
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Phase Icon & Title */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-5xl">{phase.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                              {phase.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-bold text-primary">{phase.progress}%</span>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2">
                          <MotionDiv
                            className={`h-2 rounded-full bg-gradient-to-r ${phase.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${phase.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {phase.description}
                      </p>

                      {/* Investment & Timeline */}
                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-muted-foreground">Investment</div>
                            <div className="text-lg font-bold text-gold">{phase.investment}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Duration</div>
                            <div className="text-sm font-semibold">{phase.duration}</div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Timeline</div>
                          <div className="text-sm font-medium text-primary">{phase.timeline}</div>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Expected ROI</div>
                          <div className="text-sm font-bold text-emerald-400">{phase.expectedROI}</div>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>
                </MotionDiv>
              ))}
            </div>

            {/* Central Hub with Rotating Rings */}
            <div className="relative flex items-center justify-center mb-20">
              <MotionDiv
                className="absolute w-96 h-96 rounded-full border-2 border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
              <MotionDiv
                className="absolute w-80 h-80 rounded-full border border-gold/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              />
              <MotionDiv
                className="absolute w-64 h-64 rounded-full border border-emerald-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Central Core */}
              <MotionDiv
                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary via-gold to-emerald-500 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 30px rgba(59, 130, 246, 0.5)',
                    '0 0 60px rgba(255, 215, 0, 0.7)',
                    '0 0 30px rgba(59, 130, 246, 0.5)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="w-24 h-24 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                  <Rocket className="w-12 h-12 text-white" />
                </div>
              </MotionDiv>
            </div>
          </div>


        </div>
      </MotionDiv>
    </section>
  );
};

export default RoadmapSection;
