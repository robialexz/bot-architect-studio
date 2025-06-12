import { type AIAgent } from '@/components/AIAgentCard';

export type NodeStatus = 'idle' | 'running' | 'completed' | 'error';

// Enhanced node types for comprehensive AI workflow automation
export enum NodeType {
  // AI Model Nodes - OpenAI
  OPENAI_GPT4 = 'openai_gpt4',
  OPENAI_GPT35_TURBO = 'openai_gpt35_turbo',
  OPENAI_DALLE = 'openai_dalle',
  OPENAI_WHISPER = 'openai_whisper',
  OPENAI_TTS = 'openai_tts',
  OPENAI_EMBEDDINGS = 'openai_embeddings',
  OPENAI_MODERATION = 'openai_moderation',

  // AI Model Nodes - Anthropic
  ANTHROPIC_CLAUDE3 = 'anthropic_claude3',
  ANTHROPIC_CLAUDE2 = 'anthropic_claude2',
  ANTHROPIC_CLAUDE_INSTANT = 'anthropic_claude_instant',

  // AI Model Nodes - Google
  GOOGLE_GEMINI = 'google_gemini',
  GOOGLE_BARD = 'google_bard',
  GOOGLE_TRANSLATE = 'google_translate',
  GOOGLE_VISION = 'google_vision',
  GOOGLE_SPEECH = 'google_speech',

  // AI Model Nodes - Other Providers
  STABILITY_DIFFUSION = 'stability_diffusion',
  MIDJOURNEY = 'midjourney',
  AZURE_SPEECH = 'azure_speech',
  AZURE_TRANSLATOR = 'azure_translator',
  AZURE_COGNITIVE = 'azure_cognitive',

  // AI Processing Nodes
  TEXT_GENERATOR = 'text_generator',
  IMAGE_GENERATOR = 'image_generator',
  SENTIMENT_ANALYZER = 'sentiment_analyzer',
  TRANSLATOR = 'translator',
  SUMMARIZER = 'summarizer',
  CHATBOT = 'chatbot',
  CODE_GENERATOR = 'code_generator',
  CODE_REVIEWER = 'code_reviewer',
  CONTENT_MODERATOR = 'content_moderator',
  NER_EXTRACTOR = 'ner_extractor',
  QA_SYSTEM = 'qa_system',
  DOCUMENT_ANALYZER = 'document_analyzer',
  OCR_PROCESSOR = 'ocr_processor',

  // Data Processing Nodes
  DATA_INPUT = 'data_input',
  DATA_OUTPUT = 'data_output',
  DATA_TRANSFORMER = 'data_transformer',
  DATA_FILTER = 'data_filter',
  DATA_MERGER = 'data_merger',
  DATA_VALIDATOR = 'data_validator',
  DATA_CLEANER = 'data_cleaner',
  DATA_AGGREGATOR = 'data_aggregator',
  DATA_ENCRYPTOR = 'data_encryptor',
  DATA_DECRYPTOR = 'data_decryptor',
  CSV_PARSER = 'csv_parser',
  EXCEL_PARSER = 'excel_parser',
  JSON_PARSER = 'json_parser',
  XML_PARSER = 'xml_parser',
  PDF_PARSER = 'pdf_parser',

  // Database Connectors
  MYSQL_CONNECTOR = 'mysql_connector',
  POSTGRESQL_CONNECTOR = 'postgresql_connector',
  MONGODB_CONNECTOR = 'mongodb_connector',
  REDIS_CONNECTOR = 'redis_connector',
  SQLITE_CONNECTOR = 'sqlite_connector',
  ELASTICSEARCH_CONNECTOR = 'elasticsearch_connector',

  // API & Integration Nodes
  API_REQUEST = 'api_request',
  API_RESPONSE = 'api_response',
  REST_CLIENT = 'rest_client',
  GRAPHQL_CLIENT = 'graphql_client',
  WEBHOOK_SENDER = 'webhook_sender',
  WEBHOOK_RECEIVER = 'webhook_receiver',

  // Cloud Storage Integrations
  AWS_S3 = 'aws_s3',
  GOOGLE_DRIVE = 'google_drive',
  DROPBOX = 'dropbox',
  ONEDRIVE = 'onedrive',
  FILE_UPLOAD = 'file_upload',
  FILE_DOWNLOAD = 'file_download',

  // Communication Integrations
  EMAIL_SENDER = 'email_sender',
  EMAIL_RECEIVER = 'email_receiver',
  GMAIL_CONNECTOR = 'gmail_connector',
  OUTLOOK_CONNECTOR = 'outlook_connector',
  SENDGRID_CONNECTOR = 'sendgrid_connector',
  SLACK_CONNECTOR = 'slack_connector',
  DISCORD_CONNECTOR = 'discord_connector',
  TEAMS_CONNECTOR = 'teams_connector',
  TELEGRAM_CONNECTOR = 'telegram_connector',

  // Social Media Integrations
  TWITTER_CONNECTOR = 'twitter_connector',
  LINKEDIN_CONNECTOR = 'linkedin_connector',
  FACEBOOK_CONNECTOR = 'facebook_connector',
  INSTAGRAM_CONNECTOR = 'instagram_connector',
  YOUTUBE_CONNECTOR = 'youtube_connector',

  // CRM & Business Integrations
  SALESFORCE_CONNECTOR = 'salesforce_connector',
  HUBSPOT_CONNECTOR = 'hubspot_connector',
  PIPEDRIVE_CONNECTOR = 'pipedrive_connector',
  ZENDESK_CONNECTOR = 'zendesk_connector',
  INTERCOM_CONNECTOR = 'intercom_connector',

  // Payment & E-commerce
  STRIPE_CONNECTOR = 'stripe_connector',
  PAYPAL_CONNECTOR = 'paypal_connector',
  SHOPIFY_CONNECTOR = 'shopify_connector',
  WOOCOMMERCE_CONNECTOR = 'woocommerce_connector',

  // Calendar & Scheduling
  GOOGLE_CALENDAR = 'google_calendar',
  OUTLOOK_CALENDAR = 'outlook_calendar',
  CALENDLY_CONNECTOR = 'calendly_connector',

  // Productivity Tools
  NOTION_CONNECTOR = 'notion_connector',
  AIRTABLE_CONNECTOR = 'airtable_connector',
  TRELLO_CONNECTOR = 'trello_connector',
  ASANA_CONNECTOR = 'asana_connector',
  JIRA_CONNECTOR = 'jira_connector',

  // Logic & Control Flow Nodes
  CONDITION = 'condition',
  IF_ELSE = 'if_else',
  SWITCH = 'switch',
  LOOP = 'loop',
  FOR_EACH = 'for_each',
  WHILE_LOOP = 'while_loop',
  DELAY = 'delay',
  WAIT = 'wait',
  RETRY = 'retry',
  ERROR_HANDLER = 'error_handler',

  // Utility Nodes
  VARIABLE_SET = 'variable_set',
  VARIABLE_GET = 'variable_get',
  MATH_OPERATION = 'math_operation',
  DATE_TIME = 'date_time',
  RANDOM_GENERATOR = 'random_generator',
  TEXT_FORMATTER = 'text_formatter',
  URL_PARSER = 'url_parser',
  REGEX_MATCHER = 'regex_matcher',

  // Trigger Nodes
  MANUAL_TRIGGER = 'manual_trigger',
  SCHEDULE_TRIGGER = 'schedule_trigger',
  WEBHOOK_TRIGGER = 'webhook_trigger',
  FILE_TRIGGER = 'file_trigger',
  EMAIL_TRIGGER = 'email_trigger',
  DATABASE_TRIGGER = 'database_trigger',
  API_TRIGGER = 'api_trigger',

  // Streaming & Real-time
  STREAM_PROCESSOR = 'stream_processor',
  KAFKA_CONNECTOR = 'kafka_connector',
  RABBITMQ_CONNECTOR = 'rabbitmq_connector',
  WEBSOCKET_CONNECTOR = 'websocket_connector',

  // Legacy types for backward compatibility
  TEXT_INPUT = 'textInput',
  UPPERCASE_TEXT = 'uppercaseText',
  DATA_TRANSFORMATION = 'dataTransformation',
  SENTIMENT_ANALYSIS = 'sentimentAnalysis',
}

export type AgentType = NodeType | string; // Allow other string types for extensibility

export interface WorkflowNodeData {
  label: string;
  name: string; // For StatusIndicator or toasts if needed
  description?: string;
  width?: number;
  config?: Record<string, unknown>;
  configValue?: string;
  textValue?: string; // For 'textInput' agent
  transformationLogic?: string; // For 'dataTransformation' agent
  simulatedOutput?: string; // Added for node execution simulation
  errorMessage?: string; // Added for node execution simulation
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  status?: NodeStatus; // Adding status to the WorkflowNodeData
  actualOutput?: unknown; // Adding actualOutput to the WorkflowNodeData
  // Other node-specific data can go here
}

export interface WorkflowNode {
  id: string;
  type: AgentType; // e.g., 'custom', 'input', 'output', or specific agent type like 'textInput', 'uppercaseText'
  data: WorkflowNodeData;
  position: { x: number; y: number };
  status: NodeStatus;
  simulatedOutput?: string;
  simulatedInput?: string;
  actualInput?: unknown;
  actualOutput?: unknown;
  errorMessage?: string;
}

export interface Connection {
  id: string;
  from: string; // Corresponds to source in React Flow
  to: string; // Corresponds to target in React Flow
}

// As per user request for react-flow-renderer like edges
export interface Edge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  type?: string;
  label?: string;
  sourceHandle?: string;
  targetHandle?: string;
  style?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

// Enhanced workflow types for AI automation platform
export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: Edge[];
  userId: string;
  isPublic: boolean;
  tags: string[];
  category: WorkflowCategory;
  status: WorkflowStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  lastExecuted?: string;
  executionCount: number;
  settings: WorkflowSettings;
}

export interface WorkflowSettings {
  autoSave: boolean;
  executionTimeout: number;
  retryOnFailure: boolean;
  maxRetries: number;
  enableLogging: boolean;
  enableAnalytics: boolean;
}

export enum WorkflowCategory {
  CUSTOMER_SUPPORT = 'customer_support',
  CONTENT_GENERATION = 'content_generation',
  DATA_PROCESSING = 'data_processing',
  MARKETING_AUTOMATION = 'marketing_automation',
  SOCIAL_MEDIA = 'social_media',
  E_COMMERCE = 'e_commerce',
  PRODUCTIVITY = 'productivity',
  CUSTOM = 'custom',
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ERROR = 'error',
  ARCHIVED = 'archived',
}

// Import execution types from the dedicated execution module
export type { ExecutionStatus, ExecutionResult, NodeExecutionResult } from './execution';
