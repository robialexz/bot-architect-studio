import React from 'react';
import {
  ArrowRight,
  Play,
  Github,
  Star,
  TrendingUp,
  Users,
  MessageCircle,
  ExternalLink,
  Zap,
  Target,
  Rocket,
  Shield,
  CheckCircle,
  Clock,
  Calendar,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { useDesignSystem } from '@/hooks/useDesignSystem';
import { MotionDiv } from '@/lib/motion-wrapper';
import AdvancedLandingBackground from './AdvancedLandingBackground';

const N8NStyleHero: React.FC = () => {
  const { getGlassCardClasses } = useDesignSystem();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Advanced Interactive Background */}
      <AdvancedLandingBackground />

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        {/* Hero Content */}
        <div className="max-w-6xl mx-auto">
          {/* Main Headline */}
          <MotionDiv
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">The Future of</span>
              <br />
              <span className="bg-gradient-to-r from-ai-emerald via-ai-electric to-ai-cyber bg-clip-text text-transparent">
                AI Workflow Automation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              Join the revolution in intelligent automation. FlowsyAI empowers technical teams to
              build, deploy, and scale AI-powered workflows with unprecedented ease and flexibility.
            </p>

            {/* Token Purchase CTA - Primary Focus */}
            <MotionDiv
              className="mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="text-sm text-muted-foreground mb-2">
                  🚀 <span className="font-semibold text-ai-emerald">$FlowAI Token Now Live!</span>{' '}
                  Join 1,265+ Community Members
                </div>

                <GlassButton
                  variant="glass-primary"
                  size="xl"
                  icon={<TrendingUp className="w-6 h-6" />}
                  iconPosition="left"
                  gradient="accent"
                  glow
                  className="text-xl px-12 py-6 animate-pulse hover:animate-none transform hover:scale-105 transition-all duration-300"
                  onClick={() =>
                    window.open(
                      'https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump',
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                >
                  Buy $FlowAI Token
                  <ArrowRight className="w-6 h-6 ml-2" />
                </GlassButton>

                <div className="text-xs text-muted-foreground">
                  Contract: GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump
                </div>
              </div>
            </MotionDiv>

            {/* Community CTAs */}
            <MotionDiv
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlassButton
                variant="glass-secondary"
                size="lg"
                icon={<MessageCircle className="w-5 h-5" />}
                iconPosition="left"
                gradient="secondary"
                className="min-w-[180px] hover:scale-105 transition-transform duration-300"
                onClick={() =>
                  window.open('https://t.me/+jNmtj8qUUtMxOTVk', '_blank', 'noopener,noreferrer')
                }
              >
                Join Telegram
                <ExternalLink className="w-4 h-4 ml-2" />
              </GlassButton>

              <GlassButton
                variant="glass-secondary"
                size="lg"
                icon={<Users className="w-5 h-5" />}
                iconPosition="left"
                gradient="primary"
                className="min-w-[180px] hover:scale-105 transition-transform duration-300"
                onClick={() =>
                  window.open('https://x.com/FlowsyAI', '_blank', 'noopener,noreferrer')
                }
              >
                Follow on X
                <ExternalLink className="w-4 h-4 ml-2" />
              </GlassButton>

              <GlassButton
                variant="glass"
                size="lg"
                icon={<Play className="w-5 h-5" />}
                iconPosition="left"
                className="min-w-[180px] hover:scale-105 transition-transform duration-300"
                onClick={() => window.open('/platform-showcase', '_self')}
              >
                Watch Demo
              </GlassButton>
            </MotionDiv>

            {/* Value Propositions */}
            <MotionDiv
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <GlassCard
                variant="subtle"
                size="md"
                className="text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-ai-emerald to-ai-mint rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy AI workflows in minutes, not hours. Our drag-and-drop interface makes
                  automation accessible to everyone.
                </p>
              </GlassCard>

              <GlassCard
                variant="subtle"
                size="md"
                className="text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-ai-electric to-ai-cyber rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Precision Control</h3>
                <p className="text-sm text-muted-foreground">
                  Fine-tune every aspect of your AI agents with code-level precision or visual
                  simplicity.
                </p>
              </GlassCard>

              <GlassCard
                variant="subtle"
                size="md"
                className="text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-ai-plasma to-ai-neon rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Scale Infinitely</h3>
                <p className="text-sm text-muted-foreground">
                  From startup to enterprise, FlowsyAI grows with your needs and handles any
                  workload.
                </p>
              </GlassCard>
            </MotionDiv>
          </MotionDiv>

          {/* Community & Transparency Section */}
          <MotionDiv
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <GlassCard
              variant="strong"
              size="xl"
              className="relative overflow-hidden border-2 border-primary/20"
            >
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    Community & Transparency
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Built with transparency and community at our core. Every milestone, every
                    decision, every line of code is open for the community to see.
                  </p>
                </div>

                {/* Real Community Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <MotionDiv
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-ai-electric to-ai-cyber rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">1,265+</div>
                    <p className="text-sm text-muted-foreground mb-3">Active Community Members</p>
                    <GlassButton
                      variant="glass-secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open('https://t.me/+jNmtj8qUUtMxOTVk', '_blank')}
                    >
                      Join Telegram
                    </GlassButton>
                  </MotionDiv>

                  <MotionDiv
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-ai-emerald to-ai-mint rounded-full mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">$FlowAI</div>
                    <p className="text-sm text-muted-foreground mb-3">Live Token on Solana</p>
                    <GlassButton
                      variant="glass-primary"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          'https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump',
                          '_blank'
                        )
                      }
                    >
                      View Chart
                    </GlassButton>
                  </MotionDiv>

                  <MotionDiv
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-ai-plasma to-ai-neon rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-2">100%</div>
                    <p className="text-sm text-muted-foreground mb-3">Transparent & Locked</p>
                    <GlassButton
                      variant="glass"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        window.open(
                          'https://app.streamflow.finance/contract/solana/mainnet/CfECHu7EJahWe7QuxgyrSJNPB6YgBww79G9o2wMehQBK',
                          '_blank'
                        )
                      }
                    >
                      View Contract
                    </GlassButton>
                  </MotionDiv>
                </div>

                {/* Development Milestones */}
                <div className="border-t border-border/50 pt-6">
                  <h4 className="text-lg font-semibold mb-4 text-foreground text-center">
                    Recent Development Milestones
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Token Launch Completed</div>
                        <div className="text-sm text-muted-foreground">
                          Successfully launched $FlowAI on Solana with full transparency
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">June 2025</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Community Growth</div>
                        <div className="text-sm text-muted-foreground">
                          Reached 1,265+ active community members across platforms
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Ongoing</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                      <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Platform Development</div>
                        <div className="text-sm text-muted-foreground">
                          Core workflow builder and AI agent system in active development
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">In Progress</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50">
                      <Calendar className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">Beta Release Planned</div>
                        <div className="text-sm text-muted-foreground">
                          Public beta testing for core platform features
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Q3 2025</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </MotionDiv>

          {/* Final CTA Section */}
          <MotionDiv
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <GlassCard variant="accent" size="lg" gradient="primary" className="max-w-4xl mx-auto">
              <div className="text-center p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join our growing community of 1,265+ members building the future of AI automation.
                  Get your $FlowAI tokens and be part of the revolution.
                </p>

                {/* Dual CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <GlassButton
                    variant="glass-primary"
                    size="xl"
                    icon={<TrendingUp className="w-6 h-6" />}
                    iconPosition="left"
                    gradient="accent"
                    glow
                    className="text-xl px-12 py-6 min-w-[250px] animate-pulse hover:animate-none"
                    onClick={() =>
                      window.open(
                        'https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump',
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  >
                    Buy $FlowAI Now
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </GlassButton>

                  <GlassButton
                    variant="glass-secondary"
                    size="xl"
                    icon={<MessageCircle className="w-6 h-6" />}
                    iconPosition="left"
                    gradient="secondary"
                    className="text-xl px-12 py-6 min-w-[250px]"
                    onClick={() =>
                      window.open('https://t.me/+jNmtj8qUUtMxOTVk', '_blank', 'noopener,noreferrer')
                    }
                  >
                    Join Community
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </GlassButton>
                </div>

                {/* Real Trust Indicators */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Live on Solana</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span>1,265+ Community Members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span>100% Transparent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      <span>Active Development</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default N8NStyleHero;
