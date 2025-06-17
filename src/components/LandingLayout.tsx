
import React from 'react';
import NavbarNoMotion from '@/components/Navbar-NoMotion';
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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      {showNavbar && <NavbarNoMotion />}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {showFooter && <FooterNoMotion />}
    </div>
  );
};

export default LandingLayout;
