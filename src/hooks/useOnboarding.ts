import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface OnboardingState {
  isFirstTime: boolean;
  hasCompletedOnboarding: boolean;
  hasSkippedOnboarding: boolean;
  shouldShowOnboarding: boolean;
  completedAt: string | null;
  currentStep: number;
}

export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isFirstTime: false,
    hasCompletedOnboarding: false,
    hasSkippedOnboarding: false,
    shouldShowOnboarding: false,
    completedAt: null,
    currentStep: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkOnboardingStatus = () => {
      const hasCompleted = localStorage.getItem('onboarding_completed') === 'true';
      const hasSkipped = localStorage.getItem('onboarding_skipped') === 'true';
      const completedAt = localStorage.getItem('onboarding_completed_at');
      const userCreatedAt = new Date(user.id); // Assuming user ID contains timestamp
      const now = new Date();
      const timeSinceCreation = now.getTime() - userCreatedAt.getTime();
      const isNewUser = timeSinceCreation < 24 * 60 * 60 * 1000; // Less than 24 hours

      // Check if this is truly a first-time user
      const isFirstTime = !hasCompleted && !hasSkipped && isNewUser;

      // Should show onboarding if it's a first-time user or if they haven't completed/skipped
      const shouldShow = isFirstTime || (!hasCompleted && !hasSkipped);

      setOnboardingState({
        isFirstTime,
        hasCompletedOnboarding: hasCompleted,
        hasSkippedOnboarding: hasSkipped,
        shouldShowOnboarding: shouldShow,
        completedAt,
        currentStep: 0,
      });
    };

    checkOnboardingStatus();
  }, [user, isAuthenticated]);

  const markOnboardingCompleted = () => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_completed_at', new Date().toISOString());
    setOnboardingState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      shouldShowOnboarding: false,
      completedAt: new Date().toISOString(),
    }));
  };

  const markOnboardingSkipped = () => {
    localStorage.setItem('onboarding_skipped', 'true');
    setOnboardingState(prev => ({
      ...prev,
      hasSkippedOnboarding: true,
      shouldShowOnboarding: false,
    }));
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_skipped');
    localStorage.removeItem('onboarding_completed_at');
    setOnboardingState({
      isFirstTime: true,
      hasCompletedOnboarding: false,
      hasSkippedOnboarding: false,
      shouldShowOnboarding: true,
      completedAt: null,
      currentStep: 0,
    });
  };

  const startOnboarding = () => {
    setOnboardingState(prev => ({
      ...prev,
      shouldShowOnboarding: true,
      currentStep: 0,
    }));
  };

  return {
    ...onboardingState,
    markOnboardingCompleted,
    markOnboardingSkipped,
    resetOnboarding,
    startOnboarding,
  };
};
