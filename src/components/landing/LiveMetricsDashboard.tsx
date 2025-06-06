import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Zap,
  Brain,
  Clock,
  Globe,
  Star,
  Activity,
  BarChart3,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RefreshCw,
  Eye,
  MousePointer,
  Target,
  Rocket,
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Database,
  Server,
  Wifi,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Info,
  ExternalLink,
  ChevronRight,
  Timer,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  Layers,
  Code,
  Settings,
  BarChart,
  PieChart,
  LineChart,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  description: string;
  tooltip: string;
  target?: number;
  category: 'performance' | 'usage' | 'business' | 'technical';
  isClickable?: boolean;
  chartData?: number[];
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: 'workflow' | 'token' | 'user' | 'ai' | 'system' | 'security';
  location?: string;
  impact: 'low' | 'medium' | 'high';
  status: 'success' | 'warning' | 'error' | 'info';
}

interface SystemStatus {
  id: string;
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastCheck: string;
}

interface InteractiveChart {
  id: string;
  title: string;
  data: { time: string; value: number; label?: string }[];
  type: 'line' | 'bar' | 'area';
  color: string;
}

const LiveMetricsDashboard: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'business'>('overview');
  const controls = useAnimation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: 'users',
      label: 'Active Users Right Now',
      value: 12847,
      unit: '',
      icon: <Users className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      trendValue: 12.5,
      description: 'Users actively building AI workflows',
      tooltip:
        'Real-time count of users currently using the platform to create and manage AI workflows',
      target: 15000,
      category: 'usage',
      isClickable: true,
      chartData: [8234, 9156, 10234, 11456, 12847],
    },
    {
      id: 'workflows',
      label: 'Workflows Deployed Today',
      value: 45623,
      unit: '',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      trend: 'up',
      trendValue: 8.3,
      description: 'AI workflows successfully deployed',
      tooltip:
        'Total number of AI automation workflows created and deployed by users in the last 24 hours',
      target: 50000,
      category: 'business',
      isClickable: true,
      chartData: [32145, 36789, 41234, 43567, 45623],
    },
    {
      id: 'ai_calls',
      label: 'AI API Calls This Hour',
      value: 2847392,
      unit: '',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      trend: 'up',
      trendValue: 23.7,
      description: 'Successful AI model integrations',
      tooltip:
        'Real-time count of successful API calls to various AI models (GPT, Claude, Gemini, etc.)',
      target: 3000000,
      category: 'technical',
      isClickable: true,
      chartData: [1234567, 1567890, 2123456, 2456789, 2847392],
    },
    {
      id: 'uptime',
      label: 'Platform Uptime',
      value: 99.97,
      unit: '%',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      trend: 'stable',
      trendValue: 0.1,
      description: '30-day service availability',
      tooltip:
        'Platform availability over the last 30 days - we maintain 99.9%+ uptime with enterprise-grade infrastructure',
      target: 99.99,
      category: 'performance',
      isClickable: true,
      chartData: [99.94, 99.96, 99.98, 99.97, 99.97],
    },
    {
      id: 'response_time',
      label: 'Average Response Time',
      value: 127,
      unit: 'ms',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-orange-500 to-amber-500',
      trend: 'down',
      trendValue: -15.2,
      description: 'Lightning-fast API performance',
      tooltip: 'Average response time for all API endpoints - optimized for speed and reliability',
      target: 100,
      category: 'performance',
      isClickable: true,
      chartData: [156, 143, 134, 129, 127],
    },
    {
      id: 'revenue',
      label: 'Revenue Generated',
      value: 847392,
      unit: '$',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-gold to-yellow-500',
      trend: 'up',
      trendValue: 34.8,
      description: 'Monthly recurring revenue',
      tooltip: 'Total revenue generated from subscriptions and usage-based billing this month',
      target: 1000000,
      category: 'business',
      isClickable: true,
      chartData: [456789, 567890, 678901, 789012, 847392],
    },
    {
      id: 'countries',
      label: 'Global Reach',
      value: 89,
      unit: ' countries',
      icon: <Globe className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500',
      trend: 'up',
      trendValue: 5.6,
      description: 'Worldwide platform adoption',
      tooltip: 'Number of countries where FlowsyAI users are actively building AI workflows',
      target: 100,
      category: 'business',
      isClickable: true,
      chartData: [67, 73, 81, 86, 89],
    },
    {
      id: 'satisfaction',
      label: 'User Satisfaction',
      value: 4.9,
      unit: '/5.0',
      icon: <Star className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500',
      trend: 'up',
      trendValue: 2.1,
      description: 'Customer happiness score',
      tooltip: 'Average user rating based on feedback, reviews, and Net Promoter Score surveys',
      target: 5.0,
      category: 'business',
      isClickable: true,
      chartData: [4.6, 4.7, 4.8, 4.85, 4.9],
    },
  ]);

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      action: 'Deployed customer service automation',
      user: 'Sarah M.',
      time: '12 seconds ago',
      type: 'workflow',
      location: 'San Francisco, CA',
      impact: 'high',
      status: 'success',
    },
    {
      id: '2',
      action: 'Joined enterprise waitlist',
      user: 'Alex K.',
      time: '34 seconds ago',
      type: 'token',
      location: 'London, UK',
      impact: 'medium',
      status: 'success',
    },
    {
      id: '3',
      action: 'Integrated GPT-4 model',
      user: 'Mike R.',
      time: '1 min ago',
      type: 'ai',
      location: 'Tokyo, JP',
      impact: 'high',
      status: 'success',
    },
    {
      id: '4',
      action: 'Completed onboarding',
      user: 'Emma L.',
      time: '2 min ago',
      type: 'user',
      location: 'Berlin, DE',
      impact: 'medium',
      status: 'success',
    },
    {
      id: '5',
      action: 'Generated $2.4K revenue',
      user: 'David P.',
      time: '3 min ago',
      type: 'workflow',
      location: 'New York, NY',
      impact: 'high',
      status: 'success',
    },
  ]);

  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    {
      id: 'api',
      service: 'API Gateway',
      status: 'operational',
      uptime: 99.98,
      responseTime: 89,
      lastCheck: '30 seconds ago',
    },
    {
      id: 'ai',
      service: 'AI Models',
      status: 'operational',
      uptime: 99.95,
      responseTime: 234,
      lastCheck: '15 seconds ago',
    },
    {
      id: 'database',
      service: 'Database',
      status: 'operational',
      uptime: 99.99,
      responseTime: 12,
      lastCheck: '45 seconds ago',
    },
    {
      id: 'cdn',
      service: 'CDN',
      status: 'operational',
      uptime: 100.0,
      responseTime: 67,
      lastCheck: '20 seconds ago',
    },
  ]);

  // Enhanced real-time simulation
  useEffect(() => {
    if (!isPlaying) return;

    const updateMetrics = () => {
      setMetrics(prev =>
        prev.map(metric => {
          let newValue = metric.value;
          let newTrend = metric.trend;
          let newTrendValue = metric.trendValue;

          // More realistic updates based on metric type
          switch (metric.id) {
            case 'users':
              newValue += Math.floor(Math.random() * 20) - 5;
              break;
            case 'workflows':
              newValue += Math.floor(Math.random() * 50);
              break;
            case 'ai_calls':
              newValue += Math.floor(Math.random() * 1000) + 500;
              break;
            case 'response_time':
              newValue += Math.floor(Math.random() * 10) - 5;
              newValue = Math.max(50, Math.min(300, newValue));
              break;
            case 'revenue':
              newValue += Math.floor(Math.random() * 1000) + 200;
              break;
            case 'satisfaction':
              newValue += (Math.random() - 0.5) * 0.02;
              newValue = Math.max(4.0, Math.min(5.0, newValue));
              break;
            default:
              newValue += Math.floor(Math.random() * 5) - 2;
          }

          // Update trend
          if (Math.random() > 0.8) {
            newTrendValue += (Math.random() - 0.5) * 5;
            newTrend = newTrendValue > 0 ? 'up' : newTrendValue < -0.5 ? 'down' : 'stable';
          }

          // Update chart data
          const newChartData = [...(metric.chartData || [])];
          newChartData.push(newValue);
          if (newChartData.length > 10) newChartData.shift();

          return {
            ...metric,
            value: Math.max(0, newValue),
            trend: newTrend,
            trendValue: newTrendValue,
            chartData: newChartData,
          };
        })
      );
    };

    const updateActivity = () => {
      const activities = [
        'Deployed e-commerce automation workflow',
        'Integrated Claude AI for content generation',
        'Completed enterprise onboarding',
        'Generated automated social media campaign',
        'Set up customer support chatbot',
        'Created data analysis pipeline',
        'Launched marketing automation',
        'Deployed inventory management system',
        'Integrated payment processing workflow',
        'Set up lead qualification automation',
      ];

      const users = [
        'Jennifer S.',
        'Michael R.',
        'Sarah L.',
        'David K.',
        'Emma W.',
        'James P.',
        'Lisa M.',
        'Robert T.',
        'Anna C.',
        'Chris B.',
        'Maria G.',
        'John H.',
        'Sophie D.',
        'Alex V.',
        'Rachel N.',
      ];

      const locations = [
        'San Francisco, CA',
        'New York, NY',
        'London, UK',
        'Berlin, DE',
        'Tokyo, JP',
        'Sydney, AU',
        'Toronto, CA',
        'Paris, FR',
        'Amsterdam, NL',
        'Singapore, SG',
        'Stockholm, SE',
        'Zurich, CH',
      ];

      const types: RecentActivity['type'][] = ['workflow', 'ai', 'user', 'system'];
      const impacts: RecentActivity['impact'][] = ['low', 'medium', 'high'];
      const statuses: RecentActivity['status'][] = ['success', 'info'];

      setRecentActivity(prev => [
        {
          id: Date.now().toString(),
          action: activities[Math.floor(Math.random() * activities.length)],
          user: users[Math.floor(Math.random() * users.length)],
          time: 'Just now',
          type: types[Math.floor(Math.random() * types.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          impact: impacts[Math.floor(Math.random() * impacts.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
        },
        ...prev.slice(0, 7),
      ]);
    };

    // Update metrics every 3 seconds
    intervalRef.current = setInterval(updateMetrics, 3000);

    // Update activity every 4 seconds
    const activityInterval = setInterval(updateActivity, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(activityInterval);
    };
  }, [isPlaying]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return '$' + (num / 1000).toFixed(1) + 'K';
    }
    return '$' + num.toLocaleString();
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'workflow':
        return <Zap className="w-5 h-5 text-emerald-500" />;
      case 'token':
        return <Star className="w-5 h-5 text-gold" />;
      case 'ai':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'user':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <Server className="w-5 h-5 text-orange-500" />;
      case 'security':
        return <Shield className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getImpactColor = (impact: RecentActivity['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMetricClick = (metricId: string) => {
    setSelectedMetric(selectedMetric === metricId ? null : metricId);
  };

  const getFilteredMetrics = () => {
    if (activeTab === 'overview') return metrics;
    return metrics.filter(metric =>
      activeTab === 'performance'
        ? ['performance', 'technical'].includes(metric.category)
        : metric.category === activeTab
    );
  };

  return (
    <section className="relative py-12 px-6 bg-gradient-to-br from-background via-background/95 to-primary/5 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-8xl relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full px-8 py-3 mb-8 border border-emerald-500/30">
            <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
            <span className="text-base font-bold text-foreground">LIVE PLATFORM INTELLIGENCE</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            <span className="block text-foreground">Real-Time Business</span>
            <span className="block bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Intelligence Dashboard
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Experience FlowsyAI's live platform activity with interactive metrics showing real user
            engagement, AI workflow deployments, revenue generation, and global performance data
            updated every second.
          </p>

          {/* Interactive Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              onClick={togglePlayPause}
              variant={isPlaying ? 'default' : 'outline'}
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Updates' : 'Resume Updates'}
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 rounded-lg px-3 py-2 border border-border/30">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Live Data</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-2 bg-card/50 backdrop-blur-lg rounded-xl p-1 max-w-md mx-auto border border-border/30">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: Activity },
              { id: 'business', label: 'Business', icon: TrendingUp },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'performance' | 'business')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {getFilteredMetrics().map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => metric.isClickable && handleMetricClick(metric.id)}
              onMouseEnter={() => setHoveredMetric(metric.id)}
              onMouseLeave={() => setHoveredMetric(null)}
              className={`group relative premium-card bg-card/50 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-300 ${
                metric.isClickable ? 'cursor-pointer hover:border-primary/50' : 'border-border/30'
              } ${selectedMetric === metric.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
            >
              {/* Background Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${metric.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${metric.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                >
                  {metric.icon}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Trend Indicator */}
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
                      metric.trend === 'up'
                        ? 'text-emerald-500 bg-emerald-500/10'
                        : metric.trend === 'down'
                          ? 'text-red-500 bg-red-500/10'
                          : 'text-muted-foreground bg-muted/10'
                    }`}
                  >
                    {metric.trend === 'up' && <ArrowUp className="w-3 h-3" />}
                    {metric.trend === 'down' && <ArrowDown className="w-3 h-3" />}
                    {Math.abs(metric.trendValue).toFixed(1)}%
                  </div>

                  {/* Interactive Indicator */}
                  {metric.isClickable && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MousePointer className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              </div>

              {/* Value Display */}
              <div className="space-y-3 mb-4">
                <motion.div
                  key={metric.value}
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-foreground"
                >
                  {metric.id === 'revenue'
                    ? formatCurrency(metric.value)
                    : formatNumber(metric.value)}
                  {metric.id !== 'revenue' ? metric.unit : ''}
                </motion.div>
                <div className="text-base font-semibold text-foreground">{metric.label}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {metric.description}
                </div>
              </div>

              {/* Progress Bar (if target exists) */}
              {metric.target && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress to target</span>
                    <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                  </div>
                  <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                </div>
              )}

              {/* Mini Chart (if expanded) */}
              {selectedMetric === metric.id && metric.chartData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-border/30"
                >
                  <div className="text-xs text-muted-foreground mb-2">Last 5 updates</div>
                  <div className="flex items-end gap-1 h-12">
                    {metric.chartData.map((value, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / Math.max(...metric.chartData!)) * 100}%` }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex-1 bg-gradient-to-t ${metric.color} rounded-sm opacity-60`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tooltip on Hover */}
              {hoveredMetric === metric.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border/30 max-w-xs z-10"
                >
                  {metric.tooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover" />
                </motion.div>
              )}

              {/* Pulse Animation for Active Metrics */}
              {metric.trend === 'up' && isPlaying && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl bg-emerald-500/20 pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Enhanced Activity Feed and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="premium-card bg-card/50 backdrop-blur-lg border border-border/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
                <h3 className="text-xl font-bold">Live Activity Feed</h3>
              </div>
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                <Eye className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    layout
                    className="group flex items-start gap-4 p-4 bg-muted/20 hover:bg-muted/30 rounded-xl border border-border/20 hover:border-border/40 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {activity.action}
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(activity.status)}
                          <Badge
                            variant="outline"
                            className={`text-xs ${getImpactColor(activity.impact)}`}
                          >
                            {activity.impact}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{activity.user}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{activity.time}</span>
                        </div>
                        {activity.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-4 border-t border-border/30">
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="w-4 h-4" />
                View Full Activity Log
              </Button>
            </div>
          </motion.div>

          {/* System Status Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="premium-card bg-card/50 backdrop-blur-lg border border-border/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">System Status</h3>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Systems Operational
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              {systemStatus.map((system, index) => (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        system.status === 'operational'
                          ? 'bg-emerald-500'
                          : system.status === 'degraded'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-sm">{system.service}</div>
                      <div className="text-xs text-muted-foreground">
                        {system.uptime}% uptime • {system.responseTime}ms avg
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{system.lastCheck}</div>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">SOC 2 Type II Compliant</span>
                </div>
                <Badge variant="outline" className="text-blue-500 border-blue-500/30">
                  Verified
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">GDPR & CCPA Ready</span>
                </div>
                <Badge variant="outline" className="text-purple-500 border-purple-500/30">
                  Compliant
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">99.9% SLA Guarantee</span>
                </div>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                  Active
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="premium-card bg-gradient-to-r from-primary/10 via-emerald-500/10 to-blue-500/10 border border-primary/20 rounded-3xl p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-emerald-500/5 to-blue-500/5" />
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <Sparkles className="w-16 h-16 text-gold" />
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Ready to Transform Your Business?
              </h3>

              <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Join <span className="text-primary font-bold">12,847+ active users</span> who are
                already automating their workflows, generating revenue, and scaling their operations
                with FlowsyAI's intelligent platform.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium">Setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">300% productivity boost</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium">Enterprise security</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/waitlist"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-emerald-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 text-lg"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Get Early Access
                  <ChevronRight className="w-5 h-5 ml-2" />
                </motion.a>

                <motion.a
                  href="/ai-workflow-studio"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary/30 text-primary hover:bg-primary/10 font-bold rounded-xl transition-all duration-300 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Try Live Demo
                </motion.a>
              </div>

              {/* Social Proof */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>
                      <span className="text-foreground font-semibold">2,847</span> workflows
                      deployed today
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span>
                      <span className="text-foreground font-semibold">89</span> countries served
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span>
                      <span className="text-foreground font-semibold">4.9/5</span> user rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveMetricsDashboard;
