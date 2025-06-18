import React from 'react';
import { MotionDiv } from '@/lib/motion-wrapper';
import { Skeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
  title?: string;
  subtitle?: string;
  showHero?: boolean;
  showCards?: boolean;
  cardCount?: number;
  showSidebar?: boolean;
  variant?: 'features' | 'documentation' | 'roadmap' | 'default';
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  title = 'Loading...',
  subtitle = 'Please wait while we prepare the content',
  showHero = true,
  showCards = true,
  cardCount = 6,
  showSidebar = false,
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'features':
        return {
          gradient: 'from-primary to-sapphire',
          bgGradient: 'from-background via-background to-primary/5',
          accentColor: 'bg-primary/20',
        };
      case 'documentation':
        return {
          gradient: 'from-sapphire to-gold',
          bgGradient: 'from-background via-background to-sapphire/5',
          accentColor: 'bg-sapphire/20',
        };
      case 'roadmap':
        return {
          gradient: 'from-primary to-gold',
          bgGradient: 'from-background via-background to-gold/5',
          accentColor: 'bg-gold/20',
        };
      default:
        return {
          gradient: 'from-primary to-sapphire',
          bgGradient: 'from-background via-background to-primary/5',
          accentColor: 'bg-primary/20',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${styles.bgGradient} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-80 h-80 bg-sapphire/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-primary/5 to-sapphire/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: '30s' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {/* Hero Skeleton */}
        {showHero && (
          <MotionDiv
            className="text-center mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Loading Indicator */}
            <div className="relative mb-6">
              <div
                className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${styles.gradient} rounded-full flex items-center justify-center`}
              >
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <div
                className={`absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-r ${styles.gradient} rounded-full animate-ping opacity-20`}
              ></div>
            </div>

            {/* Title and Subtitle */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{subtitle}</p>

            {/* Hero Content Skeleton */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <div className="flex justify-center gap-4 mt-8">
                <Skeleton className="h-12 w-32 rounded-lg" />
                <Skeleton className="h-12 w-32 rounded-lg" />
              </div>
            </div>
          </MotionDiv>
        )}

        {/* Main Content Layout */}
        <div className={`flex ${showSidebar ? 'gap-8' : ''}`}>
          {/* Sidebar Skeleton */}
          {showSidebar && (
            <div className="w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-8 space-y-4">
                <Skeleton className="h-8 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Cards Grid Skeleton */}
            {showCards && (
              <div
                className={`grid grid-cols-1 ${showSidebar ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8`}
              >
                {Array.from({ length: cardCount }).map((_, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card/80 backdrop-blur-lg border border-border-alt rounded-xl p-6 shadow-lg"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${styles.accentColor} rounded-lg animate-pulse`} />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    {/* Card Content */}
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>

                    {/* Card Metrics */}
                    <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-background/50 rounded-lg">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="text-center">
                          <Skeleton className="h-5 w-12 mx-auto mb-1" />
                          <Skeleton className="h-3 w-8 mx-auto" />
                        </div>
                      ))}
                    </div>

                    {/* Card Actions */}
                    <div className="flex gap-3 mt-6">
                      <Skeleton className="h-9 flex-1 rounded-lg" />
                      <Skeleton className="h-9 flex-1 rounded-lg" />
                    </div>
                  </MotionDiv>
                ))}
              </div>
            )}

            {/* Content Skeleton for Documentation */}
            {!showCards && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
