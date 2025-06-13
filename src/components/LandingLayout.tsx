import React from 'react';
import NavbarNoMotion from '@/components/Navbar-NoMotion';
import FooterNoMotion from '@/components/Footer-NoMotion';
import FloatingFeedbackButtonNoMotion from '@/components/FloatingFeedbackButton-NoMotion';

interface LandingLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  showFeedback?: boolean;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
  showFeedback = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      {showNavbar && <NavbarNoMotion />}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {showFooter && <FooterNoMotion />}

      {/* Floating Feedback Button */}
      {showFeedback && <FloatingFeedbackButtonNoMotion />}
    </div>
  );
};

export default LandingLayout;
