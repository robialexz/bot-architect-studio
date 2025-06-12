// Node template service for AI workflow platform
import {
  NodeTemplate,
  NodeCategory,
  DataType,
  ConfigurationType,
  AIProvider,
} from '@/types/nodeTemplates';
import { NodeType } from '@/types/workflow';
import { EnhancedAIModelService } from './enhancedAIModelService';

export class NodeTemplateService {
  private static instance: NodeTemplateService;
  private templates: Map<string, NodeTemplate> = new Map();
  private aiModelService = EnhancedAIModelService.getInstance();

  static getInstance(): NodeTemplateService {
    if (!NodeTemplateService.instance) {
      NodeTemplateService.instance = new NodeTemplateService();
      NodeTemplateService.instance.initializeTemplates();
    }
    return NodeTemplateService.instance;
  }

  private initializeTemplates(): void {
    // Initialize all node templates
    this.initializeAIModelNodes();
    this.initializeDataProcessingNodes();
    this.initializeIntegrationNodes();
    this.initializeUtilityNodes();
    this.initializeTriggerNodes();
  }

  private initializeAIModelNodes(): void {
    // OpenAI GPT-4
    this.addTemplate({
      id: 'openai_gpt4',
      type: NodeType.OPENAI_GPT4,
      name: 'OpenAI GPT-4',
      description: 'Advanced language model for complex reasoning and generation tasks',
      category: NodeCategory.AI_MODELS,
      icon: '🧠',
      color: '#10A37F',
      tags: ['openai', 'gpt-4', 'text', 'generation', 'reasoning'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'prompt',
          name: 'Prompt',
          type: DataType.STRING,
          required: true,
          description: 'The text prompt for GPT-4',
        },
        {
          id: 'system_message',
          name: 'System Message',
          type: DataType.STRING,
          required: false,
          description: 'System instructions for the model',
        },
      ],
      outputs: [
        {
          id: 'response',
          name: 'Response',
          type: DataType.STRING,
          description: 'GPT-4 generated response',
        },
        {
          id: 'tokens_used',
          name: 'Tokens Used',
          type: DataType.NUMBER,
          description: 'Number of tokens consumed',
        },
        {
          id: 'finish_reason',
          name: 'Finish Reason',
          type: DataType.STRING,
          description: 'Why the generation stopped',
        },
      ],
      configuration: [
        {
          id: 'api_key',
          name: 'api_key',
          label: 'OpenAI API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Your OpenAI API key',
        },
        {
          id: 'model',
          name: 'model',
          label: 'Model Version',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'GPT-4 model variant',
          defaultValue: 'gpt-4-turbo',
          options: [
            { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
            { label: 'GPT-4', value: 'gpt-4' },
            { label: 'GPT-4 32k', value: 'gpt-4-32k' },
          ],
        },
        {
          id: 'temperature',
          name: 'temperature',
          label: 'Temperature',
          type: ConfigurationType.SLIDER,
          required: false,
          description: 'Controls randomness (0.0 to 2.0)',
          defaultValue: 0.7,
        },
        {
          id: 'max_tokens',
          name: 'max_tokens',
          label: 'Max Tokens',
          type: ConfigurationType.NUMBER,
          required: false,
          description: 'Maximum tokens to generate',
          defaultValue: 1000,
        },
      ],
      examples: [
        {
          name: 'Code Review',
          description: 'Review and improve code quality',
          input: { prompt: 'Review this Python function for improvements' },
          output: { response: 'Here are several improvements for your function...' },
          configuration: { model: 'gpt-4-turbo', temperature: 0.3 },
        },
      ],
    });

    // OpenAI GPT-3.5 Turbo
    this.addTemplate({
      id: 'openai_gpt35_turbo',
      type: NodeType.OPENAI_GPT35_TURBO,
      name: 'OpenAI GPT-3.5 Turbo',
      description: 'Fast and efficient language model for most text generation tasks',
      category: NodeCategory.AI_MODELS,
      icon: '⚡',
      color: '#10A37F',
      tags: ['openai', 'gpt-3.5', 'text', 'generation', 'fast'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'prompt',
          name: 'Prompt',
          type: DataType.STRING,
          required: true,
          description: 'The text prompt for GPT-3.5',
        },
        {
          id: 'system_message',
          name: 'System Message',
          type: DataType.STRING,
          required: false,
          description: 'System instructions for the model',
        },
      ],
      outputs: [
        {
          id: 'response',
          name: 'Response',
          type: DataType.STRING,
          description: 'GPT-3.5 generated response',
        },
        {
          id: 'tokens_used',
          name: 'Tokens Used',
          type: DataType.NUMBER,
          description: 'Number of tokens consumed',
        },
      ],
      configuration: [
        {
          id: 'api_key',
          name: 'api_key',
          label: 'OpenAI API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Your OpenAI API key',
        },
        {
          id: 'model',
          name: 'model',
          label: 'Model Version',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'GPT-3.5 model variant',
          defaultValue: 'gpt-3.5-turbo',
          options: [
            { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
            { label: 'GPT-3.5 Turbo 16k', value: 'gpt-3.5-turbo-16k' },
          ],
        },
        {
          id: 'temperature',
          name: 'temperature',
          label: 'Temperature',
          type: ConfigurationType.SLIDER,
          required: false,
          description: 'Controls randomness (0.0 to 2.0)',
          defaultValue: 0.7,
        },
      ],
      examples: [
        {
          name: 'Content Generation',
          description: 'Generate marketing content quickly',
          input: { prompt: 'Write a product description for a smart watch' },
          output: { response: 'Introducing the next generation smart watch...' },
          configuration: { model: 'gpt-3.5-turbo', temperature: 0.8 },
        },
      ],
    });

    // OpenAI DALL-E
    this.addTemplate({
      id: 'openai_dalle',
      type: NodeType.OPENAI_DALLE,
      name: 'OpenAI DALL-E',
      description: 'Generate images from text descriptions using DALL-E',
      category: NodeCategory.AI_MODELS,
      icon: '🎨',
      color: '#10A37F',
      tags: ['openai', 'dalle', 'image', 'generation', 'art'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'prompt',
          name: 'Image Prompt',
          type: DataType.STRING,
          required: true,
          description: 'Description of the image to generate',
        },
      ],
      outputs: [
        {
          id: 'image_url',
          name: 'Image URL',
          type: DataType.STRING,
          description: 'URL of the generated image',
        },
        {
          id: 'revised_prompt',
          name: 'Revised Prompt',
          type: DataType.STRING,
          description: 'DALL-E revised prompt',
        },
      ],
      configuration: [
        {
          id: 'api_key',
          name: 'api_key',
          label: 'OpenAI API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Your OpenAI API key',
        },
        {
          id: 'model',
          name: 'model',
          label: 'DALL-E Model',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'DALL-E model version',
          defaultValue: 'dall-e-3',
          options: [
            { label: 'DALL-E 3', value: 'dall-e-3' },
            { label: 'DALL-E 2', value: 'dall-e-2' },
          ],
        },
        {
          id: 'size',
          name: 'size',
          label: 'Image Size',
          type: ConfigurationType.SELECT,
          required: false,
          description: 'Size of the generated image',
          defaultValue: '1024x1024',
          options: [
            { label: '1024x1024', value: '1024x1024' },
            { label: '1792x1024', value: '1792x1024' },
            { label: '1024x1792', value: '1024x1792' },
          ],
        },
        {
          id: 'quality',
          name: 'quality',
          label: 'Quality',
          type: ConfigurationType.SELECT,
          required: false,
          description: 'Image quality level',
          defaultValue: 'standard',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'HD', value: 'hd' },
          ],
        },
      ],
      examples: [
        {
          name: 'Product Mockup',
          description: 'Generate product images for marketing',
          input: { prompt: 'A modern smartphone on a clean white background' },
          output: { image_url: 'https://example.com/generated-image.png' },
          configuration: { model: 'dall-e-3', size: '1024x1024', quality: 'hd' },
        },
      ],
    });

    // Anthropic Claude 3
    this.addTemplate({
      id: 'anthropic_claude3',
      type: NodeType.ANTHROPIC_CLAUDE3,
      name: 'Anthropic Claude 3',
      description: 'Advanced AI assistant with strong reasoning and analysis capabilities',
      category: NodeCategory.AI_MODELS,
      icon: '🎭',
      color: '#D97706',
      tags: ['anthropic', 'claude', 'reasoning', 'analysis', 'safety'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'prompt',
          name: 'Prompt',
          type: DataType.STRING,
          required: true,
          description: 'The text prompt for Claude',
        },
        {
          id: 'system_prompt',
          name: 'System Prompt',
          type: DataType.STRING,
          required: false,
          description: 'System instructions for Claude',
        },
      ],
      outputs: [
        {
          id: 'response',
          name: 'Response',
          type: DataType.STRING,
          description: 'Claude generated response',
        },
        {
          id: 'tokens_used',
          name: 'Tokens Used',
          type: DataType.NUMBER,
          description: 'Number of tokens consumed',
        },
      ],
      configuration: [
        {
          id: 'api_key',
          name: 'api_key',
          label: 'Anthropic API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Your Anthropic API key',
        },
        {
          id: 'model',
          name: 'model',
          label: 'Claude Model',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Claude model version',
          defaultValue: 'claude-3-opus-20240229',
          options: [
            { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
            { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229' },
            { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
          ],
        },
        {
          id: 'max_tokens',
          name: 'max_tokens',
          label: 'Max Tokens',
          type: ConfigurationType.NUMBER,
          required: false,
          description: 'Maximum tokens to generate',
          defaultValue: 1000,
        },
        {
          id: 'temperature',
          name: 'temperature',
          label: 'Temperature',
          type: ConfigurationType.SLIDER,
          required: false,
          description: 'Controls randomness (0.0 to 1.0)',
          defaultValue: 0.7,
        },
      ],
      examples: [
        {
          name: 'Document Analysis',
          description: 'Analyze complex documents and extract insights',
          input: { prompt: 'Analyze this legal contract and summarize key terms' },
          output: { response: 'This contract contains the following key provisions...' },
          configuration: { model: 'claude-3-opus-20240229', temperature: 0.3 },
        },
      ],
    });

    // Google Gemini
    this.addTemplate({
      id: 'google_gemini',
      type: NodeType.GOOGLE_GEMINI,
      name: 'Google Gemini',
      description: "Google's multimodal AI model for text and image understanding",
      category: NodeCategory.AI_MODELS,
      icon: '💎',
      color: '#4285F4',
      tags: ['google', 'gemini', 'multimodal', 'text', 'image'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'prompt',
          name: 'Prompt',
          type: DataType.STRING,
          required: true,
          description: 'The text prompt for Gemini',
        },
        {
          id: 'image',
          name: 'Image',
          type: DataType.IMAGE,
          required: false,
          description: 'Optional image for multimodal input',
        },
      ],
      outputs: [
        {
          id: 'response',
          name: 'Response',
          type: DataType.STRING,
          description: 'Gemini generated response',
        },
        {
          id: 'tokens_used',
          name: 'Tokens Used',
          type: DataType.NUMBER,
          description: 'Number of tokens consumed',
        },
      ],
      configuration: [
        {
          id: 'api_key',
          name: 'api_key',
          label: 'Google API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Your Google AI API key',
        },
        {
          id: 'model',
          name: 'model',
          label: 'Gemini Model',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Gemini model version',
          defaultValue: 'gemini-pro',
          options: [
            { label: 'Gemini Pro', value: 'gemini-pro' },
            { label: 'Gemini Pro Vision', value: 'gemini-pro-vision' },
          ],
        },
        {
          id: 'temperature',
          name: 'temperature',
          label: 'Temperature',
          type: ConfigurationType.SLIDER,
          required: false,
          description: 'Controls randomness (0.0 to 1.0)',
          defaultValue: 0.7,
        },
      ],
      examples: [
        {
          name: 'Image Analysis',
          description: 'Analyze images and answer questions about them',
          input: { prompt: 'What do you see in this image?', image: 'base64_image_data' },
          output: { response: 'I can see a beautiful landscape with mountains...' },
          configuration: { model: 'gemini-pro-vision', temperature: 0.5 },
        },
      ],
    });

    // OpenAI Whisper (Speech-to-Text)
    this.addTemplate({
      id: 'openai_whisper',
      type: NodeType.OPENAI_WHISPER,
      name: 'OpenAI Whisper',
      description: 'Convert speech to text using OpenAI Whisper',
      category: NodeCategory.AI_MODELS,
      icon: '🎤',
      color: '#10A37F',
      tags: ['openai', 'whisper', 'speech', 'transcription', 'audio'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'audio_file',
          name: 'Audio File',
          type: DataType.FILE,
          required: true,
          description: 'Audio file to transcribe',
        },
      ],
      outputs: [
        {
          id: 'text',
          name: 'Transcribed Text',
          type: DataType.STRING,
          description: 'Transcribed text from audio',
        },
        {
          id: 'language',
          name: 'Detected Language',
          type: DataType.STRING,
          description: 'Detected language of the audio',
        },
      ],
      configuration: [
        {
          id: 'api_key',
          name: 'api_key',
          label: 'OpenAI API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Your OpenAI API key',
        },
        {
          id: 'model',
          name: 'model',
          label: 'Whisper Model',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Whisper model version',
          defaultValue: 'whisper-1',
          options: [{ label: 'Whisper-1', value: 'whisper-1' }],
        },
        {
          id: 'language',
          name: 'language',
          label: 'Language',
          type: ConfigurationType.SELECT,
          required: false,
          description: 'Expected language (auto-detect if not specified)',
          options: [
            { label: 'Auto-detect', value: '' },
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Italian', value: 'it' },
            { label: 'Portuguese', value: 'pt' },
            { label: 'Russian', value: 'ru' },
            { label: 'Japanese', value: 'ja' },
            { label: 'Korean', value: 'ko' },
            { label: 'Chinese', value: 'zh' },
          ],
        },
      ],
      examples: [
        {
          name: 'Meeting Transcription',
          description: 'Transcribe meeting recordings',
          input: { audio_file: 'meeting_recording.mp3' },
          output: { text: "Welcome to today's meeting. Let's start with...", language: 'en' },
          configuration: { model: 'whisper-1', language: 'en' },
        },
      ],
    });

    // OpenAI Text-to-Speech
    this.addTemplate({
      id: 'openai_tts',
      type: NodeType.OPENAI_TTS,
      name: 'OpenAI Text-to-Speech',
      description: 'Convert text to speech using OpenAI TTS',
      category: NodeCategory.AI_MODELS,
      icon: '🔊',
      color: '#10A37F',
      tags: ['openai', 'tts', 'speech', 'synthesis', 'audio'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'text',
          name: 'Text',
          type: DataType.STRING,
          required: true,
          description: 'Text to convert to speech',
        },
      ],
      outputs: [
        {
          id: 'audio_url',
          name: 'Audio URL',
          type: DataType.STRING,
          description: 'URL of the generated audio file',
        },
      ],
      configuration: [
        {
          id: 'api_key',
          name: 'api_key',
          label: 'OpenAI API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Your OpenAI API key',
        },
        {
          id: 'model',
          name: 'model',
          label: 'TTS Model',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Text-to-speech model',
          defaultValue: 'tts-1',
          options: [
            { label: 'TTS-1', value: 'tts-1' },
            { label: 'TTS-1 HD', value: 'tts-1-hd' },
          ],
        },
        {
          id: 'voice',
          name: 'voice',
          label: 'Voice',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Voice to use for synthesis',
          defaultValue: 'alloy',
          options: [
            { label: 'Alloy', value: 'alloy' },
            { label: 'Echo', value: 'echo' },
            { label: 'Fable', value: 'fable' },
            { label: 'Onyx', value: 'onyx' },
            { label: 'Nova', value: 'nova' },
            { label: 'Shimmer', value: 'shimmer' },
          ],
        },
        {
          id: 'speed',
          name: 'speed',
          label: 'Speed',
          type: ConfigurationType.SLIDER,
          required: false,
          description: 'Speech speed (0.25 to 4.0)',
          defaultValue: 1.0,
        },
      ],
      examples: [
        {
          name: 'Podcast Generation',
          description: 'Generate audio content for podcasts',
          input: { text: 'Welcome to our AI podcast. Today we discuss...' },
          output: { audio_url: 'https://example.com/generated-audio.mp3' },
          configuration: { model: 'tts-1-hd', voice: 'nova', speed: 1.0 },
        },
      ],
    });

    // Sentiment Analyzer
    this.addTemplate({
      id: 'sentiment_analyzer',
      type: NodeType.SENTIMENT_ANALYZER,
      name: 'Sentiment Analyzer',
      description: 'Analyze the sentiment and emotions in text content',
      category: NodeCategory.AI_MODELS,
      icon: '😊',
      color: '#10B981',
      tags: ['ai', 'sentiment', 'analysis', 'emotion', 'nlp'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'text',
          name: 'Text',
          type: DataType.STRING,
          required: true,
          description: 'Text to analyze for sentiment',
        },
      ],
      outputs: [
        {
          id: 'sentiment',
          name: 'Sentiment',
          type: DataType.STRING,
          description: 'Overall sentiment (positive, negative, neutral)',
        },
        {
          id: 'confidence',
          name: 'Confidence',
          type: DataType.NUMBER,
          description: 'Confidence score (0-1)',
        },
        {
          id: 'emotions',
          name: 'Emotions',
          type: DataType.OBJECT,
          description: 'Detailed emotion breakdown',
        },
        {
          id: 'score',
          name: 'Sentiment Score',
          type: DataType.NUMBER,
          description: 'Numerical sentiment score (-1 to 1)',
        },
      ],
      configuration: [
        {
          id: 'provider',
          name: 'provider',
          label: 'Analysis Provider',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Choose sentiment analysis provider',
          defaultValue: 'openai',
          options: [
            { label: 'OpenAI', value: 'openai' },
            { label: 'Google Cloud', value: 'google' },
            { label: 'Azure Cognitive', value: 'azure' },
            { label: 'Local Model', value: 'local' },
          ],
        },
        {
          id: 'detailed_analysis',
          name: 'detailed_analysis',
          label: 'Detailed Analysis',
          type: ConfigurationType.BOOLEAN,
          required: false,
          description: 'Include detailed emotion breakdown',
          defaultValue: true,
        },
        {
          id: 'api_key',
          name: 'api_key',
          label: 'API Key',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'API key for the selected provider',
        },
      ],
      examples: [
        {
          name: 'Customer Review Analysis',
          description: 'Analyze customer feedback sentiment',
          input: { text: 'This product is amazing! I love it and would recommend it to everyone.' },
          output: {
            sentiment: 'positive',
            confidence: 0.95,
            score: 0.8,
            emotions: { joy: 0.9, excitement: 0.7, satisfaction: 0.8 },
          },
          configuration: { provider: 'openai', detailed_analysis: true },
        },
      ],
    });
  }

  private initializeDataProcessingNodes(): void {
    // MySQL Database Connector
    this.addTemplate({
      id: 'mysql_connector',
      type: NodeType.MYSQL_CONNECTOR,
      name: 'MySQL Database',
      description: 'Connect to and query MySQL databases',
      category: NodeCategory.DATA_PROCESSING,
      icon: '🗄️',
      color: '#4479A1',
      tags: ['mysql', 'database', 'sql', 'query'],
      featured: true,
      difficulty: 'intermediate',
      inputs: [
        {
          id: 'query',
          name: 'SQL Query',
          type: DataType.STRING,
          required: true,
          description: 'SQL query to execute',
        },
        {
          id: 'parameters',
          name: 'Parameters',
          type: DataType.OBJECT,
          required: false,
          description: 'Query parameters for prepared statements',
        },
      ],
      outputs: [
        {
          id: 'results',
          name: 'Query Results',
          type: DataType.ARRAY,
          description: 'Results from the database query',
        },
        {
          id: 'affected_rows',
          name: 'Affected Rows',
          type: DataType.NUMBER,
          description: 'Number of affected rows (for INSERT/UPDATE/DELETE)',
        },
      ],
      configuration: [
        {
          id: 'host',
          name: 'host',
          label: 'Host',
          type: ConfigurationType.TEXT,
          required: true,
          description: 'Database host address',
          defaultValue: 'localhost',
        },
        {
          id: 'port',
          name: 'port',
          label: 'Port',
          type: ConfigurationType.NUMBER,
          required: true,
          description: 'Database port',
          defaultValue: 3306,
        },
        {
          id: 'database',
          name: 'database',
          label: 'Database Name',
          type: ConfigurationType.TEXT,
          required: true,
          description: 'Name of the database',
        },
        {
          id: 'username',
          name: 'username',
          label: 'Username',
          type: ConfigurationType.TEXT,
          required: true,
          description: 'Database username',
        },
        {
          id: 'password',
          name: 'password',
          label: 'Password',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Database password',
        },
      ],
      examples: [
        {
          name: 'User Lookup',
          description: 'Find users by email',
          input: {
            query: 'SELECT * FROM users WHERE email = ?',
            parameters: { email: 'user@example.com' },
          },
          output: { results: [{ id: 1, name: 'John Doe', email: 'user@example.com' }] },
          configuration: { host: 'localhost', port: 3306, database: 'myapp' },
        },
      ],
    });

    // CSV Parser
    this.addTemplate({
      id: 'csv_parser',
      type: NodeType.CSV_PARSER,
      name: 'CSV Parser',
      description: 'Parse CSV files and convert to structured data',
      category: NodeCategory.DATA_PROCESSING,
      icon: '📊',
      color: '#059669',
      tags: ['csv', 'parser', 'data', 'file'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'csv_file',
          name: 'CSV File',
          type: DataType.FILE,
          required: true,
          description: 'CSV file to parse',
        },
      ],
      outputs: [
        {
          id: 'data',
          name: 'Parsed Data',
          type: DataType.ARRAY,
          description: 'Array of objects from CSV data',
        },
        {
          id: 'headers',
          name: 'Headers',
          type: DataType.ARRAY,
          description: 'Column headers from the CSV',
        },
        {
          id: 'row_count',
          name: 'Row Count',
          type: DataType.NUMBER,
          description: 'Number of data rows parsed',
        },
      ],
      configuration: [
        {
          id: 'delimiter',
          name: 'delimiter',
          label: 'Delimiter',
          type: ConfigurationType.SELECT,
          required: false,
          description: 'CSV delimiter character',
          defaultValue: ',',
          options: [
            { label: 'Comma (,)', value: ',' },
            { label: 'Semicolon (;)', value: ';' },
            { label: 'Tab', value: '\t' },
            { label: 'Pipe (|)', value: '|' },
          ],
        },
        {
          id: 'has_header',
          name: 'has_header',
          label: 'Has Header Row',
          type: ConfigurationType.BOOLEAN,
          required: false,
          description: 'First row contains column headers',
          defaultValue: true,
        },
        {
          id: 'skip_empty_lines',
          name: 'skip_empty_lines',
          label: 'Skip Empty Lines',
          type: ConfigurationType.BOOLEAN,
          required: false,
          description: 'Skip empty lines in the CSV',
          defaultValue: true,
        },
      ],
      examples: [
        {
          name: 'Customer Data Import',
          description: 'Parse customer data from CSV file',
          input: { csv_file: 'customers.csv' },
          output: {
            data: [{ name: 'John Doe', email: 'john@example.com', age: 30 }],
            headers: ['name', 'email', 'age'],
            row_count: 1,
          },
          configuration: { delimiter: ',', has_header: true },
        },
      ],
    });

    // JSON Parser
    this.addTemplate({
      id: 'json_parser',
      type: NodeType.JSON_PARSER,
      name: 'JSON Parser',
      description: 'Parse and manipulate JSON data',
      category: NodeCategory.DATA_PROCESSING,
      icon: '📋',
      color: '#7C3AED',
      tags: ['json', 'parser', 'data', 'transform'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'json_input',
          name: 'JSON Input',
          type: DataType.STRING,
          required: true,
          description: 'JSON string to parse',
        },
      ],
      outputs: [
        {
          id: 'parsed_data',
          name: 'Parsed Data',
          type: DataType.OBJECT,
          description: 'Parsed JSON object',
        },
        {
          id: 'is_valid',
          name: 'Is Valid',
          type: DataType.BOOLEAN,
          description: 'Whether the JSON is valid',
        },
      ],
      configuration: [
        {
          id: 'path_extraction',
          name: 'path_extraction',
          label: 'JSON Path',
          type: ConfigurationType.TEXT,
          required: false,
          description: 'Extract specific path from JSON (e.g., $.data.items)',
        },
        {
          id: 'strict_mode',
          name: 'strict_mode',
          label: 'Strict Mode',
          type: ConfigurationType.BOOLEAN,
          required: false,
          description: 'Use strict JSON parsing',
          defaultValue: true,
        },
      ],
      examples: [
        {
          name: 'API Response Processing',
          description: 'Parse API response and extract data',
          input: { json_input: '{"status": "success", "data": {"users": [{"name": "John"}]}}' },
          output: {
            parsed_data: { status: 'success', data: { users: [{ name: 'John' }] } },
            is_valid: true,
          },
          configuration: { path_extraction: '$.data.users', strict_mode: true },
        },
      ],
    });
  }

  private initializeIntegrationNodes(): void {
    // Gmail Connector
    this.addTemplate({
      id: 'gmail_connector',
      type: NodeType.GMAIL_CONNECTOR,
      name: 'Gmail',
      description: 'Send and receive emails through Gmail',
      category: NodeCategory.INTEGRATIONS,
      icon: '📧',
      color: '#EA4335',
      tags: ['gmail', 'email', 'google', 'messaging'],
      featured: true,
      difficulty: 'intermediate',
      inputs: [
        {
          id: 'to',
          name: 'To',
          type: DataType.STRING,
          required: true,
          description: 'Recipient email address',
        },
        {
          id: 'subject',
          name: 'Subject',
          type: DataType.STRING,
          required: true,
          description: 'Email subject',
        },
        {
          id: 'body',
          name: 'Body',
          type: DataType.STRING,
          required: true,
          description: 'Email body content',
        },
        {
          id: 'attachments',
          name: 'Attachments',
          type: DataType.ARRAY,
          required: false,
          description: 'File attachments',
        },
      ],
      outputs: [
        {
          id: 'message_id',
          name: 'Message ID',
          type: DataType.STRING,
          description: 'Gmail message ID',
        },
        {
          id: 'thread_id',
          name: 'Thread ID',
          type: DataType.STRING,
          description: 'Gmail thread ID',
        },
      ],
      configuration: [
        {
          id: 'client_id',
          name: 'client_id',
          label: 'Client ID',
          type: ConfigurationType.TEXT,
          required: true,
          description: 'Google OAuth Client ID',
        },
        {
          id: 'client_secret',
          name: 'client_secret',
          label: 'Client Secret',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Google OAuth Client Secret',
        },
        {
          id: 'refresh_token',
          name: 'refresh_token',
          label: 'Refresh Token',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'OAuth refresh token',
        },
        {
          id: 'from_email',
          name: 'from_email',
          label: 'From Email',
          type: ConfigurationType.EMAIL,
          required: true,
          description: 'Sender email address',
        },
      ],
      examples: [
        {
          name: 'Welcome Email',
          description: 'Send welcome email to new users',
          input: {
            to: 'user@example.com',
            subject: 'Welcome to our platform!',
            body: 'Thank you for joining us...',
          },
          output: { message_id: 'msg_abc123', thread_id: 'thread_xyz789' },
          configuration: { from_email: 'noreply@company.com' },
        },
      ],
    });

    // Slack Connector
    this.addTemplate({
      id: 'slack_connector',
      type: NodeType.SLACK_CONNECTOR,
      name: 'Slack',
      description: 'Send messages and interact with Slack workspaces',
      category: NodeCategory.INTEGRATIONS,
      icon: '💬',
      color: '#4A154B',
      tags: ['slack', 'messaging', 'team', 'collaboration'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'message',
          name: 'Message',
          type: DataType.STRING,
          required: true,
          description: 'Message to send to Slack',
        },
        {
          id: 'channel',
          name: 'Channel',
          type: DataType.STRING,
          required: false,
          description: 'Slack channel (optional if configured)',
        },
        {
          id: 'attachments',
          name: 'Attachments',
          type: DataType.ARRAY,
          required: false,
          description: 'Message attachments or blocks',
        },
      ],
      outputs: [
        {
          id: 'message_id',
          name: 'Message ID',
          type: DataType.STRING,
          description: 'ID of the sent message',
        },
        {
          id: 'timestamp',
          name: 'Timestamp',
          type: DataType.STRING,
          description: 'When the message was sent',
        },
        {
          id: 'channel_id',
          name: 'Channel ID',
          type: DataType.STRING,
          description: 'ID of the channel where message was sent',
        },
      ],
      configuration: [
        {
          id: 'bot_token',
          name: 'bot_token',
          label: 'Bot Token',
          type: ConfigurationType.PASSWORD,
          required: true,
          description: 'Slack bot token (starts with xoxb-)',
        },
        {
          id: 'default_channel',
          name: 'default_channel',
          label: 'Default Channel',
          type: ConfigurationType.TEXT,
          required: false,
          description: 'Default channel to send messages to',
          defaultValue: '#general',
        },
        {
          id: 'username',
          name: 'username',
          label: 'Bot Username',
          type: ConfigurationType.TEXT,
          required: false,
          description: 'Display name for the bot',
        },
      ],
      examples: [
        {
          name: 'System Alert',
          description: 'Send system alerts to operations channel',
          input: { message: '🚨 High CPU usage detected on server-01', channel: '#ops-alerts' },
          output: {
            message_id: '1234567890.123456',
            timestamp: '1640995200.123456',
            channel_id: 'C1234567890',
          },
          configuration: { default_channel: '#alerts', username: 'MonitorBot' },
        },
      ],
    });

    // Google Drive Connector
    this.addTemplate({
      id: 'google_drive',
      type: NodeType.GOOGLE_DRIVE,
      name: 'Google Drive',
      description: 'Upload, download, and manage files in Google Drive',
      category: NodeCategory.INTEGRATIONS,
      icon: '📁',
      color: '#4285F4',
      tags: ['google', 'drive', 'storage', 'files'],
      featured: true,
      difficulty: 'intermediate',
      inputs: [
        {
          id: 'file',
          name: 'File',
          type: DataType.FILE,
          required: false,
          description: 'File to upload (for upload operations)',
        },
        {
          id: 'file_id',
          name: 'File ID',
          type: DataType.STRING,
          required: false,
          description: 'Google Drive file ID (for download/update operations)',
        },
        {
          id: 'folder_id',
          name: 'Folder ID',
          type: DataType.STRING,
          required: false,
          description: 'Target folder ID',
        },
      ],
      outputs: [
        {
          id: 'file_id',
          name: 'File ID',
          type: DataType.STRING,
          description: 'Google Drive file ID',
        },
        {
          id: 'file_url',
          name: 'File URL',
          type: DataType.STRING,
          description: 'Shareable file URL',
        },
        {
          id: 'file_content',
          name: 'File Content',
          type: DataType.STRING,
          description: 'File content (for download operations)',
        },
      ],
      configuration: [
        {
          id: 'operation',
          name: 'operation',
          label: 'Operation',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Drive operation to perform',
          defaultValue: 'upload',
          options: [
            { label: 'Upload File', value: 'upload' },
            { label: 'Download File', value: 'download' },
            { label: 'Delete File', value: 'delete' },
            { label: 'List Files', value: 'list' },
            { label: 'Share File', value: 'share' },
          ],
        },
        {
          id: 'service_account_key',
          name: 'service_account_key',
          label: 'Service Account Key',
          type: ConfigurationType.JSON,
          required: true,
          description: 'Google service account JSON key',
        },
      ],
      examples: [
        {
          name: 'Backup Upload',
          description: 'Upload backup files to Google Drive',
          input: { file: 'backup.zip', folder_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' },
          output: {
            file_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
            file_url: 'https://drive.google.com/file/d/...',
          },
          configuration: { operation: 'upload' },
        },
      ],
    });
  }

  private initializeUtilityNodes(): void {
    // Conditional Logic (If/Else)
    this.addTemplate({
      id: 'if_else',
      type: NodeType.IF_ELSE,
      name: 'If/Else Condition',
      description: 'Execute different paths based on conditions',
      category: NodeCategory.UTILITIES,
      icon: '🔀',
      color: '#8B5CF6',
      tags: ['logic', 'condition', 'branching', 'control'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'condition',
          name: 'Condition',
          type: DataType.BOOLEAN,
          required: true,
          description: 'Boolean condition to evaluate',
        },
        {
          id: 'true_value',
          name: 'True Value',
          type: DataType.ANY,
          required: false,
          description: 'Value to output if condition is true',
        },
        {
          id: 'false_value',
          name: 'False Value',
          type: DataType.ANY,
          required: false,
          description: 'Value to output if condition is false',
        },
      ],
      outputs: [
        {
          id: 'result',
          name: 'Result',
          type: DataType.ANY,
          description: 'Output based on condition evaluation',
        },
        {
          id: 'condition_met',
          name: 'Condition Met',
          type: DataType.BOOLEAN,
          description: 'Whether the condition was true',
        },
      ],
      configuration: [
        {
          id: 'operator',
          name: 'operator',
          label: 'Comparison Operator',
          type: ConfigurationType.SELECT,
          required: false,
          description: 'Operator for comparing values',
          defaultValue: 'equals',
          options: [
            { label: 'Equals (==)', value: 'equals' },
            { label: 'Not Equals (!=)', value: 'not_equals' },
            { label: 'Greater Than (>)', value: 'greater_than' },
            { label: 'Less Than (<)', value: 'less_than' },
            { label: 'Contains', value: 'contains' },
            { label: 'Starts With', value: 'starts_with' },
            { label: 'Ends With', value: 'ends_with' },
            { label: 'Is Empty', value: 'is_empty' },
            { label: 'Is Not Empty', value: 'is_not_empty' },
          ],
        },
        {
          id: 'compare_value',
          name: 'compare_value',
          label: 'Compare Value',
          type: ConfigurationType.TEXT,
          required: false,
          description: 'Value to compare against',
        },
      ],
      examples: [
        {
          name: 'Age Verification',
          description: 'Check if user is adult',
          input: { condition: true, true_value: 'Adult', false_value: 'Minor' },
          output: { result: 'Adult', condition_met: true },
          configuration: { operator: 'greater_than', compare_value: '18' },
        },
      ],
    });

    // Mathematical Operations
    this.addTemplate({
      id: 'math_operation',
      type: NodeType.MATH_OPERATION,
      name: 'Math Operation',
      description: 'Perform mathematical calculations',
      category: NodeCategory.UTILITIES,
      icon: '🧮',
      color: '#059669',
      tags: ['math', 'calculation', 'numbers', 'arithmetic'],
      featured: true,
      difficulty: 'beginner',
      inputs: [
        {
          id: 'value_a',
          name: 'Value A',
          type: DataType.NUMBER,
          required: true,
          description: 'First number',
        },
        {
          id: 'value_b',
          name: 'Value B',
          type: DataType.NUMBER,
          required: false,
          description: 'Second number (for binary operations)',
        },
      ],
      outputs: [
        {
          id: 'result',
          name: 'Result',
          type: DataType.NUMBER,
          description: 'Mathematical operation result',
        },
        {
          id: 'formatted_result',
          name: 'Formatted Result',
          type: DataType.STRING,
          description: 'Result formatted as string',
        },
      ],
      configuration: [
        {
          id: 'operation',
          name: 'operation',
          label: 'Operation',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Mathematical operation to perform',
          defaultValue: 'add',
          options: [
            { label: 'Add (+)', value: 'add' },
            { label: 'Subtract (-)', value: 'subtract' },
            { label: 'Multiply (×)', value: 'multiply' },
            { label: 'Divide (÷)', value: 'divide' },
            { label: 'Power (^)', value: 'power' },
            { label: 'Square Root (√)', value: 'sqrt' },
            { label: 'Absolute Value (|x|)', value: 'abs' },
            { label: 'Round', value: 'round' },
            { label: 'Floor', value: 'floor' },
            { label: 'Ceiling', value: 'ceil' },
            { label: 'Modulo (%)', value: 'modulo' },
          ],
        },
        {
          id: 'decimal_places',
          name: 'decimal_places',
          label: 'Decimal Places',
          type: ConfigurationType.NUMBER,
          required: false,
          description: 'Number of decimal places for result',
          defaultValue: 2,
        },
      ],
      examples: [
        {
          name: 'Price Calculation',
          description: 'Calculate total price with tax',
          input: { value_a: 100, value_b: 1.08 },
          output: { result: 108, formatted_result: '108.00' },
          configuration: { operation: 'multiply', decimal_places: 2 },
        },
      ],
    });
  }

  private initializeTriggerNodes(): void {
    // Schedule Trigger
    this.addTemplate({
      id: 'schedule_trigger',
      type: NodeType.SCHEDULE_TRIGGER,
      name: 'Schedule Trigger',
      description: 'Trigger workflow on a schedule',
      category: NodeCategory.TRIGGERS,
      icon: '⏰',
      color: '#F59E0B',
      tags: ['schedule', 'cron', 'timer', 'automation'],
      featured: true,
      difficulty: 'intermediate',
      inputs: [],
      outputs: [
        {
          id: 'trigger_time',
          name: 'Trigger Time',
          type: DataType.STRING,
          description: 'When the trigger fired',
        },
        {
          id: 'execution_count',
          name: 'Execution Count',
          type: DataType.NUMBER,
          description: 'Number of times this trigger has fired',
        },
      ],
      configuration: [
        {
          id: 'schedule_type',
          name: 'schedule_type',
          label: 'Schedule Type',
          type: ConfigurationType.SELECT,
          required: true,
          description: 'Type of schedule',
          defaultValue: 'interval',
          options: [
            { label: 'Interval', value: 'interval' },
            { label: 'Cron Expression', value: 'cron' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
        },
        {
          id: 'interval_value',
          name: 'interval_value',
          label: 'Interval Value',
          type: ConfigurationType.NUMBER,
          required: false,
          description: 'Interval value (for interval type)',
          defaultValue: 5,
        },
        {
          id: 'interval_unit',
          name: 'interval_unit',
          label: 'Interval Unit',
          type: ConfigurationType.SELECT,
          required: false,
          description: 'Interval unit',
          defaultValue: 'minutes',
          options: [
            { label: 'Minutes', value: 'minutes' },
            { label: 'Hours', value: 'hours' },
            { label: 'Days', value: 'days' },
          ],
        },
        {
          id: 'cron_expression',
          name: 'cron_expression',
          label: 'Cron Expression',
          type: ConfigurationType.TEXT,
          required: false,
          description: 'Cron expression (for cron type)',
          placeholder: '0 9 * * 1-5',
        },
      ],
      examples: [
        {
          name: 'Daily Report',
          description: 'Generate daily reports at 9 AM',
          input: {},
          output: { trigger_time: '2024-01-15T09:00:00Z', execution_count: 15 },
          configuration: { schedule_type: 'cron', cron_expression: '0 9 * * *' },
        },
      ],
    });

    // Webhook Trigger (Enhanced)
    this.addTemplate({
      id: 'webhook_trigger',
      type: NodeType.WEBHOOK_TRIGGER,
      name: 'Webhook Trigger',
      description: 'Trigger workflow from HTTP webhooks',
      category: NodeCategory.TRIGGERS,
      icon: '🔗',
      color: '#F59E0B',
      tags: ['webhook', 'trigger', 'http'],
      featured: true,
      difficulty: 'beginner',
      inputs: [],
      outputs: [
        {
          id: 'payload',
          name: 'Webhook Payload',
          type: DataType.OBJECT,
          description: 'The webhook request payload',
        },
        {
          id: 'headers',
          name: 'Headers',
          type: DataType.OBJECT,
          description: 'HTTP headers from the request',
        },
      ],
      configuration: [
        {
          id: 'webhook_url',
          name: 'webhook_url',
          label: 'Webhook URL',
          type: ConfigurationType.URL,
          required: false,
          description: 'Auto-generated webhook URL',
        },
        {
          id: 'authentication',
          name: 'authentication',
          label: 'Authentication',
          type: ConfigurationType.SELECT,
          required: false,
          description: 'Webhook authentication method',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'API Key', value: 'api_key' },
            { label: 'Basic Auth', value: 'basic_auth' },
          ],
        },
      ],
      examples: [
        {
          name: 'GitHub Webhook',
          description: 'Receive GitHub push notifications',
          input: {},
          output: { payload: { repository: 'my-repo', action: 'push' } },
          configuration: { authentication: 'none' },
        },
      ],
    });
  }

  private addTemplate(template: NodeTemplate): void {
    this.templates.set(template.id, template);
  }

  getAllTemplates(): NodeTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: NodeCategory): NodeTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  getFeaturedTemplates(): NodeTemplate[] {
    return this.getAllTemplates().filter(template => template.featured);
  }

  getTemplate(id: string): NodeTemplate | undefined {
    return this.templates.get(id);
  }

  searchTemplates(query: string): NodeTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTemplates().filter(
      template =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): NodeTemplate[] {
    return this.getAllTemplates().filter(template => template.difficulty === difficulty);
  }

  private getModelOptions(): Array<{ label: string; value: string }> {
    const models = this.aiModelService.getAllModels();
    return models.map(model => ({
      label: `${model.name} (${model.provider})`,
      value: model.id,
    }));
  }

  getAvailableModels(): Array<{ id: string; name: string; provider: string; category: string }> {
    return this.aiModelService.getAllModels().map(model => ({
      id: model.id,
      name: model.name,
      provider: model.provider,
      category: model.category,
    }));
  }

  getFeaturedModels(): Array<{ id: string; name: string; provider: string; category: string }> {
    return this.aiModelService.getFeaturedModels().map(model => ({
      id: model.id,
      name: model.name,
      provider: model.provider,
      category: model.category,
    }));
  }
}
