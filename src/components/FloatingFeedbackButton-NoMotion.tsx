
import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeedbackSystem from './FeedbackSystem';
import { useAuth } from '@/hooks/useAuth';

const FloatingFeedbackButtonNoMotion: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();

  // Only show for authenticated users
  if (!isAuthenticated) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 animate-scale-in" style={{ animationDelay: '2s' }}>
        <div
          className="hover:scale-105 active:scale-95 transition-transform duration-200"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            onClick={() => setShowFeedback(true)}
            className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-primary to-gold hover:from-primary-dark hover:to-gold-dark shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20 hover:border-white/40"
          >
            <span className="relative z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6" />
            </span>

            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

            {/* Pulse animation */}
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-ring" />
          </Button>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap animate-fade-in">
            <div className="relative bg-card/95 backdrop-blur-sm border border-border-alt rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-foreground">Share Feedback</span>
              </div>

              {/* Arrow */}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2">
                <div className="w-0 h-0 border-l-4 border-l-border-alt border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <FeedbackSystem
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scale-in {
            from { 
              scale: 0; 
              opacity: 0; 
            }
            to { 
              scale: 1; 
              opacity: 1; 
            }
          }
          
          @keyframes fade-in {
            from { 
              opacity: 0; 
              transform: translateX(10px) translateY(-50%) scale(0.9); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) translateY(-50%) scale(1); 
            }
          }
          
          @keyframes pulse-ring {
            0%, 100% { 
              transform: scale(1); 
              opacity: 0.5; 
            }
            50% { 
              transform: scale(1.2); 
              opacity: 0; 
            }
          }
          
          .animate-scale-in {
            animation: scale-in 0.5s ease-out both;
          }
          
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
          
          .animate-pulse-ring {
            animation: pulse-ring 2s ease-in-out infinite;
          }
        `
      }} />
    </>
  );
};

export default FloatingFeedbackButtonNoMotion;
