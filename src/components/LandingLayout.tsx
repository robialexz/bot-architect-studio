
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarNoMotion from '@/components/Navbar-NoMotion';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import FooterNoMotion from '@/components/Footer-NoMotion';

interface LandingLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
}) => {
  const location = useLocation();
  // Pages that should use EnhancedNavbar (all public pages for consistency)
  const enhancedNavbarPages = [
    '/',
    '/v2',
    '/pricing',
    '/platform-showcase',
    '/roadmap',
    '/features',
    '/documentation',
    '/about',
    '/contact',
    '/waitlist',
    '/privacy',
    '/terms'
  ];
  const isEnhancedNavbarPage = enhancedNavbarPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar - Enhanced for main pages, Regular for others */}
      {showNavbar && (
        isEnhancedNavbarPage ? <EnhancedNavbar /> : <NavbarNoMotion />
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {showFooter && <FooterNoMotion />}
    </div>
  );
};

export default LandingLayout;
