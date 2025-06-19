import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MessageCircle, ShoppingCart, Lock, Shield, Users, TrendingUp,
  Zap, Star, CheckCircle, ArrowRight, Sparkles, Crown, Rocket,
  Twitter, Github, Globe, Send, Linkedin, Youtube, Instagram, Chrome
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Enhanced Interactive Hero Section
const VideoHeroSection: React.FC = () => {
  const [userCount, setUserCount] = useState(12847);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/40 to-purple-950/30">
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Video with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <video
          className="w-full h-full object-cover opacity-20"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/flowsyai-demo.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Enhanced Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Live Stats Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Badge className="bg-green-500/20 border-green-500/30 text-green-300 px-6 py-3 text-lg">
            <motion.div
              key={userCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <Users className="w-4 h-4" />
              {userCount.toLocaleString()} Active Users
              <TrendingUp className="w-4 h-4" />
            </motion.div>
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Enhanced Title with Glow Effect */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight relative">
            <motion.span 
              className="bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              FlowsyAI
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.span>
          </h1>

          {/* Enhanced Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            The Future of AI Automation is Here
            <span className="block text-lg text-blue-300 mt-2">
              Revolutionary AI platform currently in development
            </span>
          </motion.p>

          {/* Development Status */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="flex items-center bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-blue-300 font-medium">In Active Development</span>
            </div>
            <div className="text-white/60">•</div>
            <div className="flex items-center bg-green-500/20 px-4 py-2 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-300 font-medium">Open Source</span>
            </div>
            <div className="text-white/60">•</div>
            <div className="flex items-center bg-purple-500/20 px-4 py-2 rounded-full border border-purple-500/30">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              <span className="text-purple-300 font-medium">Community Driven</span>
            </div>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-10 py-5 text-lg rounded-xl shadow-2xl shadow-green-500/25"
                onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank')}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/50 to-emerald-400/50"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Buy $FlowAI Now
                  <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                </span>
              </Button>
            </motion.div>

            {/* Community Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="group border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50 font-bold px-6 py-4 text-base rounded-xl backdrop-blur-sm"
                  onClick={() => window.open('https://twitter.com/flowsyai', '_blank')}
                >
                  <span className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Follow on X
                  </span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="group border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 font-bold px-6 py-4 text-base rounded-xl backdrop-blur-sm"
                  onClick={() => window.open('https://t.me/+jNmtj8qUUtMxOTVk', '_blank')}
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Join Telegram
                  </span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="group border-gray-500/30 text-gray-300 hover:bg-gray-500/10 hover:border-gray-500/50 font-bold px-6 py-4 text-base rounded-xl backdrop-blur-sm"
                  onClick={() => window.open('https://github.com/flowsyai', '_blank')}
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    View GitHub
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Urgency Indicator */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 text-red-300">
              <motion.div
                className="w-2 h-2 bg-red-400 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-sm font-medium">Limited Time: Early Adopter Pricing</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Custom SVG Components for Brand Logos
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const RedditLogo = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="#FF4500">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

const TelegramLogo = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="#0088cc">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const DiscordLogo = () => (
  <svg viewBox="0 0 24 24" className="w-12 h-12" fill="#5865F2">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
  </svg>
);

// Social Media & Partners Scrolling Banner
const ScrollingBanner: React.FC = () => {
  const platforms = [
    {
      name: "Google",
      icon: <GoogleLogo />,
      color: "from-blue-500 to-green-500",
      url: "https://google.com"
    },
    {
      name: "X (Twitter)",
      icon: <Twitter className="w-12 h-12 text-black" />,
      color: "from-gray-800 to-gray-600",
      url: "https://twitter.com/flowsyai"
    },
    {
      name: "Reddit",
      icon: <RedditLogo />,
      color: "from-orange-500 to-red-500",
      url: "https://reddit.com/r/flowsyai"
    },
    {
      name: "Telegram",
      icon: <TelegramLogo />,
      color: "from-blue-500 to-cyan-500",
      url: "https://t.me/+jNmtj8qUUtMxOTVk"
    },
    {
      name: "Discord",
      icon: <DiscordLogo />,
      color: "from-indigo-500 to-purple-500",
      url: "https://discord.gg/flowsyai"
    },
    {
      name: "GitHub",
      icon: <Github className="w-12 h-12 text-white" />,
      color: "from-gray-700 to-gray-900",
      url: "https://github.com/flowsyai"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-12 h-12 text-blue-600" />,
      color: "from-blue-600 to-blue-800",
      url: "https://linkedin.com/company/flowsyai"
    },
    {
      name: "YouTube",
      icon: <Youtube className="w-12 h-12 text-red-600" />,
      color: "from-red-600 to-red-800",
      url: "https://youtube.com/@flowsyai"
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-12 h-12 text-pink-500" />,
      color: "from-pink-500 to-purple-600",
      url: "https://instagram.com/flowsyai"
    }
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedPlatforms = [...platforms, ...platforms, ...platforms];

  return (
    <section className="py-16 bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-purple-500/20 border-purple-500/30 text-purple-300">
            <Globe className="w-4 h-4 mr-2" />
            Global Presence
          </Badge>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Connect With Us Everywhere
          </h3>
          <p className="text-white/70 max-w-2xl mx-auto">
            Join our growing community across all major platforms and stay updated with the latest FlowsyAI developments
          </p>
        </motion.div>

        {/* Scrolling Banner */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-slate-950 to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-12 py-8"
              animate={{
                x: [0, `-${(platforms.length * 96)}px`],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: `${(platforms.length * 96) * 3}px` }}
            >
              {duplicatedPlatforms.map((platform, index) => (
                <motion.div
                  key={`${platform.name}-${index}`}
                  className="flex-shrink-0 group cursor-pointer flex flex-col items-center"
                  whileHover={{ scale: 1.2, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => window.open(platform.url, '_blank')}
                >
                  <motion.div
                    className="w-16 h-16 flex items-center justify-center"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {platform.icon}
                    </div>
                  </motion.div>
                  <div className="text-center mt-2">
                    <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                      {platform.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 mb-6">Follow us for updates, news, and exclusive content</p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50"
                onClick={() => window.open('https://t.me/+jNmtj8qUUtMxOTVk', '_blank')}
              >
                <Send className="w-4 h-4 mr-2" />
                Join Telegram
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"
                onClick={() => window.open('https://twitter.com/flowsyai', '_blank')}
              >
                <Twitter className="w-4 h-4 mr-2" />
                Follow on X
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Interactive Workflow Section
const AIWorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const workflowSteps = [
    {
      step: "1",
      title: "Connect",
      description: "Link your tools and data sources seamlessly",
      icon: "🔗",
      details: "Integrate with 500+ apps and services",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "2",
      title: "Automate",
      description: "AI creates intelligent workflows instantly",
      icon: "🤖",
      details: "Advanced AI processes your data intelligently",
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "3",
      title: "Scale",
      description: "Watch your productivity multiply exponentially",
      icon: "🚀",
      details: "Handle 10x more work with same resources",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-900/95 to-blue-950/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-6 bg-blue-500/20 border-blue-500/30 text-blue-300">
            <Zap className="w-4 h-4 mr-2" />
            How It Works
          </Badge>

          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Automation Made Simple
            </span>
          </h2>

          <p className="text-xl text-white/80 mb-8">
            Transform your workflow in three powerful steps
          </p>

          {/* Success Metrics */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { value: "500%", label: "Productivity Increase" },
              { value: "24/7", label: "Automated Operations" },
              { value: "99.9%", label: "Uptime Guarantee" }
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl font-bold text-green-400">{metric.value}</div>
                <div className="text-sm text-white/60">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Workflow Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {workflowSteps.map((item, index) => (
            <motion.div
              key={index}
              className={`group relative cursor-pointer transition-all duration-500 ${
                activeStep === index ? 'scale-105' : 'hover:scale-102'
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              onHoverStart={() => setActiveStep(index)}
              whileHover={{ y: -10 }}
            >
              <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full transition-all duration-500 ${
                activeStep === index ? 'border-white/30 bg-white/10' : 'hover:border-white/20'
              }`}>
                {/* Step Number with Glow */}
                <div className="relative mb-6">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto relative`}
                    animate={activeStep === index ? {
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 40px rgba(59, 130, 246, 0.5)",
                        "0 0 20px rgba(59, 130, 246, 0.3)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                  </motion.div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-white/70 mb-4 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {item.description}
                </p>

                <motion.div
                  className="text-sm text-blue-300 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeStep === index ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.details}
                </motion.div>

                {/* Interactive Progress Bar */}
                <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: activeStep === index ? "100%" : "60%" }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>

                {/* Connection Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 transform -translate-y-1/2 z-10">
                    <motion.div
                      className="absolute -right-2 -top-2 w-4 h-4 text-blue-400"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-2xl shadow-blue-500/25"
              onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank')}
            >
              <span className="flex items-center gap-3">
                <Rocket className="w-5 h-5" />
                Start Your AI Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Token Distribution with Social Proof
const TokenDistributionSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const distributionData = [
    {
      label: "Public Sale",
      percentage: "90%",
      amount: "900M",
      color: "from-blue-500 to-cyan-500",
      description: "Majority of tokens allocated for public sale, ensuring wide distribution and community ownership"
    },
    {
      label: "Dev Wallet (Locked)",
      percentage: "10%",
      amount: "100M",
      color: "from-green-500 to-emerald-500",
      description: "Reserved for development and team incentives. Locked until $10M market cap. At $10M MC, 5% of this wallet (0.5% of total supply) will be burned"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-black via-slate-950/50 to-green-950/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 left-1/5 w-72 h-72 bg-green-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-6 bg-green-500/20 border-green-500/30 text-green-300">
            <Crown className="w-4 h-4 mr-2" />
            Tokenomics
          </Badge>

          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              FlowsyAI Tokenomics
            </span>
          </h2>

          <p className="text-xl text-white/80 mb-8">
            A balanced and sustainable token distribution designed to foster long-term growth and community engagement
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
            <motion.div
              className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-6 py-3"
              whileHover={{ scale: 1.05 }}
            >
              <Lock className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-semibold">Dev Wallet Locked</span>
              <Shield className="w-5 h-5 text-green-400" />
            </motion.div>

            <motion.div
              className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-6 py-3"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-semibold">Audited Contract</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-6 py-3"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold">Deflationary Model</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive Distribution Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {distributionData.map((item, index) => (
            <motion.div
              key={index}
              className="group relative cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center h-full transition-all duration-500 ${
                hoveredIndex === index ? 'border-white/30 bg-white/10' : 'hover:border-white/20'
              }`}>
                {/* Percentage with Glow */}
                <motion.div
                  className="relative mb-4"
                  animate={hoveredIndex === index ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.percentage}
                  </div>
                  {hoveredIndex === index && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-xl -z-10`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.label}
                </h3>

                <div className="text-white/60 mb-3">{item.amount} tokens</div>

                {/* Description on Hover */}
                <motion.div
                  className="text-sm text-white/70 leading-relaxed"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    height: hoveredIndex === index ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.description}
                </motion.div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    whileInView={{ width: item.percentage }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  />
                </div>

                {/* Special Lock Icon for Team */}
                {item.label.includes('Locked') && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Lock className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Token Allocation Overview */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">⏰</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Token Allocation Overview</h3>
            </div>

            <p className="text-white/80 text-center mb-6 leading-relaxed">
              The FlowsyAI token ($FSY) distribution is strategically planned to support the ecosystem's growth,
              development, and community. Below is a summary of the allocation categories:
            </p>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-blue-300 font-medium">Public Sale:</span>
                <span className="text-white font-bold">90%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-green-300 font-medium">Dev Wallet (Locked):</span>
                <span className="text-white font-bold">10%</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium text-sm">View Lock Contract</span>
              </div>
              <p className="text-white/70 text-sm">
                Transparency and security are our priorities. All locked tokens are verifiable on-chain.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Total Supply with Animation */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block bg-gradient-to-r from-white/10 to-green-500/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <motion.div
              className="text-4xl md:text-5xl font-bold text-white mb-2"
              animate={{
                textShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.5)",
                  "0 0 20px rgba(34, 197, 94, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              1B Total Supply
            </motion.div>
            <div className="text-white/70 text-lg">Fixed supply - No inflation</div>
            <div className="text-green-400 text-sm mt-2 font-medium">Deflationary through token burns</div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-10 py-5 text-lg rounded-xl shadow-2xl shadow-green-500/25"
              onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank')}
            >
              <span className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5" />
                Secure Your $FlowAI Tokens
                <Sparkles className="w-5 h-5 group-hover:animate-spin" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Final CTA with Social Proof & Urgency
const FinalCTASection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechFlow",
      content: "FlowsyAI transformed our operations. 500% productivity increase in just 2 months!",
      avatar: "👩‍💼"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO, DataSync",
      content: "The AI automation is incredible. We're processing 10x more data with the same team.",
      avatar: "👨‍💻"
    },
    {
      name: "Emily Watson",
      role: "Founder, AutoScale",
      content: "Best investment we made this year. ROI was immediate and continues to grow.",
      avatar: "👩‍🚀"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950/20 to-purple-950/20 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Testimonials Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-yellow-500/20 border-yellow-500/30 text-yellow-300">
              <Star className="w-4 h-4 mr-2" />
              Customer Success Stories
            </Badge>
            <h3 className="text-3xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-white/60">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {/* Urgency Timer */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
              <div className="text-red-300 font-semibold mb-4">⚡ Limited Time Offer Ends In:</div>
              <div className="flex justify-center gap-4">
                {[
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="bg-white/10 rounded-xl p-3 min-w-[80px]"
                    animate={{ scale: item.label === 'Seconds' ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="text-2xl font-bold text-white">{item.value.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-white/60">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <Badge className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-500/30 px-8 py-4 text-xl">
            <Rocket className="w-6 h-6 mr-3" />
            Ready to Transform Your Business?
            <Crown className="w-6 h-6 ml-3" />
          </Badge>

          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Join the
            </span>
            <br />
            <motion.span
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              AI Revolution
            </motion.span>
          </h2>

          <motion.p
            className="text-2xl md:text-3xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Don't miss out on the future of AI automation. Get your $FlowAI tokens and be part of the revolution that's transforming how businesses operate.
          </motion.p>

          {/* Enhanced Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-8 justify-center items-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-12 py-6 text-xl rounded-2xl shadow-2xl shadow-green-500/30 border border-green-400/50"
                onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank')}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-600/50 to-emerald-600/50 rounded-2xl"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Buy $FlowAI Now
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-6 h-6" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>

            {/* Community Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="group border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/50 font-bold px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                  onClick={() => window.open('https://twitter.com/flowsyai', '_blank')}
                >
                  <span className="flex items-center gap-2">
                    <Twitter className="w-5 h-5" />
                    Follow on X
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="group border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/50 font-bold px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                  onClick={() => window.open('https://t.me/+jNmtj8qUUtMxOTVk', '_blank')}
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Join Telegram
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="group border-gray-500/30 text-gray-300 hover:bg-gray-500/10 hover:border-gray-500/50 font-bold px-8 py-4 text-lg rounded-xl backdrop-blur-sm"
                  onClick={() => window.open('https://github.com/flowsyai', '_blank')}
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    View GitHub
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Final Social Proof */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 text-white/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No Lock-up Period</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Audited Smart Contract</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Instant Trading</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const LandingV2Premium: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* 1. Video Hero Section - Enhanced and Interactive */}
      <VideoHeroSection />

      {/* 2. Social Media Banner - Global Presence */}
      <ScrollingBanner />

      {/* 3. AI Workflow Section - Interactive and Engaging */}
      <AIWorkflowSection />

      {/* 4. Token Distribution Section - Transparent Tokenomics */}
      <TokenDistributionSection />

      {/* 5. Final CTA Section - Social Proof & Urgency */}
      <FinalCTASection />
    </div>
  );
};

export default LandingV2Premium;
