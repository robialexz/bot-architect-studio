import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Database, 
  Code, 
  BarChart3, 
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Cpu,
  Network,
  Lock
} from 'lucide-react';

interface Capability {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

const CapabilitiesShowcase: React.FC = () => {
  const [activeCapability, setActiveCapability] = useState(0);
  const [animatedMetrics, setAnimatedMetrics] = useState<Record<string, number>>({});

  const capabilities: Capability[] = [
    {
      id: 'ai-intelligence',
      title: 'AI Intelligence Engine',
      description: 'Advanced AI models that understand context, make decisions, and continuously learn from your business processes.',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'GPT-4 & Claude Integration',
        'Natural Language Processing',
        'Contextual Decision Making',
        'Continuous Learning',
        'Multi-Modal Understanding'
      ],
      metrics: [
        { label: 'AI Models', value: '15+' },
        { label: 'Accuracy', value: '97%' },
        { label: 'Response Time', value: '2.3s' }
      ]
    },
    {
      id: 'automation',
      title: 'Smart Automation',
      description: 'Intelligent workflow automation that adapts to changing conditions and optimizes performance in real-time.',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Dynamic Workflow Routing',
        'Auto-Optimization',
        'Error Recovery',
        'Load Balancing',
        'Performance Monitoring'
      ],
      metrics: [
        { label: 'Time Saved', value: '85%' },
        { label: 'Efficiency', value: '94%' },
        { label: 'Uptime', value: '99.9%' }
      ]
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption, compliance frameworks, and advanced threat protection.',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      features: [
        'AES-256 Encryption',
        'SOC2 Compliance',
        'GDPR Ready',
        'Audit Trails',
        'Role-Based Access'
      ],
      metrics: [
        { label: 'Security Score', value: 'A+' },
        { label: 'Compliance', value: '100%' },
        { label: 'Incidents', value: '0' }
      ]
    },
    {
      id: 'integrations',
      title: 'Universal Integrations',
      description: 'Connect with 500+ tools and services through our comprehensive API ecosystem and pre-built connectors.',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      features: [
        '500+ Pre-built Connectors',
        'REST & GraphQL APIs',
        'Webhook Support',
        'Real-time Sync',
        'Custom Integrations'
      ],
      metrics: [
        { label: 'Integrations', value: '500+' },
        { label: 'API Calls/min', value: '10K+' },
        { label: 'Sync Speed', value: '<1s' }
      ]
    }
  ];

  // Auto-rotate capabilities
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCapability(prev => (prev + 1) % capabilities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [capabilities.length]);

  // Animate metrics
  useEffect(() => {
    const timer = setTimeout(() => {
      const newMetrics: Record<string, number> = {};
      capabilities.forEach((capability, capIndex) => {
        capability.metrics.forEach((metric, metricIndex) => {
          const key = `${capIndex}-${metricIndex}`;
          const numericValue = parseInt(metric.value.replace(/[^\d]/g, '')) || 0;
          newMetrics[key] = numericValue;
        });
      });
      setAnimatedMetrics(newMetrics);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full px-6 py-3 mb-8">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">Core Capabilities</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powered by
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Advanced AI
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the next generation of business automation with our cutting-edge AI capabilities
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Capability Cards */}
          <div className="space-y-6">
            {capabilities.map((capability, index) => (
              <div
                key={capability.id}
                className={`
                  relative cursor-pointer transition-all duration-500 group
                  ${activeCapability === index ? 'scale-105 z-20' : 'hover:scale-102 z-10'}
                `}
                onClick={() => setActiveCapability(index)}
              >
                <div className={`
                  bg-gray-800/60 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-500
                  ${activeCapability === index 
                    ? 'border-blue-400/60 shadow-2xl shadow-blue-500/20' 
                    : 'border-gray-700/50 hover:border-gray-600/60'
                  }
                `}>
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`
                      p-3 rounded-xl bg-gradient-to-r ${capability.color} text-white
                      ${activeCapability === index ? 'scale-110' : 'group-hover:scale-105'}
                      transition-transform duration-300
                    `}>
                      {capability.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{capability.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {activeCapability === index && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        )}
                        <span className="text-gray-400 text-sm">
                          {activeCapability === index ? 'Active' : 'Click to explore'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {capability.description}
                  </p>

                  {/* Features */}
                  {activeCapability === index && (
                    <div className="space-y-2 mb-4 animate-fade-in">
                      {capability.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {capability.metrics.map((metric, metricIndex) => {
                      const key = `${index}-${metricIndex}`;
                      const animatedValue = animatedMetrics[key] || 0;
                      
                      return (
                        <div key={metricIndex} className="text-center">
                          <div className="text-lg font-bold text-white">
                            {metric.value.includes('%') || metric.value.includes('+') || metric.value.includes('s') || metric.value.includes('A') 
                              ? metric.value 
                              : animatedValue > 0 ? `${animatedValue}${metric.value.replace(/\d+/g, '')}` : metric.value
                            }
                          </div>
                          <div className="text-gray-500 text-xs">{metric.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Glow */}
                  {activeCapability === index && (
                    <div className={`
                      absolute inset-0 bg-gradient-to-r ${capability.color} opacity-5 rounded-2xl
                      animate-pulse
                    `} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Display */}
          <div className="flex items-center justify-center">
            <div className="relative w-96 h-96">
              {/* Central Hub */}
              <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Network className="w-12 h-12 text-white" />
              </div>

              {/* Orbiting Capabilities */}
              {capabilities.map((capability, index) => (
                <div
                  key={capability.id}
                  className={`
                    absolute w-16 h-16 rounded-full flex items-center justify-center transition-all duration-1000
                    ${activeCapability === index 
                      ? `bg-gradient-to-r ${capability.color} scale-125 shadow-lg` 
                      : 'bg-gray-700 scale-100'
                    }
                  `}
                  style={{
                    top: `${50 + Math.sin((index * 90 + (activeCapability * 10)) * Math.PI / 180) * 140}px`,
                    left: `${50 + Math.cos((index * 90 + (activeCapability * 10)) * Math.PI / 180) * 140}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="text-white scale-75">
                    {capability.icon}
                  </div>
                </div>
              ))}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {capabilities.map((_, index) => (
                  <line
                    key={index}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + Math.cos((index * 90 + (activeCapability * 10)) * Math.PI / 180) * 140}px`}
                    y2={`${50 + Math.sin((index * 90 + (activeCapability * 10)) * Math.PI / 180) * 140}px`}
                    stroke={activeCapability === index ? '#3B82F6' : '#374151'}
                    strokeWidth={activeCapability === index ? '3' : '1'}
                    strokeDasharray={activeCapability === index ? '5,5' : 'none'}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              Experience All Capabilities
            </h3>
            <p className="text-gray-400 mb-6">
              See how these powerful capabilities work together to transform your business processes
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
              Explore Platform
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default CapabilitiesShowcase;
