import { AIServiceProxy, AIRequest, AIResponse, UsageStats } from '@/types/execution';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

class AIServiceProxyImpl implements AIServiceProxy {
  private apiKeys: Record<string, string>;
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();
  private baseUrls: Record<string, string>;

  constructor() {
    // Hardcoded API keys for production use
    this.apiKeys = {
      openai: import.meta.env.VITE_OPENAI_API_KEY || '',
      anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
      google: 'AIzaSyCaBma6PzdWf6EC52VPaWMSPYDn43dPnX0', // Your Google AI API key
      huggingface: import.meta.env.VITE_HUGGINGFACE_API_KEY || '',
      stability: import.meta.env.VITE_STABILITY_API_KEY || '',
      cohere: import.meta.env.VITE_COHERE_API_KEY || '',
    };

    this.baseUrls = {
      openai: 'https://api.openai.com/v1',
      anthropic: 'https://api.anthropic.com/v1',
      google: 'https://generativelanguage.googleapis.com/v1beta',
      huggingface: 'https://api-inference.huggingface.co',
      stability: 'https://api.stability.ai/v1',
      cohere: 'https://api.cohere.ai/v1',
    };
  }

  async executeAIRequest(request: AIRequest, userId: string): Promise<AIResponse> {
    const startTime = Date.now();

    logger.info('Executing AI request', {
      service: request.service,
      model: request.model,
      nodeId: request.nodeId,
      userId,
    });

    try {
      // Validate API key
      if (!this.validateAPIKey(request.service)) {
        return this.createMockResponse(request, startTime);
      }

      // Check rate limits
      if (!this.checkRateLimit(userId, request.service)) {
        throw new Error(`Rate limit exceeded for ${request.service}`);
      }

      // Execute the actual AI request
      const response = await this.callAIService(request);

      // Track usage (disabled temporarily to avoid Supabase errors)
      if (response.success && (response.tokensUsed || response.estimatedCost)) {
        // TODO: Re-enable when ai_usage table is created in Supabase
        // await this.trackUsage(userId, { ... });
        logger.info('AI usage tracked locally', {
          service: request.service,
          model: request.model,
          tokens: response.tokensUsed,
          cost: response.estimatedCost,
        });
      }

      return response;
    } catch (error) {
      logger.error('AI request failed', {
        service: request.service,
        error: error instanceof Error ? error.message : 'Unknown error',
        nodeId: request.nodeId,
      });

      // Return mock response on error
      return this.createMockResponse(
        request,
        startTime,
        error instanceof Error ? error.message : undefined
      );
    }
  }

  validateAPIKey(service: string): boolean {
    const key = this.apiKeys[service];
    return !!(key && key !== '' && key !== 'demo-key');
  }

  checkRateLimit(userId: string, service: string): boolean {
    const key = `${userId}:${service}`;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const limit = this.getRateLimit(service);

    const record = this.rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      logger.warn('Rate limit exceeded', { userId, service, count: record.count, limit });
      return false;
    }

    record.count++;
    return true;
  }

  async trackUsage(userId: string, usage: any): Promise<void> {
    try {
      await supabase.from('ai_usage').insert({
        user_id: userId,
        execution_id: usage.executionId,
        node_execution_id: usage.nodeExecutionId,
        service_provider: usage.serviceProvider,
        model_name: usage.modelName,
        tokens_used: usage.tokensUsed,
        estimated_cost: usage.estimatedCost,
        request_data: usage.requestData,
        response_data: usage.responseData,
      });
    } catch (error) {
      logger.error('Failed to track AI usage', { error });
    }
  }

  async getUsageStats(
    userId: string,
    timeframe: 'day' | 'week' | 'month' = 'month'
  ): Promise<UsageStats> {
    try {
      const startDate = this.getStartDate(timeframe);

      const { data, error } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (error) {
        logger.error('Failed to get usage stats', { error });
        return this.getEmptyUsageStats();
      }

      return this.calculateUsageStats(data || []);
    } catch (error) {
      logger.error('Error getting usage stats', { error });
      return this.getEmptyUsageStats();
    }
  }

  private async callAIService(request: AIRequest): Promise<AIResponse> {
    switch (request.service) {
      case 'openai':
        return this.callOpenAI(request);
      case 'anthropic':
        return this.callAnthropic(request);
      case 'google':
        return this.callGoogle(request);
      case 'huggingface':
        return this.callHuggingFace(request);
      case 'stability':
        return this.callStability(request);
      case 'cohere':
        return this.callCohere(request);
      default:
        throw new Error(`Unsupported AI service: ${request.service}`);
    }
  }

  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    const response = await fetch(`${this.baseUrls.openai}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKeys.openai}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: [{ role: 'user', content: request.prompt }],
        max_tokens: request.parameters?.maxTokens || 1000,
        temperature: request.parameters?.temperature || 0.7,
        top_p: request.parameters?.topP || 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    return {
      success: true,
      data: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
      estimatedCost: this.calculateOpenAICost(data.usage?.total_tokens || 0, request.model),
      processingTime,
      model: request.model,
    };
  }

  private async callAnthropic(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    const response = await fetch(`${this.baseUrls.anthropic}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKeys.anthropic,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.parameters?.maxTokens || 1000,
        messages: [{ role: 'user', content: request.prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    return {
      success: true,
      data: data.content[0]?.text || '',
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens || 0,
      estimatedCost: this.calculateAnthropicCost(
        data.usage?.input_tokens || 0,
        data.usage?.output_tokens || 0,
        request.model
      ),
      processingTime,
      model: request.model,
    };
  }

  private async callGoogle(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    // Use Gemini Pro as default model
    const model = request.model || 'gemini-pro';

    const response = await fetch(
      `${this.baseUrls.google}/models/${model}:generateContent?key=${this.apiKeys.google}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: request.prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: request.parameters?.temperature || 0.7,
            maxOutputTokens: request.parameters?.maxTokens || 1000,
            topP: request.parameters?.topP || 1,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    // Extract text from Google AI response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      success: true,
      data: generatedText,
      tokensUsed: data.usageMetadata?.totalTokenCount || 0,
      estimatedCost: this.calculateGoogleCost(data.usageMetadata?.totalTokenCount || 0, model),
      processingTime,
      model: model,
    };
  }

  private async callHuggingFace(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    const response = await fetch(`${this.baseUrls.huggingface}/models/${request.model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKeys.huggingface}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.prompt,
        parameters: request.parameters || {},
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    return {
      success: true,
      data: Array.isArray(data) ? data[0]?.generated_text || data[0] : data,
      tokensUsed: 0, // Hugging Face doesn't provide token counts
      estimatedCost: 0,
      processingTime,
      model: request.model,
    };
  }

  private async callStability(request: AIRequest): Promise<AIResponse> {
    // Placeholder for Stability AI implementation
    throw new Error('Stability AI integration not yet implemented');
  }

  private async callCohere(request: AIRequest): Promise<AIResponse> {
    // Placeholder for Cohere implementation
    throw new Error('Cohere integration not yet implemented');
  }

  private createMockResponse(request: AIRequest, startTime: number, error?: string): AIResponse {
    const processingTime = Date.now() - startTime;

    if (error) {
      return {
        success: false,
        data: null,
        error: `Mock response due to error: ${error}`,
        processingTime,
      };
    }

    // Generate realistic mock response
    const mockResponses = {
      openai: `AI-generated response from ${request.model}: This is a simulated response to "${request.prompt?.substring(0, 50)}...". This is a mock response because no API key is configured.`,
      anthropic: `Claude response: I understand you're asking about "${request.prompt?.substring(0, 50)}...". This is a mock response for demonstration purposes.`,
      google: `Gemini response: Based on your request about "${request.prompt?.substring(0, 50)}...", here's my analysis. This is a mock response for demonstration.`,
      huggingface: `HuggingFace model response: Generated text based on your input. This is a mock response.`,
    };

    return {
      success: true,
      data: mockResponses[request.service] || 'Mock AI response',
      tokensUsed: Math.floor(Math.random() * 100) + 50,
      estimatedCost: 0.001,
      processingTime,
      model: request.model,
    };
  }

  private getRateLimit(service: string): number {
    const limits = {
      openai: 60, // 60 requests per minute
      anthropic: 50, // 50 requests per minute
      google: 60, // 60 requests per minute
      huggingface: 100, // 100 requests per minute
      stability: 30, // 30 requests per minute
      cohere: 60, // 60 requests per minute
    };

    return limits[service as keyof typeof limits] || 60;
  }

  private calculateOpenAICost(tokens: number, model: string): number {
    const costs = {
      'gpt-4': 0.03 / 1000,
      'gpt-4-turbo': 0.01 / 1000,
      'gpt-3.5-turbo': 0.002 / 1000,
    };

    return tokens * (costs[model as keyof typeof costs] || costs['gpt-3.5-turbo']);
  }

  private calculateAnthropicCost(inputTokens: number, outputTokens: number, model: string): number {
    const costs = {
      'claude-3-sonnet-20240229': { input: 0.003 / 1000, output: 0.015 / 1000 },
      'claude-3-haiku-20240307': { input: 0.00025 / 1000, output: 0.00125 / 1000 },
    };

    const modelCosts = costs[model as keyof typeof costs] || costs['claude-3-haiku-20240307'];
    return inputTokens * modelCosts.input + outputTokens * modelCosts.output;
  }

  private calculateGoogleCost(tokens: number, model: string): number {
    // Google AI pricing (approximate)
    const costs = {
      'gemini-pro': 0.0005 / 1000,
      'gemini-pro-vision': 0.0025 / 1000,
    };

    return tokens * (costs[model as keyof typeof costs] || costs['gemini-pro']);
  }

  private getStartDate(timeframe: 'day' | 'week' | 'month'): Date {
    const now = new Date();
    switch (timeframe) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  private calculateUsageStats(usageData: any[]): UsageStats {
    const stats: UsageStats = {
      totalRequests: usageData.length,
      totalTokens: 0,
      totalCost: 0,
      serviceBreakdown: {},
    };

    usageData.forEach(usage => {
      stats.totalTokens += usage.tokens_used || 0;
      stats.totalCost += usage.estimated_cost || 0;

      const service = usage.service_provider;
      if (!stats.serviceBreakdown[service]) {
        stats.serviceBreakdown[service] = {
          requests: 0,
          tokens: 0,
          cost: 0,
        };
      }

      stats.serviceBreakdown[service].requests++;
      stats.serviceBreakdown[service].tokens += usage.tokens_used || 0;
      stats.serviceBreakdown[service].cost += usage.estimated_cost || 0;
    });

    return stats;
  }

  private getEmptyUsageStats(): UsageStats {
    return {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      serviceBreakdown: {},
    };
  }
}

export const aiServiceProxy = new AIServiceProxyImpl();
