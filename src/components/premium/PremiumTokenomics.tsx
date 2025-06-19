import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  PieChart, 
  Lock, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap, 
  Globe, 
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Crown,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PremiumTokenomics: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const distributionData = [
    { 
      id: 1,
      label: "Public Sale", 
      percentage: 40, 
      color: "from-blue-500 to-cyan-500", 
      amount: "400M",
      description: "Available for public purchase on DEX",
      features: ["Immediate liquidity", "Fair launch", "No presale"],
      icon: Users,
      status: "active"
    },
    { 
      id: 2,
      label: "Liquidity Pool", 
      percentage: 25, 
      color: "from-green-500 to-emerald-500", 
      amount: "250M",
      description: "Locked liquidity for trading stability",
      features: ["Permanent lock", "Price stability", "Trading support"],
      icon: TrendingUp,
      status: "locked"
    },
    { 
      id: 3,
      label: "Development", 
      percentage: 20, 
      color: "from-purple-500 to-pink-500", 
      amount: "200M",
      description: "Platform development and improvements",
      features: ["Vested release", "Development milestones", "Community voting"],
      icon: Zap,
      status: "vested"
    },
    { 
      id: 4,
      label: "Marketing", 
      percentage: 10, 
      color: "from-yellow-500 to-orange-500", 
      amount: "100M",
      description: "Community growth and partnerships",
      features: ["Strategic partnerships", "Community rewards", "Growth initiatives"],
      icon: Globe,
      status: "active"
    },
    { 
      id: 5,
      label: "Team (Locked)", 
      percentage: 5, 
      color: "from-red-500 to-rose-500", 
      amount: "50M",
      description: "Team allocation with 2-year lock",
      features: ["2-year lock", "Vesting schedule", "Performance based"],
      icon: Lock,
      status: "locked"
    }
  ];

  const securityFeatures = [
    { icon: Shield, title: "Audited Contract", description: "Smart contract audited by leading security firms" },
    { icon: Lock, title: "Locked Liquidity", description: "Liquidity permanently locked for investor protection" },
    { icon: CheckCircle, title: "Verified Team", description: "Fully doxxed and verified development team" },
    { icon: TrendingUp, title: "Deflationary", description: "Built-in burn mechanism reduces total supply" }
  ];

  const totalSupply = 1000000000; // 1B tokens

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-green-950/20 to-slate-950" />
        
        {/* Animated Financial Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="financialGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="1" fill="rgba(34, 197, 94, 0.6)">
                  <animate attributeName="r" values="0.5;2;0.5" dur="4s" repeatCount="indefinite" />
                </circle>
                <path d="M0,40 Q20,20 40,40 T80,40" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" fill="none">
                  <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur="3s" repeatCount="indefinite" />
                </path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#financialGrid)" />
          </svg>
        </div>

        {/* Floating Dollar Signs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400/20 text-2xl font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -80, -20],
              opacity: [0, 0.6, 0],
              rotate: [0, 360, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            $
          </motion.div>
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
            className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-sm rounded-full px-6 py-3 border border-green-500/30 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <PieChart className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Transparent Tokenomics</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
            $FlowAI Distribution
          </h2>
          
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-8">
            Fair and transparent token distribution with locked development funds ensuring long-term commitment
          </p>

          {/* Security Badges */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">
              <Lock className="w-4 h-4 mr-2" />
              Dev Wallet Locked
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Audited Contract
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              Premium Token
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Interactive Pie Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 h-full">
              <CardContent className="p-0">
                <div className="aspect-square max-w-md mx-auto relative">
                  {/* Pie Chart Visualization */}
                  <div className="relative w-full h-full">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                      {distributionData.map((segment, index) => {
                        const startAngle = distributionData.slice(0, index).reduce((sum, s) => sum + (s.percentage * 3.6), 0);
                        const endAngle = startAngle + (segment.percentage * 3.6);
                        const largeArcFlag = segment.percentage > 50 ? 1 : 0;
                        
                        const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                        const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                        const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                        const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                        
                        const pathData = [
                          `M 100 100`,
                          `L ${x1} ${y1}`,
                          `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          'Z'
                        ].join(' ');

                        return (
                          <motion.path
                            key={segment.id}
                            d={pathData}
                            className={`cursor-pointer transition-all duration-300 ${
                              selectedSegment === segment.id ? 'opacity-100' : 'opacity-80 hover:opacity-90'
                            }`}
                            fill={`url(#gradient-${segment.id})`}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                            onHoverStart={() => setSelectedSegment(segment.id)}
                            onHoverEnd={() => setSelectedSegment(null)}
                            whileHover={{ scale: 1.05 }}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: index * 0.2, duration: 1 }}
                          />
                        );
                      })}
                      
                      {/* Gradients */}
                      <defs>
                        {distributionData.map((segment) => (
                          <linearGradient key={segment.id} id={`gradient-${segment.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={segment.color.split(' ')[1]} />
                            <stop offset="100%" stopColor={segment.color.split(' ')[3]} />
                          </linearGradient>
                        ))}
                      </defs>
                    </svg>

                    {/* Center Info */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-black/50 backdrop-blur-sm rounded-full w-32 h-32 flex flex-col items-center justify-center border border-white/20">
                        <div className="text-3xl font-bold text-white">1B</div>
                        <div className="text-white/60 text-sm">Total Supply</div>
                      </div>
                    </div>

                    {/* Floating Percentages */}
                    {distributionData.map((segment, index) => {
                      const angle = distributionData.slice(0, index).reduce((sum, s) => sum + (s.percentage * 3.6), 0) + (segment.percentage * 3.6) / 2;
                      const x = 100 + 110 * Math.cos((angle * Math.PI) / 180);
                      const y = 100 + 110 * Math.sin((angle * Math.PI) / 180);
                      
                      return (
                        <motion.div
                          key={segment.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                            selectedSegment === segment.id ? 'scale-110' : ''
                          } transition-transform duration-300`}
                          style={{ left: `${(x / 200) * 100}%`, top: `${(y / 200) * 100}%` }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                        >
                          <div className={`bg-gradient-to-r ${segment.color} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-white/20`}>
                            {segment.percentage}%
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Distribution Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {distributionData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
                onHoverStart={() => setSelectedSegment(item.id)}
                onHoverEnd={() => setSelectedSegment(null)}
              >
                <Card className={`bg-white/5 backdrop-blur-sm border transition-all duration-300 group-hover:scale-105 overflow-hidden ${
                  selectedSegment === item.id ? 'border-white/50 shadow-2xl' : 'border-white/10 hover:border-white/30'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold text-lg">{item.label}</span>
                            {item.status === 'locked' && (
                              <Lock className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <p className="text-white/60 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-xl">{item.percentage}%</div>
                        <div className="text-white/60 text-sm">{item.amount}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-4">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${item.percentage}%` } : { width: 0 }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                      />
                    </div>

                    {/* Features */}
                    <AnimatePresence>
                      {selectedSegment === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          {item.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-8">Security & Trust</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 + 1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                    <p className="text-white/60 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTokenomics;
