import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Rocket, 
  Star, 
  ArrowRight, 
  Clock, 
  Shield, 
  Zap,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Timer,
  Gift,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UltraFinalCTA: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 45,
    seconds: 30
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const benefits = [
    { icon: <Zap className="w-5 h-5" />, text: "Deploy in 5 minutes" },
    { icon: <Shield className="w-5 h-5" />, text: "Enterprise security" },
    { icon: <Users className="w-5 h-5" />, text: "24/7 expert support" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Guaranteed ROI" }
  ];

  const urgencyFeatures = [
    { icon: <Gift className="w-6 h-6" />, title: "Free Setup Worth $5,000", description: "Professional onboarding included" },
    { icon: <Crown className="w-6 h-6" />, title: "VIP Support Access", description: "Direct line to our AI experts" },
    { icon: <Award className="w-6 h-6" />, title: "Early Adopter Benefits", description: "Lifetime discount + exclusive features" }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 30%, transparent 70%)`
          }}
        />
        
        {/* Animated Elements */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Urgency Timer */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 text-lg font-bold mb-6 animate-pulse">
            <Timer className="w-5 h-5 mr-2" />
            Limited Time Offer - Early Access Ending Soon!
          </Badge>
          
          <div className="flex justify-center gap-4 mb-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-2 animate-premium-glow">
                  <span className="text-3xl font-bold text-white">{value.toString().padStart(2, '0')}</span>
                </div>
                <div className="text-gray-400 text-sm capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA Content */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-black mb-8">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Transform
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Your Business?
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            Join 10,000+ companies already using FlowsyAI to automate their workflows and 
            <span className="text-green-400 font-semibold"> increase productivity by 300%</span>
          </p>

          {/* Urgency Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {urgencyFeatures.map((feature, index) => (
              <Card key={index} className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 interactive-card">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-16">
          <Button
            size="lg"
            onClick={() => navigate('/waitlist')}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-16 py-8 text-2xl font-bold rounded-3xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full" />
            <Rocket className="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform duration-500 relative z-10" />
            <span className="relative z-10">Start Free Enterprise Trial</span>
            <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank')}
            className="border-4 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-16 py-8 text-2xl font-bold rounded-3xl backdrop-blur-sm transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <TrendingUp className="w-8 h-8 mr-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Buy $FlowAI Token</span>
          </Button>
        </div>

        {/* Benefits List */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                {benefit.icon}
              </div>
              <span className="font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Risk Reversal */}
        <div className="text-center">
          <div className="inline-block glass-morphism rounded-3xl px-8 py-6 mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Shield className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">100% Risk-Free Guarantee</span>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-semibold">14-Day Free Trial</div>
                <div className="text-gray-400 text-sm">No credit card required</div>
              </div>
              <div>
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-semibold">Cancel Anytime</div>
                <div className="text-gray-400 text-sm">No long-term contracts</div>
              </div>
              <div>
                <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-white font-semibold">Money-Back Guarantee</div>
                <div className="text-gray-400 text-sm">30-day full refund</div>
              </div>
            </div>
          </div>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of companies already transforming their operations with FlowsyAI. 
            Start your journey to 300% increased productivity today.
          </p>
        </div>

        {/* Final Urgency Message */}
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl px-8 py-4">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-red-400 animate-pulse" />
              <span className="text-red-300 font-semibold text-lg">
                Only 47 early access spots remaining this month
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UltraFinalCTA;
