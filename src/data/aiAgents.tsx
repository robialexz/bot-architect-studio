import React from 'react';
import {
  Book,
  Code,
  ChartBar,
  FileText,
  Layers,
  Database,
  Settings,
  CloudUpload,
  MessageSquare,
  Search,
  Image,
  Video,
  Music,
  Lock,
  Globe,
  Heart,
  Link,
  Bot,
  Cpu,
  Zap,
  Brush,
  PieChart,
  BarChart,
  Share2,
  Mail,
  Languages,
  Brain,
  Map,
  Send,
  RefreshCw,
  Type, // For Text Input
  CaseUpper, // For Uppercase Text
  Gauge, // For Sentiment Analysis
} from 'lucide-react';

import { AIAgent } from '@/components/AIAgentCard';
import { AgentType } from '@/types/workflow'; // Import AgentType

// Extend AIAgent to include an optional 'type' property
export interface TypedAIAgent extends AIAgent {
  type?: AgentType;
  defaultConfig?: Record<string, unknown>;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

export const allAiAgents: TypedAIAgent[] = [
  // Original Agents
  {
    id: 'agent-1',
    name: 'Marketing AI',
    description: 'Creates marketing strategies, content plans, and ad copy',
    icon: <ChartBar className="w-5 h-5 text-primary" />,
    category: 'Marketing',
    type: 'generic',
  },
  {
    id: 'agent-2',
    name: 'Documentation Bot',
    description: 'Generates clear, comprehensive documentation for your projects',
    icon: <Book className="w-5 h-5 text-primary" />,
    category: 'Documentation',
    type: 'generic',
  },
  {
    id: 'agent-3',
    name: 'Code Assistant',
    description: 'Writes clean, efficient code in multiple programming languages',
    icon: <Code className="w-5 h-5 text-primary" />,
    category: 'Development',
    type: 'generic',
  },
  {
    id: 'agent-4',
    name: 'Data Analyst',
    description: 'Processes and analyzes data to extract valuable insights',
    icon: <Database className="w-5 h-5 text-primary" />,
    category: 'Analysis',
    type: 'generic',
  },
  {
    id: 'agent-5',
    name: 'Content Writer',
    description: 'Creates engaging articles, blog posts and website copy',
    icon: <FileText className="w-5 h-5 text-primary" />,
    category: 'Content',
    type: 'generic',
  },
  {
    id: 'agent-6',
    name: 'Deployment Expert',
    description: 'Manages deployment and infrastructure configuration',
    icon: <CloudUpload className="w-5 h-5 text-primary" />,
    category: 'DevOps',
    type: 'generic',
  },
  {
    id: 'agent-7',
    name: 'UI/UX Designer',
    description: 'Creates beautiful, user-friendly interface designs',
    icon: <Layers className="w-5 h-5 text-primary" />,
    category: 'Design',
    type: 'generic',
  },
  {
    id: 'agent-8',
    name: 'QA Tester',
    description: 'Tests applications and identifies bugs and issues',
    icon: <Settings className="w-5 h-5 text-primary" />,
    category: 'Testing',
    type: 'generic',
  },

  // New Advanced Agents
  {
    id: 'agent-9',
    name: 'Image Generator',
    description: 'Creates stunning images and artwork from text descriptions',
    icon: <Image className="w-5 h-5 text-primary" />,
    category: 'Design',
    type: 'generic',
  },
  {
    id: 'agent-10',
    name: 'SEO Optimizer',
    description: 'Improves content for better search engine rankings and visibility',
    icon: <Search className="w-5 h-5 text-primary" />,
    category: 'Marketing',
    type: 'generic',
  },
  {
    id: 'agent-11',
    name: 'Video Creator',
    description: 'Generates video content from scripts and storyboards',
    icon: <Video className="w-5 h-5 text-primary" />,
    category: 'Content',
    type: 'generic',
  },
  {
    id: 'agent-12',
    name: 'Security Expert',
    description: 'Identifies and resolves security vulnerabilities in your applications',
    icon: <Lock className="w-5 h-5 text-primary" />,
    category: 'Security',
    type: 'generic',
  },
  {
    id: 'agent-13',
    name: 'Translator',
    description: 'Translates content across multiple languages with cultural context',
    icon: <Globe className="w-5 h-5 text-primary" />,
    category: 'Localization',
    type: 'generic',
  },
  {
    id: 'agent-14',
    name: 'Social Media Manager',
    description: 'Creates and schedules engaging social media content',
    icon: <Share2 className="w-5 h-5 text-primary" />,
    category: 'Marketing',
    type: 'generic',
  },
  {
    id: 'agent-15',
    name: 'Email Marketer',
    description: 'Designs effective email marketing campaigns with high conversion rates',
    icon: <Mail className="w-5 h-5 text-primary" />,
    category: 'Marketing',
    type: 'generic',
  },
  {
    id: 'agent-16',
    name: 'API Integrator',
    description: 'Connects different services and applications through API integration',
    icon: <Link className="w-5 h-5 text-primary" />,
    category: 'Development',
    type: 'generic',
  },
  {
    id: 'agent-17',
    name: 'Customer Support Bot',
    description: 'Provides instant customer support and answers to common questions',
    icon: <MessageSquare className="w-5 h-5 text-primary" />,
    category: 'Support',
    type: 'generic',
  },
  {
    id: 'agent-18',
    name: 'Music Composer',
    description: 'Creates original music and sound effects for your projects',
    icon: <Music className="w-5 h-5 text-primary" />,
    category: 'Audio',
    type: 'generic',
  },
  {
    id: 'agent-19',
    name: 'Health Assistant',
    description: 'Provides health advice and wellness recommendations',
    icon: <Heart className="w-5 h-5 text-primary" />,
    category: 'Health',
    type: 'generic',
  },
  {
    id: 'agent-20',
    name: 'AI Trainer',
    description: 'Helps train and fine-tune other AI models for specific tasks',
    icon: <Bot className="w-5 h-5 text-primary" />,
    category: 'AI',
    type: 'generic',
  },
  {
    id: 'agent-21',
    name: 'Hardware Optimizer',
    description: 'Optimizes system performance for AI and ML workloads',
    icon: <Cpu className="w-5 h-5 text-primary" />,
    category: 'Hardware',
    type: 'generic',
  },
  {
    id: 'agent-22',
    name: 'Energy Efficiency Expert',
    description: 'Optimizes energy consumption in computing systems',
    icon: <Zap className="w-5 h-5 text-primary" />,
    category: 'Sustainability',
    type: 'generic',
  },
  {
    id: 'agent-23',
    name: 'Digital Artist',
    description: 'Creates digital art and illustrations for various projects',
    icon: <Brush className="w-5 h-5 text-primary" />,
    category: 'Design',
    type: 'generic',
  },
  {
    id: 'agent-24',
    name: 'Analytics Expert',
    description: 'Provides in-depth analysis of business metrics and KPIs',
    icon: <PieChart className="w-5 h-5 text-primary" />,
    category: 'Analysis',
    type: 'generic',
  },
  // New Agents for actual execution
  {
    id: 'agent-text-input',
    name: 'Text Input',
    description: 'Provides a text value as input for other agents.',
    icon: <Type className="w-5 h-5 text-primary" />,
    category: 'Utility',
    type: 'textInput',
  },
  {
    id: 'agent-uppercase-text',
    name: 'Uppercase Text',
    description: 'Converts incoming text to uppercase. Can add prefix/suffix.',
    icon: <CaseUpper className="w-5 h-5 text-primary" />,
    category: 'Utility',
    type: 'uppercaseText',
  },
  {
    id: 'agent-data-transform',
    name: 'Data Transformation',
    description: 'Transforms input data based on defined logic.',
    icon: <RefreshCw className="w-5 h-5 text-primary" />,
    category: 'Utility',
    type: 'dataTransformation',
  },
  {
    id: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    description: 'Analyzes text input and outputs sentiment score',
    icon: <Gauge className="w-5 h-5 text-primary" />,
    category: 'NLP',
    type: 'sentimentAnalysis',
    inputSchema: { text: 'string' },
    outputSchema: { sentiment: 'string', score: 'number' },
    defaultConfig: { model: 'default' },
  },
];

export const getAgentsByCategory = (category: string) => {
  if (category === 'all') return allAiAgents;
  return allAiAgents.filter(agent => agent.category.toLowerCase() === category.toLowerCase());
};

export const searchAgents = (query: string) => {
  return allAiAgents.filter(
    agent =>
      agent.name.toLowerCase().includes(query.toLowerCase()) ||
      agent.description.toLowerCase().includes(query.toLowerCase()) ||
      agent.category.toLowerCase().includes(query.toLowerCase())
  );
};

export const getFeaturedAgents = (count: number = 4) => {
  // Get a selection of agents across different categories
  const featured = [];
  const categories = [...new Set(allAiAgents.map(agent => agent.category))];

  for (const category of categories) {
    const categoryAgents = allAiAgents.filter(agent => agent.category === category);
    if (categoryAgents.length > 0) {
      featured.push(categoryAgents[0]);
    }
    if (featured.length >= count) break;
  }

  // If we still need more, add random agents
  while (featured.length < count) {
    const randomIndex = Math.floor(Math.random() * allAiAgents.length);
    if (!featured.includes(allAiAgents[randomIndex])) {
      featured.push(allAiAgents[randomIndex]);
    }
  }

  return featured;
};
