import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PremiumLogo from '@/components/ui/PremiumLogo';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Menu,
  X,
  Star,
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  
  // Transform navbar based on scroll
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
  const navbarBlur = useTransform(scrollY, [0, 100], [10, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { 
      to: '/platform-showcase', 
      label: 'Platform',
      icon: <Brain className="w-4 h-4" />,
      description: 'Explore our AI platform'
    },
    { 
      to: '/roadmap', 
      label: 'Roadmap', 
      featured: true,
      icon: <Rocket className="w-4 h-4" />,
      description: 'See what\'s coming next'
    },
    { 
      to: '/pricing', 
      label: 'Pricing',
      icon: <Zap className="w-4 h-4" />,
      description: 'Choose your plan'
    },
    { 
      to: '/features', 
      label: 'Features',
      description: 'Discover capabilities'
    },
    { 
      to: '/documentation', 
      label: 'Docs',
      description: 'Learn how to use FlowsyAI'
    },
  ];

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        "border-b border-white/10 backdrop-blur-xl",
        isScrolled 
          ? "bg-black/95 shadow-2xl shadow-black/60" 
          : "bg-black/90"
      )}
      style={{ 
        backdropFilter: `blur(${navbarBlur}px)`,
        backgroundColor: `rgba(0, 0, 0, ${navbarOpacity})`
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between min-h-[80px]">
        
        {/* Enhanced Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10 group-hover:border-white/30 transition-all duration-300">
              <PremiumLogo
                size={isMobile ? 'lg' : 'xl'}
                showText={false}
                animated={true}
                className="drop-shadow-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <motion.div 
            className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-2xl px-3 py-2 border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group relative inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ease-out',
                      'focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black',
                      isActive
                        ? 'bg-white/20 text-white shadow-lg border border-white/30'
                        : 'text-white/90 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/20',
                      item.featured &&
                        'bg-gradient-to-r from-violet-500/30 to-cyan-500/30 border-violet-400/50 hover:border-cyan-400/70 hover:from-violet-500/40 hover:to-cyan-500/40 text-white shadow-lg'
                    )
                  }
                >
                  <motion.div 
                    className="flex items-center gap-2 relative z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                    {item.featured && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gradient-to-r from-violet-400/30 to-cyan-400/30 text-white border border-cyan-400/50 font-bold"
                        >
                          New
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Enhanced hover effect */}
                  <motion.span
                    className={cn(
                      'absolute bottom-1 left-2 right-2 h-0.5 origin-bottom-left rounded-full',
                      item.featured
                        ? 'bg-gradient-to-r from-violet-400 to-cyan-400'
                        : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                    )}
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />

                  {/* Glow effect for featured items */}
                  {item.featured && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl blur-sm -z-10"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Enhanced Action Buttons */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Waitlist Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/waitlist')}
              className="group relative overflow-hidden bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hidden sm:inline-flex"
            >
              <motion.span 
                className="relative z-10 flex items-center"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Star className="w-4 h-4 mr-2" />
                Join Waitlist
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>

          {/* Start Trial Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/waitlist')}
              className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 border border-violet-400/50"
            >
              <motion.span 
                className="relative z-10 flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.span>
              
              {/* Animated glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-cyan-500/30 rounded-xl blur-md -z-10"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
                aria-label="Toggle mobile menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-4 py-3 text-base font-medium transition-all duration-300',
                        'border border-transparent',
                        isActive 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'text-white/90 hover:bg-white/10 hover:text-white hover:border-white/20',
                        item.featured && 'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border-violet-400/30'
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                      {item.featured && (
                        <Badge className="text-xs bg-violet-500/30 text-white border-violet-400/50">
                          New
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-white/60 mt-1 ml-7">{item.description}</p>
                    )}
                  </NavLink>
                </motion.div>
              ))}
              
              {/* Mobile Action Buttons */}
              <motion.div 
                className="pt-4 space-y-3 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/waitlist');
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-xl"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Join Token Waitlist
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/waitlist');
                  }}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default EnhancedNavbar;
