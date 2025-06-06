import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingFeedbackButton from './FloatingFeedbackButton';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if current page is landing page
  useEffect(() => {
    setIsLandingPage(location.pathname === '/' || location.pathname === '/index.html');
  }, [location]);

  // Add scroll listener for transparent navbar effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if we should use a more subtle gradient for content-heavy pages
  const isContentHeavyPage = ['/studio', '/documentation', '/settings'].includes(location.pathname);

  // Check if current page is workflow builder (full-screen mode)
  const isWorkflowBuilder = location.pathname === '/workflow-builder';

  // If workflow builder, render without layout elements
  if (isWorkflowBuilder) {
    return <div className="h-screen w-screen overflow-hidden">{children}</div>;
  }

  return (
    <React.Fragment>
      {/* Global Animated Background */}
      <div className="fixed inset-0 z-[-10] overflow-hidden">
        {/* Dynamic Gradient Flow */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(147, 51, 234, 0.25), rgba(59, 130, 246, 0.25), rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25), rgba(147, 51, 234, 0.25))',
              'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25), rgba(147, 51, 234, 0.25), rgba(59, 130, 246, 0.25))',
              'linear-gradient(225deg, rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25), rgba(147, 51, 234, 0.25), rgba(59, 130, 246, 0.25), rgba(16, 185, 129, 0.25))',
              'linear-gradient(315deg, rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25), rgba(147, 51, 234, 0.25), rgba(59, 130, 246, 0.25), rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25))',
              'linear-gradient(45deg, rgba(147, 51, 234, 0.25), rgba(59, 130, 246, 0.25), rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.25), rgba(147, 51, 234, 0.25))',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Floating Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.7, 1.3, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-gold/25 to-orange-500/25 rounded-full blur-3xl"
          animate={{
            x: [0, 60, -60, 0],
            y: [0, -80, 80, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        />

        {/* Mesh Gradient Overlay */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 20%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative flex flex-col min-h-screen">
        {/* Dynamic Navbar - transparent for landing page, solid for other pages */}
        <div
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
            isLandingPage && !isScrolled
              ? 'bg-transparent backdrop-blur-0'
              : 'bg-background/80 backdrop-blur-md shadow-sm'
          }`}
        >
          <Navbar />
        </div>

        {/* Page Content */}
        <main className={`flex-grow ${isLandingPage ? 'pt-0' : 'pt-16'}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </main>

        <Footer />

        {/* Floating Feedback Button */}
        <FloatingFeedbackButton />
      </div>
    </React.Fragment>
  );
};

export default Layout;
