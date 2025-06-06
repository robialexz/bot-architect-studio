import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OpenAIService } from '../openai/openaiService';

// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    VITE_LOG_LEVEL: 'debug',
    VITE_OPENAI_API_KEY: 'sk-test-key-mock-for-testing-purposes-only',
  },
  isProduction: false,
  isDevelopment: true,
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    api: {
      request: vi.fn(),
      response: vi.fn(),
      error: vi.fn(),
    },
    error: vi.fn(),
  },
}));

// Mock fetch globally with proper error handling
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock AbortController for timeout tests
global.AbortController = vi.fn(() => ({
  signal: { aborted: false },
  abort: vi.fn(),
})) as any;

describe('OpenAIService', () => {
  let service: OpenAIService;
  const mockApiKey = 'sk-test-key-mock-for-testing-purposes-only';

  beforeEach(() => {
    service = new OpenAIService({ apiKey: mockApiKey });
    vi.clearAllMocks();

    // Reset fetch mock to default successful response
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        id: 'test-id',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
        choices: [{
          index: 0,
          message: { role: 'assistant', content: 'Test response' },
          finish_reason: 'stop',
        }],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should throw error when API key is missing', () => {
      expect(() => new OpenAIService({ apiKey: '' })).toThrow('OpenAI API key is required');
    });

    it('should set default configuration', () => {
      const service = new OpenAIService({ apiKey: 'test' });
      expect(service).toBeDefined();
    });
  });

  describe('generateText', () => {
    it('should generate text successfully', async () => {
      const mockResponse = {
        id: 'test-id',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Generated text response' },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.generateText({
        prompt: 'Test prompt',
        model: 'gpt-3.5-turbo',
      });

      expect(result).toEqual({
        text: 'Generated text response',
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
        model: 'gpt-3.5-turbo',
        finishReason: 'stop',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = {
        error: {
          message: 'Invalid API key',
          type: 'invalid_request_error',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(mockErrorResponse),
      });

      await expect(service.generateText({ prompt: 'Test prompt' })).rejects.toThrow(
        'OpenAI API error: 401 - Invalid API key'
      );
    });

    it('should handle network timeouts', async () => {
      // Mock a timeout error
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'AbortError';

      mockFetch.mockRejectedValueOnce(timeoutError);

      await expect(service.generateText({ prompt: 'Test prompt' })).rejects.toThrow();
    });

    it('should use custom parameters', async () => {
      const mockResponse = {
        id: 'test-id',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Custom response' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      await service.generateText({
        prompt: 'Custom prompt',
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 500,
        systemPrompt: 'Custom system prompt',
      });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody).toEqual({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Custom system prompt' },
          { role: 'user', content: 'Custom prompt' },
        ],
        temperature: 0.5,
        max_tokens: 500,
      });
    });
  });

  describe('analyzeText', () => {
    it('should analyze sentiment', async () => {
      const mockResponse = {
        id: 'test-id',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content:
                '{"sentiment": "positive", "confidence": 0.9, "reasoning": "Positive language"}',
            },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 15, completion_tokens: 25, total_tokens: 40 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.analyzeText('I love this product!', 'sentiment');

      expect(result).toEqual({
        sentiment: 'positive',
        confidence: 0.9,
        reasoning: 'Positive language',
      });
    });

    it('should handle invalid JSON responses', async () => {
      const mockResponse = {
        id: 'test-id',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Invalid JSON response' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.analyzeText('Test text', 'sentiment');

      expect(result).toEqual({
        analysis: 'Invalid JSON response',
        type: 'sentiment',
      });
    });
  });

  describe('healthCheck', () => {
    it('should return true when API is healthy', async () => {
      const mockResponse = {
        id: 'test-id',
        object: 'chat.completion',
        created: 1234567890,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: { role: 'assistant', content: 'Hello!' },
            finish_reason: 'stop',
          },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const isHealthy = await service.healthCheck();
      expect(isHealthy).toBe(true);
    });

    it('should return false when API is unhealthy', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const isHealthy = await service.healthCheck();
      expect(isHealthy).toBe(false);
    });
  });
});
