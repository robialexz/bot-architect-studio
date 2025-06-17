import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Workflow, 
  Bot, 
  Zap, 
  Shield, 
  Target, 
  Clock,
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Award,
  Globe,
  Rocket
} from 'lucide-react';

const PremiumFeaturesSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const premiumFeatures = [
    {
      icon: <Workflow className="w-12 h-12" />,
      title: "Visual Workflow Builder",
      description: "Drag-and-drop interface to create complex AI workflows without coding",
      color: "from-blue-500 to-cyan-500",
      stats: "50+ Templates",
      benefits: ["No-code workflow creation", "Real-time collaboration", "Version control", "Template marketplace"],
      image: "/assets/images/workflow-builder-4k.jpg"
    },
    {
      icon: <Bot className="w-12 h-12" />,
      title: "AI Agent Marketplace",
      description: "Access hundreds of pre-built AI agents for every business need",
      color: "from-purple-500 to-pink-500",
      stats: "200+ Agents",
      benefits: ["Pre-trained specialists", "Custom agent creation", "Agent collaboration", "Performance analytics"],
      image: "/assets/images/ai-agents-4k.jpg"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Real-time Execution",
      description: "Deploy and monitor workflows with instant feedback and analytics",
      color: "from-yellow-500 to-orange-500",
      stats: "< 100ms Response",
      benefits: ["Instant deployment", "Live monitoring", "Auto-scaling", "Performance optimization"],
      image: "/assets/images/real-time-execution-4k.jpg"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC2 compliance and data encryption",
      color: "from-emerald-500 to-teal-500",
      stats: "99.9% Secure",
      benefits: ["SOC2 compliance", "End-to-end encryption", "Role-based access", "Audit trails"],
      image: "/assets/images/enterprise-security-4k.jpg"
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Smart Optimization",
      description: "AI automatically optimizes workflows for maximum efficiency",
      color: "from-red-500 to-pink-500",
      stats: "40% Faster",
      benefits: ["Auto-optimization", "Performance insights", "Resource allocation", "Cost reduction"],
      image: "/assets/images/smart-optimization-4k.jpg"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "24/7 Automation",
      description: "Workflows run continuously with automatic error handling",
      color: "from-indigo-500 to-purple-500",
      stats: "Always On",
      benefits: ["Continuous operation", "Error recovery", "Health monitoring", "Automatic scaling"],
      image: "/assets/images/247-automation-4k.jpg"
    }
  ];

  const awards = [
    { icon: <Award className="w-5 h-5" />, text: "Best AI Platform 2024", org: "TechCrunch" },
    { icon: <Star className="w-5 h-5" />, text: "5-Star Enterprise Rating", org: "G2" },
    { icon: <Globe className="w-5 h-5" />, text: "Global Innovation Award", org: "MIT" },
    { icon: <Rocket className="w-5 h-5" />, text: "Fastest Growing AI Startup", org: "Forbes" }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
          }}
        />
        
        {/* Morphing Blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full animate-morphing-blob" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full animate-morphing-blob" style={{ animationDelay: '10s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Awards Section */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {awards.map((award, index) => (
              <div key={index} className="glass-morphism rounded-2xl px-6 py-4 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    {award.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-sm">{award.text}</div>
                    <div className="text-gray-400 text-xs">{award.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-6xl md:text-8xl font-black mb-8">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Enterprise-Grade
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              AI Platform
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Trusted by Fortune 500 companies to automate their most critical business processes
          </p>
        </div>

        {/* Interactive Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Feature Cards */}
          <div className="space-y-6">
            {premiumFeatures.map((feature, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-500 interactive-card ${
                  activeFeature === index 
                    ? `bg-gradient-to-r ${feature.color} p-[2px] animate-premium-glow` 
                    : 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-700'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-8 bg-gray-900 rounded-lg">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                        <Badge className={`bg-gradient-to-r ${feature.color} text-white border-none`}>
                          {feature.stats}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-4 text-lg leading-relaxed">{feature.description}</p>
                      
                      {/* Benefits List */}
                      <div className="grid grid-cols-2 gap-2">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Visualization */}
          <div className="sticky top-8">
            <div className="relative">
              {/* 4K Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                  {/* Animated Feature Icon */}
                  <div className={`w-32 h-32 rounded-3xl bg-gradient-to-r ${premiumFeatures[activeFeature].color} flex items-center justify-center animate-premium-glow`}>
                    <div className="scale-150">
                      {premiumFeatures[activeFeature].icon}
                    </div>
                  </div>
                  
                  {/* Feature Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass-morphism rounded-2xl p-6">
                      <h4 className="text-2xl font-bold text-white mb-2">
                        {premiumFeatures[activeFeature].title}
                      </h4>
                      <p className="text-gray-300 mb-4">
                        {premiumFeatures[activeFeature].description}
                      </p>
                      <div className="flex items-center gap-4">
                        <Badge className={`bg-gradient-to-r ${premiumFeatures[activeFeature].color} text-white`}>
                          {premiumFeatures[activeFeature].stats}
                        </Badge>
                        <div className="flex items-center gap-2 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">Enterprise Ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 glass-morphism rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime SLA</div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 glass-morphism rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">10K+</div>
                  <div className="text-xs text-gray-400">Enterprise Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/40 transform hover:scale-110 transition-all duration-500 group"
          >
            <Rocket className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            Explore All Features
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeaturesSection;
