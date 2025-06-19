import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Download,
  Share2,
  Heart,
  Bookmark,
  Sparkles, 
  Star,
  Zap,
  Eye,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PremiumVideoHeroComplete: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(154);
  const [views, setViews] = useState(15420);

  const videoRef = useRef<HTMLDivElement>(null);
  const actualVideoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Auto-start video when component mounts
  useEffect(() => {
    const videoElement = actualVideoRef.current;
    if (videoElement) {
      // Ensure video plays automatically
      videoElement.play().catch(error => {
        console.log('Autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <motion.section
      ref={videoRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ opacity }}
    >
      {/* Full Screen Video Background */}
      <div className="absolute inset-0">
        <video
          ref={actualVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => {
            if (actualVideoRef.current) {
              setDuration(actualVideoRef.current.duration);
            }
          }}
          onTimeUpdate={() => {
            if (actualVideoRef.current) {
              setCurrentTime(actualVideoRef.current.currentTime);
            }
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully');
            setViews(prev => prev + 1);
          }}
          onError={(e) => console.error('Video error:', e)}
          style={{
            pointerEvents: 'none', // Prevent any interaction with video
            userSelect: 'none'     // Prevent text selection
          }}
        >
          <source src="/videos/flowsyai-demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay Content - Improved Spacing */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 flex items-center justify-center">
        <div className="relative z-10 container mx-auto px-6 text-center max-w-6xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Badge className="bg-black/70 backdrop-blur-md text-white border-white/40 px-8 py-4 text-xl shadow-2xl">
              <Sparkles className="w-6 h-6 mr-3" />
              FlowsyAI Live Demo
              <Eye className="w-6 h-6 ml-3" />
            </Badge>
          </motion.div>

          {/* Main Title - Better Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] drop-shadow-2xl">
              <span className="block bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4">
                AI Automation
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                In Action
              </span>
            </h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Watch FlowsyAI transform complex workflows into simple, intelligent automation
            </motion.p>
          </motion.div>

          {/* Video Stats Overlay - Better Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-4 mb-12"
          >
            <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-full px-6 py-3 border border-white/40 shadow-xl">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="text-white text-base font-semibold">{formatViews(views)} views</span>
            </div>

            <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-full px-6 py-3 border border-white/40 shadow-xl">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-white text-base font-semibold">Live Demo</span>
            </div>

            <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-full px-6 py-3 border border-white/40 shadow-xl">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-white text-base font-semibold">4.9</span>
            </div>
          </motion.div>

          {/* Action Buttons - Better Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-10 py-5 rounded-xl shadow-2xl shadow-blue-500/40 border border-blue-400/50 text-lg"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Try FlowsyAI Now
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-black/40 hover:bg-black/60 text-white border-white/60 hover:border-white/80 font-bold px-10 py-5 rounded-xl backdrop-blur-md text-lg"
            >
              <TrendingUp className="w-6 h-6 mr-3" />
              Learn More
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

    </motion.section>
  );
};

export default PremiumVideoHeroComplete;
