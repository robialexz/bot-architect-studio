/**
 * useServices Hook
 * Provides unified access to all services (frontend/backend)
 */

import { useEffect, useState } from 'react';
import { serviceManager, getWorkflowService, getAIService, getAuthService } from '@/services/serviceManager';
import { logger } from '@/lib/logger';

export interface ServiceStatus {
  isUsingBackend: boolean;
  backendHealthy: boolean;
  lastHealthCheck: Date | null;
}

export function useServices() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    isUsingBackend: false,
    backendHealthy: false,
    lastHealthCheck: null,
  });

  useEffect(() => {
    // Initial status check
    updateServiceStatus();

    // Set up periodic health checks
    const healthCheckInterval = setInterval(async () => {
      try {
        await serviceManager.refreshBackendHealth();
        updateServiceStatus();
      } catch (error) {
        logger.warn('Health check failed:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(healthCheckInterval);
  }, []);

  const updateServiceStatus = () => {
    setServiceStatus({
      isUsingBackend: serviceManager.isUsingBackend(),
      backendHealthy: serviceManager.isUsingBackend(),
      lastHealthCheck: new Date(),
    });
  };

  const refreshServices = async () => {
    await serviceManager.refreshBackendHealth();
    updateServiceStatus();
  };

  return {
    // Service instances
    workflowService: getWorkflowService(),
    aiService: getAIService(),
    authService: getAuthService(),
    
    // Service status
    serviceStatus,
    refreshServices,
    
    // Convenience flags
    isUsingBackend: serviceStatus.isUsingBackend,
    isBackendHealthy: serviceStatus.backendHealthy,
  };
}

/**
 * Hook for workflow operations
 */
export function useWorkflows() {
  const { workflowService } = useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithErrorHandling = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logger.error('Workflow operation failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Service methods
    createWorkflow: (data: any) => executeWithErrorHandling(() => workflowService.createWorkflow(data)),
    getWorkflows: (params?: any) => executeWithErrorHandling(() => workflowService.getWorkflows(params)),
    getWorkflow: (id: string | number) => executeWithErrorHandling(() => workflowService.getWorkflow(id)),
    updateWorkflow: (id: string | number, data: any) => executeWithErrorHandling(() => workflowService.updateWorkflow(id, data)),
    deleteWorkflow: (id: string | number) => executeWithErrorHandling(() => workflowService.deleteWorkflow(id)),
    executeWorkflow: (id: string | number, input?: any) => executeWithErrorHandling(() => workflowService.executeWorkflow(id, input)),
    searchWorkflows: (query: string, filters?: any) => executeWithErrorHandling(() => workflowService.searchWorkflows(query, filters)),
    
    // State
    loading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Hook for AI operations
 */
export function useAI() {
  const { aiService } = useServices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeWithErrorHandling = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logger.error('AI operation failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // Service methods
    processRequest: (request: any) => executeWithErrorHandling(() => aiService.processRequest(request)),
    getModels: () => executeWithErrorHandling(() => aiService.getModels()),
    generateWithOpenAI: (prompt: string, model?: string, options?: any) => 
      executeWithErrorHandling(() => aiService.generateWithOpenAI(prompt, model, options)),
    generateWithClaude: (prompt: string, model?: string, options?: any) => 
      executeWithErrorHandling(() => aiService.generateWithClaude(prompt, model, options)),
    generateCode: (prompt: string, language?: string, provider?: string) => 
      executeWithErrorHandling(() => aiService.generateCode(prompt, language, provider)),
    analyzeText: (text: string, type?: string, provider?: string) => 
      executeWithErrorHandling(() => aiService.analyzeText(text, type, provider)),
    
    // State
    loading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Hook for authentication operations
 */
export function useBackendAuth() {
  const { authService } = useServices();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set initial user
    setUser(authService.getUser());

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, [authService]);

  const executeWithErrorHandling = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      logger.error('Auth operation failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // User state
    user,
    isAuthenticated: authService.isAuthenticated(),
    
    // Service methods
    login: (credentials: any) => executeWithErrorHandling(() => authService.login(credentials)),
    register: (userData: any) => executeWithErrorHandling(() => authService.register(userData)),
    logout: () => executeWithErrorHandling(() => authService.logout()),
    getCurrentUser: () => executeWithErrorHandling(() => authService.getCurrentUser()),
    updateProfile: (data: any) => executeWithErrorHandling(() => authService.updateProfile(data)),
    
    // State
    loading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Hook for service monitoring and debugging
 */
export function useServiceMonitor() {
  const { serviceStatus, refreshServices } = useServices();
  const [logs, setLogs] = useState<Array<{ timestamp: Date; level: string; message: string; data?: any }>>([]);

  useEffect(() => {
    // Listen for service events
    const handleServiceEvent = (event: CustomEvent) => {
      setLogs(prev => [...prev.slice(-99), {
        timestamp: new Date(),
        level: event.detail.level || 'info',
        message: event.detail.message,
        data: event.detail.data,
      }]);
    };

    window.addEventListener('service:event' as any, handleServiceEvent);
    return () => window.removeEventListener('service:event' as any, handleServiceEvent);
  }, []);

  const clearLogs = () => setLogs([]);

  return {
    serviceStatus,
    logs,
    clearLogs,
    refreshServices,
    
    // Debug helpers
    getServiceInfo: () => ({
      backend: serviceStatus.isUsingBackend,
      healthy: serviceStatus.backendHealthy,
      lastCheck: serviceStatus.lastHealthCheck,
      logCount: logs.length,
    }),
  };
}
