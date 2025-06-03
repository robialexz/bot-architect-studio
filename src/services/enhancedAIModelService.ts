import { AIProvider, AIModelConfig } from '@/types/nodeTemplates';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  capabilities: string[];
  maxTokens: number;
  costPer1kTokens: number;
  category: 'text' | 'image' | 'audio' | 'multimodal' | 'code' | 'embedding';
  featured: boolean;
  apiEndpoint?: string;
  requiresApiKey: boolean;
  supportedFeatures: {
    streaming: boolean;
    functionCalling: boolean;
    vision: boolean;
    audio: boolean;
    json: boolean;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
  examples: Array<{
    input: Record<string, string>;
    output: string;
  }>;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  provider?: AIProvider;
  model?: string;
}

export class EnhancedAIModelService {
  private static instance: EnhancedAIModelService;
  private models: Map<string, AIModel> = new Map();
  private promptTemplates: Map<string, PromptTemplate> = new Map();

  private constructor() {
    this.initializeModels();
    this.initializePromptTemplates();
  }

  static getInstance(): EnhancedAIModelService {
    if (!EnhancedAIModelService.instance) {
      EnhancedAIModelService.instance = new EnhancedAIModelService();
    }
    return EnhancedAIModelService.instance;
  }

  private initializeModels(): void {
    // OpenAI Models
    this.addModel({
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: AIProvider.OPENAI,
      description: 'Most capable GPT-4 model with 128k context window',
      capabilities: ['text generation', 'code generation', 'analysis', 'reasoning'],
      maxTokens: 128000,
      costPer1kTokens: 0.01,
      category: 'text',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: true,
        vision: false,
        audio: false,
        json: true,
      },
    });

    this.addModel({
      id: 'gpt-4-vision',
      name: 'GPT-4 Vision',
      provider: AIProvider.OPENAI,
      description: 'GPT-4 with vision capabilities for image analysis',
      capabilities: ['text generation', 'image analysis', 'visual reasoning'],
      maxTokens: 128000,
      costPer1kTokens: 0.01,
      category: 'multimodal',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: true,
        vision: true,
        audio: false,
        json: true,
      },
    });

    this.addModel({
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: AIProvider.OPENAI,
      description: 'Fast and efficient model for most tasks',
      capabilities: ['text generation', 'conversation', 'basic analysis'],
      maxTokens: 16385,
      costPer1kTokens: 0.0015,
      category: 'text',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: true,
        vision: false,
        audio: false,
        json: true,
      },
    });

    // Anthropic Models
    this.addModel({
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: AIProvider.ANTHROPIC,
      description: 'Most powerful Claude model for complex tasks',
      capabilities: ['advanced reasoning', 'analysis', 'creative writing', 'code generation'],
      maxTokens: 200000,
      costPer1kTokens: 0.015,
      category: 'text',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        json: true,
      },
    });

    this.addModel({
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: AIProvider.ANTHROPIC,
      description: 'Balanced performance and speed for most tasks',
      capabilities: ['text generation', 'analysis', 'reasoning', 'code generation'],
      maxTokens: 200000,
      costPer1kTokens: 0.003,
      category: 'text',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        json: true,
      },
    });

    this.addModel({
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: AIProvider.ANTHROPIC,
      description: 'Fastest Claude model for simple tasks',
      capabilities: ['text generation', 'conversation', 'basic analysis'],
      maxTokens: 200000,
      costPer1kTokens: 0.00025,
      category: 'text',
      featured: false,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        json: true,
      },
    });

    // Google Models
    this.addModel({
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: AIProvider.GOOGLE,
      description: "Google's most capable multimodal model",
      capabilities: ['text generation', 'image analysis', 'code generation', 'reasoning'],
      maxTokens: 32768,
      costPer1kTokens: 0.0005,
      category: 'multimodal',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: true,
        vision: true,
        audio: false,
        json: true,
      },
    });

    this.addModel({
      id: 'gemini-pro-vision',
      name: 'Gemini Pro Vision',
      provider: AIProvider.GOOGLE,
      description: 'Specialized for image and video understanding',
      capabilities: ['image analysis', 'video analysis', 'visual reasoning'],
      maxTokens: 32768,
      costPer1kTokens: 0.0005,
      category: 'multimodal',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: true,
        audio: false,
        json: true,
      },
    });

    // Local Models (Ollama)
    this.addModel({
      id: 'llama2-7b',
      name: 'Llama 2 7B',
      provider: AIProvider.OLLAMA,
      description: 'Open source model running locally via Ollama',
      capabilities: ['text generation', 'conversation', 'basic reasoning'],
      maxTokens: 4096,
      costPer1kTokens: 0,
      category: 'text',
      featured: true,
      requiresApiKey: false,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: false,
        json: false,
      },
    });

    this.addModel({
      id: 'llama2-13b',
      name: 'Llama 2 13B',
      provider: AIProvider.OLLAMA,
      description: 'Larger Llama 2 model with better performance',
      capabilities: ['text generation', 'conversation', 'reasoning', 'code generation'],
      maxTokens: 4096,
      costPer1kTokens: 0,
      category: 'text',
      featured: true,
      requiresApiKey: false,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: false,
        json: false,
      },
    });

    this.addModel({
      id: 'mistral-7b',
      name: 'Mistral 7B',
      provider: AIProvider.OLLAMA,
      description: 'Efficient and capable open source model',
      capabilities: ['text generation', 'code generation', 'reasoning'],
      maxTokens: 8192,
      costPer1kTokens: 0,
      category: 'text',
      featured: true,
      requiresApiKey: false,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: false,
        json: false,
      },
    });

    this.addModel({
      id: 'codellama-7b',
      name: 'Code Llama 7B',
      provider: AIProvider.OLLAMA,
      description: 'Specialized for code generation and programming tasks',
      capabilities: ['code generation', 'code completion', 'debugging', 'code explanation'],
      maxTokens: 4096,
      costPer1kTokens: 0,
      category: 'code',
      featured: true,
      requiresApiKey: false,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: false,
        json: false,
      },
    });

    // Stability AI Models
    this.addModel({
      id: 'stable-diffusion-xl',
      name: 'Stable Diffusion XL',
      provider: AIProvider.STABILITY_AI,
      description: 'High-quality image generation model',
      capabilities: ['image generation', 'image editing', 'style transfer'],
      maxTokens: 77,
      costPer1kTokens: 0.04,
      category: 'image',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: false,
        functionCalling: false,
        vision: false,
        audio: false,
        json: false,
      },
    });

    // ElevenLabs Models
    this.addModel({
      id: 'eleven-multilingual-v2',
      name: 'ElevenLabs Multilingual v2',
      provider: AIProvider.ELEVEN_LABS,
      description: 'High-quality text-to-speech in multiple languages',
      capabilities: ['text-to-speech', 'voice cloning', 'multilingual'],
      maxTokens: 5000,
      costPer1kTokens: 0.18,
      category: 'audio',
      featured: true,
      requiresApiKey: true,
      supportedFeatures: {
        streaming: true,
        functionCalling: false,
        vision: false,
        audio: true,
        json: false,
      },
    });
  }

  private addModel(model: AIModel): void {
    this.models.set(model.id, model);
  }

  getModel(id: string): AIModel | undefined {
    return this.models.get(id);
  }

  getModelsByProvider(provider: AIProvider): AIModel[] {
    return Array.from(this.models.values()).filter(model => model.provider === provider);
  }

  getModelsByCategory(category: string): AIModel[] {
    return Array.from(this.models.values()).filter(model => model.category === category);
  }

  getFeaturedModels(): AIModel[] {
    return Array.from(this.models.values()).filter(model => model.featured);
  }

  getAllModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  searchModels(query: string): AIModel[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.models.values()).filter(
      model =>
        model.name.toLowerCase().includes(lowercaseQuery) ||
        model.description.toLowerCase().includes(lowercaseQuery) ||
        model.capabilities.some(cap => cap.toLowerCase().includes(lowercaseQuery))
    );
  }

  private initializePromptTemplates(): void {
    // Content Creation Templates
    this.addPromptTemplate({
      id: 'blog-post-writer',
      name: 'Blog Post Writer',
      description: 'Generate engaging blog posts on any topic',
      category: 'Content Creation',
      template: `Write a comprehensive blog post about {{topic}}.

Structure:
- Engaging headline
- Introduction that hooks the reader
- 3-5 main sections with subheadings
- Conclusion with call-to-action

Tone: {{tone}}
Target audience: {{audience}}
Word count: {{wordCount}} words

Include relevant examples and actionable insights.`,
      variables: ['topic', 'tone', 'audience', 'wordCount'],
      examples: [
        {
          input: {
            topic: 'AI in healthcare',
            tone: 'professional',
            audience: 'healthcare professionals',
            wordCount: '1500',
          },
          output: 'AI in Healthcare: Revolutionizing Patient Care and Medical Diagnosis...',
        },
      ],
      tags: ['content', 'blog', 'writing', 'marketing'],
      difficulty: 'beginner',
      provider: AIProvider.OPENAI,
      model: 'gpt-4-turbo',
    });

    this.addPromptTemplate({
      id: 'social-media-content',
      name: 'Social Media Content Creator',
      description: 'Create engaging social media posts for different platforms',
      category: 'Content Creation',
      template: `Create {{postCount}} engaging social media posts for {{platform}} about {{topic}}.

Requirements:
- Platform: {{platform}}
- Tone: {{tone}}
- Include relevant hashtags
- Call-to-action in each post
- Character limit: {{characterLimit}}

Make each post unique and engaging.`,
      variables: ['postCount', 'platform', 'topic', 'tone', 'characterLimit'],
      examples: [
        {
          input: {
            postCount: '3',
            platform: 'LinkedIn',
            topic: 'remote work productivity',
            tone: 'professional',
            characterLimit: '3000',
          },
          output: "Post 1: 🏠 Remote work isn't just about working from home...",
        },
      ],
      tags: ['social media', 'marketing', 'content'],
      difficulty: 'beginner',
    });

    // Data Analysis Templates
    this.addPromptTemplate({
      id: 'data-analyzer',
      name: 'Data Analysis Assistant',
      description: 'Analyze datasets and provide insights',
      category: 'Data Analysis',
      template: `Analyze the following dataset and provide insights:

Data: {{dataDescription}}
Format: {{dataFormat}}

Please provide:
1. Summary statistics
2. Key patterns and trends
3. Anomalies or outliers
4. Actionable recommendations
5. Visualization suggestions

Focus on: {{analysisGoals}}`,
      variables: ['dataDescription', 'dataFormat', 'analysisGoals'],
      examples: [
        {
          input: {
            dataDescription: 'Sales data for Q1-Q4 2023',
            dataFormat: 'CSV with columns: date, product, sales, region',
            analysisGoals: 'identify best performing products and regions',
          },
          output: 'Based on the sales data analysis...',
        },
      ],
      tags: ['data', 'analysis', 'insights', 'business'],
      difficulty: 'intermediate',
      provider: AIProvider.ANTHROPIC,
      model: 'claude-3-sonnet',
    });

    // Code Generation Templates
    this.addPromptTemplate({
      id: 'code-generator',
      name: 'Code Generator',
      description: 'Generate code in various programming languages',
      category: 'Programming',
      template: `Generate {{language}} code for the following requirement:

Task: {{task}}
Programming Language: {{language}}
Framework/Library: {{framework}}

Requirements:
- Follow best practices and conventions
- Include error handling
- Add comments for complex logic
- Make code modular and reusable

Additional specifications: {{specifications}}`,
      variables: ['language', 'task', 'framework', 'specifications'],
      examples: [
        {
          input: {
            language: 'Python',
            task: 'Create a REST API for user management',
            framework: 'FastAPI',
            specifications: 'Include CRUD operations and authentication',
          },
          output: 'from fastapi import FastAPI, HTTPException...',
        },
      ],
      tags: ['code', 'programming', 'development'],
      difficulty: 'intermediate',
      provider: AIProvider.OLLAMA,
      model: 'codellama-7b',
    });

    // Customer Service Templates
    this.addPromptTemplate({
      id: 'customer-service-response',
      name: 'Customer Service Response',
      description: 'Generate professional customer service responses',
      category: 'Customer Service',
      template: `Generate a professional customer service response for the following inquiry:

Customer Message: {{customerMessage}}
Issue Type: {{issueType}}
Customer Tier: {{customerTier}}
Company Policy: {{companyPolicy}}

Response should be:
- Empathetic and understanding
- Professional and helpful
- Include specific next steps
- Offer additional assistance

Tone: {{tone}}`,
      variables: ['customerMessage', 'issueType', 'customerTier', 'companyPolicy', 'tone'],
      examples: [
        {
          input: {
            customerMessage: "My order hasn't arrived and it's been 2 weeks",
            issueType: 'shipping delay',
            customerTier: 'premium',
            companyPolicy: 'full refund or replacement for delays over 10 days',
            tone: 'apologetic and solution-focused',
          },
          output: 'Dear valued customer, I sincerely apologize for the delay...',
        },
      ],
      tags: ['customer service', 'communication', 'support'],
      difficulty: 'beginner',
    });

    // Email Templates
    this.addPromptTemplate({
      id: 'email-composer',
      name: 'Professional Email Composer',
      description: 'Compose professional emails for various purposes',
      category: 'Communication',
      template: `Compose a professional email with the following details:

Purpose: {{purpose}}
Recipient: {{recipient}}
Tone: {{tone}}
Key Points: {{keyPoints}}

Email should include:
- Appropriate subject line
- Professional greeting
- Clear and concise body
- Proper closing
- Call-to-action if needed

Context: {{context}}`,
      variables: ['purpose', 'recipient', 'tone', 'keyPoints', 'context'],
      examples: [
        {
          input: {
            purpose: 'follow up on meeting',
            recipient: 'potential client',
            tone: 'professional and friendly',
            keyPoints: 'recap discussion, next steps, timeline',
            context: 'sales meeting about software implementation',
          },
          output: 'Subject: Follow-up on Our Software Implementation Discussion...',
        },
      ],
      tags: ['email', 'communication', 'business'],
      difficulty: 'beginner',
    });
  }

  private addPromptTemplate(template: PromptTemplate): void {
    this.promptTemplates.set(template.id, template);
  }

  getPromptTemplates(): PromptTemplate[] {
    return Array.from(this.promptTemplates.values());
  }

  getPromptTemplatesByCategory(category: string): PromptTemplate[] {
    return Array.from(this.promptTemplates.values()).filter(
      template => template.category === category
    );
  }
}
