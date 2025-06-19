import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Rocket, 
  Bot, 
  Layers, 
  Star, 
  Globe, 
  Shield, 
  BarChart3, 
  Users,
  Workflow,
  Database,
  Cloud,
  Lock,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const CustomInfinityBrand: React.FC = () => {
  const features = [
    { Icon: Brain, name: 'AI Intelligence', color: 'from-blue-400 to-cyan-400', glow: 'shadow-blue-500/50' },
    { Icon: Zap, name: 'Lightning Fast', color: 'from-yellow-400 to-orange-400', glow: 'shadow-yellow-500/50' },
    { Icon: Rocket, name: 'Rapid Deploy', color: 'from-purple-400 to-pink-400', glow: 'shadow-purple-500/50' },
    { Icon: Bot, name: 'Smart Automation', color: 'from-cyan-400 to-blue-400', glow: 'shadow-cyan-500/50' },
    { Icon: Layers, name: 'Multi-Layer AI', color: 'from-green-400 to-emerald-400', glow: 'shadow-green-500/50' },
    { Icon: Star, name: 'Premium Quality', color: 'from-pink-400 to-rose-400', glow: 'shadow-pink-500/50' },
    { Icon: Globe, name: 'Global Scale', color: 'from-indigo-400 to-purple-400', glow: 'shadow-indigo-500/50' },
    { Icon: Shield, name: 'Enterprise Security', color: 'from-emerald-400 to-green-400', glow: 'shadow-emerald-500/50' },
    { Icon: BarChart3, name: 'Advanced Analytics', color: 'from-orange-400 to-red-400', glow: 'shadow-orange-500/50' },
    { Icon: Users, name: 'Team Collaboration', color: 'from-violet-400 to-purple-400', glow: 'shadow-violet-500/50' },
    { Icon: Workflow, name: 'Smart Workflows', color: 'from-teal-400 to-cyan-400', glow: 'shadow-teal-500/50' },
    { Icon: Database, name: 'Data Processing', color: 'from-slate-400 to-gray-400', glow: 'shadow-slate-500/50' },
    { Icon: Cloud, name: 'Cloud Native', color: 'from-sky-400 to-blue-400', glow: 'shadow-sky-500/50' },
    { Icon: Lock, name: 'Secure by Design', color: 'from-red-400 to-pink-400', glow: 'shadow-red-500/50' },
    { Icon: TrendingUp, name: 'Performance Boost', color: 'from-lime-400 to-green-400', glow: 'shadow-lime-500/50' },
    { Icon: Sparkles, name: 'AI Magic', color: 'from-fuchsia-400 to-pink-400', glow: 'shadow-fuchsia-500/50' }
  ];

  return (
    <div className="relative w-full py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-slate-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="customGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5">
                <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="4s" repeatCount="indefinite" />
              </path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#customGrid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold">Powered by FlowsyAI</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
            Next-Gen AI Features
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the full power of artificial intelligence with our comprehensive suite of automation tools
          </p>
        </motion.div>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
          
          {/* Scrolling Content */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -2000] }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* First Set */}
              {features.map((feature, index) => (
                <motion.div
                  key={`first-${index}`}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-2xl ${feature.glow} min-w-[280px]`}>
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                          {feature.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-white/60 text-sm ml-2">Premium</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                         style={{ 
                           background: 'linear-gradient(45deg, transparent, transparent), linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
                           backgroundClip: 'padding-box, border-box',
                           backgroundOrigin: 'padding-box, border-box'
                         }} />
                  </div>
                </motion.div>
              ))}
              
              {/* Duplicate Set for Seamless Loop */}
              {features.map((feature, index) => (
                <motion.div
                  key={`second-${index}`}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-2xl ${feature.glow} min-w-[280px]`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <feature.Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                          {feature.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                          <span className="text-white/60 text-sm ml-2">Premium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-8 mt-12 flex-wrap"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">16+</div>
            <div className="text-white/60 text-sm">AI Features</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">99.9%</div>
            <div className="text-white/60 text-sm">Uptime</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">10M+</div>
            <div className="text-white/60 text-sm">Workflows</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomInfinityBrand;
