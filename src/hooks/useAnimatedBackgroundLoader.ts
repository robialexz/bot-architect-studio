import { useState, useEffect, useCallback, useRef } from 'react';

interface LoaderOptions {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onRetry?: (attempt: number) => void;
}

interface LoaderState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  error?: Error;
  retryCount: number;
  progress: number;
}

export const useAnimatedBackgroundLoader = (options: LoaderOptions = {}) => {
  const {
    timeout = 10000,
    retryAttempts = 3,
    retryDelay = 2000,
    onSuccess,
    onError,
    onRetry,
  } = options;

  const [state, setState] = useState<LoaderState>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
    retryCount: 0,
    progress: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  const startLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false,
      progress: 0,
    }));

    // Simulate progress
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 20;
      if (progress > 90) progress = 90;
      setState(prev => ({ ...prev, progress }));
    }, 200);

    // Set timeout
    timeoutRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      const error = new Error('Animation loading timeout');
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        error,
        progress: 0,
      }));

      if (onError) {
        onError(error);
      }
    }, timeout);
  }, [timeout, onError]);

  const markAsLoaded = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: true,
      hasError: false,
      progress: 100,
    }));

    if (onSuccess) {
      onSuccess();
    }
  }, [onSuccess]);

  const markAsError = useCallback(
    (error: Error) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        error,
        progress: 0,
      }));

      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  const retry = useCallback(() => {
    if (state.retryCount >= retryAttempts) {
      console.warn('useAnimatedBackgroundLoader: Max retry attempts reached');
      return;
    }

    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      hasError: false,
    }));

    if (onRetry) {
      onRetry(state.retryCount + 1);
    }

    retryTimeoutRef.current = setTimeout(
      () => {
        startLoading();
      },
      retryDelay * (state.retryCount + 1)
    );
  }, [state.retryCount, retryAttempts, retryDelay, onRetry, startLoading]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setState({
      isLoading: false,
      isLoaded: false,
      hasError: false,
      retryCount: 0,
      progress: 0,
    });
  }, []);

  // Auto-retry on error
  useEffect(() => {
    if (state.hasError && state.retryCount < retryAttempts) {
      console.log(
        `useAnimatedBackgroundLoader: Auto-retrying (${state.retryCount + 1}/${retryAttempts})`
      );
      retry();
    }
  }, [state.hasError, state.retryCount, retryAttempts, retry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startLoading,
    markAsLoaded,
    markAsError,
    retry,
    reset,
    canRetry: state.retryCount < retryAttempts,
  };
};
