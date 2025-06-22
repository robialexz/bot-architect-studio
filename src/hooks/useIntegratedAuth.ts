/**
 * Integrated Authentication Hook
 * Combines frontend and backend authentication systems
 */

import { useState, useEffect, useCallback } from 'react';
import { useBackendAuth } from './useServices';
import { useAuth as useFrontendAuth } from './useAuth';
import { serviceManager } from '@/services/serviceManager';
import { logger } from '@/lib/logger';

export interface IntegratedUser {
  id: string | number;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier?: string;
  is_verified?: boolean;
  // Add any other user properties needed
}

export interface AuthState {
  user: IntegratedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isUsingBackend: boolean;
}

export function useIntegratedAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    isUsingBackend: false,
  });

  // Backend auth hook
  const backendAuth = useBackendAuth();
  
  // Frontend auth hook (fallback)
  const frontendAuth = useFrontendAuth();

  // Determine which auth system to use
  const isUsingBackend = serviceManager.isUsingBackend();

  // Update auth state based on active system
  useEffect(() => {
    const updateAuthState = () => {
      if (isUsingBackend) {
        // Use backend authentication
        setAuthState({
          user: backendAuth.user ? {
            id: backendAuth.user.id,
            email: backendAuth.user.email,
            username: backendAuth.user.username,
            full_name: backendAuth.user.full_name,
            avatar_url: backendAuth.user.avatar_url,
            subscription_tier: backendAuth.user.subscription_tier,
            is_verified: backendAuth.user.is_verified,
          } : null,
          isAuthenticated: backendAuth.isAuthenticated,
          isLoading: backendAuth.loading,
          error: backendAuth.error,
          isUsingBackend: true,
        });
      } else {
        // Use frontend authentication
        setAuthState({
          user: frontendAuth.user ? {
            id: frontendAuth.user.id || frontendAuth.user.email,
            email: frontendAuth.user.email,
            username: frontendAuth.user.user_metadata?.username,
            full_name: frontendAuth.user.user_metadata?.full_name,
            avatar_url: frontendAuth.user.user_metadata?.avatar_url,
            subscription_tier: 'free',
            is_verified: frontendAuth.user.email_confirmed_at != null,
          } : null,
          isAuthenticated: !!frontendAuth.user,
          isLoading: frontendAuth.loading,
          error: frontendAuth.error,
          isUsingBackend: false,
        });
      }
    };

    updateAuthState();
  }, [
    isUsingBackend,
    backendAuth.user,
    backendAuth.isAuthenticated,
    backendAuth.loading,
    backendAuth.error,
    frontendAuth.user,
    frontendAuth.loading,
    frontendAuth.error,
  ]);

  // Login function
  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      if (isUsingBackend) {
        const result = await backendAuth.login(credentials);
        if (result) {
          logger.info('Backend login successful');
          return result;
        }
      } else {
        const result = await frontendAuth.signIn(credentials.email, credentials.password);
        if (result) {
          logger.info('Frontend login successful');
          return result;
        }
      }
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }, [isUsingBackend, backendAuth, frontendAuth]);

  // Register function
  const register = useCallback(async (userData: {
    email: string;
    password: string;
    full_name?: string;
    username?: string;
  }) => {
    try {
      if (isUsingBackend) {
        const result = await backendAuth.register(userData);
        if (result) {
          logger.info('Backend registration successful');
          return result;
        }
      } else {
        const result = await frontendAuth.signUp(userData.email, userData.password, {
          data: {
            full_name: userData.full_name,
            username: userData.username,
          }
        });
        if (result) {
          logger.info('Frontend registration successful');
          return result;
        }
      }
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }, [isUsingBackend, backendAuth, frontendAuth]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (isUsingBackend) {
        await backendAuth.logout();
      } else {
        await frontendAuth.signOut();
      }
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  }, [isUsingBackend, backendAuth, frontendAuth]);

  // Update profile function
  const updateProfile = useCallback(async (updates: {
    full_name?: string;
    username?: string;
    bio?: string;
    company?: string;
    location?: string;
    website?: string;
  }) => {
    try {
      if (isUsingBackend) {
        const result = await backendAuth.updateProfile(updates);
        if (result) {
          logger.info('Backend profile update successful');
          return result;
        }
      } else {
        // Frontend profile update would go here
        logger.info('Frontend profile update (not implemented)');
        return authState.user;
      }
    } catch (error) {
      logger.error('Profile update failed:', error);
      throw error;
    }
  }, [isUsingBackend, backendAuth, authState.user]);

  // Get current user function
  const getCurrentUser = useCallback(async () => {
    try {
      if (isUsingBackend) {
        return await backendAuth.getCurrentUser();
      } else {
        return frontendAuth.user;
      }
    } catch (error) {
      logger.error('Get current user failed:', error);
      throw error;
    }
  }, [isUsingBackend, backendAuth, frontendAuth]);

  // Clear error function
  const clearError = useCallback(() => {
    if (isUsingBackend) {
      backendAuth.clearError();
    } else {
      frontendAuth.clearError?.();
    }
  }, [isUsingBackend, backendAuth, frontendAuth]);

  // Check if user has premium subscription
  const isPremium = useCallback(() => {
    if (authState.user) {
      return authState.user.subscription_tier === 'premium' || 
             authState.user.subscription_tier === 'enterprise';
    }
    return false;
  }, [authState.user]);

  // Check if user is verified
  const isVerified = useCallback(() => {
    return authState.user?.is_verified || false;
  }, [authState.user]);

  return {
    // Auth state
    ...authState,
    
    // Auth methods
    login,
    register,
    logout,
    updateProfile,
    getCurrentUser,
    clearError,
    
    // Utility methods
    isPremium,
    isVerified,
    
    // System info
    authSystem: isUsingBackend ? 'backend' : 'frontend',
  };
}
