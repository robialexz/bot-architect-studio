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

const navLinkBaseClasses =
  'group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background';
const navLinkInactiveClasses =
  'text-white/90 hover:bg-white/10 hover:text-white';
const navLinkActiveClasses =
  'bg-white/20 text-white shadow-md hover:bg-white/25';

const mobileNavLinkBaseClasses =
  'block rounded-md px-3 py-2 text-base font-medium transition-colors';
const mobileNavLinkInactiveClasses =
  'text-white/90 hover:bg-white/10 hover:text-white';
const mobileNavLinkActiveClasses =
  'bg-white/20 text-white';

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
    { to: '/platform-showcase', label: 'Platform' },
    { to: '/roadmap', label: 'Roadmap', featured: true },
    { to: '/pricing', label: 'Pricing' },
    { to: '/features', label: 'Features' },
    { to: '/documentation', label: 'Documentation' },
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
    <nav className="border-b border-white/20 bg-black/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl shadow-black/60">
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex items-center justify-between min-h-[70px]">
        <MotionButton
          onClick={handleLogoClick}
          className="group cursor-pointer bg-transparent border-none px-12 py-4 rounded-lg hover:bg-accent/50 transition-all duration-300"
          aria-label="Navigate to home page"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <PremiumLogo
            size={isDesktop ? 'xxl' : 'xl'}
            showText={false}
            animated={true}
            className="drop-shadow-sm"
          />
        </MotionButton>

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
              <div className="flex items-center gap-3">
                <MotionButton
                  onClick={() => navigate('/waitlist')}
                  className="group relative overflow-hidden bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 ease-in-out inline-flex h-9 items-center justify-center whitespace-nowrap px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 border border-white/20 hover:border-white/40 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                    <Star className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                    Join Token Waitlist
                  </span>
                </MotionButton>
                <MotionButton
                  onClick={() => navigate('/waitlist')}
                  className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 ease-in-out border border-violet-400/50 inline-flex h-9 items-center justify-center whitespace-nowrap px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Start Free Trial
                  </span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-cyan-500/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </MotionButton>
              </div>
            )}
          </div>

          {/* New Project Button - Only show for authenticated users on desktop */}
          {!forceUnauthenticated && isAuthenticated && (
            <button
              type="button"
              onClick={handleNewProject}
              className="hidden md:inline-flex bg-violet-500 text-white hover:bg-violet-600 group h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              New Project
            </button>
          )}

          {/* Settings - Only show for authenticated users */}
          {!forceUnauthenticated && isAuthenticated && (
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'group inline-flex h-10 w-max items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-300',
                  isActive ? navLinkActiveClasses : navLinkInactiveClasses,
                  'p-2 rounded-full md:rounded-md md:px-3 md:py-2 text-white/90 hover:text-white hover:bg-white/10',
                  !isDesktop && 'hover:bg-white/10'
                )
              }
              title="Settings"
            >
              <Settings className="w-5 h-5" />
              <span className="sr-only md:not-sr-only md:ml-1.5">Settings</span>
            </NavLink>
          )}

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
