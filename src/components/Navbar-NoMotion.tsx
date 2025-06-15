import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Menu,
  X,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Bot,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';

// Define a type for navigation items
interface NavItem {
  to: string;
  label: string;
  icon?: React.ReactNode; // Make icon optional and use ReactNode for flexibility
  featured?: boolean;
  description?: string; // Add optional description
}

// const navLinkBaseClasses = // Unused
//   'group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background';
// const navLinkInactiveClasses = // Unused
//   'text-white/90 hover:bg-white/10 hover:text-white';
// const navLinkActiveClasses = // Unused
//   'bg-white/20 text-white shadow-md hover:bg-white/25';

const mobileNavLinkBaseClasses =
  'block rounded-md px-3 py-2 text-base font-medium transition-colors';
const mobileNavLinkInactiveClasses = 'text-white/90 hover:bg-white/10 hover:text-white';
const mobileNavLinkActiveClasses = 'bg-white/20 text-white';

const NavbarNoMotion = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Removed unused user, logout
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const isMobile = useIsMobile(); // isMobile is not directly used, isDesktop is derived and used
  const isDesktop = !useIsMobile();
  // const { comingSoonHandlers } = useComingSoon(); // Unused

  useEffect(() => {
    if (isDesktop && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop, isMobileMenuOpen]);

  // const handleNewProject = () => { // Unused
  //   setIsMobileMenuOpen(false);
  //   navigate('/');
  // };

  // Smart logo navigation based on authentication status
  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (!forceUnauthenticated && isAuthenticated) {
      navigate('/account');
    } else {
      navigate('/');
    }
  };

  // Different navigation for authenticated vs unauthenticated users
  const unauthenticatedNavItems: NavItem[] = [
    { to: '/platform-showcase', label: 'Platform' },
    { to: '/roadmap', label: 'Roadmap', featured: true },
    { to: '/pricing', label: 'Pricing' },
    { to: '/features', label: 'Features' },
    { to: '/documentation', label: 'Documentation' },
  ];

  // const authenticatedNavItems: NavItem[] = [ // Unused as navItems is hardcoded to unauthenticatedNavItems
  //   { to: '/account', label: 'Dashboard' },
  //   {
  //     to: '/workflow-builder',
  //     label: 'Workflow Builder',
  //     icon: <PlusCircle className="w-4 h-4" />,
  //     featured: true,
  //     description: 'Build powerful AI workflows',
  //   },
  //   {
  //     to: '/ai-ecosystem-playground',
  //     label: 'AI Playground',
  //     icon: <Sparkles className="w-4 h-4" />,
  //     featured: true,
  //     description: 'Experiment with AI models',
  //   },
  //   { to: '/workflow-templates', label: 'Templates' },
  //   { to: '/workflow-marketplace', label: 'Marketplace' },
  //   { to: '/workflow-analytics', label: 'Analytics' },
  // ];

  // Force unauthenticated nav items for FlowsyAI landing page
  const navItems: NavItem[] = unauthenticatedNavItems; // Explicitly type navItems
  // Force isAuthenticated to false for FlowsyAI landing page
  const forceUnauthenticated = true;

  return (
    <nav className="border-b border-white/10 bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-black/40">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 animate-pulse"></div>

      <div className="relative w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between min-h-[64px]">
        {/* Premium FlowsyAI Logo */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 border border-white/20 hover:border-white/40 rounded-2xl px-6 py-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
          aria-label="Navigate to FlowsyAI home"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative flex items-center gap-3">
            {/* AI Bot Icon with animation */}
            <div className="relative">
              <Bot className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 group-hover:rotate-12" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
            </div>

            {/* FlowsyAI Text Logo */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-cyan-300 transition-all duration-300">
                FlowsyAI
              </span>
              <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300 font-medium">
                AI Workflow Studio
              </span>
            </div>
          </div>
        </button>

        {/* Premium Navigation Pills */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-2xl px-4 py-2 border border-white/20 shadow-2xl shadow-black/20">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group relative overflow-hidden inline-flex h-11 items-center justify-center rounded-xl px-5 py-2 text-sm font-bold transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 text-white shadow-xl border border-blue-400/50 scale-105'
                      : 'text-white/90 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/30 hover:scale-105',
                    'backdrop-blur-sm',
                    item.featured &&
                      'bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border-violet-400/40 hover:border-cyan-400/60 hover:from-violet-500/30 hover:to-cyan-500/30 text-white shadow-xl animate-pulse'
                  )
                }
              >
                {/* Animated background for active/hover states */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex items-center gap-2 relative z-10">
                  {item.icon}
                  <span className="font-bold tracking-wide">{item.label}</span>
                  {item.featured && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-violet-400/40 to-cyan-400/40 text-white border border-cyan-400/60 font-bold animate-bounce"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>

                {/* Dynamic underline effect */}
                <span
                  className={cn(
                    'absolute bottom-1 left-2 right-2 h-1 origin-center scale-x-0 transition-all duration-500 ease-out group-hover:scale-x-100 rounded-full',
                    item.featured
                      ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400'
                      : 'bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400'
                  )}
                />

                {/* Premium glow effect */}
                {item.featured && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-cyan-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Premium Action Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            {!forceUnauthenticated && isAuthenticated ? (
              <div>Authenticated User Menu</div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Join Waitlist Button */}
                <button
                  type="button"
                  onClick={() => navigate('/waitlist')}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-cyan-500/30 text-white font-bold rounded-xl transition-all duration-500 ease-out inline-flex h-11 items-center justify-center whitespace-nowrap px-6 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent border border-white/30 hover:border-white/50 shadow-xl hover:shadow-blue-500/20 hover:scale-105 backdrop-blur-xl"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                    <Star className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500 text-yellow-400" />
                    Join Token Waitlist
                  </span>

                  {/* Premium glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </button>

                {/* Buy FlowAI Button */}
                <button
                  type="button"
                  onClick={() => window.open('https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump', '_blank', 'noopener,noreferrer')}
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-400 hover:via-teal-400 hover:to-green-400 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-500 ease-out border border-emerald-400/60 hover:border-emerald-300/80 inline-flex h-11 items-center justify-center whitespace-nowrap px-6 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:scale-105 backdrop-blur-xl"
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300 text-white" />
                    Buy $FlowAI
                  </span>

                  {/* Premium glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/40 via-teal-500/40 to-green-500/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden animate-slide-down"
          id="mobile-navigation-menu"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    mobileNavLinkBaseClasses,
                    isActive ? mobileNavLinkActiveClasses : mobileNavLinkInactiveClasses
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; height: 0; }
          to { opacity: 1; height: auto; }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default NavbarNoMotion;
