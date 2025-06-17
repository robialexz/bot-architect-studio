import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  Play,
  TrendingUp,
  Users,
  Building,
  Award,
  Quote,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Shield,
  Target,
  Sparkles,
  Brain
} from 'lucide-react';

// 3D Floating Card Component
const FloatingTestimonialCard: React.FC<{
  testimonial: any;
  isActive: boolean;
  index: number;
}> = ({ testimonial, isActive, index }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / 20;
    const deltaY = (e.clientY - centerY) / 20;
    setMousePos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative transition-all duration-700 ease-out cursor-pointer
        ${isActive ? 'scale-105 z-20' : 'scale-95 opacity-60 z-10'}
      `}
      style={{
        transform: `
          perspective(1000px)
          rotateX(${mousePos.y}deg)
          rotateY(${mousePos.x}deg)
          translateZ(${isActive ? '50px' : '0px'})
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow Effect */}
      {isActive && (
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
      )}

      {/* Card Content */}
      <div className="relative bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Stars */}
        <div className="flex items-center mb-6 relative z-10">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-6 h-6 text-yellow-400 fill-current mr-1 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Quote */}
        <Quote className="w-12 h-12 text-blue-400 mb-6 relative z-10" />

        {/* Content */}
        <p className="text-xl text-gray-200 leading-relaxed mb-8 relative z-10">
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <div className="text-white font-bold text-lg">{testimonial.name}</div>
            <div className="text-gray-400">{testimonial.role}</div>
            <div className="text-blue-400 text-sm">{testimonial.company}</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 relative z-10">
          {Object.entries(testimonial.metrics).map(([key, value]) => (
            <div key={key} className="text-center p-3 bg-gray-900/50 rounded-xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400">{value}</div>
              <div className="text-gray-400 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UltraSocialProofSection: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const industryStats = [
    { label: "AI Workflows Created", value: "50,000+", color: "from-blue-400 to-cyan-400" },
    { label: "Tasks Automated Daily", value: "2.4M", color: "from-purple-400 to-pink-400" },
    { label: "Enterprise Clients", value: "500+", color: "from-emerald-400 to-teal-400" },
    { label: "Uptime Guarantee", value: "99.9%", color: "from-yellow-400 to-orange-400" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO",
      company: "TechCorp Global",
      avatar: "/assets/avatars/sarah-chen-4k.jpg",
      content: "FlowsyAI transformed our entire data processing pipeline. What used to take our team 40 hours per week now happens automatically in minutes. The ROI was immediate and substantial.",
      rating: 5,
      metrics: { roi: "340%", timeSaved: "40 hours/week", efficiency: "95%" },
      videoUrl: "/assets/videos/testimonial-sarah-4k.mp4",
      industry: "Technology"
    },
    {
      name: "Marcus Rodriguez",
      role: "VP of Operations",
      company: "Global Manufacturing Inc",
      avatar: "/assets/avatars/marcus-rodriguez-4k.jpg",
      content: "The AI workflow automation has revolutionized our manufacturing processes. We've reduced errors by 90% and increased production efficiency by 60%. It's like having a team of experts working 24/7.",
      rating: 5,
      metrics: { roi: "280%", timeSaved: "35 hours/week", efficiency: "90%" },
      videoUrl: "/assets/videos/testimonial-marcus-4k.mp4",
      industry: "Manufacturing"
    },
    {
      name: "Emily Watson",
      role: "Chief Innovation Officer",
      company: "FinanceFirst Bank",
      avatar: "/assets/avatars/emily-watson-4k.jpg",
      content: "FlowsyAI's compliance automation has been a game-changer for our regulatory reporting. We've cut compliance costs by 70% while improving accuracy to 99.9%. The peace of mind is invaluable.",
      rating: 5,
      metrics: { roi: "420%", timeSaved: "50 hours/week", efficiency: "99%" },
      videoUrl: "/assets/videos/testimonial-emily-4k.mp4",
      industry: "Finance"
    }
  ];

  const caseStudies = [
    {
      company: "Global Retail Chain",
      industry: "E-commerce",
      challenge: "Manual order processing causing delays",
      solution: "Automated order-to-fulfillment workflow",
      results: ["300% faster processing", "99.5% accuracy", "$2M annual savings"],
      icon: <Building className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      company: "Healthcare Network",
      industry: "Healthcare",
      challenge: "Patient data management inefficiencies",
      solution: "AI-powered patient care coordination",
      results: ["50% faster patient intake", "95% satisfaction rate", "40% cost reduction"],
      icon: <Shield className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500"
    },
    {
      company: "Financial Services",
      industry: "Banking",
      challenge: "Complex regulatory compliance",
      solution: "Automated compliance monitoring",
      results: ["100% compliance rate", "70% cost reduction", "Real-time reporting"],
      icon: <Target className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Enterprise Customers", icon: <Users className="w-6 h-6" /> },
    { value: "50M+", label: "Tasks Automated", icon: <Zap className="w-6 h-6" /> },
    { value: "99.9%", label: "Uptime SLA", icon: <Shield className="w-6 h-6" /> },
    { value: "$500M+", label: "Cost Savings Generated", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08)_0%,transparent_50%)]"
          style={{
            transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-3 mb-8">
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-medium">Trusted by Industry Leaders</span>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>

          <h2 className="text-6xl md:text-8xl font-black mb-8">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powering Success
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          
          {/* Industry Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {industryStats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 group-hover:border-blue-400/60 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Floating Testimonials */}
        <div className="mb-20">
          <div className="relative" style={{ perspective: '1000px' }}>
            {/* Main Testimonial Display */}
            <div className="flex justify-center items-center min-h-[600px] relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`
                    absolute transition-all duration-1000 ease-out
                    ${index === activeTestimonial ? 'z-20' : 'z-10'}
                  `}
                  style={{
                    transform: `
                      translateX(${(index - activeTestimonial) * 400}px)
                      translateZ(${index === activeTestimonial ? '0px' : '-200px'})
                      rotateY(${(index - activeTestimonial) * 15}deg)
                    `,
                    opacity: Math.abs(index - activeTestimonial) <= 1 ? 1 : 0,
                  }}
                >
                  <FloatingTestimonialCard
                    testimonial={testimonial}
                    isActive={index === activeTestimonial}
                    index={index}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center gap-4 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`
                    w-4 h-4 rounded-full transition-all duration-300 relative overflow-hidden
                    ${activeTestimonial === index
                      ? 'bg-blue-400 scale-125 shadow-lg shadow-blue-400/50'
                      : 'bg-gray-600 hover:bg-gray-500 hover:scale-110'
                    }
                  `}
                >
                  {activeTestimonial === index && (
                    <div className="absolute inset-0 bg-white/30 animate-ping rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Auto-play indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Auto-rotating testimonials</span>
              </div>
            </div>
          </div>
        </div>

        {/* Case Studies */}
        <div className="mb-20">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-all duration-300 interactive-card">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${study.color} flex items-center justify-center mb-6`}>
                    {study.icon}
                  </div>
                  
                  <Badge className="mb-4 bg-gray-700 text-gray-300">{study.industry}</Badge>
                  
                  <h4 className="text-xl font-bold text-white mb-4">{study.company}</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Challenge:</div>
                      <div className="text-gray-200">{study.challenge}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Solution:</div>
                      <div className="text-gray-200">{study.solution}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Results:</div>
                      <div className="space-y-2">
                        {study.results.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-gray-200 text-sm">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UltraSocialProofSection;
