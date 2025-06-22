import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/utils/logger';
import PremiumLogo from '@/components/ui/PremiumLogo';
import { useComingSoon } from '@/hooks/useComingSoon';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Layers,
  Settings,
  Menu,
  X,
  PlusCircle,
  LogIn,
  UserPlus,
  Sparkles,
  User,
  LogOut,
  Crown,
  BarChart3,
  Users,
  Bot,
  Shield,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SafeAnimatePresence,
  MotionDiv,
  MotionSection,
  MotionH1,
  MotionH2,
  MotionP,
  MotionButton,
  MotionLi,
  MotionTr,
  MotionSpan,
} from '@/lib/motion-wrapper';

import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { preloadRouteComponents } from '@/components/lazy/LazyComponents';

const navLinkBaseClasses =
  'group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background';
const navLinkInactiveClasses = 'text-white/90 hover:bg-white/10 hover:text-white';
const navLinkActiveClasses = 'bg-white/20 text-white shadow-md hover:bg-white/25';

const mobileNavLinkBaseClasses =
  'block rounded-md px-3 py-2 text-base font-medium transition-colors';
const mobileNavLinkInactiveClasses = 'text-white/90 hover:bg-white/10 hover:text-white';
const mobileNavLinkActiveClasses = 'bg-white/20 text-white';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const { comingSoonHandlers } = useComingSoon();

  useEffect(() => {
    if (isDesktop && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop, isMobileMenuOpen]);

  // Preload handler for navigation items
  const handleNavHover = (route: string) => {
    preloadRouteComponents(route);
  };

  const handleNewProject = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
  };

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
  const unauthenticatedNavItems = [
    { to: '/features', label: 'Features' },
    { to: '/platform-showcase', label: 'Platform' },
    { to: '/documentation', label: 'Docs' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/roadmap', label: 'Roadmap', featured: true },
  ];

  const authenticatedNavItems = [
    { to: '/account', label: 'Dashboard' },
    {
      to: '/workflow-builder',
      label: 'Workflow Builder',
      icon: <PlusCircle className="w-4 h-4" />,
      featured: true,
      description: 'Build powerful AI workflows',
    },
    {
      to: '/ai-ecosystem-playground',
      label: 'AI Playground',
      icon: <Sparkles className="w-4 h-4" />,
      featured: true,
      description: 'Experiment with AI models',
    },
    { to: '/workflow-templates', label: 'Templates' },
    { to: '/workflow-marketplace', label: 'Marketplace' },
    { to: '/workflow-analytics', label: 'Analytics' },
  ];

  // Force unauthenticated nav items for FlowsyAI landing page
  const navItems = unauthenticatedNavItems;
  // Force isAuthenticated to false for FlowsyAI landing page
  const forceUnauthenticated = true;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Floating Navbar Container - REDESIGNED */}
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-ai-emerald/5 via-ai-electric/5 to-ai-cyber/5 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />

          {/* Main Navbar Content */}
          <div className="relative flex items-center justify-between px-6 py-3 min-h-[60px]">
            {/* Logo Section */}
            <MotionButton
              onClick={handleLogoClick}
              className="group cursor-pointer bg-transparent border-none p-2 rounded-2xl hover:bg-white/10 transition-all duration-300"
              aria-label="Navigate to FlowsyAI home"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <PremiumLogo
                size={isDesktop ? 'lg' : 'md'}
                showText={false}
                animated={true}
                className="drop-shadow-lg"
              />
            </MotionButton>

            {/* Desktop Navigation - Floating Pills Design */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center gap-3">
                {navItems.map((item, index) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onMouseEnter={() => handleNavHover(item.to)}
                    onFocus={() => handleNavHover(item.to)}
                    className={({ isActive }) =>
                      cn(
                        'group relative inline-flex h-10 items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-500 ease-out focus:outline-none',
                        isActive
                          ? 'bg-gradient-to-r from-ai-emerald via-ai-electric to-ai-emerald text-white shadow-lg shadow-ai-emerald/30 scale-105'
                          : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:scale-105',
                        'backdrop-blur-sm overflow-hidden',
                        item.featured &&
                          'ring-2 ring-ai-plasma/50 ring-offset-2 ring-offset-transparent animate-pulse'
                      )
                    }
                  >
                    {/* Pill Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ai-emerald/20 via-ai-electric/20 to-ai-cyber/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                      {item.label}
                      {item.featured && (
                        <Badge
                          variant="secondary"
                          className="ml-1 px-2 py-0.5 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white border-none shadow-sm animate-bounce"
                        >
                          🔥
                        </Badge>
                      )}
                    </span>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-ai-emerald/30 to-ai-electric/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md -z-10" />
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Action Buttons - Futuristic Design */}
            <div className="flex items-center gap-3">
              {!forceUnauthenticated && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-12 w-12 rounded-full p-0 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10 ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300">
                          <AvatarImage src={user?.avatarUrl} alt={user?.fullName || user?.email} />
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 text-white font-bold text-lg shadow-lg">
                            {user?.fullName
                              ? user.fullName.charAt(0).toUpperCase()
                              : user?.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online Status Indicator */}
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></div>
                        {user?.isPremium && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 drop-shadow-lg" />
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.fullName || user?.username || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        {user?.isPremium && (
                          <div className="flex items-center gap-1 text-xs text-gold">
                            <Crown className="h-3 w-3" />
                            Premium Member
                          </div>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/account')}>
                      <User className="mr-2 h-4 w-4" />
                      Account Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/projects')}>
                      <Layers className="mr-2 h-4 w-4" />
                      My Projects
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/workflow-builder')}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Workflow Builder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/ai-ecosystem-playground')}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Ecosystem Playground
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/analytics')}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/security-dashboard')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/workflow-collaboration')}>
                      <Users className="mr-2 h-4 w-4" />
                      Team Collaboration
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/ai-optimization')}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AI Optimization
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    {!user?.isPremium && (
                      <DropdownMenuItem onClick={() => navigate('/billing')}>
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Premium
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          await logout();
                        } catch (error) {
                          logger.auth.error('Desktop logout failed:', error);
                        }
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  {/* Waitlist Button - Elegant Design */}
                  <MotionButton
                    onClick={() => navigate('/waitlist')}
                    className="group relative overflow-hidden bg-white/5 hover:bg-white/10 text-white/90 hover:text-white font-medium rounded-full transition-all duration-500 ease-out inline-flex h-10 items-center justify-center whitespace-nowrap px-6 text-sm border border-white/20 hover:border-white/40 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ai-emerald/20 to-ai-electric/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                    <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                      <Star className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Waitlist
                    </span>

                    {/* Subtle glow */}
                    <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
                  </MotionButton>

                  {/* Buy Token Button - Premium Design */}
                  <MotionButton
                    onClick={() =>
                      window.open(
                        'https://dexscreener.com/solana/GzfwLWcTyEWcC3D9SeaXQPvfCevjh5xce1iWsPJGpump',
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    className="group relative overflow-hidden bg-gradient-to-r from-ai-emerald via-ai-electric to-ai-emerald text-white font-bold rounded-full transition-all duration-500 ease-out inline-flex h-10 items-center justify-center whitespace-nowrap px-6 text-sm shadow-lg shadow-ai-emerald/30 hover:shadow-xl hover:shadow-ai-emerald/40"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ai-electric via-ai-cyber to-ai-plasma opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-pulse" />

                    <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                      <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Buy $FlowAI
                    </span>

                    {/* Premium glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ai-emerald/50 to-ai-electric/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg rounded-full -z-10" />
                  </MotionButton>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle - Elegant Design */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-300" />
                )}
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <SafeAnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl overflow-hidden"
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
              {/* Action Buttons - Mobile */}
              <div className="pt-4 pb-2 border-t border-border-alt space-y-3">
                {!forceUnauthenticated && isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 bg-card/50 rounded-lg border border-border-alt">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 ring-2 ring-[hsl(var(--nav-primary))]/30 shadow-lg">
                            <AvatarImage
                              src={user?.avatarUrl}
                              alt={user?.fullName || user?.email}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--nav-primary))] via-[hsl(var(--nav-secondary))] to-[hsl(var(--accent))] text-white font-bold text-lg shadow-lg">
                              {user?.fullName
                                ? user.fullName.charAt(0).toUpperCase()
                                : user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {/* Online Status Indicator */}
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-[hsl(var(--nav-background))] rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user?.fullName || user?.username || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          {user?.isPremium && (
                            <div className="flex items-center gap-1 text-xs text-gold">
                              <Crown className="h-3 w-3" />
                              Premium
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/account');
                      }}
                      className="w-full bg-gradient-to-r from-[hsl(var(--button-primary))]/10 to-[hsl(var(--nav-secondary))]/10 border-[hsl(var(--button-primary))]/30 hover:border-[hsl(var(--button-primary))]/50 hover:bg-[hsl(var(--button-primary))]/20 text-[hsl(var(--nav-foreground))] hover:text-[hsl(var(--button-primary))] transition-all duration-300"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Account Dashboard
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/projects');
                      }}
                      className="w-full bg-gradient-to-r from-[hsl(var(--button-primary))]/10 to-[hsl(var(--nav-secondary))]/10 border-[hsl(var(--button-primary))]/30 hover:border-[hsl(var(--button-primary))]/50 hover:bg-[hsl(var(--button-primary))]/20 text-[hsl(var(--nav-foreground))] hover:text-[hsl(var(--button-primary))] transition-all duration-300"
                    >
                      <Layers className="w-5 h-5 mr-2" />
                      My Projects
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/workflow-builder');
                      }}
                      className="w-full bg-gradient-to-r from-[hsl(var(--button-primary))]/10 to-[hsl(var(--nav-secondary))]/10 border-[hsl(var(--button-primary))]/30 hover:border-[hsl(var(--button-primary))]/50 hover:bg-[hsl(var(--button-primary))]/20 text-[hsl(var(--nav-foreground))] hover:text-[hsl(var(--button-primary))] transition-all duration-300"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Workflow Builder
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/ai-ecosystem-playground');
                      }}
                      className="w-full bg-gradient-to-r from-[hsl(var(--button-primary))]/10 to-[hsl(var(--nav-secondary))]/10 border-[hsl(var(--button-primary))]/30 hover:border-[hsl(var(--button-primary))]/50 hover:bg-[hsl(var(--button-primary))]/20 text-[hsl(var(--nav-foreground))] hover:text-[hsl(var(--button-primary))] transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      AI Ecosystem Playground
                    </Button>
                    {!user?.isPremium && (
                      <Button
                        size="lg"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/billing');
                        }}
                        className="w-full bg-gradient-to-r from-gold via-gold-light to-gold text-background"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        Upgrade to Premium
                      </Button>
                    )}
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        try {
                          await logout();
                        } catch (error) {
                          logger.auth.error('Mobile logout failed:', error);
                        }
                      }}
                      className="w-full bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <MotionButton
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/waitlist');
                      }}
                      className="w-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-md px-8 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Join Token Waitlist
                    </MotionButton>
                    <MotionButton
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/waitlist');
                      }}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-sapphire text-background font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 ease-in-out border border-primary/20 inline-flex h-11 items-center justify-center whitespace-nowrap px-8 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Start Free Trial
                      </span>
                    </MotionButton>
                  </div>
                )}
              </div>
            </div>
          </MotionDiv>
        )}
      </SafeAnimatePresence>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>, // Changed ElementRef to typeof Link
  React.ComponentPropsWithoutRef<typeof Link> & { title: string } // Used ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to || '/'}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Navbar;
