import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Bot,
  Sparkles,
  ShoppingCart,
  Heart,
  DollarSign,
  Users,
  FileText,
  Mail,
  BarChart3,
  Zap,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  Check
} from 'lucide-react';

interface IndustryDemo {
  id: string;
  title: string;
  industry: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  roi: string;
  timeSaved: string;
  complexity: 'Simple' | 'Medium' | 'Advanced';
  steps: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    duration: number;
    status: 'idle' | 'processing' | 'completed';
  }>;
}

const EnhancedInteractiveDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const industryDemos: IndustryDemo[] = [
    {
      id: 'ecommerce',
      title: 'E-commerce Order Processing',
      industry: 'Retail & E-commerce',
      description: 'Automate order processing, inventory management, and customer communications',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      roi: '340%',
      timeSaved: '25 hours/week',
      complexity: 'Medium',
      steps: [
        {
          id: 'order-agent',
          title: 'Order Intelligence Agent',
          description: 'Validates order data, checks fraud patterns, applies business rules',
          icon: <ShoppingCart className="w-6 h-6" />,
          duration: 1200,
          status: 'idle'
        },
        {
          id: 'inventory-agent',
          title: 'Inventory Management Agent',
          description: 'Real-time stock verification across 15 warehouses, predictive restocking',
          icon: <BarChart3 className="w-6 h-6" />,
          duration: 1800,
          status: 'idle'
        },
        {
          id: 'payment-agent',
          title: 'Payment Security Agent',
          description: 'Multi-gateway processing, fraud detection, PCI compliance validation',
          icon: <DollarSign className="w-6 h-6" />,
          duration: 2200,
          status: 'idle'
        },
        {
          id: 'logistics-agent',
          title: 'Logistics Optimization Agent',
          description: 'Route optimization, carrier selection, automated label generation',
          icon: <Bot className="w-6 h-6" />,
          duration: 1600,
          status: 'idle'
        },
        {
          id: 'communication-agent',
          title: 'Customer Communication Agent',
          description: 'Personalized notifications, tracking updates, support ticket creation',
          icon: <Mail className="w-6 h-6" />,
          duration: 1000,
          status: 'idle'
        }
      ]
    },
    {
      id: 'healthcare',
      title: 'Patient Care Coordination',
      industry: 'Healthcare',
      description: 'Streamline patient intake, appointment scheduling, and follow-up care',
      icon: <Heart className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-500',
      roi: '280%',
      timeSaved: '18 hours/week',
      complexity: 'Advanced',
      steps: [
        {
          id: 'intake-agent',
          title: 'Patient Intake Intelligence Agent',
          description: 'HIPAA-compliant data processing, medical history analysis, risk assessment',
          icon: <Users className="w-6 h-6" />,
          duration: 1600,
          status: 'idle'
        },
        {
          id: 'insurance-agent',
          title: 'Insurance Verification Agent',
          description: 'Real-time eligibility checks across 200+ providers, pre-auth automation',
          icon: <CheckCircle className="w-6 h-6" />,
          duration: 2200,
          status: 'idle'
        },
        {
          id: 'scheduling-agent',
          title: 'Smart Scheduling Agent',
          description: 'AI-powered resource optimization, provider matching, conflict resolution',
          icon: <Clock className="w-6 h-6" />,
          duration: 1900,
          status: 'idle'
        },
        {
          id: 'care-planning-agent',
          title: 'Clinical Decision Support Agent',
          description: 'Evidence-based treatment recommendations, drug interaction checks',
          icon: <Brain className="w-6 h-6" />,
          duration: 2400,
          status: 'idle'
        },
        {
          id: 'communication-agent',
          title: 'Patient Communication Agent',
          description: 'Automated follow-ups, appointment reminders, care coordination',
          icon: <Mail className="w-6 h-6" />,
          duration: 1200,
          status: 'idle'
        }
      ]
    },
    {
      id: 'finance',
      title: 'Financial Report Generation',
      industry: 'Finance & Banking',
      description: 'Automate financial analysis, reporting, and compliance monitoring',
      icon: <DollarSign className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      roi: '420%',
      timeSaved: '35 hours/week',
      complexity: 'Advanced',
      steps: [
        {
          id: 'data-aggregation-agent',
          title: 'Financial Data Aggregation Agent',
          description: 'Multi-source data integration, real-time market feeds, API orchestration',
          icon: <BarChart3 className="w-6 h-6" />,
          duration: 2200,
          status: 'idle'
        },
        {
          id: 'analysis-agent',
          title: 'Quantitative Analysis Agent',
          description: 'Advanced ML models, risk assessment, predictive analytics, anomaly detection',
          icon: <Brain className="w-6 h-6" />,
          duration: 2800,
          status: 'idle'
        },
        {
          id: 'reporting-agent',
          title: 'Intelligent Reporting Agent',
          description: 'Dynamic report generation, data visualization, executive summaries',
          icon: <FileText className="w-6 h-6" />,
          duration: 2000,
          status: 'idle'
        },
        {
          id: 'compliance-agent',
          title: 'Regulatory Compliance Agent',
          description: 'Multi-jurisdiction compliance checks, audit trail generation, risk scoring',
          icon: <CheckCircle className="w-6 h-6" />,
          duration: 1700,
          status: 'idle'
        },
        {
          id: 'distribution-agent',
          title: 'Secure Distribution Agent',
          description: 'Encrypted delivery, access control, stakeholder notifications, audit logs',
          icon: <Mail className="w-6 h-6" />,
          duration: 1300,
          status: 'idle'
        }
      ]
    }
  ];

  const currentDemo = industryDemos[activeDemo];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentStep < currentDemo.steps.length) {
      const step = currentDemo.steps[currentStep];
      interval = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);

        if (currentStep === currentDemo.steps.length - 1) {
          setIsPlaying(false);
        }
      }, step.duration);
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [isPlaying, currentStep, currentDemo]);

  const handlePlayPause = () => {
    if (currentStep >= currentDemo.steps.length) {
      handleReset();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleDemoChange = (index: number) => {
    setActiveDemo(index);
    handleReset();
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) return 'completed';
    if (stepIndex === currentStep && isPlaying) return 'processing';
    return 'pending';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Industry-Specific
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              AI Workflows
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-8">
            See how FlowsyAI transforms operations across different industries with intelligent automation
          </p>
        </div>

        {/* Industry Demo Selector */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {industryDemos.map((demo, index) => (
            <Card
              key={demo.id}
              className={`cursor-pointer transition-all duration-500 interactive-card ${
                activeDemo === index
                  ? `bg-gradient-to-r ${demo.color} p-[2px]`
                  : 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-700'
              }`}
              onClick={() => handleDemoChange(index)}
            >
              <CardContent className="p-6 bg-gray-900 rounded-lg h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${demo.color} flex-shrink-0`}>
                    {demo.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{demo.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{demo.industry}</p>
                    <Badge className={`text-xs ${getComplexityColor(demo.complexity)}`}>
                      {demo.complexity}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{demo.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">ROI:</span>
                    <span className="text-green-400 font-semibold ml-2">{demo.roi}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time Saved:</span>
                    <span className="text-blue-400 font-semibold ml-2">{demo.timeSaved}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={handlePlayPause}
            className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700'
                : `bg-gradient-to-r ${currentDemo.color} hover:scale-105`
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isPlaying ? 'Pause Demo' : 'Start Demo'}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="px-8 py-4 text-lg font-semibold rounded-xl border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Modern AI Workflow Dashboard */}
        <div className="relative">
          {/* Premium Background with Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] rounded-3xl" />

          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 overflow-hidden">
            {/* Floating Orbs Background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-32 h-32 rounded-full opacity-20 animate-float-slow ${
                    i % 3 === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    i % 3 === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}
                  style={{
                    left: `${Math.random() * 80}%`,
                    top: `${Math.random() * 80}%`,
                    animationDelay: `${i * 2}s`,
                    animationDuration: `${8 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            {/* Modern Dashboard Layout */}
            <div className="relative z-10 space-y-8">
              {/* Header Section with Live Status */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentDemo.color} flex items-center justify-center shadow-2xl`}>
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">AI Workflow Engine</h3>
                    <p className="text-gray-400">
                      {isPlaying ? 'Processing workflow...' : 'Ready to execute'}
                    </p>
                  </div>
                </div>

                {/* Live Status Indicators */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-sm text-gray-300">
                      {isPlaying ? 'Active' : 'Standby'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {completedSteps.length}/{currentDemo.steps.length} Complete
                  </div>
                </div>
              </div>

              {/* Modern AI Workflow Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {currentDemo.steps.map((step, index) => {
                  const isActive = getStepStatus(index) === 'completed';
                  const isProcessing = getStepStatus(index) === 'processing';
                  const isPending = getStepStatus(index) === 'pending';

                  return (
                    <div
                      key={step.id}
                      className={`
                        relative group transition-all duration-700 transform
                        ${isActive ? 'scale-105 z-10' : isProcessing ? 'scale-102 z-20' : 'hover:scale-101'}
                      `}
                    >
                      {/* Card Background */}
                      <div className={`
                        relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500
                        ${isActive ?
                          'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-400/50 shadow-2xl shadow-green-500/20' :
                          isProcessing ?
                          'bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-400/50 shadow-2xl shadow-blue-500/20 animate-pulse-slow' :
                          'bg-gray-900/60 border-gray-700/50 hover:border-gray-600/50'
                        }
                      `}>

                        {/* Status Bar */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isActive ?
                              'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' :
                              isProcessing ?
                              'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg animate-glow' :
                              'bg-gray-700 group-hover:bg-gray-600'
                            }
                          `}>
                            {step.icon}
                          </div>

                          {/* Status Indicator */}
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <>
                                <Check className="w-4 h-4 text-green-400" />
                                <span className="text-xs text-green-400 font-medium">Complete</span>
                              </>
                            )}
                            {isProcessing && (
                              <>
                                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs text-blue-400 font-medium">Processing</span>
                              </>
                            )}
                            {isPending && (
                              <>
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-500 font-medium">Pending</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Agent Info */}
                        <div className="space-y-3">
                          <h4 className={`font-semibold transition-colors duration-300 ${
                            isActive || isProcessing ? 'text-white' : 'text-gray-300'
                          }`}>
                            {step.title}
                          </h4>

                          <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                            isActive || isProcessing ? 'text-gray-200' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Progress</span>
                              <span className={`${isActive ? 'text-green-400' : isProcessing ? 'text-blue-400' : 'text-gray-500'}`}>
                                {isActive ? '100%' : isProcessing ? '75%' : '0%'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${
                                  isActive ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-full' :
                                  isProcessing ? 'bg-gradient-to-r from-blue-500 to-cyan-500 w-3/4 animate-pulse' :
                                  'w-0'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Processing Details */}
                          {isProcessing && (
                            <div className="mt-3 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                              <div className="text-blue-400 text-xs font-medium animate-pulse mb-1">
                                🔄 Processing...
                              </div>
                              <div className="text-xs text-gray-400">
                                ETA: {Math.floor(step.duration / 1000)}s
                              </div>
                            </div>
                          )}

                          {/* Completion Details */}
                          {isActive && (
                            <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                              <div className="text-green-400 text-xs font-medium mb-1">
                                ✅ Completed
                              </div>
                              <div className="text-xs text-gray-400">
                                Processed in {Math.floor(step.duration / 1000)}s
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Glow Effect */}
                        {(isActive || isProcessing) && (
                          <div className={`
                            absolute inset-0 rounded-2xl opacity-20 blur-xl -z-10
                            ${isActive ? 'bg-green-500' : 'bg-blue-500'}
                          `} />
                        )}
                      </div>

                      {/* Connection Arrow */}
                      {index < currentDemo.steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-30">
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500
                            ${isActive ? 'bg-green-500 shadow-lg' : 'bg-gray-700'}
                          `}>
                            <ArrowRight className={`w-3 h-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Real-time Performance Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Live Metrics Panel */}
                <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400 animate-pulse" />
                    Live AI Metrics
                    <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Active Agents</span>
                        <span className="text-green-400 font-semibold text-lg flex items-center gap-1">
                          <Brain className="w-4 h-4" />
                          {completedSteps.length + (isPlaying ? 1 : 0)}/{currentDemo.steps.length}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Processing Speed</span>
                        <span className="text-blue-400 font-semibold text-lg">
                          {isPlaying ? '847 ops/sec' : '0 ops/sec'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Efficiency</span>
                        <span className="text-purple-400 font-semibold text-lg">
                          {Math.round((completedSteps.length / currentDemo.steps.length) * 100)}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-sm">Memory Usage</span>
                        <span className="text-yellow-400 font-semibold text-lg">
                          {isPlaying ? '2.1GB' : '0.8GB'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Overall Progress</span>
                      <span className="text-white font-medium">
                        {Math.round((completedSteps.length / currentDemo.steps.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-500 relative"
                        style={{ width: `${(completedSteps.length / currentDemo.steps.length) * 100}%` }}
                      >
                        {isPlaying && (
                          <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Models Status Panel */}
                <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                    AI Models Active
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                      <span className="text-gray-300 text-sm">GPT-4 Turbo</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isPlaying ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-500'
                      }`}>
                        {isPlaying ? 'Active' : 'Standby'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                      <span className="text-gray-300 text-sm">Claude-3 Opus</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isPlaying ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-500'
                      }`}>
                        {isPlaying ? 'Active' : 'Standby'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                      <span className="text-gray-300 text-sm">Custom ML</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isPlaying ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-600/20 text-gray-500'
                      }`}>
                        {isPlaying ? 'Training' : 'Idle'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                      <span className="text-gray-300 text-sm">Vector DB</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isPlaying ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-600/20 text-gray-500'
                      }`}>
                        {isPlaying ? 'Indexing' : 'Ready'}
                      </span>
                    </div>
                  </div>

                  {/* Network Activity */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Network: {isPlaying ? '↑ 12.3 MB/s' : '↑ 0 MB/s'}</span>
                      <span>Latency: {isPlaying ? '23ms' : '0ms'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Status Summary */}
              <div className="mt-8 text-center">
                <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 px-8 py-6 max-w-4xl mx-auto">
                  <h4 className="text-2xl font-semibold text-white mb-3">
                    {isPlaying
                      ? `Processing: ${currentDemo.steps[currentStep]?.title || 'Workflow Complete'}`
                      : `${currentDemo.title} - Ready to Execute`
                    }
                  </h4>
                  <p className="text-gray-400 mb-4 text-lg">
                    {isPlaying && currentStep < currentDemo.steps.length
                      ? `AI agents are collaborating to ${currentDemo.steps[currentStep]?.description.toLowerCase()}`
                      : `This intelligent workflow saves ${currentDemo.timeSaved} and delivers ${currentDemo.roi} ROI`
                    }
                  </p>

                  {/* Live Performance Indicators */}
                  <div className="flex justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 font-medium">System Healthy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                      <span className="text-blue-400 font-medium">
                        {isPlaying ? 'Processing' : 'Standby'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <span className="text-purple-400 font-medium">Auto-scaling</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedInteractiveDemo;
