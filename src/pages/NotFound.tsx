import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ServerCrash, Home } from 'lucide-react'; // Or Frown, AlertTriangle etc.

const pageVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 0.9 },
};

const iconVariants = {
  initial: { rotate: -10, scale: 0.8 },
  animate: {
    rotate: [0, -10, 10, -10, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    transition: { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 },
  },
};

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.main
        className="flex-1 flex flex-col items-center justify-center text-center p-8"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <motion.div variants={iconVariants} initial="initial" animate="animate">
          <ServerCrash className="w-32 h-32 text-primary mb-8" />
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold text-primary mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-h3 text-foreground/90 mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Oops! Page Not Found
        </motion.p>
        <motion.p
          className="text-body-lg text-muted-foreground mb-10 max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button asChild size="lg" className="group">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Return to Homepage
            </Link>
          </Button>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default NotFound;
