import React, { useState, useEffect, useRef } from 'react';
import {
  MotionDiv,
  MotionSection,
  MotionH1,
  MotionH2,
  MotionP,
  MotionButton,
  MotionLi,
  MotionTr,
  MotionAside,
} from '@/lib/motion-wrapper';

import {
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Rocket,
  Target,
  Users,
  Code,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Crown,
  PlayCircle,
  GitCommit,
  Package,
  Layers,
  Settings,
  Database,
  Brain,
  Bot,
  Workflow as WorkflowIcon,
  DollarSign,
  Euro,
  Coins,
  TrendingDown,
  Activity,
  Award,
  Flame,
  Lightning,
  Megaphone,
  Building,
  Briefcase,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  MapPin,
  Timer,
  Gauge,
  Banknote,
  CreditCard,
  Wallet,
  PiggyBank,
  LineChart,
  BarChart,
  PieChart,
  Presentation,
  Handshake,
  Network,
  Satellite,
  Orbit,
  Atom,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { useNavigate } from 'react-router-dom';

// Animation variants for the dynamic roadmap
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.05 },
};

const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const timelineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const milestoneVariants = {
  hidden: { opacity: 0, x: -100, scale: 0.8 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePhase, setActivePhase] = useState(1); // Current phase: Marketing boost
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Update current time every second for dynamic feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setAnimationTrigger(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Roadmap phases with specific timeline and budget information
  const roadmapPhases = [
    {
      id: 'phase-0',
      title: 'Foundation Development',
      period: 'February 2025',
      status: 'completed',
      budget: '€5,000',
      budgetIcon: Euro,
      progress: 100,
      description: 'Complete website development and infrastructure setup',
      achievements: [
        'Production-ready website launched',
        'Modern UI/UX implementation',
        'Backend infrastructure setup',
        'Security protocols implemented',
        'Performance optimization completed'
      ],
      icon: Code,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      glowColor: 'shadow-green-500/20',
    },
    {
      id: 'phase-1',
      title: 'Token Launch & Marketing Boost',
      period: 'June 2025 - Present',
      status: 'in-progress',
      budget: '€5,000',
      budgetIcon: Euro,
      progress: 85,
      description: 'Token launch completion and aggressive marketing campaign',
      achievements: [
        'AIF Token successfully launched',
        'Multi-channel marketing campaign active',
        'Community building initiatives',
        'Influencer partnerships established',
        'Social media presence expansion'
      ],
      currentFocus: [
        'Expanding community reach',
        'Strategic partnerships',
        'Content marketing campaigns',
        'User acquisition optimization'
      ],
      icon: Rocket,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-500/20',
    },
    {
      id: 'phase-2',
      title: 'Major Expansion Phase',
      period: 'Post-Token Migration',
      status: 'planned',
      budget: '€40,000',
      budgetIcon: Euro,
      progress: 0,
      description: 'Massive community building and marketing boost with substantial investment',
      plannedInitiatives: [
        'Large-scale marketing campaigns',
        'Global community expansion',
        'Strategic partnerships & collaborations',
        'Platform development acceleration',
        'Enterprise client acquisition',
        'Advanced AI features development',
        'International market expansion',
        'Professional team scaling'
      ],
      icon: Crown,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      glowColor: 'shadow-purple-500/20',
    },
    {
      id: 'phase-3',
      title: 'Platform Revolution',
      period: '2026 & Beyond',
      status: 'future',
      budget: 'TBD',
      budgetIcon: Infinity,
      progress: 0,
      description: 'Full AI automation platform launch and market domination',
      visionPoints: [
        'Complete AI workflow platform',
        'Enterprise-grade solutions',
        'Global market leadership',
        'Advanced AI agent ecosystem',
        'Revolutionary automation tools',
        'Industry partnerships',
        'IPO preparation',
        'Worldwide expansion'
      ],
      icon: Sparkles,
      color: 'from-gold to-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      glowColor: 'shadow-yellow-500/20',
    },
  ];

  // Investment and financial milestones
  const investmentMilestones = [
    {
      phase: 'Foundation',
      amount: '€5,000',
      period: 'February 2025',
      status: 'completed',
      description: 'Website development and infrastructure',
      roi: 'Platform launched successfully',
      icon: Code,
      color: 'text-green-500',
    },
    {
      phase: 'Marketing Boost',
      amount: '€5,000',
      period: 'June 2025 - Present',
      status: 'active',
      description: 'Token launch and marketing campaigns',
      roi: 'Community growth and token success',
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      phase: 'Major Expansion',
      amount: '€40,000',
      period: 'Post-Token Migration',
      status: 'planned',
      description: 'Massive community building and platform development',
      roi: 'Market leadership and platform dominance',
      icon: Crown,
      color: 'text-purple-500',
    },
  ];

  // Key metrics and achievements
  const currentMetrics = {
    totalInvestment: '€50,000+',
    communitySize: '1,265+',
    platformStatus: 'Live & Growing',
    tokenStatus: 'Successfully Launched',
    nextMilestone: 'Major Expansion Phase',
    timeToExpansion: 'Imminent',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sapphire/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-sapphire/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <MotionDiv
        className="relative z-10 container mx-auto px-4 py-8 md:py-16"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.6 }}
      >
        {/* Dynamic Hero Section */}
        <MotionSection
          className="text-center mb-16 md:mb-24"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="relative">
            <Badge className="mb-6 bg-gradient-to-r from-primary via-sapphire to-gold text-background text-lg px-6 py-2 animate-pulse">
              <Rocket className="w-5 h-5 mr-2" />
              🚀 AMBITIOUS ROADMAP TO SUCCESS
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-sapphire to-gold bg-clip-text text-transparent leading-tight">
              FlowsyAI
              <br />
              <span className="text-3xl sm:text-4xl lg:text-6xl">Journey to Dominance</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              From <span className="text-primary font-semibold">€5,000 foundation</span> to <span className="text-gold font-semibold">€40,000+ expansion</span> -
              witness our ambitious journey to revolutionize AI automation
            </p>

            {/* Live Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 max-w-6xl mx-auto">
              {Object.entries(currentMetrics).map(([key, value], index) => (
                <MotionDiv
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card/80 backdrop-blur-lg border border-border-alt rounded-lg p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-primary mb-1">{value}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </MotionDiv>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/waitlist')}
                className="bg-gradient-to-r from-primary to-sapphire text-background hover:shadow-xl hover:shadow-primary/30 text-lg px-8 py-4 animate-pulse"
              >
                <Crown className="mr-2 h-5 w-5" />
                Join the Revolution
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open('https://t.me/your_telegram', '_blank')}
                className="border-primary/30 hover:border-primary/60 text-lg px-8 py-4"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Community (1,265+)
              </Button>
            </div>
          </div>
        </MotionSection>

        {/* Investment Timeline */}
        <MotionSection
          className="mb-16 md:mb-24"
          variants={timelineVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
              💰 Investment & Growth Timeline
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Strategic investments driving our ambitious expansion from startup to market leader
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {investmentMilestones.map((milestone, index) => (
              <MotionDiv
                key={milestone.phase}
                variants={milestoneVariants}
                className="relative"
              >
                <GlassCard className={`premium-card bg-card/80 backdrop-blur-lg border-2 ${
                  milestone.status === 'completed' ? 'border-green-500/30 shadow-green-500/20' :
                  milestone.status === 'active' ? 'border-blue-500/30 shadow-blue-500/20 animate-pulse' :
                  'border-purple-500/30 shadow-purple-500/20'
                } shadow-2xl p-8 text-center relative overflow-hidden`}>

                  {/* Background Animation */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    milestone.status === 'completed' ? 'from-green-500/5 to-emerald-500/5' :
                    milestone.status === 'active' ? 'from-blue-500/5 to-cyan-500/5' :
                    'from-purple-500/5 to-pink-500/5'
                  } animate-pulse`} />

                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                      milestone.status === 'completed' ? 'bg-green-500/20' :
                      milestone.status === 'active' ? 'bg-blue-500/20' :
                      'bg-purple-500/20'
                    }`}>
                      <milestone.icon className={`h-8 w-8 ${milestone.color}`} />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{milestone.phase}</h3>
                    <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                      {milestone.amount}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{milestone.period}</p>
                    <p className="text-muted-foreground mb-4">{milestone.description}</p>

                    <Badge
                      variant={milestone.status === 'completed' ? 'default' : milestone.status === 'active' ? 'secondary' : 'outline'}
                      className={`${
                        milestone.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        milestone.status === 'active' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse' :
                        'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      } mb-4`}
                    >
                      {milestone.status === 'completed' ? '✅ COMPLETED' :
                       milestone.status === 'active' ? '🔥 ACTIVE NOW' : '🚀 COMING SOON'}
                    </Badge>

                    <div className="text-sm text-primary font-semibold">
                      ROI: {milestone.roi}
                    </div>
                  </div>
                </GlassCard>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        {/* Dynamic Roadmap Phases */}
        <MotionSection
          className="mb-16 md:mb-24"
          variants={timelineVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-sapphire bg-clip-text text-transparent">
              🎯 Roadmap Phases
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our strategic journey from foundation to market domination
            </p>
          </div>

          <div ref={timelineRef} className="relative max-w-6xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-sapphire to-gold transform md:-translate-x-1/2" />

            {roadmapPhases.map((phase, index) => (
              <MotionDiv
                key={phase.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-8 md:left-1/2 w-6 h-6 rounded-full border-4 border-background transform md:-translate-x-1/2 z-10 ${
                  phase.status === 'completed' ? 'bg-green-500 animate-pulse' :
                  phase.status === 'in-progress' ? 'bg-blue-500 animate-bounce' :
                  phase.status === 'planned' ? 'bg-purple-500' :
                  'bg-gold animate-spin'
                }`} />

                {/* Phase Card */}
                <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                }`}>
                  <GlassCard className={`premium-card bg-card/90 backdrop-blur-lg border-2 ${phase.borderColor} ${phase.glowColor} shadow-2xl p-8 hover:scale-105 transition-all duration-500 relative overflow-hidden`}>

                    {/* Animated Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${phase.color.replace('from-', 'from-').replace('to-', 'to-')}/5 animate-pulse`} />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`p-4 ${phase.bgColor} rounded-xl`}>
                          <phase.icon className={`h-8 w-8 bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`} />
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'}
                            className={`text-lg px-4 py-2 ${
                              phase.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              phase.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse' :
                              phase.status === 'planned' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                              'bg-gold/20 text-gold border-gold/30'
                            }`}
                          >
                            {phase.status === 'completed' ? '✅ COMPLETED' :
                             phase.status === 'in-progress' ? '🔥 ACTIVE NOW' :
                             phase.status === 'planned' ? '🚀 PLANNED' : '✨ FUTURE'}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-3 text-foreground">{phase.title}</h3>
                      <p className="text-lg text-primary font-semibold mb-2">{phase.period}</p>
                      <p className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                        Budget: {phase.budget}
                      </p>
                      <p className="text-muted-foreground mb-6">{phase.description}</p>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Progress</span>
                          <span>{phase.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-1000 bg-gradient-to-r ${phase.color}`}
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Achievements/Plans */}
                      <div className="space-y-4">
                        {phase.achievements && (
                          <div>
                            <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Achievements
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {phase.achievements.map((achievement, idx) => (
                                <div key={idx} className="flex items-center text-sm text-muted-foreground">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                  {achievement}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {phase.currentFocus && (
                          <div>
                            <h4 className="font-semibold text-blue-400 mb-3 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              Current Focus
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {phase.currentFocus.map((focus, idx) => (
                                <div key={idx} className="flex items-center text-sm text-muted-foreground">
                                  <Zap className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                                  {focus}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {phase.plannedInitiatives && (
                          <div>
                            <h4 className="font-semibold text-purple-400 mb-3 flex items-center">
                              <Rocket className="w-4 h-4 mr-2" />
                              Planned Initiatives
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {phase.plannedInitiatives.map((initiative, idx) => (
                                <div key={idx} className="flex items-center text-sm text-muted-foreground">
                                  <Star className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                                  {initiative}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {phase.visionPoints && (
                          <div>
                            <h4 className="font-semibold text-gold mb-3 flex items-center">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Vision Points
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {phase.visionPoints.map((point, idx) => (
                                <div key={idx} className="flex items-center text-sm text-muted-foreground">
                                  <Crown className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                                  {point}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>

        {/* Call to Action Section */}
        <MotionSection
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <GlassCard className="premium-card bg-gradient-to-br from-primary/10 via-sapphire/10 to-gold/10 backdrop-blur-lg border-2 border-primary/20 shadow-2xl p-12 relative overflow-hidden">

            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sapphire/5 to-gold/5 animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-sapphire to-gold animate-pulse" />

            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-sapphire to-gold bg-clip-text text-transparent">
                  🚀 Join Our Ambitious Journey
                </h2>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  We're not just building a platform - we're creating the future of AI automation.
                  With <span className="text-primary font-semibold">€50,000+ invested</span> and
                  <span className="text-sapphire font-semibold"> ambitious expansion plans</span>,
                  this is your chance to be part of something revolutionary.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">€50K+</div>
                  <div className="text-sm text-muted-foreground">Total Investment</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sapphire mb-2">1,265+</div>
                  <div className="text-sm text-muted-foreground">Community Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">4</div>
                  <div className="text-sm text-muted-foreground">Major Phases</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">85%</div>
                  <div className="text-sm text-muted-foreground">Current Progress</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Button
                  size="lg"
                  onClick={() => navigate('/waitlist')}
                  className="bg-gradient-to-r from-primary to-sapphire text-background hover:shadow-xl hover:shadow-primary/30 text-xl px-12 py-6 animate-pulse"
                >
                  <Crown className="mr-3 h-6 w-6" />
                  Join the Revolution
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open('https://t.me/your_telegram', '_blank')}
                  className="border-2 border-primary/30 hover:border-primary/60 text-xl px-12 py-6"
                >
                  <Users className="mr-3 h-6 w-6" />
                  Join Community
                  <ExternalLink className="ml-3 h-6 w-6" />
                </Button>
              </div>

              {/* Next Milestone Countdown */}
              <div className="mt-12 p-6 bg-card/50 rounded-xl border border-border-alt">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  🎯 Next Major Milestone
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    €40,000 Expansion Phase
                  </div>
                  <div className="text-lg text-muted-foreground mb-4">
                    Post-Token Migration • Massive Community Building
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30 text-lg px-6 py-2 animate-pulse">
                    🚀 COMING SOON
                  </Badge>
                </div>
              </div>
            </div>
          </GlassCard>
        </MotionSection>
      </MotionDiv>
    </div>
  );
};





export default RoadmapPage;
