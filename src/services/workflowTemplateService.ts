// Workflow template service for pre-built AI automation workflows
import { WorkflowTemplate } from '@/types/nodeTemplates';
import { WorkflowCategory, NodeType } from '@/types/workflow';

export class WorkflowTemplateService {
  private static instance: WorkflowTemplateService;
  private templates: Map<string, WorkflowTemplate> = new Map();

  static getInstance(): WorkflowTemplateService {
    if (!WorkflowTemplateService.instance) {
      WorkflowTemplateService.instance = new WorkflowTemplateService();
      WorkflowTemplateService.instance.initializeTemplates();
    }
    return WorkflowTemplateService.instance;
  }

  private initializeTemplates(): void {
    // Customer Support Bot Template
    this.addTemplate({
      id: 'customer-support-bot',
      name: 'AI Customer Support Bot',
      description:
        'Automated customer support system with sentiment analysis and intelligent routing',
      category: 'customer_support',
      tags: ['customer-service', 'ai', 'automation', 'support'],
      difficulty: 'beginner',
      estimatedTime: 15,
      author: 'AI Flow Team',
      downloads: 1250,
      rating: 4.8,
      reviews: 89,
      featured: true,
      useCase:
        'Automatically handle customer inquiries, analyze sentiment, and route complex issues to human agents',
      requirements: ['Slack integration', 'OpenAI API key'],
      benefits: [
        'Reduce response time by 80%',
        'Handle 70% of inquiries automatically',
        'Improve customer satisfaction',
        'Free up human agents for complex issues',
      ],
      nodes: [
        {
          id: 'trigger-1',
          type: NodeType.WEBHOOK_TRIGGER,
          position: { x: 100, y: 100 },
          data: {
            label: 'Customer Message',
            name: 'Customer Message Trigger',
            config: {
              webhook_url: 'auto-generated',
              authentication: 'api_key',
            },
          },
          status: 'idle',
        },
        {
          id: 'sentiment-1',
          type: NodeType.SENTIMENT_ANALYZER,
          position: { x: 350, y: 100 },
          data: {
            label: 'Analyze Sentiment',
            name: 'Sentiment Analysis',
            config: {
              detailed_analysis: true,
            },
          },
          status: 'idle',
        },
        {
          id: 'condition-1',
          type: NodeType.CONDITION,
          position: { x: 600, y: 100 },
          data: {
            label: 'Check Sentiment',
            name: 'Sentiment Check',
            config: {
              condition: 'sentiment === "negative" || confidence < 0.7',
            },
          },
          status: 'idle',
        },
        {
          id: 'ai-response-1',
          type: NodeType.TEXT_GENERATOR,
          position: { x: 850, y: 50 },
          data: {
            label: 'Generate Response',
            name: 'AI Response Generator',
            config: {
              provider: 'openai',
              model: 'gpt-4',
              temperature: 0.7,
              system_prompt:
                'You are a helpful customer support assistant. Provide empathetic and solution-focused responses.',
            },
          },
          status: 'idle',
        },
        {
          id: 'slack-1',
          type: NodeType.SLACK_CONNECTOR,
          position: { x: 1100, y: 50 },
          data: {
            label: 'Send to Slack',
            name: 'Slack Notification',
            config: {
              default_channel: '#customer-support',
            },
          },
          status: 'idle',
        },
        {
          id: 'escalate-1',
          type: NodeType.SLACK_CONNECTOR,
          position: { x: 850, y: 200 },
          data: {
            label: 'Escalate to Human',
            name: 'Human Escalation',
            config: {
              default_channel: '#urgent-support',
            },
          },
          status: 'idle',
        },
      ],
      edges: [
        { id: 'e1', source: 'trigger-1', target: 'sentiment-1' },
        { id: 'e2', source: 'sentiment-1', target: 'condition-1' },
        { id: 'e3', source: 'condition-1', target: 'ai-response-1', sourceHandle: 'false' },
        { id: 'e4', source: 'ai-response-1', target: 'slack-1' },
        { id: 'e5', source: 'condition-1', target: 'escalate-1', sourceHandle: 'true' },
      ],
    });

    // Content Generation Pipeline
    this.addTemplate({
      id: 'content-generation-pipeline',
      name: 'AI Content Generation Pipeline',
      description:
        'Automated content creation workflow for blogs, social media, and marketing materials',
      category: 'content_generation',
      tags: ['content', 'marketing', 'ai', 'automation', 'social-media'],
      difficulty: 'intermediate',
      estimatedTime: 25,
      author: 'AI Flow Team',
      downloads: 890,
      rating: 4.6,
      reviews: 67,
      featured: true,
      useCase:
        'Generate high-quality content across multiple platforms with consistent brand voice',
      requirements: ['OpenAI API key', 'Social media accounts'],
      benefits: [
        'Generate content 10x faster',
        'Maintain consistent brand voice',
        'Multi-platform distribution',
        'SEO-optimized content',
      ],
      nodes: [
        {
          id: 'trigger-1',
          type: NodeType.MANUAL_TRIGGER,
          position: { x: 100, y: 150 },
          data: {
            label: 'Start Content Creation',
            name: 'Manual Trigger',
            config: {},
          },
          status: 'idle',
        },
        {
          id: 'topic-generator-1',
          type: NodeType.TEXT_GENERATOR,
          position: { x: 350, y: 150 },
          data: {
            label: 'Generate Topic Ideas',
            name: 'Topic Generator',
            config: {
              provider: 'openai',
              model: 'gpt-4',
              temperature: 0.8,
              system_prompt:
                'Generate creative and engaging topic ideas for blog posts and social media content.',
            },
          },
          status: 'idle',
        },
        {
          id: 'blog-writer-1',
          type: NodeType.TEXT_GENERATOR,
          position: { x: 600, y: 100 },
          data: {
            label: 'Write Blog Post',
            name: 'Blog Writer',
            config: {
              provider: 'openai',
              model: 'gpt-4',
              temperature: 0.7,
              system_prompt:
                'Write comprehensive, SEO-optimized blog posts with engaging headlines and clear structure.',
            },
          },
          status: 'idle',
        },
        {
          id: 'social-adapter-1',
          type: NodeType.TEXT_GENERATOR,
          position: { x: 600, y: 200 },
          data: {
            label: 'Adapt for Social Media',
            name: 'Social Media Adapter',
            config: {
              provider: 'openai',
              model: 'gpt-3.5-turbo',
              temperature: 0.6,
              system_prompt:
                'Adapt content for different social media platforms with appropriate hashtags and formatting.',
            },
          },
          status: 'idle',
        },
        {
          id: 'file-output-1',
          type: NodeType.DATA_OUTPUT,
          position: { x: 850, y: 150 },
          data: {
            label: 'Save Content',
            name: 'Content Storage',
            config: {
              format: 'markdown',
              destination: 'content-library',
            },
          },
          status: 'idle',
        },
      ],
      edges: [
        { id: 'e1', source: 'trigger-1', target: 'topic-generator-1' },
        { id: 'e2', source: 'topic-generator-1', target: 'blog-writer-1' },
        { id: 'e3', source: 'topic-generator-1', target: 'social-adapter-1' },
        { id: 'e4', source: 'blog-writer-1', target: 'file-output-1' },
        { id: 'e5', source: 'social-adapter-1', target: 'file-output-1' },
      ],
    });

    // Data Processing & Analysis
    this.addTemplate({
      id: 'data-analysis-pipeline',
      name: 'Smart Data Analysis Pipeline',
      description: 'Automated data processing, analysis, and reporting with AI insights',
      category: 'data_processing',
      tags: ['data', 'analytics', 'ai', 'reporting', 'insights'],
      difficulty: 'advanced',
      estimatedTime: 35,
      author: 'AI Flow Team',
      downloads: 567,
      rating: 4.9,
      reviews: 43,
      featured: false,
      useCase: 'Process large datasets, extract insights, and generate automated reports',
      requirements: ['Database access', 'OpenAI API key', 'File storage'],
      benefits: [
        'Automate data analysis',
        'Generate insights automatically',
        'Create visual reports',
        'Detect patterns and anomalies',
      ],
      nodes: [
        {
          id: 'file-trigger-1',
          type: NodeType.FILE_TRIGGER,
          position: { x: 100, y: 150 },
          data: {
            label: 'New Data File',
            name: 'File Upload Trigger',
            config: {
              file_types: ['csv', 'json', 'xlsx'],
              watch_folder: '/data-uploads',
            },
          },
          status: 'idle',
        },
        {
          id: 'csv-parser-1',
          type: NodeType.CSV_PARSER,
          position: { x: 350, y: 150 },
          data: {
            label: 'Parse Data',
            name: 'CSV Parser',
            config: {
              delimiter: ',',
              headers: true,
              encoding: 'utf-8',
            },
          },
          status: 'idle',
        },
        {
          id: 'data-analyzer-1',
          type: NodeType.DATA_ANALYZER,
          position: { x: 600, y: 150 },
          data: {
            label: 'Analyze Data',
            name: 'AI Data Analyzer',
            config: {
              analysis_type: 'comprehensive',
              include_statistics: true,
              detect_anomalies: true,
            },
          },
          status: 'idle',
        },
        {
          id: 'report-generator-1',
          type: NodeType.TEXT_GENERATOR,
          position: { x: 850, y: 150 },
          data: {
            label: 'Generate Report',
            name: 'Report Generator',
            config: {
              provider: 'openai',
              model: 'gpt-4',
              temperature: 0.3,
              system_prompt:
                'Generate comprehensive data analysis reports with insights, trends, and recommendations.',
            },
          },
          status: 'idle',
        },
      ],
      edges: [
        { id: 'e1', source: 'file-trigger-1', target: 'csv-parser-1' },
        { id: 'e2', source: 'csv-parser-1', target: 'data-analyzer-1' },
        { id: 'e3', source: 'data-analyzer-1', target: 'report-generator-1' },
      ],
    });

    // Marketing Automation
    this.addTemplate({
      id: 'marketing-automation',
      name: 'AI Marketing Automation',
      description: 'Personalized marketing campaigns with AI-driven content and targeting',
      category: 'marketing_automation',
      tags: ['marketing', 'personalization', 'ai', 'campaigns', 'email'],
      difficulty: 'intermediate',
      estimatedTime: 30,
      author: 'AI Flow Team',
      downloads: 723,
      rating: 4.7,
      reviews: 56,
      featured: true,
      useCase:
        'Create personalized marketing campaigns that adapt to customer behavior and preferences',
      requirements: ['Email service', 'Customer database', 'OpenAI API key'],
      benefits: [
        'Increase conversion rates by 40%',
        'Personalize at scale',
        'Automate campaign optimization',
        'Improve customer engagement',
      ],
      nodes: [
        {
          id: 'schedule-trigger-1',
          type: NodeType.SCHEDULE_TRIGGER,
          position: { x: 100, y: 150 },
          data: {
            label: 'Daily Campaign',
            name: 'Daily Schedule',
            config: {
              schedule: '0 9 * * *', // 9 AM daily
              timezone: 'UTC',
            },
          },
          status: 'idle',
        },
        {
          id: 'customer-data-1',
          type: NodeType.DATABASE_CONNECTOR,
          position: { x: 350, y: 150 },
          data: {
            label: 'Get Customer Data',
            name: 'Customer Database',
            config: {
              query: 'SELECT * FROM customers WHERE active = true',
              database_type: 'postgresql',
            },
          },
          status: 'idle',
        },
        {
          id: 'personalize-1',
          type: NodeType.TEXT_GENERATOR,
          position: { x: 600, y: 150 },
          data: {
            label: 'Personalize Content',
            name: 'Content Personalizer',
            config: {
              provider: 'openai',
              model: 'gpt-4',
              temperature: 0.6,
              system_prompt:
                'Create personalized marketing content based on customer data and preferences.',
            },
          },
          status: 'idle',
        },
        {
          id: 'email-sender-1',
          type: NodeType.EMAIL_SENDER,
          position: { x: 850, y: 150 },
          data: {
            label: 'Send Email',
            name: 'Email Campaign',
            config: {
              template: 'marketing-template',
              track_opens: true,
              track_clicks: true,
            },
          },
          status: 'idle',
        },
      ],
      edges: [
        { id: 'e1', source: 'schedule-trigger-1', target: 'customer-data-1' },
        { id: 'e2', source: 'customer-data-1', target: 'personalize-1' },
        { id: 'e3', source: 'personalize-1', target: 'email-sender-1' },
      ],
    });
  }

  private addTemplate(template: WorkflowTemplate): void {
    this.templates.set(template.id, template);
  }

  getAllTemplates(): WorkflowTemplate[] {
    return Array.from(this.templates.values());
  }

  getFeaturedTemplates(): WorkflowTemplate[] {
    return this.getAllTemplates().filter(template => template.featured);
  }

  getTemplatesByCategory(category: string): WorkflowTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category);
  }

  getTemplatesByDifficulty(
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): WorkflowTemplate[] {
    return this.getAllTemplates().filter(template => template.difficulty === difficulty);
  }

  getTemplate(id: string): WorkflowTemplate | undefined {
    return this.templates.get(id);
  }

  searchTemplates(query: string): WorkflowTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTemplates().filter(
      template =>
        template.name.toLowerCase().includes(lowercaseQuery) ||
        template.description.toLowerCase().includes(lowercaseQuery) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
        template.useCase.toLowerCase().includes(lowercaseQuery)
    );
  }

  getPopularTemplates(): WorkflowTemplate[] {
    return this.getAllTemplates()
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 6);
  }

  getTopRatedTemplates(): WorkflowTemplate[] {
    return this.getAllTemplates()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }
}
