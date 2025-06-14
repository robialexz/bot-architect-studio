import { NavLink, useNavigate } from 'react-router-dom'; // Removed Link
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { logger } from '@/utils/logger'; // Removed logger
// import { useComingSoon } from '@/hooks/useComingSoon'; // Removed useComingSoon
// Removed unused UI component imports for NavigationMenu, DropdownMenu, Avatar

import {
  Menu,
  X,
  // PlusCircle, // Used in authenticatedNavItems (though that array itself is unused currently)
  Sparkles, // Used in Start Free Trial button & authenticatedNavItems
  Star, // Used in Join Token Waitlist button
  // Removed unused Lucide icons: Layers, Settings, LogIn, UserPlus, User, LogOut, Crown, BarChart3, Users, Bot, Shield
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
    <nav className="border-b border-white/20 bg-black/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl shadow-black/60">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex items-center justify-between min-h-[70px]">
        <button
          onClick={handleLogoClick}
          className="group cursor-pointer bg-transparent border-none p-2 rounded-lg hover:bg-accent/50 transition-all duration-300 hover:scale-105"
          aria-label="Navigate to home page"
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            {' '}
            {/* Adjust size as needed */}
            <video
              src="/background-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </button>

        {/* Desktop Navigation - HIGHLY VISIBLE */}
        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-xl px-2 py-1 border border-white/10 z-50 relative">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black',
                    isActive
                      ? 'bg-white/20 text-white shadow-lg border border-white/30'
                      : 'text-white/95 hover:text-white hover:bg-white/15 border border-transparent hover:border-white/20',
                    'relative group/link font-medium',
                    item.featured &&
                      'bg-gradient-to-r from-violet-500/30 to-cyan-500/30 border-violet-400/50 hover:border-cyan-400/70 hover:from-violet-500/40 hover:to-cyan-500/40 text-white shadow-lg'
                  )
                }
              >
                <div className="flex items-center gap-2 relative z-10">
                  {item.icon}
                  <span className="font-semibold">{item.label}</span>
                  {item.featured && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-violet-400/30 to-cyan-400/30 text-white border border-cyan-400/50 font-bold"
                    >
                      New
                    </Badge>
                  )}
                </div>

                {/* Hover underline effect */}
                <span
                  className={cn(
                    'absolute bottom-1 left-2 right-2 h-0.5 origin-bottom-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 rounded-full',
                    item.featured
                      ? 'bg-gradient-to-r from-violet-400 to-cyan-400'
                      : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                  )}
                />

                {/* Glow effect for featured items */}
                {item.featured && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Authentication Section - Desktop */}
          <div className="flex items-center gap-3">
            {!forceUnauthenticated && isAuthenticated ? (
              <div>Authenticated User Menu</div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/waitlist')}
                  className="group relative overflow-hidden bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out inline-flex h-9 items-center justify-center whitespace-nowrap px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 border border-white/20 hover:border-white/40 shadow-lg hover:scale-105"
                >
                  <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                    <Star className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                    Join Token Waitlist
                  </span>
                </button>
                <button
                  onClick={() => navigate('/waitlist')}
                  className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 ease-in-out border border-violet-400/50 inline-flex h-9 items-center justify-center whitespace-nowrap px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Start Free Trial
                  </span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-cyan-500/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
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
