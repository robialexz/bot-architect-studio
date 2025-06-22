/**
 * Service Manager
 * Manages the transition between frontend and backend services
 * Provides a unified interface for all services
 */

import { apiConfig } from '@/lib/env';
import { logger } from '@/lib/logger';

// Frontend services (legacy)
import { workflowService } from './workflowService';
import { realAIService } from './realAIService';
import { useAuth } from '@/hooks/useAuth';

// Backend services (new)
import { backendWorkflowService } from './backendWorkflowService';
import { backendAIService } from './backendAIService';
import { backendAuthService } from './backendAuthService';

// Service interfaces
export interface IWorkflowService {
  createWorkflow: (data: any) => Promise<any>;
  getWorkflows: (params?: any) => Promise<any[]>;
  getWorkflow: (id: string | number) => Promise<any>;
  updateWorkflow: (id: string | number, data: any) => Promise<any>;
  deleteWorkflow: (id: string | number) => Promise<void>;
  executeWorkflow: (id: string | number, input?: any) => Promise<any>;
  searchWorkflows: (query: string, filters?: any) => Promise<any[]>;
}

export interface IAIService {
  processRequest: (request: any) => Promise<any>;
  getModels: () => Promise<any[]>;
  generateWithOpenAI: (prompt: string, model?: string, options?: any) => Promise<any>;
  generateWithClaude: (prompt: string, model?: string, options?: any) => Promise<any>;
  generateCode: (prompt: string, language?: string, provider?: string) => Promise<any>;
  analyzeText: (text: string, type?: string, provider?: string) => Promise<any>;
}

export interface IAuthService {
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<any>;
  updateProfile: (data: any) => Promise<any>;
  isAuthenticated: () => boolean;
  getUser: () => any;
  onAuthStateChange: (callback: (user: any) => void) => () => void;
}

class ServiceManager {
  private useBackend: boolean;
  private backendHealthy: boolean = false;

  constructor() {
    this.useBackend = apiConfig.backendEnabled;
    this.checkBackendHealth();
  }

  private async checkBackendHealth(): Promise<void> {
    if (!this.useBackend) {
      logger.info('Backend disabled, using frontend services');
      return;
    }

    try {
      const health = await fetch(`${apiConfig.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000,
      } as any);

      if (health.ok) {
        this.backendHealthy = true;
        logger.info('Backend is healthy, using backend services');
      } else {
        throw new Error('Backend health check failed');
      }
    } catch (error) {
      logger.warn('Backend health check failed, falling back to frontend services:', error);
      this.backendHealthy = false;
      this.useBackend = false;
    }
  }

  /**
   * Get the appropriate workflow service
   */
  getWorkflowService(): IWorkflowService {
    if (this.useBackend && this.backendHealthy) {
      return this.createBackendWorkflowAdapter();
    }
    return this.createFrontendWorkflowAdapter();
  }

  /**
   * Get the appropriate AI service
   */
  getAIService(): IAIService {
    if (this.useBackend && this.backendHealthy) {
      return this.createBackendAIAdapter();
    }
    return this.createFrontendAIAdapter();
  }

  /**
   * Get the appropriate auth service
   */
  getAuthService(): IAuthService {
    if (this.useBackend && this.backendHealthy) {
      return this.createBackendAuthAdapter();
    }
    return this.createFrontendAuthAdapter();
  }

  /**
   * Check if backend is being used
   */
  isUsingBackend(): boolean {
    return this.useBackend && this.backendHealthy;
  }

  /**
   * Force refresh backend health check
   */
  async refreshBackendHealth(): Promise<void> {
    await this.checkBackendHealth();
  }

  // Backend service adapters
  private createBackendWorkflowAdapter(): IWorkflowService {
    return {
      createWorkflow: (data) => backendWorkflowService.createWorkflow(data),
      getWorkflows: (params) => backendWorkflowService.getWorkflows(params),
      getWorkflow: (id) => backendWorkflowService.getWorkflow(Number(id)),
      updateWorkflow: (id, data) => backendWorkflowService.updateWorkflow(Number(id), data),
      deleteWorkflow: (id) => backendWorkflowService.deleteWorkflow(Number(id)),
      executeWorkflow: (id, input) => backendWorkflowService.executeWorkflow(Number(id), input),
      searchWorkflows: (query, filters) => backendWorkflowService.searchWorkflows(query, filters),
    };
  }

  private createBackendAIAdapter(): IAIService {
    return {
      processRequest: (request) => backendAIService.processRequest(request),
      getModels: () => backendAIService.getModels(),
      generateWithOpenAI: (prompt, model, options) => backendAIService.generateWithOpenAI(prompt, model, options),
      generateWithClaude: (prompt, model, options) => backendAIService.generateWithClaude(prompt, model, options),
      generateCode: (prompt, language, provider) => backendAIService.generateCode(prompt, language, provider as any),
      analyzeText: (text, type, provider) => backendAIService.analyzeText(text, type as any, provider as any),
    };
  }

  private createBackendAuthAdapter(): IAuthService {
    return {
      login: (credentials) => backendAuthService.login(credentials),
      register: (userData) => backendAuthService.register(userData),
      logout: () => backendAuthService.logout(),
      getCurrentUser: () => backendAuthService.getCurrentUser(),
      updateProfile: (data) => backendAuthService.updateProfile(data),
      isAuthenticated: () => backendAuthService.isAuthenticated(),
      getUser: () => backendAuthService.getUser(),
      onAuthStateChange: (callback) => backendAuthService.onAuthStateChange(callback),
    };
  }

  // Frontend service adapters (legacy)
  private createFrontendWorkflowAdapter(): IWorkflowService {
    return {
      createWorkflow: async (data) => {
        const result = await workflowService.createWorkflow(data);
        return result;
      },
      getWorkflows: async (params) => {
        const result = await workflowService.getWorkflows();
        return result;
      },
      getWorkflow: async (id) => {
        const result = await workflowService.getWorkflow(String(id));
        return result;
      },
      updateWorkflow: async (id, data) => {
        const result = await workflowService.updateWorkflow(String(id), data);
        return result;
      },
      deleteWorkflow: async (id) => {
        await workflowService.deleteWorkflow(String(id));
      },
      executeWorkflow: async (id, input) => {
        // Frontend workflow execution would go here
        return { id: `exec_${id}`, status: 'completed', output: input };
      },
      searchWorkflows: async (query, filters) => {
        const result = await workflowService.searchWorkflows(query);
        return result;
      },
    };
  }

  private createFrontendAIAdapter(): IAIService {
    return {
      processRequest: async (request) => {
        // Map backend request format to frontend
        const { provider, model, prompt, max_tokens, temperature } = request;
        
        if (provider === 'openai') {
          return realAIService.processGPT4(prompt, model);
        } else if (provider === 'anthropic') {
          return realAIService.processClaude(prompt, model);
        } else if (provider === 'google') {
          return realAIService.processGemini(prompt, model);
        }
        
        throw new Error(`Unsupported provider: ${provider}`);
      },
      getModels: async () => {
        return [
          { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
          { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
          { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
        ];
      },
      generateWithOpenAI: (prompt, model, options) => realAIService.processGPT4(prompt, model),
      generateWithClaude: (prompt, model, options) => realAIService.processClaude(prompt, model),
      generateCode: (prompt, language, provider) => realAIService.generateCode(prompt, language),
      analyzeText: (text, type, provider) => realAIService.processGPT4(`Analyze this text: ${text}`, 'gpt-3.5-turbo'),
    };
  }

  private createFrontendAuthAdapter(): IAuthService {
    // This would integrate with the existing useAuth hook
    const authHook = useAuth();
    
    return {
      login: async (credentials) => {
        // Frontend auth logic
        return { user: { email: credentials.email }, token: 'frontend-token' };
      },
      register: async (userData) => {
        // Frontend registration logic
        return { user: { email: userData.email }, token: 'frontend-token' };
      },
      logout: async () => {
        // Frontend logout logic
      },
      getCurrentUser: async () => {
        return authHook.user;
      },
      updateProfile: async (data) => {
        return { ...authHook.user, ...data };
      },
      isAuthenticated: () => !!authHook.user,
      getUser: () => authHook.user,
      onAuthStateChange: (callback) => {
        // Would need to implement this with the auth hook
        return () => {};
      },
    };
  }
}

// Create singleton instance
export const serviceManager = new ServiceManager();

// Export convenience methods
export const getWorkflowService = () => serviceManager.getWorkflowService();
export const getAIService = () => serviceManager.getAIService();
export const getAuthService = () => serviceManager.getAuthService();

// Export default
export default serviceManager;
