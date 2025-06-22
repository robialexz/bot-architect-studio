/**
 * Backend AI Service
 * Replaces the frontend realAIService with Python backend integration
 */

import { apiClient } from './apiClient';
import { logger } from '@/lib/logger';

// Types
export interface AIRequest {
  provider: 'openai' | 'anthropic' | 'google';
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  metadata?: Record<string, any>;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  provider?: string;
  model?: string;
  tokens_used: number;
  processing_time: number;
  metadata?: Record<string, any>;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  max_tokens?: number;
  cost_per_token?: number;
}

export interface AIUsageStats {
  user_id: number;
  api_calls_count: number;
  total_tokens_used: number;
  subscription_tier: string;
  daily_usage: Record<string, number>;
  monthly_usage: Record<string, number>;
  cost_breakdown: Record<string, number>;
  performance_metrics: {
    avg_response_time: number;
    success_rate: number;
    error_rate: number;
  };
  provider_usage: Record<string, {
    requests: number;
    tokens: number;
    cost: number;
    avg_response_time: number;
  }>;
}

export interface BatchAIRequest {
  requests: AIRequest[];
  priority?: 'low' | 'normal' | 'high';
  callback_url?: string;
  optimization?: {
    enable_fallback?: boolean;
    fallback_providers?: string[];
    cost_limit?: number;
    timeout?: number;
  };
}

export interface BatchAIResponse {
  batch_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_requests: number;
  completed_requests: number;
  failed_requests: number;
  results?: AIResponse[];
  created_at: string;
  completed_at?: string;
}

class BackendAIService {
  private readonly baseUrl = '/ai';

  /**
   * Process a single AI request
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      logger.info('Processing AI request:', {
        provider: request.provider,
        model: request.model,
        prompt_length: request.prompt.length
      });

      const response = await apiClient.post<AIResponse>(`${this.baseUrl}/process`, request);

      logger.info('AI request processed:', {
        success: response.success,
        tokens_used: response.tokens_used,
        processing_time: response.processing_time
      });

      return response;
    } catch (error) {
      logger.error('Failed to process AI request:', error);
      throw new Error('Failed to process AI request');
    }
  }

  /**
   * Process multiple AI requests in batch
   */
  async processBatch(batchRequest: BatchAIRequest): Promise<BatchAIResponse> {
    try {
      logger.info('Processing AI batch:', {
        request_count: batchRequest.requests.length,
        priority: batchRequest.priority || 'normal'
      });

      const response = await apiClient.post<BatchAIResponse>(`${this.baseUrl}/batch`, batchRequest);

      logger.info('AI batch submitted:', {
        batch_id: response.batch_id,
        total_requests: response.total_requests
      });

      return response;
    } catch (error) {
      logger.error('Failed to process AI batch:', error);
      throw new Error('Failed to process AI batch');
    }
  }

  /**
   * Get batch status and results
   */
  async getBatchStatus(batchId: string): Promise<BatchAIResponse> {
    try {
      const response = await apiClient.get<BatchAIResponse>(`${this.baseUrl}/batch/${batchId}`);
      return response;
    } catch (error) {
      logger.error('Failed to get batch status:', error);
      throw new Error('Failed to get batch status');
    }
  }

  /**
   * Get available AI models
   */
  async getModels(): Promise<AIModel[]> {
    try {
      logger.debug('Fetching available AI models');

      const response = await apiClient.get<{ models: AIModel[] }>(`${this.baseUrl}/models`);

      logger.debug(`Fetched ${response.models.length} AI models`);
      return response.models;
    } catch (error) {
      logger.error('Failed to fetch AI models:', error);
      throw new Error('Failed to fetch AI models');
    }
  }

  /**
   * Get AI usage statistics
   */
  async getUsageStats(): Promise<AIUsageStats> {
    try {
      logger.debug('Fetching AI usage statistics');

      const stats = await apiClient.get<AIUsageStats>(`${this.baseUrl}/usage`);

      logger.debug('AI usage stats fetched:', {
        api_calls: stats.api_calls_count,
        tokens_used: stats.total_tokens_used
      });

      return stats;
    } catch (error) {
      logger.error('Failed to fetch AI usage stats:', error);
      throw new Error('Failed to fetch AI usage stats');
    }
  }

  /**
   * Generate text with OpenAI
   */
  async generateWithOpenAI(
    prompt: string,
    model: string = 'gpt-3.5-turbo',
    options: Partial<AIRequest> = {}
  ): Promise<AIResponse> {
    return this.processRequest({
      provider: 'openai',
      model,
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
      ...options
    });
  }

  /**
   * Generate text with Anthropic Claude
   */
  async generateWithClaude(
    prompt: string,
    model: string = 'claude-3-sonnet-20240229',
    options: Partial<AIRequest> = {}
  ): Promise<AIResponse> {
    return this.processRequest({
      provider: 'anthropic',
      model,
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
      ...options
    });
  }

  /**
   * Generate text with Google Gemini
   */
  async generateWithGemini(
    prompt: string,
    model: string = 'gemini-pro',
    options: Partial<AIRequest> = {}
  ): Promise<AIResponse> {
    return this.processRequest({
      provider: 'google',
      model,
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
      ...options
    });
  }

  /**
   * Generate code with AI
   */
  async generateCode(
    prompt: string,
    language: string = 'javascript',
    provider: 'openai' | 'anthropic' | 'google' = 'openai'
  ): Promise<AIResponse> {
    const codePrompt = `Generate ${language} code for: ${prompt}\n\nProvide only the code with proper formatting and comments.`;
    
    return this.processRequest({
      provider,
      model: provider === 'openai' ? 'gpt-4' : provider === 'anthropic' ? 'claude-3-sonnet-20240229' : 'gemini-pro',
      prompt: codePrompt,
      max_tokens: 2000,
      temperature: 0.3,
      metadata: { type: 'code_generation', language }
    });
  }

  /**
   * Analyze text with AI
   */
  async analyzeText(
    text: string,
    analysisType: 'sentiment' | 'summary' | 'keywords' | 'classification' = 'summary',
    provider: 'openai' | 'anthropic' | 'google' = 'openai'
  ): Promise<AIResponse> {
    const prompts = {
      sentiment: `Analyze the sentiment of the following text and provide a detailed analysis:\n\n${text}`,
      summary: `Provide a concise summary of the following text:\n\n${text}`,
      keywords: `Extract the main keywords and key phrases from the following text:\n\n${text}`,
      classification: `Classify the following text into appropriate categories:\n\n${text}`
    };

    return this.processRequest({
      provider,
      model: provider === 'openai' ? 'gpt-3.5-turbo' : provider === 'anthropic' ? 'claude-3-haiku-20240307' : 'gemini-pro',
      prompt: prompts[analysisType],
      max_tokens: 1000,
      temperature: 0.3,
      metadata: { type: 'text_analysis', analysis_type: analysisType }
    });
  }

  /**
   * Process multiple prompts with the same configuration
   */
  async processMultiple(
    prompts: string[],
    config: Omit<AIRequest, 'prompt'> = { provider: 'openai', model: 'gpt-3.5-turbo' }
  ): Promise<AIResponse[]> {
    const requests = prompts.map(prompt => ({ ...config, prompt }));
    
    const batchResponse = await this.processBatch({ requests });
    
    // Poll for completion
    let status = batchResponse;
    while (status.status === 'pending' || status.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      status = await this.getBatchStatus(batchResponse.batch_id);
    }
    
    return status.results || [];
  }

  /**
   * Estimate cost for AI request
   */
  estimateCost(request: AIRequest): number {
    // Rough cost estimation (would be more accurate with real pricing data)
    const baseCosts = {
      'openai': { 'gpt-4': 0.03, 'gpt-3.5-turbo': 0.002 },
      'anthropic': { 'claude-3-opus-20240229': 0.015, 'claude-3-sonnet-20240229': 0.003 },
      'google': { 'gemini-pro': 0.001 }
    };

    const providerCosts = baseCosts[request.provider] || {};
    const costPerToken = providerCosts[request.model] || 0.002;
    const estimatedTokens = Math.ceil(request.prompt.length / 4) + (request.max_tokens || 1000);

    return estimatedTokens * costPerToken / 1000; // Cost per 1K tokens
  }

  /**
   * Process request with fallback providers
   */
  async processWithFallback(
    request: AIRequest,
    fallbackProviders: string[] = ['openai', 'anthropic']
  ): Promise<AIResponse> {
    try {
      logger.info('Processing AI request with fallback:', {
        provider: request.provider,
        fallbacks: fallbackProviders
      });

      const response = await apiClient.post<AIResponse>(`${this.baseUrl}/process-fallback`, {
        ...request,
        fallback_providers: fallbackProviders
      });

      logger.info('AI request with fallback processed:', {
        success: response.success,
        provider_used: response.provider,
        tokens_used: response.tokens_used
      });

      return response;
    } catch (error) {
      logger.error('Failed to process AI request with fallback:', error);
      throw new Error('Failed to process AI request with fallback');
    }
  }

  /**
   * Estimate cost for requests
   */
  async estimateCost(requests: AIRequest[]): Promise<{
    total_cost: number;
    provider_costs: Record<string, number>;
    token_estimates: Record<string, number>;
    request_count: number;
  }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/estimate-cost`, { requests });
      return response;
    } catch (error) {
      logger.error('Failed to estimate cost:', error);
      throw new Error('Failed to estimate cost');
    }
  }

  /**
   * Get advanced analytics
   */
  async getAnalytics(): Promise<{
    rate_limits: Record<string, any>;
    performance_metrics: Record<string, number>;
    cost_metrics: Record<string, number>;
    provider_health: Record<string, any>;
  }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/analytics`);
      return response;
    } catch (error) {
      logger.error('Failed to get analytics:', error);
      throw new Error('Failed to get analytics');
    }
  }

  /**
   * Process batch with optimization
   */
  async processBatchOptimized(
    batchRequest: BatchAIRequest & { optimization?: any }
  ): Promise<BatchAIResponse> {
    try {
      logger.info('Processing optimized AI batch:', {
        request_count: batchRequest.requests.length,
        priority: batchRequest.priority || 'normal',
        optimization: batchRequest.optimization
      });

      const response = await apiClient.post<BatchAIResponse>(`${this.baseUrl}/batch-optimized`, batchRequest);

      logger.info('Optimized AI batch submitted:', {
        batch_id: response.batch_id,
        total_requests: response.total_requests
      });

      return response;
    } catch (error) {
      logger.error('Failed to process optimized AI batch:', error);
      throw new Error('Failed to process optimized AI batch');
    }
  }

  /**
   * Smart text processing with automatic provider selection
   */
  async smartProcess(
    prompt: string,
    options: {
      task_type?: 'generation' | 'analysis' | 'translation' | 'summarization' | 'code';
      quality?: 'fast' | 'balanced' | 'high';
      max_cost?: number;
      preferred_providers?: string[];
    } = {}
  ): Promise<AIResponse> {
    const { task_type = 'generation', quality = 'balanced', max_cost, preferred_providers } = options;

    // Smart provider selection based on task type and quality
    let provider: 'openai' | 'anthropic' | 'google';
    let model: string;

    if (task_type === 'code') {
      provider = 'openai';
      model = quality === 'high' ? 'gpt-4' : 'gpt-3.5-turbo';
    } else if (task_type === 'analysis') {
      provider = 'anthropic';
      model = quality === 'high' ? 'claude-3-opus-20240229' : 'claude-3-sonnet-20240229';
    } else if (task_type === 'translation') {
      provider = 'google';
      model = 'gemini-pro';
    } else {
      // Default to balanced approach
      provider = quality === 'high' ? 'openai' : 'anthropic';
      model = quality === 'high' ? 'gpt-4' : 'claude-3-haiku-20240307';
    }

    // Override with preferred providers if specified
    if (preferred_providers && preferred_providers.length > 0) {
      provider = preferred_providers[0] as any;
    }

    const request: AIRequest = {
      provider,
      model,
      prompt,
      max_tokens: quality === 'fast' ? 500 : quality === 'balanced' ? 1000 : 2000,
      temperature: task_type === 'code' ? 0.1 : 0.7,
      metadata: { task_type, quality, smart_processing: true }
    };

    // Use fallback if cost limit is specified
    if (max_cost && this.estimateCost(request) > max_cost) {
      return this.processWithFallback(request, ['anthropic', 'google']);
    }

    return this.processRequest(request);
  }
}

// Create singleton instance
export const backendAIService = new BackendAIService();

// Export default
export default backendAIService;
