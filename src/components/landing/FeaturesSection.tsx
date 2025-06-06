import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Feature icons as SVG components for better animations
const FeatureIcon1 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const FeatureIcon2 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 7h.01" />
    <path d="M17 7h.01" />
    <path d="M7 17h.01" />
    <path d="M17 17h.01" />
    <path d="M7 12h10" />
  </svg>
);

const FeatureIcon3 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10"
  >
    <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </svg>
);

const FeatureIcon4 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18v-6" />
    <path d="M8 18v-1" />
    <path d="M16 18v-3" />
  </svg>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const FeaturesSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const features = [
    // Feature cards removed as requested - keeping the component structure for future use
  ];

  // Detailed use cases for the carousel
  const useCases = [
    {
      title: 'Customer Support Automation',
      description:
        'Build an AI-powered support system that handles routine inquiries, routes complex issues to the right team, and learns from each interaction.',
      image:
        'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Data Processing Pipeline',
      description:
        'Create workflows that automatically collect, clean, and analyze data from multiple sources, generating insights and reports without manual intervention.',
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Content Creation Assistant',
      description:
        'Deploy AI agents that help generate content drafts, suggest improvements, and maintain consistent brand voice across all your channels.',
      image:
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 md:py-32 relative overflow-hidden premium-hero-bg"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-sapphire/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-gold/10 to-transparent"></div>
        <motion.div
          className="absolute -left-64 top-1/4 w-96 h-96 rounded-full bg-primary/15 blur-3xl"
          animate={{
            x: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        ></motion.div>
        <motion.div
          className="absolute -right-64 bottom-1/4 w-96 h-96 rounded-full bg-gold/15 blur-3xl"
          animate={{
            x: [0, -50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        ></motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`premium-card group p-8 ${feature.bgColor} border ${feature.borderColor} relative overflow-hidden`}
            >
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-20"></div>
                <div className="h-full w-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),rgba(255,255,255,0))]"></div>
              </motion.div>

              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 text-white bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-500 premium-shadow`}
              >
                {feature.icon}
              </div>

              <h3
                className={`text-2xl font-bold mb-4 font-serif ${feature.color.includes('emerald') ? 'text-emerald-400' : feature.color.includes('pink') ? 'text-pink-400' : feature.color.includes('amber') ? 'text-amber-400' : 'text-blue-400'}`}
              >
                {feature.title}
              </h3>

              <p className="text-muted-foreground mb-8 leading-relaxed">{feature.description}</p>

              <div className="flex items-center">
                <div className="h-px flex-grow bg-border group-hover:bg-primary/30 transition-colors duration-300 mr-4"></div>

                <Button
                  asChild
                  variant="outline"
                  className="group/btn flex items-center text-foreground hover:text-primary border-primary/20 hover:border-primary/40 hover:bg-primary/5 premium-border"
                >
                  <Link to={feature.path}>
                    <span>Explore Feature</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="premium-card p-10 max-w-3xl mx-auto bg-gradient-to-br from-card via-card/80 to-card">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
              Ready to Transform Your Experience?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join the exclusive community of innovators who are redefining what's possible with our
              premium AI integration platform.
            </p>
            <Button
              size="lg"
              className="relative overflow-hidden px-8 py-6 bg-gradient-to-r from-gold via-gold-light to-gold text-background font-medium premium-border"
            >
              <span className="relative z-10 flex items-center">
                Begin Your Premium Journey{' '}
                <ArrowRight className="ml-2 h-5 w-5 animate-bounce-subtle" />
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
