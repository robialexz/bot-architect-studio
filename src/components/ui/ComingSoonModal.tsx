import React from 'react';
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
} from '@/lib/motion-wrapper';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Rocket, Calendar, Star, Bell, ArrowRight, Clock, Zap } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  expectedDate?: string;
  description?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  feature = 'This Feature',
  expectedDate = 'Q1 2025',
  description = "We're working hard to bring you this amazing feature as part of our comprehensive AI workflow platform.",
}) => {
  return (
    <SafeAnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <MotionDiv
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <MotionDiv
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="relative w-full max-w-md">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-gold/10 to-sapphire/20 rounded-3xl blur-xl" />

              {/* Modal Content */}
              <div className="relative premium-card bg-background/95 backdrop-blur-lg border border-primary/20 rounded-3xl p-8 shadow-2xl">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-muted/50"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Header */}
                <div className="text-center mb-6">
                  <MotionDiv
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-primary via-gold to-sapphire text-white mb-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
                  >
                    <Rocket className="w-8 h-8" />
                  </MotionDiv>

                  <MotionH2
                    className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Coming Soon!
                  </MotionH2>

                  <MotionP
                    className="text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {feature} is currently in development
                  </MotionP>
                </div>

                {/* Status Badge */}
                <MotionDiv
                  className="flex justify-center mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2 animate-pulse" />
                    In Development
                  </Badge>
                </MotionDiv>

                {/* Description */}
                <MotionP
                  className="text-center text-muted-foreground mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {description}
                </MotionP>

                {/* Timeline */}
                <MotionDiv
                  className="bg-muted/30 rounded-2xl p-4 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-medium">Expected Launch</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {expectedDate}
                    </Badge>
                  </div>
                </MotionDiv>

                {/* Features Preview */}
                <MotionDiv
                  className="space-y-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-primary">
                    What to Expect
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Advanced AI Integration',
                      'Intuitive Interface',
                      'Real-time Collaboration',
                      'Enterprise Security',
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Star className="w-3 h-3 text-gold" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </MotionDiv>

                {/* Action Buttons */}
                <MotionDiv
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-gold text-white hover:shadow-lg transition-all duration-300"
                    disabled
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notify Me When Ready
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10"
                    onClick={onClose}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Explore Other Features
                  </Button>
                </MotionDiv>

                {/* Footer Note */}
                <MotionDiv
                  className="text-center mt-6 pt-4 border-t border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <p className="text-xs text-muted-foreground">
                    Building the future of AI automation • Stay tuned for updates
                  </p>
                </MotionDiv>
              </div>
            </div>
          </MotionDiv>
        </>
      )}
    </SafeAnimatePresence>
  );
};

export default ComingSoonModal;
