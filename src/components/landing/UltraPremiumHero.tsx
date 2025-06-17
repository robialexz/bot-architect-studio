import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  ArrowRight, 
  Star,
  TrendingUp,
  Users,
  Bot,
  Zap,
  Award,
  CheckCircle2,
  Sparkles,
  Globe,
  Shield,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UltraPremiumHero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setIsVideoLoaded(true));
    }
  }, []);

  const awards = [
    { icon: <Award className="w-4 h-4" />, text: "AI Innovation Award 2024" },
    { icon: <Shield className="w-4 h-4" />, text: "SOC2 Certified" },
    { icon: <Globe className="w-4 h-4" />, text: "Global Enterprise Ready" }
  ];

  const metrics = [
    { value: "99.9%", label: "Uptime SLA", icon: <Clock className="w-5 h-5" /> },
    { value: "10K+", label: "Enterprise Users", icon: <Users className="w-5 h-5" /> },
    { value: "50M+", label: "Tasks Automated", icon: <Bot className="w-5 h-5" /> },
    { value: "300%", label: "ROI Average", icon: <TrendingUp className="w-5 h-5" /> }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 4K Video Background with Multiple Sources */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          {/* 4K Sources - Multiple formats for compatibility */}
          <source src="/assets/videos/ai-workflow-4k.mp4" type="video/mp4" />
          <source src="/assets/videos/ai-workflow-4k.webm" type="video/webm" />
          <source src="/assets/videos/ai-workflow-hd.mp4" type="video/mp4" />
          {/* Fallback poster */}
        </video>
        
        {/* Dynamic gradient overlay that responds to mouse */}
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%)`
          }}
        />
      </div>

      {/* Animated Particle System */}
      <div className="absolute inset-0 z-10">
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Premium Awards Banner */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-wrap justify-center gap-4">
          {awards.map((award, index) => (
            <Badge 
              key={index}
              className="bg-black/40 backdrop-blur-md border-white/20 text-white px-4 py-2 text-xs font-medium hover:bg-black/60 transition-all duration-300"
            >
              {award.icon}
              <span className="ml-2">{award.text}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        {/* Premium Badge */}
        <div className="mb-8 animate-fade-in">
          <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-500/30 px-8 py-3 text-base font-medium backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 mr-3" />
            Enterprise-Grade AI Workflow Automation
            <CheckCircle2 className="w-5 h-5 ml-3 text-green-400" />
          </Badge>
        </div>

        {/* Ultra-Premium Headlines */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 animate-slide-up leading-tight">
          <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            Transform Your
          </span>
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
            Business with AI
          </span>
        </h1>

        {/* Enhanced Subheadline */}
        <p className="text-2xl md:text-3xl text-gray-200 mb-6 max-w-5xl mx-auto leading-relaxed animate-slide-up font-light" style={{ animationDelay: '0.2s' }}>
          Build, deploy, and scale intelligent workflows that 
          <span className="text-blue-400 font-semibold"> increase productivity by 300%</span> and 
          <span className="text-purple-400 font-semibold"> reduce costs by 60%</span>
        </p>

        {/* ROI Guarantee */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="inline-block bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl px-6 py-3 backdrop-blur-sm">
            <span className="text-emerald-300 font-semibold text-lg">
              💰 Guaranteed 10x ROI in 90 days or money back
            </span>
          </div>
        </div>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            onClick={() => navigate('/waitlist')}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/40 transform hover:scale-110 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />
            <Star className="w-6 h-6 mr-3 group-hover:rotate-180 transition-transform duration-500" />
            Start Free Enterprise Trial
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank')}
            className="border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-12 py-6 text-xl font-bold rounded-2xl backdrop-blur-sm transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <TrendingUp className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Invest in $FlowAI Token</span>
          </Button>
        </div>

        {/* Enterprise Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {metrics.map((metric, index) => (
            <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 group-hover:border-blue-400/60 transition-colors duration-300">
                  {metric.icon}
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                {metric.value}
              </div>
              <div className="text-gray-400 text-sm font-medium">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator with Animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mt-2 animate-pulse" />
          </div>
          <span className="text-white/60 text-xs font-medium">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default UltraPremiumHero;
