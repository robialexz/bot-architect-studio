import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  MessageCircle, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap,
  Star,
  Globe,
  Lock,
  Crown,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PremiumBuySection: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const socialPlatforms = [
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: ExternalLink,
      href: 'https://x.com/flowsyai',
      color: 'from-blue-500 to-cyan-500',
      description: 'Latest updates & news',
      followers: '12.5K',
      glow: 'shadow-blue-500/50'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: MessageCircle,
      href: 'https://t.me/flowsyai',
      color: 'from-cyan-500 to-blue-500',
      description: 'Community discussions',
      followers: '8.2K',
      glow: 'shadow-cyan-500/50'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: Users,
      href: 'https://discord.gg/flowsyai',
      color: 'from-purple-500 to-indigo-500',
      description: 'Developer community',
      followers: '15.7K',
      glow: 'shadow-purple-500/50'
    }
  ];

  const tokenFeatures = [
    { icon: Shield, text: 'Audited Smart Contract' },
    { icon: Lock, text: 'Locked Liquidity' },
    { icon: TrendingUp, text: 'Deflationary Mechanism' },
    { icon: Crown, text: 'Governance Rights' }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-purple-950/30" />
        
        {/* Animated Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
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
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-green-500/30 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Rocket className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">Join the Revolution</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
            Get $FlowAI Token
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Be part of the AI automation revolution. Get your tokens and join our thriving community of innovators.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Token Purchase Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredCard('token')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card className="relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/50 transition-all duration-500 h-full overflow-hidden group">
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={hoveredCard === 'token' ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <CardContent className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <DollarSign className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors duration-300">
                      Buy $FlowAI
                    </h3>
                    <p className="text-white/60">Premium AI Token</p>
                  </div>
                  <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>

                {/* Token Features */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {tokenFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2 text-white/80 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <feature.icon className="w-4 h-4 text-green-400" />
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Price Info */}
                <motion.div 
                  className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Current Price</span>
                    <span className="text-green-400 font-bold">$0.0234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">24h Change</span>
                    <span className="text-green-400 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +12.5%
                    </span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg rounded-xl shadow-2xl shadow-green-500/30 border border-green-400/50"
                      onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank')}
                    >
                      <DollarSign className="w-5 h-5 mr-2" />
                      Buy $FlowAI Now
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      className="w-full border-green-500/30 text-green-300 hover:bg-green-500/10 py-4 text-lg rounded-xl backdrop-blur-sm"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      View Chart
                    </Button>
                  </motion.div>
                </div>
              </CardContent>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                animate={hoveredCard === 'token' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Card>
          </motion.div>

          {/* Community Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredCard('community')}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <Card className="relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-500 h-full overflow-hidden group">
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={hoveredCard === 'community' ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <CardContent className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                      Join Community
                    </h3>
                    <p className="text-white/60">Connect & Collaborate</p>
                  </div>
                  <Badge className="ml-auto bg-purple-500/20 text-purple-300 border-purple-500/30">
                    <Globe className="w-3 h-3 mr-1" />
                    Global
                  </Badge>
                </div>

                {/* Community Stats */}
                <motion.div 
                  className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-purple-400 font-bold text-lg">36.2K</div>
                      <div className="text-white/60 text-xs">Members</div>
                    </div>
                    <div>
                      <div className="text-pink-400 font-bold text-lg">24/7</div>
                      <div className="text-white/60 text-xs">Support</div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold text-lg">150+</div>
                      <div className="text-white/60 text-xs">Countries</div>
                    </div>
                  </div>
                </motion.div>

                {/* Social Platforms */}
                <div className="space-y-3">
                  {socialPlatforms.map((platform, index) => (
                    <motion.div
                      key={platform.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10 py-4 rounded-xl justify-start group/social backdrop-blur-sm"
                        onClick={() => window.open(platform.href, '_blank')}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center mr-4 group-hover/social:scale-110 transition-transform duration-300`}>
                          <platform.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{platform.name}</div>
                          <div className="text-sm text-white/60">{platform.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white/80">{platform.followers}</div>
                          <ArrowRight className="w-4 h-4 text-white/60 group-hover/social:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                animate={hoveredCard === 'community' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/60 mb-6">
            Join thousands of innovators already using FlowsyAI
          </p>
          <div className="flex justify-center items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            <span className="text-white/80 ml-2">4.9/5 from 2,847 reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumBuySection;
