import React, { useState } from 'react';
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
  Bot,
  Workflow as WorkflowIcon,
  Zap,
  Shield,
  Globe,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Crown,
  Layers,
  Target,
  Clock,
  Brain,
  Code,
  Mic,
  Eye,
  Search,
  Filter,
  Star,
  TrendingUp,
  Database,
  Settings,
  Cpu,
  Network,
  Lock,
  Gauge,
  Palette,
  Headphones,
  MonitorSpeaker,
  Smartphone,
  Cloud,
  GitBranch,
  FileText,
  MessageSquare,
  Calendar,
  Bell,
  Activity,
  Puzzle,
  Rocket,
  PlayCircle,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { useNavigate } from 'react-router-dom';

// Modern animation variants for the Features page
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.02 },
};

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const Features: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Modern features showcase data
  const featuresShowcase = [
    {
      id: 'ai-orchestration',
      title: 'AI Agent Orchestration',
      subtitle: 'Intelligent Multi-Agent Coordination',
      description: 'Deploy sophisticated AI agents that collaborate seamlessly to solve complex problems',
      icon: Bot,
      category: 'AI Core',
      status: 'live',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      features: [
        'Multi-agent coordination',
        'Smart task delegation',
        'Autonomous decision making',
        'Real-time communication',
        'Conflict resolution',
        'Performance optimization'
      ],
      metrics: {
        efficiency: '+300%',
        accuracy: '99.7%',
        speed: '10x faster'
      },
      demoAvailable: true,
    },
    {
      id: 'visual-builder',
      title: 'Visual Workflow Builder',
      subtitle: 'No-Code Automation Platform',
      description: 'Create complex workflows with intuitive drag-and-drop interface',
      icon: WorkflowIcon,
      category: 'Builder',
      status: 'live',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      features: [
        'Drag-and-drop interface',
        'Real-time preview',
        'Template library',
        'Version control',
        'Collaborative editing',
        'Auto-save functionality'
      ],
      metrics: {
        productivity: '+250%',
        learning: '5 min setup',
        templates: '500+'
      },
      demoAvailable: true,
    },
    {
      id: 'smart-analytics',
      title: 'Smart Analytics',
      subtitle: 'AI-Powered Insights',
      description: 'Deep insights into performance with predictive analytics and optimization suggestions',
      icon: BarChart3,
      category: 'Analytics',
      status: 'live',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      features: [
        'Real-time monitoring',
        'Predictive analytics',
        'Custom dashboards',
        'Performance optimization',
        'Cost analysis',
        'ROI tracking'
      ],
      metrics: {
        insights: 'Real-time',
        accuracy: '95%+',
        savings: '40% cost'
      },
      demoAvailable: true,
    },
    {
      id: 'voice-control',
      title: 'Voice Commands',
      subtitle: 'Natural Language Interface',
      description: 'Control workflows using natural voice commands and conversational AI',
      icon: Mic,
      category: 'Interface',
      status: 'beta',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      features: [
        'Natural language processing',
        'Multi-language support',
        'Voice-to-workflow conversion',
        'Hands-free operation',
        'Context awareness',
        'Custom commands'
      ],
      metrics: {
        languages: '25+',
        accuracy: '98%',
        response: '<1s'
      },
      demoAvailable: false,
    },
    {
      id: 'enterprise-security',
      title: 'Enterprise Security',
      subtitle: 'Bank-Level Protection',
      description: 'Advanced security features with compliance and enterprise-grade protection',
      icon: Shield,
      category: 'Security',
      status: 'live',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      features: [
        'End-to-end encryption',
        'SOC 2 compliance',
        'Role-based access',
        'Audit logging',
        'Data sovereignty',
        'Zero-trust architecture'
      ],
      metrics: {
        uptime: '99.99%',
        compliance: 'SOC 2',
        encryption: 'AES-256'
      },
      demoAvailable: false,
    },
    {
      id: 'integrations',
      title: 'Universal Integrations',
      subtitle: 'Connect Everything',
      description: 'Seamlessly integrate with thousands of services and APIs',
      icon: Network,
      category: 'Connectivity',
      status: 'live',
      gradient: 'from-teal-500 to-blue-500',
      bgGradient: 'from-teal-500/10 to-blue-500/10',
      features: [
        'Pre-built connectors',
        'Custom API support',
        'Webhook triggers',
        'Data synchronization',
        'Real-time updates',
        'Error handling'
      ],
      metrics: {
        integrations: '1000+',
        apis: 'REST/GraphQL',
        uptime: '99.9%'
      },
      demoAvailable: true,
    },
  ];

  // Feature categories for filtering
  const categories = [
    { id: 'all', label: 'All Features', icon: Star, count: featuresShowcase.length },
    { id: 'AI Core', label: 'AI Core', icon: Brain, count: featuresShowcase.filter(f => f.category === 'AI Core').length },
    { id: 'Builder', label: 'Builder', icon: WorkflowIcon, count: featuresShowcase.filter(f => f.category === 'Builder').length },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, count: featuresShowcase.filter(f => f.category === 'Analytics').length },
    { id: 'Security', label: 'Security', icon: Shield, count: featuresShowcase.filter(f => f.category === 'Security').length },
    { id: 'Connectivity', label: 'Connectivity', icon: Network, count: featuresShowcase.filter(f => f.category === 'Connectivity').length },
  ];

  // Filter features based on active category and search
  const filteredFeatures = featuresShowcase.filter(feature => {
    const matchesCategory = activeCategory === 'all' || feature.category === activeCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/3 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-sapphire/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-primary/5 to-sapphire/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />
      </div>

      <MotionDiv
        className="relative z-10 container mx-auto px-4 py-8 md:py-16"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <MotionSection
          className="text-center mb-16 md:mb-24"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <Badge className="mb-6 bg-gradient-to-r from-primary to-sapphire text-background text-lg px-6 py-3">
            <Sparkles className="w-5 h-5 mr-2" />
            🚀 REVOLUTIONARY FEATURES
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-sapphire to-gold bg-clip-text text-transparent leading-tight">
            Powerful AI
            <br />
            <span className="text-3xl sm:text-4xl lg:text-6xl">Features & Capabilities</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover cutting-edge AI automation features designed to <span className="text-primary font-semibold">revolutionize</span> your workflow experience
          </p>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search features..."
                className="pl-12 pr-4 py-4 text-lg bg-card/80 backdrop-blur-lg border-border-alt rounded-xl w-full focus-visible:ring-2 focus-visible:ring-primary"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={`${
                    activeCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'border-border-alt hover:border-primary/40'
                  } transition-all duration-200`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/waitlist')}
              className="bg-gradient-to-r from-primary to-sapphire text-background hover:shadow-xl hover:shadow-primary/30 text-lg px-8 py-4"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Try Features Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/documentation')}
              className="border-primary/30 hover:border-primary/60 text-lg px-8 py-4"
            >
              <Code className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
        </MotionSection>

        {/* Features Showcase */}
        <MotionSection
          className="mb-16 md:mb-24"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-sapphire bg-clip-text text-transparent">
              🎯 Feature Showcase
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore our comprehensive suite of AI-powered features designed for maximum productivity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {filteredFeatures.map((feature, index) => (
              <MotionDiv
                key={feature.id}
                variants={featureCardVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="group cursor-pointer"
              >
                <GlassCard className={`premium-card bg-card/90 backdrop-blur-lg border-2 border-border-alt shadow-2xl p-8 h-full relative overflow-hidden transition-all duration-500 ${
                  hoveredFeature === feature.id ? 'shadow-primary/20 border-primary/30' : ''
                }`}>

                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={feature.status === 'live' ? 'default' : feature.status === 'beta' ? 'secondary' : 'outline'}
                          className={`${
                            feature.status === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            feature.status === 'beta' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          } text-sm px-3 py-1`}
                        >
                          {feature.status === 'live' ? '✅ LIVE' :
                           feature.status === 'beta' ? '🧪 BETA' : '🚧 COMING SOON'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-primary font-semibold mb-3">{feature.subtitle}</p>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-background/50 rounded-lg border border-border/50">
                      {Object.entries(feature.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-primary">{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features List */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-primary" />
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {feature.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feat}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {feature.demoAvailable && (
                        <Button
                          size="sm"
                          onClick={() => navigate('/waitlist')}
                          className="bg-gradient-to-r from-primary to-sapphire text-background hover:shadow-lg flex-1"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Try Demo
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/documentation')}
                        className={`border-primary/20 hover:border-primary/40 ${feature.demoAvailable ? 'flex-1' : 'w-full'}`}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </MotionDiv>
            ))}
          </div>

          {/* No Results */}
          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No features found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </MotionSection>

        {/* Call to Action Section */}
        <MotionSection
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <GlassCard className="premium-card bg-gradient-to-br from-primary/10 via-sapphire/10 to-gold/10 backdrop-blur-lg border-2 border-primary/20 shadow-2xl p-12 relative overflow-hidden">

            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sapphire/5 to-gold/5 animate-pulse" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-sapphire to-gold" />

            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-sapphire to-gold bg-clip-text text-transparent">
                  🚀 Ready to Experience These Features?
                </h2>
                <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  Join thousands of users who are already transforming their workflows with our
                  <span className="text-primary font-semibold"> revolutionary AI features</span>.
                  Start your journey today and unlock the full potential of AI automation.
                </p>
              </div>

              {/* Feature Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{featuresShowcase.length}</div>
                  <div className="text-sm text-muted-foreground">Powerful Features</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sapphire mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Expert Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Integrations</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Button
                  size="lg"
                  onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank', 'noopener,noreferrer')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-background hover:shadow-xl hover:shadow-emerald-500/30 text-xl px-12 py-6 animate-pulse"
                >
                  <TrendingUp className="mr-3 h-6 w-6" />
                  Buy $FlowAI
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/pricing')}
                  className="border-2 border-primary/30 hover:border-primary/60 text-xl px-12 py-6"
                >
                  <DollarSign className="mr-3 h-6 w-6" />
                  View Pricing
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>1,265+ Community Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold" />
                  <span>Premium Support</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </MotionSection>
      </MotionDiv>
    </div>
  );
};

export default Features;
