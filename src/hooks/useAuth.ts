import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, type Profile } from '@/lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

export interface User {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  isPremium: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true for proper initialization
  const [isInitialized, setIsInitialized] = useState(false); // Start uninitialized until session check completes
  const navigate = useNavigate();

  // Use refs to track state across renders and prevent scope issues
  const lastProcessedUserIdRef = useRef<string | null>(null);
  const isProcessingAuthEventRef = useRef(false);
  const isMountedRef = useRef(true);

  // Convert Supabase user + profile to our User interface
  const mapSupabaseUserToUser = useCallback(
    (supabaseUser: SupabaseUser, profile?: Profile): User => {
      return {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        username: profile?.username || undefined,
        fullName: profile?.full_name || undefined,
        avatarUrl: profile?.avatar_url || undefined,
        isPremium: profile?.is_premium || false,
      };
    },
    []
  );

  // Validate session to ensure it's not expired or corrupted
  const validateSession = useCallback(async (session: Session): Promise<boolean> => {
    try {
      // Check if session has required properties
      if (!session.user || !session.access_token) {
        logger.auth.warn('Invalid session: missing user or access token');
        return false;
      }

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && session.expires_at < now) {
        logger.auth.warn('Session expired');
        return false;
      }

      // Try to make a simple authenticated request to verify the token works
      const { error } = await supabase.from('profiles').select('id').limit(1);
      if (error) {
        logger.auth.warn('Session validation failed:', error.message);
        return false;
      }

      logger.auth.debug('Session validation successful');
      return true;
    } catch (error) {
      logger.auth.warn('Session validation error:', error);
      return false;
    }
  }, []);

  // Fetch user profile from database with timeout - more robust
  const fetchUserProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      logger.auth.debug('Fetching profile for user:', userId);

      // Add timeout to prevent hanging - increased to 10 seconds
      const profilePromise = supabase.from('profiles').select('*').eq('id', userId).single();

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      );

      const { data: profile, error } = (await Promise.race([profilePromise, timeoutPromise])) as {
        data: Profile | null;
        error: Error | null;
      };

      if (error) {
        logger.auth.warn('Profile fetch failed:', error.message);
        // Don't fail completely - continue without profile
        logger.auth.debug('Creating user without profile data');
        return null;
      }

      logger.auth.debug('Profile fetched successfully:', profile?.email || 'no email');
      return profile;
    } catch (error) {
      logger.auth.warn('Profile fetch error:', error);
      // Don't fail completely - continue without profile
      logger.auth.debug('Continuing without profile due to error');
      return null;
    }
  }, []);

  // Set user from session with robust error handling and state persistence
  const setUserFromSession = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        logger.auth.debug('No user in session, clearing state');
        setUser(null);
        return;
      }

      // Prevent duplicate processing for the same user
      if (user && user.id === session.user.id && user.email === session.user.email) {
        logger.auth.debug('User already set for this session, skipping duplicate processing');
        return;
      }

      logger.auth.debug('Setting user from session:', session.user.email);

      try {
        // Create basic user object first to ensure we have something
        const basicUser = mapSupabaseUserToUser(session.user, null);

        // Set basic user immediately to prevent state loss
        setUser(basicUser);
        logger.auth.debug('Basic user set immediately:', basicUser.email);

        // Try to fetch profile to enhance user data
        try {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            const enhancedUser = mapSupabaseUserToUser(session.user, profile);
            setUser(enhancedUser);
            logger.auth.debug('User enhanced with profile data:', enhancedUser.email);
          } else {
            logger.auth.debug('Profile not found, keeping basic user data');
          }
        } catch (profileError) {
          logger.auth.warn('Profile fetch failed, keeping basic user:', profileError);
          // Keep the basic user we already set
        }
      } catch (error) {
        logger.auth.error('Critical error setting user from session:', error);
        // Even in critical error, try to set basic user
        try {
          const fallbackUser = mapSupabaseUserToUser(session.user, null);
          setUser(fallbackUser);
          logger.auth.debug('Fallback user set:', fallbackUser.email);
        } catch (fallbackError) {
          logger.auth.error('Complete failure to set user:', fallbackError);
        }
      }
    },
    [mapSupabaseUserToUser, fetchUserProfile, user]
  );

  // Initialize authentication state - run only once with proper cleanup
  useEffect(() => {
    isMountedRef.current = true;
    let authSubscription: { data?: { subscription?: { unsubscribe: () => void } } } | null = null;

    const initializeAuth = async () => {
      if (isInitialized) {
        logger.auth.debug('Auth already initialized, skipping...');
        return;
      }

      logger.auth.debug('Initializing authentication...');
      setIsLoading(true);

      try {
        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          logger.auth.error('Error getting session:', error);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        logger.auth.debug('Initial session found:', !!session?.user, session?.user?.email);

        if (isMountedRef.current) {
          if (session?.user) {
            // Skip validation for now to debug the issue
            logger.auth.debug('Restoring user from session (validation skipped)...');
            lastProcessedUserIdRef.current = session.user.id;
            await setUserFromSession(session);
            logger.auth.debug('User restored from session');
          } else {
            logger.auth.debug('No existing session');
          }
          // Always set loading to false and initialized to true after session check
          setIsLoading(false);
          setIsInitialized(true);
          logger.auth.debug('Authentication initialization complete');
        }
      } catch (error) {
        logger.auth.error('Auth initialization error:', error);
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Setup auth state listener with robust duplicate prevention
    authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMountedRef.current) {
        logger.auth.debug('Component unmounted, ignoring auth event:', event);
        return;
      }

      // Prevent concurrent processing
      if (isProcessingAuthEventRef.current) {
        logger.auth.debug('Already processing auth event, skipping:', event);
        return;
      }

      logger.auth.debug('Auth state change:', event, !!session?.user, session?.user?.email);

      // Special handling for SIGNED_OUT event
      if (event === 'SIGNED_OUT') {
        logger.auth.debug('SIGNED_OUT event detected - clearing user state');
        setUser(null);
        lastProcessedUserIdRef.current = null;
        setIsLoading(false);
        return;
      }

      // Skip duplicate events for the same user
      if (
        session?.user?.id &&
        lastProcessedUserIdRef.current === session.user.id &&
        (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED')
      ) {
        logger.auth.debug('Duplicate event for same user, skipping:', event, session.user.email);
        return;
      }

      isProcessingAuthEventRef.current = true;

      try {
        switch (event) {
          case 'SIGNED_IN':
            logger.auth.debug('User signed in via auth state change');
            if (session?.user && isMountedRef.current) {
              lastProcessedUserIdRef.current = session.user.id;
              logger.auth.debug('Setting user from SIGNED_IN event:', session.user.email);
              // Small delay to ensure state stability
              await new Promise(resolve => setTimeout(resolve, 100));
              await setUserFromSession(session);
              setIsLoading(false);
              logger.auth.debug('User state updated via SIGNED_IN');
            }
            break;

          case 'SIGNED_OUT':
            logger.auth.debug('User signed out, clearing state...');
            if (isMountedRef.current) {
              lastProcessedUserIdRef.current = null;
              setUser(null);
              setIsLoading(false);
            }
            break;

          case 'TOKEN_REFRESHED':
            logger.auth.debug('Token refreshed');
            // Only restore user if we don't have one and this is a different user
            if (session?.user && isMountedRef.current && (!user || user.id !== session.user.id)) {
              lastProcessedUserIdRef.current = session.user.id;
              logger.auth.debug('Restoring user after token refresh:', session.user.email);
              await setUserFromSession(session);
            } else {
              logger.auth.debug('Token refresh - user already set, skipping');
            }
            break;

          case 'INITIAL_SESSION':
            logger.auth.debug('Initial session event');
            // Only process if this is a new user or we don't have a user
            if (session?.user && isMountedRef.current && (!user || user.id !== session.user.id)) {
              lastProcessedUserIdRef.current = session.user.id;
              logger.auth.debug('Processing initial session for:', session.user.email);
              await setUserFromSession(session);
            } else {
              logger.auth.debug('Initial session - user already set or no user, skipping');
            }
            break;

          default:
            logger.auth.debug('Other auth event (ignored):', event);
            break;
        }
      } catch (error) {
        logger.auth.error('Error processing auth event:', event, error);
      } finally {
        isProcessingAuthEventRef.current = false;
      }
    });

    // Initialize auth
    initializeAuth();

    // Timeout fallback to ensure initialization completes
    const timeoutId = setTimeout(() => {
      if (isMountedRef.current && !isInitialized) {
        logger.auth.warn('Auth initialization timeout - forcing initialization');
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 5000); // 5 second timeout

    return () => {
      isMountedRef.current = false;
      clearTimeout(timeoutId);
      if (authSubscription) {
        authSubscription.data?.subscription?.unsubscribe();
      }
    };
  }, [isInitialized, setUserFromSession, user, validateSession]); // Added missing dependencies

  // Login function with robust state management
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      logger.auth.info('Starting login process for:', email);
      setIsLoading(true);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          logger.auth.error('Login error:', error);
          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error('No user data received');
        }

        logger.auth.info('Login successful for:', data.user.email);

        // Create basic user immediately to ensure state stability
        const basicUser = mapSupabaseUserToUser(data.user, null);
        setUser(basicUser);
        logger.auth.debug('Basic user set immediately during login:', basicUser.email);

        // Try to enhance with profile data
        try {
          const profile = await fetchUserProfile(data.user.id);
          if (profile) {
            const enhancedUser = mapSupabaseUserToUser(data.user, profile);
            setUser(enhancedUser);
            logger.auth.debug('User enhanced with profile during login:', enhancedUser.email);
            return enhancedUser;
          }
        } catch (profileError) {
          logger.auth.warn('Profile fetch failed during login, using basic user:', profileError);
        }

        // Return basic user if profile enhancement failed
        return basicUser;
      } catch (error) {
        logger.auth.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserProfile, mapSupabaseUserToUser]
  );

  // Signup function - always use real Supabase authentication
  const signup = useCallback(
    async (
      email: string,
      password: string,
      username?: string,
      fullName?: string
    ): Promise<User> => {
      logger.auth.info('Starting signup process for:', email);
      setIsLoading(true);

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: username?.trim(),
              full_name: fullName?.trim(),
            },
          },
        });

        if (error) {
          logger.auth.error('Signup error:', error);
          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error('No user data received');
        }

        logger.auth.info('Signup successful for:', data.user.email);

        // Create profile in database
        try {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email!,
            username: username?.trim() || null,
            full_name: fullName?.trim() || null,
            is_premium: false,
          });

          if (profileError) {
            logger.auth.warn('Profile creation failed:', profileError);
          } else {
            logger.auth.debug('Profile created successfully');
          }
        } catch (err) {
          logger.auth.warn('Profile creation error:', err);
        }

        // Create user object
        const newUser: User = {
          id: data.user.id,
          email: data.user.email!,
          username: username?.trim(),
          fullName: fullName?.trim(),
          avatarUrl: undefined,
          isPremium: false,
        };

        // Set user immediately
        setUser(newUser);
        logger.auth.debug('User set during signup:', newUser.email);

        return newUser;
      } catch (error) {
        logger.auth.error('Signup failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Enhanced logout function with comprehensive cleanup
  const logout = useCallback(async () => {
    logger.auth.info('Starting comprehensive logout...');

    // Set loading state during logout
    setIsLoading(true);

    try {
      // Step 1: Sign out from Supabase with proper scope
      logger.auth.debug('Signing out from Supabase...');
      const { error } = await supabase.auth.signOut({ scope: 'global' });

      if (error) {
        logger.auth.error('Supabase logout error:', error);
        // Continue with cleanup even if Supabase logout fails
      } else {
        logger.auth.debug('Supabase logout successful');
      }

      // Step 2: Clear local authentication state immediately
      logger.auth.debug('Clearing local authentication state...');
      setUser(null);
      lastProcessedUserIdRef.current = null;
      isProcessingAuthEventRef.current = false;

      // Step 3: Force clear any remaining Supabase tokens from storage
      logger.auth.debug('Force clearing authentication storage...');
      try {
        // Clear localStorage items that might contain auth tokens
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          logger.auth.debug(`Removed localStorage key: ${key}`);
        });

        // Clear sessionStorage items that might contain auth tokens
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-'))) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => {
          sessionStorage.removeItem(key);
          logger.auth.debug(`Removed sessionStorage key: ${key}`);
        });
      } catch (storageError) {
        logger.auth.warn('Error clearing storage:', storageError);
      }

      // Step 4: Verify session is actually cleared
      logger.auth.debug('Verifying session cleanup...');
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          logger.auth.warn('Session still exists after logout, forcing another signOut');
          await supabase.auth.signOut({ scope: 'global' });
        } else {
          logger.auth.debug('Session successfully cleared');
        }
      } catch (verifyError) {
        logger.auth.warn('Error verifying session cleanup:', verifyError);
      }

      logger.auth.info('Comprehensive logout completed');
    } catch (error) {
      logger.auth.error('Logout process failed:', error);
      // Even if logout fails, ensure local state is cleared
      setUser(null);
      lastProcessedUserIdRef.current = null;
    } finally {
      // Always clear loading state
      setIsLoading(false);

      // Navigate to home page after a short delay to allow state to update
      setTimeout(() => {
        logger.auth.debug('Navigating to home page...');
        navigate('/');
      }, 100);
    }
  }, [navigate]);

  // Force clear all authentication data - utility function
  const forceAuthCleanup = useCallback(async () => {
    logger.auth.info('Force clearing all authentication data...');

    try {
      // Clear React state
      setUser(null);
      lastProcessedUserIdRef.current = null;
      isProcessingAuthEventRef.current = false;

      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });

      // Force clear all storage
      const allStorageKeys = [];

      // Collect localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
          allStorageKeys.push({ storage: 'local', key });
        }
      }

      // Collect sessionStorage keys
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
          allStorageKeys.push({ storage: 'session', key });
        }
      }

      // Remove all collected keys
      allStorageKeys.forEach(({ storage, key }) => {
        if (storage === 'local') {
          localStorage.removeItem(key);
        } else {
          sessionStorage.removeItem(key);
        }
        logger.auth.debug(`Removed ${storage}Storage key: ${key}`);
      });

      logger.auth.info('Force authentication cleanup completed');
    } catch (error) {
      logger.auth.error('Error during force auth cleanup:', error);
    }
  }, []);

  // Utility functions
  const upgradeToPremium = useCallback(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/pricing');
  }, [user, navigate]);

  const updateUserPremiumStatus = useCallback(
    async (isPremium: boolean) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_premium: isPremium, updated_at: new Date().toISOString() })
          .eq('id', user.id);

        if (error) throw error;

        setUser({ ...user, isPremium });
        logger.auth.debug('Premium status updated:', isPremium);
      } catch (error) {
        logger.auth.error('Error updating premium status:', error);
        throw error;
      }
    },
    [user]
  );

  // Debug logging for development - enhanced
  useEffect(() => {
    logger.auth.debug('useAuth State Debug:', {
      user: !!user,
      isLoading,
      isInitialized,
      isAuthenticated: !!user,
      userEmail: user?.email,
      userDetails: user
        ? {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            isPremium: user.isPremium,
          }
        : null,
      timestamp: new Date().toLocaleTimeString(),
    });

    // Log when user state changes
    if (user) {
      logger.auth.debug('User is SET:', user.email);
    } else {
      logger.auth.debug('User is NULL');
    }
  }, [user, isLoading, isInitialized]);

  // Simple logout without navigation for testing
  const logoutWithoutNavigation = useCallback(async () => {
    logger.auth.debug('Simple logout without navigation...');
    try {
      // Just sign out and clear state
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        logger.auth.error('Simple logout error:', error);
      } else {
        logger.auth.debug('Simple logout successful');
      }

      // Clear local state
      setUser(null);
      lastProcessedUserIdRef.current = null;
    } catch (error) {
      logger.auth.error('Simple logout failed:', error);
    }
  }, []);

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    logoutWithoutNavigation,
    forceAuthCleanup,
    upgradeToPremium,
    updateUserPremiumStatus,
  };
};
