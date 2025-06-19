import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Workflow, 
  Bot, 
  Zap, 
  TrendingUp, 
  Database, 
  Brain, 
  ArrowRight, 
  Play, 
  Sparkles,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Cpu,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const InteractiveWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const workflowSteps = [
    {
      id: 1,
      title: "Data Input",
      subtitle: "Connect & Collect",
      description: "Seamlessly connect multiple data sources and automatically collect relevant information for processing",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      features: ["Multi-source integration", "Real-time sync", "Data validation"],
      metrics: { speed: "2.3s", accuracy: "99.8%" }
    },
    {
      id: 2,
      title: "AI Processing",
      subtitle: "Analyze & Learn",
      description: "Advanced machine learning algorithms analyze patterns and extract meaningful insights from your data",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      features: ["Pattern recognition", "Predictive analysis", "Smart categorization"],
      metrics: { speed: "0.8s", accuracy: "97.2%" }
    },
    {
      id: 3,
      title: "Smart Automation",
      subtitle: "Execute & Optimize",
      description: "Intelligent automation executes actions based on AI insights with continuous optimization",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      features: ["Automated workflows", "Smart routing", "Error handling"],
      metrics: { speed: "1.2s", accuracy: "99.5%" }
    },
    {
      id: 4,
      title: "Results & Analytics",
      subtitle: "Monitor & Improve",
      description: "Comprehensive analytics and reporting with actionable insights for continuous improvement",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/20 to-emerald-500/20",
      features: ["Real-time dashboards", "Performance metrics", "Optimization suggestions"],
      metrics: { speed: "0.5s", accuracy: "100%" }
    }
  ];

  const playAnimation = () => {
    setIsPlaying(true);
    workflowSteps.forEach((step, index) => {
      setTimeout(() => {
        setActiveStep(step.id);
        if (index === workflowSteps.length - 1) {
          setTimeout(() => {
            setActiveStep(null);
            setIsPlaying(false);
          }, 2000);
        }
      }, index * 1500);
    });
  };

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black" />
        
        {/* Animated Network Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="networkGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="rgba(59, 130, 246, 0.4)">
                  <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite" />
                </circle>
                <path d="M30,30 L60,30 M30,30 L30,60 M30,30 L60,60" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="0.5">
                  <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite" />
                </path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#networkGrid)" />
          </svg>
        </div>

        {/* Floating Data Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Workflow className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold">AI Workflow Engine</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
            How FlowsyAI Works
          </h2>
          
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-8">
            Experience the power of AI-driven automation through our intelligent 4-step workflow process
          </p>

          {/* Play Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={playAnimation}
              disabled={isPlaying}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-xl shadow-2xl shadow-blue-500/30"
            >
              <Play className="w-5 h-5 mr-2" />
              {isPlaying ? 'Playing...' : 'Watch Demo'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Workflow Steps */}
        <div className="relative max-w-7xl mx-auto">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="relative"
                onHoverStart={() => !isPlaying && setActiveStep(step.id)}
                onHoverEnd={() => !isPlaying && setActiveStep(null)}
              >
                <Card className={`relative bg-white/5 backdrop-blur-sm border transition-all duration-500 h-full group overflow-hidden ${
                  activeStep === step.id 
                    ? 'border-white/50 scale-105 shadow-2xl' 
                    : 'border-white/10 hover:border-white/30'
                }`}>
                  
                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-0 transition-opacity duration-500 ${
                      activeStep === step.id ? 'opacity-100' : 'group-hover:opacity-50'
                    }`}
                    animate={activeStep === step.id ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  <CardContent className="relative z-10 p-6">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-6">
                      <motion.div 
                        className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                        animate={activeStep === step.id ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {step.id}
                      </motion.div>
                    </div>

                    {/* Icon */}
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mx-auto mb-6 mt-4 shadow-lg`}
                      animate={activeStep === step.id ? { 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 1 }}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm text-cyan-400 font-semibold mb-3">{step.subtitle}</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {step.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-white/60"
                          initial={{ opacity: 0, x: -10 }}
                          animate={activeStep === step.id ? { opacity: 1, x: 0 } : { opacity: 0.6, x: 0 }}
                          transition={{ delay: idx * 0.1, duration: 0.3 }}
                        >
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Metrics */}
                    <AnimatePresence>
                      {activeStep === step.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-black/30 rounded-lg p-3 border border-white/10"
                        >
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div>
                              <div className="text-cyan-400 font-bold text-sm">{step.metrics.speed}</div>
                              <div className="text-white/60 text-xs">Speed</div>
                            </div>
                            <div>
                              <div className="text-green-400 font-bold text-sm">{step.metrics.accuracy}</div>
                              <div className="text-white/60 text-xs">Accuracy</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>

                  {/* Connection Arrow */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <motion.div
                        animate={activeStep === step.id ? { x: [0, 10, 0] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className={`w-6 h-6 ${activeStep === step.id ? 'text-cyan-400' : 'text-white/40'} transition-colors duration-300`} />
                      </motion.div>
                    </div>
                  )}

                  {/* Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 rounded-lg blur-xl transition-opacity duration-500 ${
                      activeStep === step.id ? 'opacity-30' : ''
                    }`}
                    animate={activeStep === step.id ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">4.8s</div>
              <div className="text-white/60 text-sm">Average Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">99.1%</div>
              <div className="text-white/60 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-white/60 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">10M+</div>
              <div className="text-white/60 text-sm">Workflows</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveWorkflow;
