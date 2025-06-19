import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Rocket, 
  Shield, 
  Users, 
  BarChart3, 
  Globe,
  ArrowRight,
  Star,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Enhanced Features Section with Scroll Animations
export const EnhancedFeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms that adapt and learn from your workflows, providing intelligent automation suggestions.",
      color: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Process thousands of tasks per second with our optimized infrastructure and real-time execution engine.",
      color: "from-yellow-500 to-orange-500",
      delay: 0.2
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption, compliance certifications, and advanced threat protection.",
      color: "from-green-500 to-emerald-500",
      delay: 0.4
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools with real-time editing, version control, and team management features.",
      color: "from-purple-500 to-pink-500",
      delay: 0.6
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive insights and analytics with customizable dashboards and detailed performance metrics.",
      color: "from-indigo-500 to-blue-500",
      delay: 0.8
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Deploy worldwide with our global infrastructure, supporting multiple regions and languages.",
      color: "from-teal-500 to-cyan-500",
      delay: 1.0
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-900 via-black to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-6 py-2 border border-white/10 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-white/80 font-medium">Premium Features</span>
          </motion.div>
          
          <motion.h2
            className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Powerful AI Automation
          </motion.h2>
          
          <motion.p
            className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Experience next-generation AI automation with enterprise-grade features designed to scale with your business needs.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ delay: feature.delay + 0.5, duration: 0.8, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group"
            >
              <Card className="h-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                <CardContent className="p-8">
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-500`}
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced Stats Section
export const EnhancedStatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const stats = [
    { value: "50M+", label: "Tasks Automated", icon: CheckCircle, color: "text-green-400" },
    { value: "99.9%", label: "Uptime Guarantee", icon: Shield, color: "text-blue-400" },
    { value: "2,847", label: "Active Workflows", icon: TrendingUp, color: "text-purple-400" },
    { value: "150+", label: "Integrations", icon: Globe, color: "text-cyan-400" }
  ];

  return (
    <section ref={ref} className="py-20 bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Join the growing community of businesses automating their workflows with FlowsyAI
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6 group-hover:border-white/30 transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </motion.div>
              
              <motion.div
                className={`text-4xl md:text-5xl font-black mb-2 ${stat.color}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: index * 0.2 + 0.6, duration: 0.8 }}
              >
                {stat.value}
              </motion.div>
              
              <p className="text-white/70 font-medium group-hover:text-white/90 transition-colors duration-300">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced CTA Section
export const EnhancedCTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section 
      ref={ref}
      className="py-32 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20 relative overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]" />
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <Rocket className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold">Ready to Get Started?</span>
          </motion.div>
          
          <motion.h2
            className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Join the AI Revolution
          </motion.h2>
          
          <motion.p
            className="text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Don't miss out on the future of AI automation. Join thousands of businesses already transforming their workflows with FlowsyAI.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-bold rounded-2xl px-8 py-4 text-lg hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 border border-violet-400/50"
              >
                <span className="relative z-10 flex items-center">
                  <Sparkles className="w-5 h-5 mr-3" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-cyan-600/50 rounded-2xl"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="group bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 rounded-2xl px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
              >
                <Star className="w-5 h-5 mr-3" />
                Join Waitlist
                <motion.div
                  className="ml-3"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
