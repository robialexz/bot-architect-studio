import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Hand,
  Zap,
  Eye,
  Layers,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Crown,
  Sparkles,
  Target,
  Wand2,
  Rocket,
} from 'lucide-react';

const ARSection = () => {
  const [currentDemo, setCurrentDemo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGestures, setShowGestures] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const arFeatures = [
    {
      icon: Hand,
      title: 'Gesture Control',
      description: 'Point, pinch, and swipe to create AI nodes in 3D space',
      demo: 'gesture-demo',
    },
    {
      icon: Eye,
      title: 'Real-time Recognition',
      description: 'Advanced computer vision tracks your hand movements instantly',
      demo: 'recognition-demo',
    },
    {
      icon: Layers,
      title: '3D Workflow Building',
      description: 'Build complex AI workflows floating in your physical space',
      demo: 'workflow-demo',
    },
    {
      icon: Zap,
      title: 'Instant Connections',
      description: 'Connect nodes with natural hand gestures and air taps',
      demo: 'connection-demo',
    },
  ];

  const gestureTypes = [
    {
      name: 'Point to Create',
      gesture: '👉',
      description: 'Point at empty space to create new AI nodes',
    },
    {
      name: 'Pinch to Select',
      gesture: '🤏',
      description: 'Pinch to select and manipulate workflow elements',
    },
    {
      name: 'Swipe to Connect',
      gesture: '👋',
      description: 'Swipe between nodes to create connections',
    },
    {
      name: 'Tap to Configure',
      gesture: '👆',
      description: 'Air tap to open node configuration panels',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo(prev => (prev + 1) % arFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [arFeatures.length]);

  return (
    <section
      id="ar-showcase"
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-gold/5"
    >
      {/* Revolutionary Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-gold/10 animate-pulse"></div>

        {/* Iron Man-style Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        {/* Floating Holographic Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-primary/30 rounded-lg"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 2) * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotateX: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-gold/20 rounded-full px-6 py-2 mb-6">
            <Crown className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-foreground">REVOLUTIONARY TECHNOLOGY</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="block text-foreground">Build AI Workflows Like</span>
            <span className="block bg-gradient-to-r from-primary via-gold to-sapphire bg-clip-text text-transparent">
              Tony Stark
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The world's first mobile AR workflow builder. Point your phone camera, use hand
            gestures, and watch AI workflows materialize in 3D space around you. No competitor even
            comes close.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* AR Demo Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Phone Frame */}
            <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-4 shadow-2xl">
              {/* Screen */}
              <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                {/* AR Camera View */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                  {/* Simulated Camera Feed */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800"></div>
                  </div>

                  {/* Floating AR Nodes */}
                  <AnimatePresence>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-16 h-16 bg-gradient-to-r from-primary to-gold rounded-lg border border-white/30 flex items-center justify-center"
                        style={{
                          left: `${20 + i * 20}%`,
                          top: `${30 + (i % 2) * 30}%`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          y: [0, -10, 0],
                          rotateY: [0, 180, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5,
                        }}
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* AR Connections */}
                  <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                      d="M 80 200 Q 150 150 220 200 Q 290 250 360 200"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Hand Gesture Indicator */}
                  <motion.div
                    className="absolute bottom-20 right-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Hand className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Floating Elements Around Phone */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8 bg-gradient-to-r from-primary to-gold rounded-full"
                style={{
                  left: i === 0 ? '-10%' : i === 1 ? '110%' : '50%',
                  top: i === 0 ? '20%' : i === 1 ? '60%' : '-5%',
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>

          {/* AR Features & Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Revolutionary Features */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/20 to-primary/20 rounded-full px-4 py-2">
                <Wand2 className="w-4 h-4 text-gold" />
                <span className="text-sm font-semibold text-foreground">FIRST IN THE WORLD</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Revolutionary AR Workflow Building
              </h3>

              <p className="text-lg text-muted-foreground leading-relaxed">
                No competitor offers anything like this. Build complex AI workflows using natural
                hand gestures in augmented reality - just like Tony Stark's holographic interfaces.
              </p>
            </div>

            {/* AR Features Grid - Enhanced Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {arFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer ${
                    currentDemo === index
                      ? 'bg-gradient-to-br from-primary/15 to-gold/15 border-primary/50 shadow-2xl shadow-primary/20'
                      : 'bg-gradient-to-br from-background/80 to-background/60 border-primary/20 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10'
                  }`}
                  onClick={() => setCurrentDemo(index)}
                >
                  {/* Background Glow Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    currentDemo === index ? 'opacity-100' : ''
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5" />
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
                  </div>

                  <div className="relative p-8">
                    {/* Icon with Enhanced Animation */}
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300 ${
                        currentDemo === index
                          ? 'bg-gradient-to-r from-primary to-gold text-white shadow-lg'
                          : 'bg-primary/10 text-primary group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-gold group-hover:text-white'
                      }`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-8 h-8" />
                    </motion.div>

                    {/* Content */}
                    <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Active Indicator */}
                    {currentDemo === index && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-4 right-4 w-3 h-3 bg-gold rounded-full shadow-lg"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Gesture Types - Enhanced Section */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h4 className="text-2xl font-bold text-foreground mb-3 flex items-center justify-center gap-3">
                  <Hand className="w-6 h-6 text-gold" />
                  Natural Hand Gestures
                  <Hand className="w-6 h-6 text-gold scale-x-[-1]" />
                </h4>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Control your AI workflows with intuitive gestures that feel natural and responsive
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {gestureTypes.map((gesture, index) => (
                  <motion.div
                    key={gesture.name}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="group relative overflow-hidden bg-gradient-to-br from-background/90 to-primary/5 rounded-2xl border border-primary/20 hover:border-gold/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
                  >
                    <div className="p-6 text-center">
                      {/* Gesture Emoji with Animation */}
                      <motion.div
                        className="text-4xl mb-4 inline-block"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        {gesture.gesture}
                      </motion.div>

                      {/* Gesture Name */}
                      <h5 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {gesture.name}
                      </h5>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {gesture.description}
                      </p>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Call to Action - Enhanced Section */}
            <div className="space-y-8 pt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden bg-gradient-to-br from-primary/15 to-gold/15 rounded-3xl p-8 border border-primary/30 shadow-2xl shadow-primary/10"
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-gold rounded-3xl mb-6 shadow-lg"
                    >
                      <Target className="w-10 h-10 text-white" />
                    </motion.div>

                    <h4 className="text-3xl font-bold text-foreground mb-4">
                      Ready to Experience the Future?
                    </h4>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      Be among the first to build AI workflows in augmented reality. No setup required -
                      just point your phone camera and start creating.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-gold text-white hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 px-8 py-4 text-lg font-semibold"
                        asChild
                      >
                        <a href="/waitlist">
                          <Smartphone className="mr-3 h-6 w-6" />
                          Join Waitlist
                          <ArrowRight className="ml-3 h-6 w-6" />
                        </a>
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-primary/40 hover:bg-primary/10 px-8 py-4 text-lg font-semibold"
                        onClick={() => setShowGestures(!showGestures)}
                      >
                        <Eye className="mr-3 h-6 w-6" />
                        View Demo
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Competitive Advantage Highlight - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="text-center p-6 bg-gradient-to-br from-gold/10 to-amber-500/10 rounded-2xl border border-gold/30 hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                  <Crown className="w-10 h-10 text-gold mx-auto mb-4" />
                  <h5 className="text-lg font-bold text-foreground mb-2">
                    Industry First
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Revolutionary AR workflow building technology
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl border border-primary/30 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h5 className="text-lg font-bold text-foreground mb-2">
                    Zero Setup
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Just point your camera and start building
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
                  <Rocket className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                  <h5 className="text-lg font-bold text-foreground mb-2">
                    Future Ready
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Next-generation workflow automation
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ARSection;
