import { logger } from '@/lib/logger';
// Environment variables will be accessed directly since we don't have an env helper yet

interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
  organization?: string;
  timeout?: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface TextGenerationOptions {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

interface TextGenerationResult {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
}

class OpenAIService {
  private config: OpenAIConfig;
  private baseURL: string;

  constructor(config: OpenAIConfig) {
    this.config = {
      timeout: 30000,
      baseURL: 'https://api.openai.com/v1',
      ...config,
    };
    this.baseURL = this.config.baseURL!;

    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`,
      ...(this.config.organization && { 'OpenAI-Organization': this.config.organization }),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      logger.api.request('POST', url);
      const startTime = Date.now();

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      const duration = Date.now() - startTime;
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.api.error('POST', url, errorData.error?.message || 'Unknown error', response.status);
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      logger.api.response('POST', url, response.status, duration);
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          logger.api.error('POST', url, 'Request timeout');
          throw new Error('OpenAI API request timeout');
        }
        logger.api.error('POST', url, error.message);
        throw error;
      }

      throw new Error('Unknown error occurred');
    }
  }

  async generateText(options: TextGenerationOptions): Promise<TextGenerationResult> {
    const {
      prompt,
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 1000,
      systemPrompt = 'You are a helpful assistant.',
    } = options;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ];

    const request: ChatCompletionRequest = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    try {
      const response = await this.makeRequest<ChatCompletionResponse>('/chat/completions', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No response choices returned from OpenAI');
      }

      return {
        text: choice.message.content,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        },
        model: response.model,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      logger.error('OpenAI text generation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        model,
        prompt: prompt.substring(0, 100) + '...',
      });
      throw error;
    }
  }

  async analyzeText(
    text: string,
    analysisType: 'sentiment' | 'entities' | 'summary' = 'sentiment'
  ): Promise<Record<string, unknown>> {
    const prompts = {
      sentiment: `Analyze the sentiment of the following text and return a JSON object with sentiment (positive/negative/neutral), confidence (0-1), and reasoning:\n\n${text}`,
      entities: `Extract named entities from the following text and return a JSON object with entities categorized by type (person, organization, location, etc.):\n\n${text}`,
      summary: `Provide a concise summary of the following text in 2-3 sentences:\n\n${text}`,
    };

    const result = await this.generateText({
      prompt: prompts[analysisType],
      systemPrompt:
        'You are an expert text analyst. Always respond with valid JSON when requested.',
      temperature: 0.3,
      maxTokens: 500,
    });

    if (analysisType === 'summary') {
      return { summary: result.text };
    }

    try {
      return JSON.parse(result.text);
    } catch {
      // Fallback if JSON parsing fails
      return { analysis: result.text, type: analysisType };
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.generateText({
        prompt: 'Hello',
        maxTokens: 10,
        temperature: 0,
      });
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
let openaiService: OpenAIService | null = null;

export const getOpenAIService = (): OpenAIService => {
  if (!openaiService) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.'
      );
    }

    openaiService = new OpenAIService({
      apiKey,
      organization: import.meta.env.VITE_OPENAI_ORG_ID,
    });
  }

  return openaiService;
};

export { OpenAIService };
export type { TextGenerationOptions, TextGenerationResult };
