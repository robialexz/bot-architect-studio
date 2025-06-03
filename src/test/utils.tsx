import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AssistantProvider } from '@/contexts/AssistantContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AssistantProvider>{children}</AssistantProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
  },
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockWorkflow = (overrides = {}) => ({
  id: 'test-workflow-id',
  name: 'Test Workflow',
  description: 'A test workflow',
  user_id: 'test-user-id',
  nodes: [],
  edges: [],
  status: 'draft' as const,
  category: 'automation' as const,
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockAgent = (overrides = {}) => ({
  id: 'test-agent-id',
  name: 'Test Agent',
  description: 'A test AI agent',
  avatar: 'https://example.com/agent-avatar.jpg',
  category: 'assistant' as const,
  capabilities: ['text-generation', 'analysis'],
  pricing: {
    type: 'free' as const,
    tokensPerRequest: 1000,
  },
  rating: 4.5,
  downloads: 1000,
  creator: 'Test Creator',
  tags: ['test', 'automation'],
  created_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

export const createMockTemplate = (overrides = {}) => ({
  id: 'test-template-id',
  name: 'Test Template',
  description: 'A test workflow template',
  category: 'automation' as const,
  difficulty: 'beginner' as const,
  estimatedTime: '5 minutes',
  nodes: [],
  edges: [],
  tags: ['test', 'template'],
  author: 'Test Author',
  downloads: 500,
  rating: 4.0,
  created_at: '2023-01-01T00:00:00.000Z',
  ...overrides,
});

// Mock API responses
export const mockApiResponse = <T,>(data: T, delay = 0) => {
  return new Promise<{ data: T; error: null }>(resolve => {
    setTimeout(() => {
      resolve({ data, error: null });
    }, delay);
  });
};

export const mockApiError = (message: string, delay = 0) => {
  return new Promise<{ data: null; error: { message: string } }>(resolve => {
    setTimeout(() => {
      resolve({ data: null, error: { message } });
    }, delay);
  });
};

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
};

export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver as unknown as typeof ResizeObserver;
};
