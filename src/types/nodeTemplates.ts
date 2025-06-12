// Node template and configuration types for the AI workflow platform

import { NodeType } from './workflow';

export interface NodeTemplate {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  category: NodeCategory;
  icon: string;
  color: string;
  inputs: NodeInput[];
  outputs: NodeOutput[];
  configuration: NodeConfiguration[];
  documentation?: string;
  examples?: NodeExample[];
  tags: string[];
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export enum NodeCategory {
  AI_MODELS = 'ai_models',
  DATA_PROCESSING = 'data_processing',
  INTEGRATIONS = 'integrations',
  LOGIC_CONTROL = 'logic_control',
  TRIGGERS = 'triggers',
  UTILITIES = 'utilities',
  CUSTOM = 'custom',
}

export interface NodeInput {
  id: string;
  name: string;
  type: DataType;
  required: boolean;
  description: string;
  defaultValue?: unknown;
  validation?: ValidationRule[];
  multiple?: boolean; // For array inputs
}

export interface NodeOutput {
  id: string;
  name: string;
  type: DataType;
  description: string;
  schema?: Record<string, unknown>; // JSON schema for complex outputs
}

export interface NodeConfiguration {
  id: string;
  name: string;
  label: string;
  type: ConfigurationType;
  required: boolean;
  description: string;
  defaultValue?: unknown;
  options?: ConfigurationOption[];
  validation?: ValidationRule[];
  conditional?: ConditionalConfig; // Show/hide based on other config values
  group?: string; // Group related configurations
}

export interface ConfigurationOption {
  label: string;
  value: unknown;
  description?: string;
  icon?: string;
}

export interface ConditionalConfig {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
  value: unknown;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'email' | 'url';
  value?: unknown;
  message: string;
  customValidator?: (value: unknown) => boolean;
}

export interface NodeExample {
  name: string;
  description: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  configuration: Record<string, unknown>;
}

export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  OBJECT = 'object',
  ARRAY = 'array',
  FILE = 'file',
  IMAGE = 'image',
  JSON = 'json',
  HTML = 'html',
  CSV = 'csv',
  XML = 'xml',
  ANY = 'any',
}

export enum ConfigurationType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  FILE = 'file',
  COLOR = 'color',
  DATE = 'date',
  DATETIME = 'datetime',
  JSON = 'json',
  CODE = 'code',
  PASSWORD = 'password',
  URL = 'url',
  EMAIL = 'email',
  SLIDER = 'slider',
  TAGS = 'tags',
}

// AI Model specific configurations
export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
  userPrompt: string;
  responseFormat?: 'text' | 'json' | 'structured';
  streaming?: boolean;
}

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  COHERE = 'cohere',
  HUGGINGFACE = 'huggingface',
  LOCAL = 'local',
  OLLAMA = 'ollama',
  LM_STUDIO = 'lm_studio',
  STABILITY_AI = 'stability_ai',
  ELEVEN_LABS = 'eleven_labs',
  REPLICATE = 'replicate',
  CUSTOM = 'custom',
}

// Integration specific types
export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  authType: AuthType;
  baseUrl?: string;
  documentation?: string;
  nodeTypes: NodeType[];
  configuration: IntegrationConfiguration[];
  popular: boolean;
  verified: boolean;
}

export interface IntegrationConfiguration {
  id: string;
  name: string;
  label: string;
  type: ConfigurationType;
  required: boolean;
  description: string;
  secure?: boolean; // for API keys, passwords, etc.
  placeholder?: string;
}

export enum AuthType {
  NONE = 'none',
  API_KEY = 'api_key',
  OAUTH2 = 'oauth2',
  BASIC_AUTH = 'basic_auth',
  BEARER_TOKEN = 'bearer_token',
  WEBHOOK_SECRET = 'webhook_secret',
  CUSTOM = 'custom',
}

// Workflow template types
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  nodes: unknown[]; // Will be converted to WorkflowNode[]
  edges: unknown[]; // Will be converted to Edge[]
  author: string;
  downloads: number;
  rating: number;
  reviews: number;
  thumbnail?: string;
  featured: boolean;
  useCase: string;
  requirements: string[];
  benefits: string[];
}

// Node execution context
export interface NodeExecutionContext {
  nodeId: string;
  workflowId: string;
  executionId: string;
  inputs: Record<string, unknown>;
  configuration: Record<string, unknown>;
  previousResults: Record<string, unknown>;
  userId: string;
  environment: 'development' | 'production';
  secrets: Record<string, string>; // Encrypted secrets
}

// Node execution response
export interface NodeExecutionResponse {
  success: boolean;
  outputs: Record<string, unknown>;
  error?: string;
  logs?: string[];
  metadata?: Record<string, unknown>;
  nextNodes?: string[]; // For conditional execution
}

// Real-time execution updates
export interface ExecutionUpdate {
  executionId: string;
  nodeId: string;
  status: 'started' | 'completed' | 'error' | 'skipped';
  timestamp: string;
  data?: unknown;
  error?: string;
  progress?: number; // 0-100 for long-running operations
}
