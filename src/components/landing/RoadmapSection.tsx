import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Rocket, Zap, Brain, Layers, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  timeline: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  features: string[];
  icon: React.ReactNode;
  color: string;
}

const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'website-development',
    title: 'Website Development & Initial Setup',
    description: 'Complete platform foundation and website development with core infrastructure',
    timeline: 'May 2025 - Completed',
    status: 'completed',
    features: [
      'Landing page design and development',
      'Core website infrastructure setup',
      'User interface and experience design',
      'Basic platform architecture planning',
      'Domain setup and hosting configuration',
      'Initial branding and visual identity'
    ],
    icon: <Layers className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'marketing-token-launch',
    title: 'Marketing Campaign & Token Launch',
    description: 'Launch comprehensive marketing strategy and introduce platform cryptocurrency',
    timeline: 'June 2025 - In Progress',
    status: 'in-progress',
    features: [
      'Digital marketing campaign across all channels',
      'FlowsyAI Token launch and distribution',
      'Community building on Discord/Telegram',
      'Influencer partnerships and collaborations',
      'Content creation and video demonstrations',
      'Early access program for beta testers'
    ],
    icon: <Rocket className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'marketing-boost',
    title: 'Marketing Boost & Community Growth',
    description: 'Intensive marketing push and community expansion with strategic partnerships',
    timeline: 'July 2025 - Upcoming',
    status: 'upcoming',
    features: [
      'Scaled advertising campaigns',
      'Strategic partnership announcements',
      'Community events and webinars',
      'Referral program implementation',
      'Social media engagement campaigns',
      'Early adopter incentive programs'
    ],
    icon: <Brain className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-600'
  }
];

const RoadmapSection: React.FC = () => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const scrollToPhase = (phaseId: string) => {
    const element = document.getElementById(`phase-${phaseId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setExpandedPhase(phaseId);
    }
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-gold/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block text-foreground">Development</span>
            <span className="block bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Follow our transparent development journey as we build the world's most advanced AI workflow automation platform.
            Starting with marketing this week and launching our token in June 2025.
          </p>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {roadmapPhases.map((phase) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => scrollToPhase(phase.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  expandedPhase === phase.id
                    ? `bg-gradient-to-r ${phase.color} text-white shadow-lg`
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                {phase.title}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-gold to-sapphire transform md:-translate-x-0.5" />

            {/* Roadmap Phases */}
            <div className="space-y-12">
              {roadmapPhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  id={`phase-${phase.id}`}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 transform -translate-x-2 md:-translate-x-2 z-10">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${phase.color} border-4 border-background shadow-lg`} />
                    {phase.status === 'completed' && (
                      <CheckCircle className="absolute -top-1 -left-1 w-6 h-6 text-emerald-500" />
                    )}
                    {phase.status === 'in-progress' && (
                      <Clock className="absolute -top-1 -left-1 w-6 h-6 text-blue-500 animate-pulse" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <motion.div
                      className="premium-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                      onClick={() => togglePhase(phase.id)}
                      onHoverStart={() => setHoveredPhase(phase.id)}
                      onHoverEnd={() => setHoveredPhase(null)}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${phase.color} text-white`}>
                          {phase.icon}
                          <span className="capitalize">{phase.status.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {phase.timeline}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                          {phase.title}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedPhase === phase.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {expandedPhase === phase.id ? (
                            <ChevronUp className="w-5 h-5 text-primary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </motion.div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {phase.description}
                      </p>

                      {/* Progress Bar for Completed/In-Progress */}
                      {(phase.status === 'completed' || phase.status === 'in-progress') && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary font-medium">
                              {phase.status === 'completed' ? '100%' : '75%'}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full bg-gradient-to-r ${phase.color}`}
                              initial={{ width: 0 }}
                              whileInView={{
                                width: phase.status === 'completed' ? '100%' : '75%'
                              }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, delay: index * 0.2 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Features List - Expandable */}
                      <AnimatePresence>
                        {(expandedPhase === phase.id || hoveredPhase === phase.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2 overflow-hidden"
                          >
                            <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">Key Features</h4>
                            <ul className="space-y-2">
                              {phase.features.map((feature, featureIndex) => (
                                <motion.li
                                  key={featureIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: featureIndex * 0.1 }}
                                  className="flex items-center gap-3 text-sm text-muted-foreground p-2 rounded-lg hover:bg-primary/5 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Click to expand hint */}
                      {expandedPhase !== phase.id && hoveredPhase !== phase.id && (
                        <div className="text-xs text-muted-foreground/60 mt-2 text-center">
                          Click to view details
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="premium-card p-8 rounded-2xl max-w-3xl mx-auto border border-primary/20">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
              Join Our Community
            </h3>
            <p className="text-muted-foreground mb-6">
              We're starting our marketing campaign this week! Sign up for early access and be among the first
              to experience our revolutionary AI workflow automation platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Website - Completed</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                <span>Marketing - In Progress</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span>Token Launch - July 2025</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-primary font-medium">
                🚀 Early adopters will receive exclusive FlowsyAI tokens and priority access!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RoadmapSection;
