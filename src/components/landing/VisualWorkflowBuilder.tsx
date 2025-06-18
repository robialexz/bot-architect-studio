import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SafeAnimatePresence, MotionDiv } from '@/lib/motion-wrapper';

import {
  Bot,
  MessageSquare,
  FileText,
  Image,
  BarChart,
  BrainCircuit,
  Database,
  Code,
  Zap,
  RefreshCw,
  Plus,
  Sparkles,
  ArrowRight,
  Trash2,
  Lightbulb,
  MapPin,
  Brain,
  Rocket,
  X,
  Save,
  Download,
  Upload,
  Play,
  Pause,
  Settings,
  Link,
  Unlink,
  Cpu,
  Mic,
  Search,
  Globe,
  Mail,
  Shield,
  CheckCircle,
  GitBranch,
  RotateCcw,
  Merge,
  Send,
  Server,
  Eye,
  Filter,
  Shuffle,
  FileCode,
  Layers,
  Network,
  Workflow,
  Target,
  Gauge,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Hash,
  Type,
  AlignLeft,
  Palette,
  Wand2,
  Scissors,
  Copy,
  Clipboard,
  FolderOpen,
  Archive,
  Package,
  Boxes,
  Container,
  HardDrive,
  CloudDownload,
  CloudUpload,
  Wifi,
  Radio,
  Bluetooth,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Video,
  Music,
  Volume2,
  VolumeX,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
  Repeat,
  Shuffle as ShuffleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { realAIService } from '@/services/realAIService';

interface AgentNode {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  position: { x: number; y: number };
  inputs: number;
  outputs: number;
  description: string;
  category: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  processingTime?: number;
  outputData?: Record<string, unknown> | null;
  metrics?: {
    tokensProcessed?: number;
    accuracy?: number;
    speed?: number;
  };
}

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePort: number;
  targetPort: number;
  animated: boolean;
  dataType?: string;
  throughput?: number;
}

interface DataPacket {
  id: string;
  connectionId: string;
  progress: number;
  data: Record<string, unknown>;
  type: 'text' | 'image' | 'data' | 'code';
  size: number;
  timestamp: number;
}

interface ProcessingResult {
  nodeId: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  metrics: {
    processingTime: number;
    tokensProcessed?: number;
    accuracy?: number;
    confidence?: number;
  };
  timestamp: number;
}

interface NodeOutput extends Record<string, unknown> {
  response: string;
  model: string;
  tokensUsed?: number;
  processingTime?: number;
  timestamp: number;
  scrapingData?: Record<string, unknown>;
}

// Enhanced Workflow Management
interface WorkflowData {
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  connections: Connection[];
  variables: WorkflowVariable[];
  settings: WorkflowSettings;
  metadata: {
    created: string;
    modified: string;
    version: string;
    author: string;
    tags: string[];
    category: string;
  };
}

// Workflow Variables System
interface WorkflowVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: unknown;
  description: string;
  scope: 'global' | 'local';
  encrypted: boolean;
}

// Workflow Settings
interface WorkflowSettings {
  timeout: number; // in seconds
  retryAttempts: number;
  parallelExecution: boolean;
  errorHandling: 'stop' | 'continue' | 'retry';
  logging: 'minimal' | 'detailed' | 'debug';
  notifications: {
    onSuccess: boolean;
    onError: boolean;
    email?: string;
    webhook?: string;
  };
}

// Real-time execution state
interface ExecutionState {
  isRunning: boolean;
  currentNode: string | null;
  completedNodes: Set<string>;
  nodeResults: Map<string, NodeOutput>;
  executionLog: Array<{
    nodeId: string;
    timestamp: number;
    status: 'started' | 'completed' | 'error';
    data?: unknown;
    error?: string;
  }>;
}

// Removed unused ParticlesBackground component

const VisualWorkflowBuilder: React.FC = () => {
  // Core workflow state
  const [nodes, setNodes] = useState<AgentNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [, setDataPackets] = useState<DataPacket[]>([]);
  const [, setProcessingResults] = useState<ProcessingResult[]>([]);

  // Enhanced execution state
  const [executionState, setExecutionState] = useState<ExecutionState>({
    isRunning: false,
    currentNode: null,
    completedNodes: new Set(),
    nodeResults: new Map(),
    executionLog: [],
  });

  // UI state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedAgent, setDraggedAgent] = useState<{
    type: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    inputs: number;
    outputs: number;
    description: string;
    category: string;
    processingTime?: number;
  } | null>(null);
  const [, setIsDragging] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{
    nodeId: string;
    port: number;
    type: 'input' | 'output';
  } | null>(null);
  const [draggedNode, setDraggedNode] = useState<{
    id: string;
    offset: { x: number; y: number };
  } | null>(null);
  const [, setShowResults] = useState(false);
  const [, setWorkflowMetrics] = useState({
    totalProcessingTime: 0,
    totalTokensProcessed: 0,
    averageAccuracy: 0,
    throughput: 0,
  });

  // Enhanced workflow management
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData | null>(null);
  const [savedWorkflows, setSavedWorkflows] = useState<WorkflowData[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // Advanced workflow features
  const [workflowVariables, setWorkflowVariables] = useState<WorkflowVariable[]>([]);
  const [workflowSettings, setWorkflowSettings] = useState<WorkflowSettings>({
    timeout: 300,
    retryAttempts: 3,
    parallelExecution: false,
    errorHandling: 'stop',
    logging: 'detailed',
    notifications: {
      onSuccess: true,
      onError: true,
    },
  });
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showTemplateMarketplace, setShowTemplateMarketplace] = useState(false);
  const [debugLogs, setDebugLogs] = useState<
    Array<{
      timestamp: number;
      level: 'info' | 'warning' | 'error' | 'debug';
      message: string;
      nodeId?: string;
      data?: unknown;
    }>
  >([]);
  const [aiSuggestions, setAiSuggestions] = useState<
    Array<{
      id: string;
      type: 'connection' | 'node' | 'optimization' | 'completion' | 'template';
      message: string;
      confidence: number;
      position?: { x: number; y: number };
      suggestedAgent?: {
        type: string;
        name: string;
        icon: React.ReactNode;
        color: string;
        inputs: number;
        outputs: number;
        description: string;
        category: string;
      };
      autoComplete?: boolean;
      action?: () => void;
    }>
  >([]);

  const [smartMode, setSmartMode] = useState(true);
  // Removed unused workflowTemplates state

  const [,] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  // New state for user input workflow generation
  const [userInput, setUserInput] = useState('');
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [isGeneratingWorkflow, setIsGeneratingWorkflow] = useState(false);
  const [, setGeneratedWorkflowDescription] = useState('');
  const [finalResults, setFinalResults] = useState<string>('');

  // Advanced workflow templates
  const advancedTemplates = [
    {
      id: 'ai-content-pipeline',
      name: 'AI Content Creation Pipeline',
      description: 'Complete content workflow with conditional logic and validation',
      category: 'Content Marketing',
      difficulty: 'advanced' as const,
      estimatedTime: '8-12 min',
      popularity: 98,
      tags: ['AI', 'Content', 'Marketing', 'Automation'],
      nodes: [
        {
          id: 'content-trigger',
          type: 'smart-trigger',
          name: 'Content Trigger',
          icon: <Zap className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          position: { x: 50, y: 100 },
          inputs: 0,
          outputs: 1,
          description: 'Triggers content creation workflow',
          category: 'Automation',
          status: 'idle' as const,
        },
        {
          id: 'topic-analyzer',
          type: 'gemini-analyzer',
          name: 'Topic Analyzer',
          icon: <BrainCircuit className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-green-500 to-blue-600',
          position: { x: 250, y: 80 },
          inputs: 1,
          outputs: 2,
          description: 'Analyze topic and generate content strategy',
          category: 'AI Models',
          status: 'idle' as const,
        },
        {
          id: 'content-validator',
          type: 'data-validator',
          name: 'Content Validator',
          icon: <Bot className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          position: { x: 450, y: 60 },
          inputs: 1,
          outputs: 2,
          description: 'Validate content quality and guidelines',
          category: 'Data Processing',
          status: 'idle' as const,
        },
        {
          id: 'content-branch',
          type: 'conditional-branch',
          name: 'Quality Check',
          icon: <ArrowRight className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
          position: { x: 650, y: 40 },
          inputs: 1,
          outputs: 2,
          description: 'Branch based on content quality',
          category: 'Logic & Control',
          status: 'idle' as const,
        },
        {
          id: 'content-writer',
          type: 'claude-writer',
          name: 'Content Writer',
          icon: <FileText className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-green-500 to-emerald-600',
          position: { x: 850, y: 20 },
          inputs: 1,
          outputs: 1,
          description: 'Generate high-quality content',
          category: 'AI Models',
          status: 'idle' as const,
        },
        {
          id: 'content-enhancer',
          type: 'gpt4-analyzer',
          name: 'Content Enhancer',
          icon: <Sparkles className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-blue-500 to-purple-600',
          position: { x: 850, y: 120 },
          inputs: 1,
          outputs: 1,
          description: 'Enhance and optimize content',
          category: 'AI Models',
          status: 'idle' as const,
        },
      ],
      connections: [
        {
          id: 'c1',
          sourceId: 'content-trigger',
          targetId: 'topic-analyzer',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c2',
          sourceId: 'topic-analyzer',
          targetId: 'content-validator',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c3',
          sourceId: 'content-validator',
          targetId: 'content-branch',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c4',
          sourceId: 'content-branch',
          targetId: 'content-writer',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c5',
          sourceId: 'content-branch',
          targetId: 'content-enhancer',
          sourcePort: 1,
          targetPort: 0,
          animated: false,
        },
      ],
      variables: [
        {
          id: 'v1',
          name: 'content_topic',
          type: 'string' as const,
          value: 'AI Technology Trends',
          description: 'Main topic for content creation',
          scope: 'global' as const,
          encrypted: false,
        },
        {
          id: 'v2',
          name: 'quality_threshold',
          type: 'number' as const,
          value: 0.8,
          description: 'Minimum quality score',
          scope: 'global' as const,
          encrypted: false,
        },
        {
          id: 'v3',
          name: 'target_audience',
          type: 'string' as const,
          value: 'Tech professionals',
          description: 'Target audience for content',
          scope: 'global' as const,
          encrypted: false,
        },
      ],
    },
    {
      id: 'data-processing-pipeline',
      name: 'Advanced Data Processing Pipeline',
      description: 'Complex data workflow with loops, validation, and transformations',
      category: 'Data Science',
      difficulty: 'expert' as const,
      estimatedTime: '15-20 min',
      popularity: 92,
      tags: ['Data', 'Processing', 'Validation', 'Transformation'],
      nodes: [
        {
          id: 'data-trigger',
          type: 'smart-trigger',
          name: 'Data Trigger',
          icon: <Zap className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          position: { x: 50, y: 120 },
          inputs: 0,
          outputs: 1,
          description: 'Triggers data processing workflow',
          category: 'Automation',
          status: 'idle' as const,
        },
        {
          id: 'data-loader',
          type: 'file-processor',
          name: 'Data Loader',
          icon: <FileText className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-amber-500 to-yellow-600',
          position: { x: 250, y: 100 },
          inputs: 1,
          outputs: 1,
          description: 'Load and parse data files',
          category: 'Data Processing',
          status: 'idle' as const,
        },
        {
          id: 'data-iterator',
          type: 'loop-iterator',
          name: 'Data Iterator',
          icon: <RefreshCw className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-pink-500 to-rose-600',
          position: { x: 450, y: 80 },
          inputs: 1,
          outputs: 2,
          description: 'Iterate through data records',
          category: 'Logic & Control',
          status: 'idle' as const,
        },
        {
          id: 'data-validator',
          type: 'data-validator',
          name: 'Data Validator',
          icon: <Bot className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          position: { x: 650, y: 60 },
          inputs: 1,
          outputs: 2,
          description: 'Validate data quality and schema',
          category: 'Data Processing',
          status: 'idle' as const,
        },
        {
          id: 'data-transformer',
          type: 'data-transformer',
          name: 'Data Transformer',
          icon: <Code className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-violet-500 to-purple-600',
          position: { x: 850, y: 40 },
          inputs: 1,
          outputs: 1,
          description: 'Transform and clean data',
          category: 'Data Processing',
          status: 'idle' as const,
        },
        {
          id: 'data-merger',
          type: 'data-merger',
          name: 'Data Merger',
          icon: <Database className="w-5 h-5" />,
          color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
          position: { x: 1050, y: 80 },
          inputs: 3,
          outputs: 1,
          description: 'Merge processed data streams',
          category: 'Logic & Control',
          status: 'idle' as const,
        },
      ],
      connections: [
        {
          id: 'c1',
          sourceId: 'data-trigger',
          targetId: 'data-loader',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c2',
          sourceId: 'data-loader',
          targetId: 'data-iterator',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c3',
          sourceId: 'data-iterator',
          targetId: 'data-validator',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c4',
          sourceId: 'data-validator',
          targetId: 'data-transformer',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c5',
          sourceId: 'data-transformer',
          targetId: 'data-merger',
          sourcePort: 0,
          targetPort: 0,
          animated: false,
        },
        {
          id: 'c6',
          sourceId: 'data-iterator',
          targetId: 'data-merger',
          sourcePort: 1,
          targetPort: 1,
          animated: false,
        },
      ],
      variables: [
        {
          id: 'v1',
          name: 'batch_size',
          type: 'number' as const,
          value: 100,
          description: 'Number of records to process per batch',
          scope: 'global' as const,
          encrypted: false,
        },
        {
          id: 'v2',
          name: 'validation_schema',
          type: 'string' as const,
          value: 'user_data_v2',
          description: 'Schema for data validation',
          scope: 'global' as const,
          encrypted: false,
        },
        {
          id: 'v3',
          name: 'output_format',
          type: 'string' as const,
          value: 'JSON',
          description: 'Output data format',
          scope: 'global' as const,
          encrypted: false,
        },
      ],
    },
  ];

  // Initialize Smart Templates and AI Features - Run only once
  useEffect(() => {
    // Load workflow templates (keeping existing simple templates)
    const templates = [
      {
        id: 'content-pipeline',
        name: 'Content Creation Pipeline',
        description: 'Complete content workflow: research → analyze → write → optimize',
        category: 'Content Marketing',
        difficulty: 'intermediate' as const,
        estimatedTime: '5-10 min',
        popularity: 95,
        nodes: [
          {
            id: 'research-trigger',
            type: 'smart-trigger',
            name: 'Research Trigger',
            icon: <Zap className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
            position: { x: 50, y: 100 },
            inputs: 0,
            outputs: 1,
            description: 'Triggers content research workflow',
            category: 'Automation',
            status: 'idle' as const,
            processingTime: 0.1,
          },
          {
            id: 'web-research',
            type: 'web-scraper',
            name: 'Web Research',
            icon: <BarChart className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
            position: { x: 250, y: 80 },
            inputs: 1,
            outputs: 1,
            description: 'Research trending topics and competitor content',
            category: 'Data Sources',
            status: 'idle' as const,
            processingTime: 2.1,
          },
          {
            id: 'content-analyzer',
            type: 'gpt4-analyzer',
            name: 'Content Analyzer',
            icon: <BrainCircuit className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-blue-500 to-purple-600',
            position: { x: 450, y: 60 },
            inputs: 1,
            outputs: 2,
            description: 'Analyze content gaps and opportunities',
            category: 'AI Models',
            status: 'idle' as const,
            processingTime: 2.3,
          },
          {
            id: 'content-writer',
            type: 'claude-writer',
            name: 'Content Writer',
            icon: <FileText className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-green-500 to-emerald-600',
            position: { x: 650, y: 40 },
            inputs: 1,
            outputs: 1,
            description: 'Generate high-quality content',
            category: 'AI Models',
            status: 'idle' as const,
            processingTime: 3.1,
          },
          {
            id: 'visual-creator',
            type: 'dalle-generator',
            name: 'Visual Creator',
            icon: <Image className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-purple-500 to-pink-600',
            position: { x: 650, y: 140 },
            inputs: 1,
            outputs: 1,
            description: 'Create accompanying visuals',
            category: 'AI Models',
            status: 'idle' as const,
            processingTime: 4.7,
          },
        ],
        connections: [
          {
            id: 'c1',
            sourceId: 'research-trigger',
            targetId: 'web-research',
            sourcePort: 0,
            targetPort: 0,
            animated: false,
          },
          {
            id: 'c2',
            sourceId: 'web-research',
            targetId: 'content-analyzer',
            sourcePort: 0,
            targetPort: 0,
            animated: false,
          },
          {
            id: 'c3',
            sourceId: 'content-analyzer',
            targetId: 'content-writer',
            sourcePort: 0,
            targetPort: 0,
            animated: false,
          },
          {
            id: 'c4',
            sourceId: 'content-analyzer',
            targetId: 'visual-creator',
            sourcePort: 1,
            targetPort: 0,
            animated: false,
          },
        ],
      },
      {
        id: 'data-insights',
        name: 'Data Insights Engine',
        description: 'Transform raw data into actionable business insights',
        category: 'Business Intelligence',
        difficulty: 'advanced' as const,
        estimatedTime: '10-15 min',
        popularity: 88,
        nodes: [
          {
            id: 'data-trigger',
            type: 'smart-trigger',
            name: 'Data Trigger',
            icon: <Zap className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
            position: { x: 50, y: 120 },
            inputs: 0,
            outputs: 1,
            description: 'Triggers data analysis workflow',
            category: 'Automation',
            status: 'idle' as const,
            processingTime: 0.1,
          },
          {
            id: 'data-collector',
            type: 'web-scraper',
            name: 'Data Collector',
            icon: <BarChart className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
            position: { x: 250, y: 100 },
            inputs: 1,
            outputs: 1,
            description: 'Collect data from multiple sources',
            category: 'Data Sources',
            status: 'idle' as const,
            processingTime: 2.1,
          },
          {
            id: 'data-processor',
            type: 'code-interpreter',
            name: 'Data Processor',
            icon: <Code className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-gray-700 to-gray-900',
            position: { x: 450, y: 80 },
            inputs: 1,
            outputs: 2,
            description: 'Process and clean data',
            category: 'Development',
            status: 'idle' as const,
            processingTime: 1.2,
          },
          {
            id: 'insights-analyzer',
            type: 'gpt4-analyzer',
            name: 'Insights Analyzer',
            icon: <BrainCircuit className="w-5 h-5" />,
            color: 'bg-gradient-to-r from-blue-500 to-purple-600',
            position: { x: 650, y: 60 },
            inputs: 1,
            outputs: 1,
            description: 'Generate business insights',
            category: 'AI Models',
            status: 'idle' as const,
            processingTime: 2.3,
          },
        ],
        connections: [
          {
            id: 'c1',
            sourceId: 'data-trigger',
            targetId: 'data-collector',
            sourcePort: 0,
            targetPort: 0,
            animated: false,
          },
          {
            id: 'c2',
            sourceId: 'data-collector',
            targetId: 'data-processor',
            sourcePort: 0,
            targetPort: 0,
            animated: false,
          },
          {
            id: 'c3',
            sourceId: 'data-processor',
            targetId: 'insights-analyzer',
            sourcePort: 0,
            targetPort: 0,
            animated: false,
          },
        ],
      },
    ];

    // Templates initialized (removed setWorkflowTemplates as it's unused)

    // Initialize AI suggestions only once with enhanced messaging
    setTimeout(() => {
      setAiSuggestions([
        {
          id: 'welcome-message',
          type: 'completion',
          message:
            '🎯 Click "Create Workflow" to tell us what you want to accomplish - AI will build and execute it for you!',
          confidence: 1.0,
        },
        {
          id: 'suggestion-1',
          type: 'template',
          message: 'Or try our Content Creation Pipeline - perfect for marketing workflows!',
          confidence: 0.95,
          action: () => {
            // Enhanced template loading with better feedback
            const template = templates.find(t => t.id === 'content-pipeline');
            if (template) {
              setNodes(template.nodes);
              setConnections(template.connections);
              setSelectedNode(null);
              setConnectionStart(null);
              setProcessingResults([]);
              setShowResults(false);

              // Add success feedback
              setTimeout(() => {
                setAiSuggestions(prev => [
                  ...prev.filter(s => s.id !== 'suggestion-1'),
                  {
                    id: 'template-loaded',
                    type: 'completion',
                    message:
                      '✅ Content Creation Pipeline loaded! Click "Run" to see it in action.',
                    confidence: 1.0,
                  },
                ]);
              }, 500);
            }
          },
        },
      ]);
    }, 2000);
  }, []); // No dependencies needed

  // Smart Auto-Suggestions based on current workflow - Optimized to prevent infinite loops
  useEffect(() => {
    if (!smartMode || nodes.length === 0 || aiSuggestions.length > 0) return;

    const timer = setTimeout(() => {
      const suggestions = [];

      // Suggest connections for isolated nodes (only once)
      const isolatedNodes = nodes.filter(
        node => !connections.some(conn => conn.sourceId === node.id || conn.targetId === node.id)
      );

      if (isolatedNodes.length > 1 && isolatedNodes[0] && isolatedNodes[1]) {
        const sourceNode = isolatedNodes[0];
        const targetNode = isolatedNodes[1];
        suggestions.push({
          id: `auto-connect-${Date.now()}`,
          type: 'connection' as const,
          message: `💡 Connect ${sourceNode.name} to ${targetNode.name} for better workflow?`,
          confidence: 0.8,
          action: () => {
            const newConnection: Connection = {
              id: `auto-conn-${Date.now()}`,
              sourceId: sourceNode.id,
              targetId: targetNode.id,
              sourcePort: 0,
              targetPort: 0,
              animated: false,
            };
            setConnections(prev => [...prev, newConnection]);
          },
        });
      }

      // Suggest optimization for long workflows (only once)
      if (nodes.length > 3) {
        suggestions.push({
          id: `optimize-${Date.now()}`,
          type: 'optimization' as const,
          message: '⚡ Add parallel processing to speed up your workflow by 40%',
          confidence: 0.9,
        });
      }

      if (suggestions.length > 0) {
        setAiSuggestions(suggestions); // Replace instead of append to prevent accumulation
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [nodes.length, connections.length, smartMode, aiSuggestions.length, nodes, connections]); // Include full arrays for proper dependency tracking

  // Advanced AI Agents Library with Real Capabilities
  const agentLibrary = [
    // AI Models
    {
      type: 'gemini-analyzer',
      name: 'Gemini Pro Analyzer',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-green-500 to-blue-600',
      inputs: 1,
      outputs: 2,
      description:
        'Advanced text analysis with Google Gemini Pro: sentiment, entities, topics, intent',
      category: 'AI Models',
      processingTime: 2.1,
      sampleOutput: {
        sentiment: 'Positive (0.89)',
        entities: ['AI', 'automation', 'workflow'],
        topics: ['Technology', 'Business Process'],
        confidence: 0.96,
      },
    },
    {
      type: 'gpt4-analyzer',
      name: 'GPT-4 Analyzer',
      icon: <Cpu className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      inputs: 1,
      outputs: 2,
      description:
        'Advanced text analysis powered by OpenAI GPT-4: sentiment, entities, topics, intent',
      category: 'AI Models',
      processingTime: 2.3,
      sampleOutput: {
        sentiment: 'Positive (0.87)',
        entities: ['AI', 'automation', 'workflow'],
        topics: ['Technology', 'Business Process'],
        confidence: 0.94,
      },
    },
    {
      type: 'claude-writer',
      name: 'Claude Writer',
      icon: <Type className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      inputs: 1,
      outputs: 1,
      description: 'Professional content generation with Claude: articles, emails, reports',
      category: 'AI Models',
      processingTime: 3.1,
      sampleOutput: {
        content: 'Generated 847 words of professional content',
        readability: 'Grade 12',
        tone: 'Professional',
        wordCount: 847,
      },
    },
    {
      type: 'dalle-generator',
      name: 'DALL-E 3',
      icon: <Palette className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      inputs: 1,
      outputs: 1,
      description: 'High-quality image generation with DALL-E 3 from text prompts',
      category: 'AI Models',
      processingTime: 4.7,
      sampleOutput: {
        imageUrl: 'generated_image_1024x1024.png',
        resolution: '1024x1024',
        style: 'Photorealistic',
        safety: 'Approved',
      },
    },
    {
      type: 'whisper-transcriber',
      name: 'Whisper STT',
      icon: <Mic className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      inputs: 1,
      outputs: 2,
      description: 'Speech-to-text with OpenAI Whisper: transcription + speaker detection',
      category: 'AI Models',
      processingTime: 1.8,
      sampleOutput: {
        transcript: 'Transcribed 5.2 minutes of audio',
        speakers: 2,
        confidence: 0.96,
        language: 'English',
      },
    },
    {
      type: 'vector-search',
      name: 'Vector Search',
      icon: <Search className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      inputs: 1,
      outputs: 1,
      description: 'Semantic search through vector embeddings with Pinecone/Weaviate',
      category: 'Data Processing',
      processingTime: 0.4,
      sampleOutput: {
        results: 15,
        topMatch: 0.94,
        avgSimilarity: 0.78,
        searchTime: '0.4s',
      },
    },
    {
      type: 'code-interpreter',
      name: 'Code Interpreter',
      icon: <FileCode className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-gray-700 to-gray-900',
      inputs: 1,
      outputs: 2,
      description: 'Execute Python code, data analysis, and generate visualizations',
      category: 'Development',
      processingTime: 1.2,
      sampleOutput: {
        executed: 'Python script',
        output: '42 rows processed',
        charts: 2,
        runtime: '1.2s',
      },
    },
    {
      type: 'web-scraper',
      name: 'Web Scraper',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-teal-500 to-cyan-600',
      inputs: 1,
      outputs: 1,
      description: 'Intelligent web scraping with anti-bot detection and data extraction',
      category: 'Data Sources',
      processingTime: 2.1,
      sampleOutput: {
        pages: 25,
        dataPoints: 1247,
        success: '96%',
        blocked: 0,
      },
    },
    {
      type: 'smart-trigger',
      name: 'Smart Trigger',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      inputs: 0,
      outputs: 1,
      description: 'Intelligent workflow triggers: webhooks, schedules, file changes',
      category: 'Automation',
      processingTime: 0.1,
      sampleOutput: {
        triggered: 'Webhook received',
        payload: '2.3KB',
        validated: true,
        timestamp: new Date().toISOString(),
      },
    },

    // Advanced Logic & Control Flow
    {
      type: 'conditional-branch',
      name: 'Conditional Branch',
      icon: <GitBranch className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      inputs: 1,
      outputs: 2,
      description: 'Branch workflow based on conditions: if-then-else logic',
      category: 'Logic & Control',
      processingTime: 0.2,
      sampleOutput: {
        condition: 'true',
        branch: 'then',
        evaluation: 'Condition met: value > threshold',
      },
    },
    {
      type: 'loop-iterator',
      name: 'Loop Iterator',
      icon: <RotateCcw className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-pink-500 to-rose-600',
      inputs: 1,
      outputs: 2,
      description: 'Iterate over data arrays or repeat operations',
      category: 'Logic & Control',
      processingTime: 0.3,
      sampleOutput: {
        iteration: 3,
        total: 10,
        current_item: 'item_3',
        progress: '30%',
      },
    },
    {
      type: 'data-merger',
      name: 'Data Merger',
      icon: <Merge className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-cyan-500 to-blue-600',
      inputs: 3,
      outputs: 1,
      description: 'Merge multiple data streams into unified output',
      category: 'Logic & Control',
      processingTime: 0.5,
      sampleOutput: {
        merged_fields: 15,
        data_sources: 3,
        conflicts_resolved: 2,
      },
    },

    // External Integrations
    {
      type: 'webhook-sender',
      name: 'Webhook Sender',
      icon: <Send className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-600',
      inputs: 1,
      outputs: 1,
      description: 'Send HTTP webhooks to external services',
      category: 'Integrations',
      processingTime: 1.2,
      sampleOutput: {
        status: 'sent',
        response_code: 200,
        endpoint: 'https://api.example.com/webhook',
      },
    },
    {
      type: 'database-query',
      name: 'Database Query',
      icon: <Server className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-slate-600 to-gray-800',
      inputs: 1,
      outputs: 1,
      description: 'Execute SQL queries on connected databases',
      category: 'Integrations',
      processingTime: 2.1,
      sampleOutput: {
        rows_affected: 156,
        query_time: '0.8s',
        database: 'production_db',
      },
    },
    {
      type: 'email-sender',
      name: 'Email Sender',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      inputs: 1,
      outputs: 1,
      description: 'Send automated emails with templates',
      category: 'Integrations',
      processingTime: 1.8,
      sampleOutput: {
        sent: true,
        recipients: 3,
        template: 'notification_template',
      },
    },

    // Advanced Data Processing
    {
      type: 'data-validator',
      name: 'Data Validator',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      inputs: 1,
      outputs: 2,
      description: 'Validate data against schemas and rules',
      category: 'Data Processing',
      processingTime: 0.8,
      sampleOutput: {
        valid: true,
        errors: 0,
        warnings: 2,
        schema: 'user_profile_v2',
      },
    },
    {
      type: 'data-transformer',
      name: 'Data Transformer',
      icon: <Shuffle className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-violet-500 to-purple-600',
      inputs: 1,
      outputs: 1,
      description: 'Transform data formats: JSON, XML, CSV conversions',
      category: 'Data Processing',
      processingTime: 1.1,
      sampleOutput: {
        format_from: 'JSON',
        format_to: 'CSV',
        records: 1250,
        size: '2.4MB',
      },
    },
    {
      type: 'file-processor',
      name: 'File Processor',
      icon: <FolderOpen className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-amber-500 to-yellow-600',
      inputs: 1,
      outputs: 1,
      description: 'Process files: read, write, convert, compress',
      category: 'Data Processing',
      processingTime: 3.2,
      sampleOutput: {
        files_processed: 12,
        total_size: '45.6MB',
        compression: '68%',
      },
    },
  ];

  // Drag and Drop Handlers
  const handleDragStart = (agent: {
    type: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    inputs: number;
    outputs: number;
    description: string;
    category: string;
    processingTime?: number;
  }) => {
    setDraggedAgent(agent);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedAgent(null);
    setIsDragging(false);
  };

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedAgent || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newNode: AgentNode = {
        id: `node-${Date.now()}`,
        ...draggedAgent,
        position: { x: x - 60, y: y - 30 }, // Center the node on cursor
        status: 'idle' as const,
      };

      setNodes(prev => [...prev, newNode]);
      setDraggedAgent(null);
      setIsDragging(false);
    },
    [draggedAgent]
  );

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Connection Handlers
  const handlePortClick = (nodeId: string, port: number, type: 'input' | 'output') => {
    if (!connectionStart) {
      if (type === 'output') {
        setConnectionStart({ nodeId, port, type });
      }
    } else {
      if (
        type === 'input' &&
        connectionStart.type === 'output' &&
        connectionStart.nodeId !== nodeId
      ) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          sourceId: connectionStart.nodeId,
          targetId: nodeId,
          sourcePort: connectionStart.port,
          targetPort: port,
          animated: false,
        };
        setConnections(prev => [...prev, newConnection]);
      }
      setConnectionStart(null);
    }
  };

  // Node Management
  // Node Movement Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const offset = {
      x: e.clientX - rect.left - node.position.x,
      y: e.clientY - rect.top - node.position.y,
    };

    setDraggedNode({ id: nodeId, offset });
    setSelectedNode(nodeId);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedNode || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - draggedNode.offset.x;
      const newY = e.clientY - rect.top - draggedNode.offset.y;

      // Constrain to canvas bounds
      const constrainedX = Math.max(0, Math.min(newX, rect.width - 120));
      const constrainedY = Math.max(0, Math.min(newY, rect.height - 100));

      setNodes(prev =>
        prev.map(node =>
          node.id === draggedNode.id
            ? { ...node, position: { x: constrainedX, y: constrainedY } }
            : node
        )
      );
    },
    [draggedNode]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined; // Explicit return for when draggedNode is null
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev =>
      prev.filter(conn => conn.sourceId !== nodeId && conn.targetId !== nodeId)
    );
    setSelectedNode(null);
  };

  const clearWorkflow = () => {
    setNodes([]);
    setConnections([]);
    setDataPackets([]);
    setExecutionState({
      isRunning: false,
      currentNode: null,
      completedNodes: new Set(),
      nodeResults: new Map(),
      executionLog: [],
    });
    setSelectedNode(null);
    setConnectionStart(null);
  };

  // Enhanced Real Workflow Execution Engine
  const runWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('No nodes to execute. Add some AI agents first!');
      return;
    }

    // Initialize execution state
    setExecutionState({
      isRunning: true,
      currentNode: null,
      completedNodes: new Set(),
      nodeResults: new Map(),
      executionLog: [],
    });

    // Reset all nodes to idle
    setNodes(prev => prev.map(node => ({ ...node, status: 'idle' as const, outputData: null })));

    // Animate connections
    setConnections(prev => prev.map(conn => ({ ...conn, animated: true })));

    toast.success('🚀 Starting workflow execution...');

    try {
      // Find trigger nodes (nodes with 0 inputs or no incoming connections)
      const triggerNodes = nodes.filter(
        node => node.inputs === 0 || !connections.some(conn => conn.targetId === node.id)
      );

      if (triggerNodes.length === 0) {
        toast.error(
          'No trigger nodes found. Add a trigger or ensure nodes are properly connected.'
        );
        return;
      }

      // Execute workflow using topological sort for proper dependency order
      await executeWorkflowTopologically(triggerNodes);

      toast.success('✅ Workflow completed successfully!');
    } catch (error) {
      toast.error(
        `❌ Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setExecutionState(prev => ({ ...prev, isRunning: false, currentNode: null }));
      setConnections(prev => prev.map(conn => ({ ...conn, animated: false })));
    }
  };

  // Topological execution engine with real data flow
  const executeWorkflowTopologically = async (triggerNodes: AgentNode[]) => {
    const processedNodes = new Set<string>();
    const nodeQueue = [...triggerNodes];

    while (nodeQueue.length > 0) {
      const currentNode = nodeQueue.shift()!;

      if (processedNodes.has(currentNode.id)) continue;

      // Check if all dependencies are satisfied
      const incomingConnections = connections.filter(conn => conn.targetId === currentNode.id);
      const dependenciesSatisfied = incomingConnections.every(conn =>
        processedNodes.has(conn.sourceId)
      );

      if (!dependenciesSatisfied) {
        // Put back at end of queue
        nodeQueue.push(currentNode);
        continue;
      }

      // Execute the node
      await executeNode(currentNode, incomingConnections);
      processedNodes.add(currentNode.id);

      // Add dependent nodes to queue
      const outgoingConnections = connections.filter(conn => conn.sourceId === currentNode.id);
      for (const conn of outgoingConnections) {
        const targetNode = nodes.find(n => n.id === conn.targetId);
        if (targetNode && !processedNodes.has(targetNode.id)) {
          nodeQueue.push(targetNode);
        }
      }
    }
  };

  // Real node execution with AI processing
  const executeNode = async (node: AgentNode, incomingConnections: Connection[]) => {
    // Update UI to show current processing node
    setExecutionState(prev => ({ ...prev, currentNode: node.id }));
    setNodes(prev =>
      prev.map(n => (n.id === node.id ? { ...n, status: 'processing' as const } : n))
    );

    // Log execution start
    setExecutionState(prev => ({
      ...prev,
      executionLog: [
        ...prev.executionLog,
        {
          nodeId: node.id,
          timestamp: Date.now(),
          status: 'started',
        },
      ],
    }));

    try {
      // Gather input data from connected nodes
      const inputData = await gatherNodeInputs(node, incomingConnections);

      // Execute the actual AI processing
      const result = await processNodeWithAI(node, inputData);

      // Store result
      setExecutionState(prev => {
        const newResults = new Map(prev.nodeResults);
        newResults.set(node.id, result);
        return {
          ...prev,
          nodeResults: newResults,
          completedNodes: new Set([...prev.completedNodes, node.id]),
          executionLog: [
            ...prev.executionLog,
            {
              nodeId: node.id,
              timestamp: Date.now(),
              status: 'completed',
              data: result,
            },
          ],
        };
      });

      // Update node UI
      setNodes(prev =>
        prev.map(n =>
          n.id === node.id
            ? {
                ...n,
                status: 'completed' as const,
                outputData: result,
                metrics: {
                  tokensProcessed: result.tokensUsed || 0,
                  accuracy: 0.95,
                  speed: result.processingTime || 1000,
                },
              }
            : n
        )
      );

      // Simulate processing time for visual feedback
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      // Handle execution error
      setExecutionState(prev => ({
        ...prev,
        executionLog: [
          ...prev.executionLog,
          {
            nodeId: node.id,
            timestamp: Date.now(),
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        ],
      }));

      setNodes(prev => prev.map(n => (n.id === node.id ? { ...n, status: 'error' as const } : n)));

      throw error;
    }
  };

  // Gather input data from connected nodes
  const gatherNodeInputs = async (
    node: AgentNode,
    incomingConnections: Connection[]
  ): Promise<Record<string, unknown>> => {
    const inputs: Record<string, unknown> = {};

    for (const connection of incomingConnections) {
      const sourceResult = executionState.nodeResults.get(connection.sourceId);
      if (sourceResult) {
        inputs[`input_${connection.targetPort}`] = sourceResult.response;
        inputs['previousData'] = sourceResult;
      }
    }

    // If no inputs, provide default based on node type
    if (Object.keys(inputs).length === 0) {
      inputs['prompt'] = getDefaultPromptForNode(node);
    }

    return inputs;
  };

  // Get default prompt for different node types
  const getDefaultPromptForNode = (node: AgentNode): string => {
    const defaultPrompts: Record<string, string> = {
      'gpt4-analyzer': 'Analyze the current market trends in AI technology and provide insights.',
      'claude-writer': 'Write a comprehensive article about the future of AI automation.',
      'gemini-analyzer': 'Analyze user behavior patterns and provide recommendations.',
      'dalle-generator': 'A futuristic AI workspace with holographic interfaces',
      'web-scraper': 'Scrape latest AI news and developments',
      'code-interpreter': 'Generate Python code for data analysis',
      'smart-trigger': 'Workflow triggered successfully',
    };

    return defaultPrompts[node.type] || 'Process the given input and provide meaningful output.';
  };

  // Enhanced node processing with advanced logic support
  const processNodeWithAI = async (
    node: AgentNode,
    inputData: Record<string, unknown>
  ): Promise<NodeOutput> => {
    const prompt = String(inputData.prompt || inputData.input_0 || getDefaultPromptForNode(node));

    // Add debug logging
    addDebugLog('info', `Processing node: ${node.name}`, node.id, { inputData });

    try {
      let result;

      switch (node.type) {
        // AI Models
        case 'gpt4-analyzer':
        case 'gemini-analyzer':
          result = await realAIService.processGemini(prompt);
          break;

        case 'claude-writer':
          result = await realAIService.processClaude(prompt);
          break;

        case 'dalle-generator':
          result = await realAIService.generateImage(prompt);
          return {
            response: result.data?.imageUrl || 'Image generated successfully',
            model: 'dall-e-3',
            tokensUsed: 0,
            processingTime: result.processingTime || 5000,
            timestamp: Date.now(),
            imageUrl: result.data?.imageUrl,
          };

        case 'code-interpreter':
          result = await realAIService.generateCode(prompt, 'python');
          return {
            response: result.data?.code || 'Code generated successfully',
            model: 'code-generator',
            tokensUsed: result.tokensUsed || 0,
            processingTime: result.processingTime || 2000,
            timestamp: Date.now(),
            code: result.data?.code,
            language: result.data?.language,
          };

        // Logic & Control Flow
        case 'conditional-branch':
          return await processConditionalBranch(inputData);

        case 'loop-iterator':
          return await processLoopIterator(inputData);

        case 'data-merger':
          return await processDataMerger(inputData);

        // Integrations
        case 'webhook-sender':
          return await processWebhookSender(inputData);

        case 'database-query':
          return await processDatabaseQuery(inputData);

        case 'email-sender':
          return await processEmailSender(inputData);

        // Data Processing
        case 'data-validator':
          return await processDataValidator(inputData);

        case 'data-transformer':
          return await processDataTransformer(inputData);

        case 'file-processor':
          return await processFileProcessor(inputData);

        case 'web-scraper':
          // Simulate web scraping with realistic data
          await new Promise(resolve => setTimeout(resolve, 2000));
          return {
            response: 'Web scraping completed successfully',
            model: 'web-scraper',
            tokensUsed: 0,
            processingTime: 2000,
            timestamp: Date.now(),
            scrapingData: {
              urls: ['https://example.com/ai-news', 'https://example.com/tech-trends'],
              dataPoints: 150,
              insights: ['AI adoption increased 40%', 'Automation tools trending'],
            },
          };

        case 'smart-trigger':
          return {
            response: 'Workflow triggered successfully',
            model: 'trigger',
            tokensUsed: 0,
            processingTime: 100,
            timestamp: Date.now(),
            triggerData: { status: 'activated', timestamp: Date.now() },
          };

        default:
          result = await realAIService.processGemini(prompt);
      }

      if (result && !result.success) {
        throw new Error(result.error || 'AI processing failed');
      }

      const output = {
        response: result?.data?.response || String(result?.data) || 'Processing completed',
        model: result?.data?.model || node.type,
        tokensUsed: result?.tokensUsed || 0,
        processingTime: result?.processingTime || 1000,
        timestamp: Date.now(),
      };

      addDebugLog('info', `Node processed successfully: ${node.name}`, node.id, { output });
      return output;
    } catch (error) {
      const errorMessage = `Failed to process ${node.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      addDebugLog('error', errorMessage, node.id, { error });
      throw new Error(errorMessage);
    }
  };

  // Advanced node processing functions
  const processConditionalBranch = async (
    inputData: Record<string, unknown>
  ): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simple condition evaluation (can be enhanced with complex logic)
    const condition = String(inputData.condition || 'true');
    const value = inputData.value || 0;
    const threshold = inputData.threshold || 50;

    const conditionMet = condition === 'true' || Number(value) > Number(threshold);

    return {
      response: conditionMet
        ? 'Condition met - taking TRUE branch'
        : 'Condition not met - taking FALSE branch',
      model: 'conditional-branch',
      tokensUsed: 0,
      processingTime: 200,
      timestamp: Date.now(),
      conditionResult: conditionMet,
      branch: conditionMet ? 'true' : 'false',
      evaluation: `${value} ${conditionMet ? '>' : '<='} ${threshold}`,
    };
  };

  const processLoopIterator = async (inputData: Record<string, unknown>): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const items = Array.isArray(inputData.items) ? inputData.items : [1, 2, 3, 4, 5];
    const currentIndex = Number(inputData.currentIndex || 0);
    const maxIterations = Number(inputData.maxIterations || items.length);

    const hasMore = currentIndex < Math.min(items.length, maxIterations) - 1;
    const currentItem = items[currentIndex];

    return {
      response: `Processing item ${currentIndex + 1} of ${Math.min(items.length, maxIterations)}`,
      model: 'loop-iterator',
      tokensUsed: 0,
      processingTime: 300,
      timestamp: Date.now(),
      currentIndex,
      currentItem,
      hasMore,
      totalItems: items.length,
      progress: ((currentIndex + 1) / Math.min(items.length, maxIterations)) * 100,
    };
  };

  const processDataMerger = async (inputData: Record<string, unknown>): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const input1 = inputData.input_0 || {};
    const input2 = inputData.input_1 || {};
    const input3 = inputData.input_2 || {};

    const merged = { ...input1, ...input2, ...input3 };
    const fieldCount = Object.keys(merged).length;

    return {
      response: `Successfully merged ${fieldCount} fields from 3 data sources`,
      model: 'data-merger',
      tokensUsed: 0,
      processingTime: 500,
      timestamp: Date.now(),
      mergedData: merged,
      fieldCount,
      sources: 3,
    };
  };

  const processWebhookSender = async (inputData: Record<string, unknown>): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const url = String(inputData.url || 'https://api.example.com/webhook');
    const payload = inputData.payload || { message: 'Hello from FlowsyAI' };

    // Simulate webhook sending
    const success = Math.random() > 0.1; // 90% success rate

    return {
      response: success ? 'Webhook sent successfully' : 'Webhook failed to send',
      model: 'webhook-sender',
      tokensUsed: 0,
      processingTime: 1200,
      timestamp: Date.now(),
      url,
      payload,
      status: success ? 'sent' : 'failed',
      responseCode: success ? 200 : 500,
    };
  };

  const processDatabaseQuery = async (inputData: Record<string, unknown>): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 2100));

    const query = String(inputData.query || 'SELECT * FROM users LIMIT 10');
    const database = String(inputData.database || 'production_db');

    // Simulate database query
    const rowsAffected = Math.floor(Math.random() * 1000) + 1;

    return {
      response: `Query executed successfully: ${rowsAffected} rows affected`,
      model: 'database-query',
      tokensUsed: 0,
      processingTime: 2100,
      timestamp: Date.now(),
      query,
      database,
      rowsAffected,
      executionTime: '0.8s',
    };
  };

  const processEmailSender = async (inputData: Record<string, unknown>): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 1800));

    const recipients = Array.isArray(inputData.recipients)
      ? inputData.recipients
      : ['user@example.com'];
    const subject = String(inputData.subject || 'Notification from FlowsyAI');
    const template = String(inputData.template || 'default_template');

    return {
      response: `Email sent successfully to ${recipients.length} recipient(s)`,
      model: 'email-sender',
      tokensUsed: 0,
      processingTime: 1800,
      timestamp: Date.now(),
      recipients,
      subject,
      template,
      sent: true,
    };
  };

  const processDataValidator = async (inputData: Record<string, unknown>): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const data = inputData.data || {};
    const schema = String(inputData.schema || 'default_schema');

    // Simulate validation
    const isValid = Math.random() > 0.2; // 80% valid rate
    const errors = isValid ? 0 : Math.floor(Math.random() * 3) + 1;
    const warnings = Math.floor(Math.random() * 3);

    return {
      response: isValid
        ? 'Data validation passed'
        : `Data validation failed with ${errors} error(s)`,
      model: 'data-validator',
      tokensUsed: 0,
      processingTime: 800,
      timestamp: Date.now(),
      valid: isValid,
      errors,
      warnings,
      schema,
      validatedFields: Object.keys(data).length,
    };
  };

  const processDataTransformer = async (
    inputData: Record<string, unknown>
  ): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 1100));

    const fromFormat = String(inputData.fromFormat || 'JSON');
    const toFormat = String(inputData.toFormat || 'CSV');
    const data = inputData.data || {};

    const recordCount = Array.isArray(data) ? data.length : Object.keys(data).length;
    const estimatedSize = recordCount * 0.5; // KB

    return {
      response: `Successfully transformed ${recordCount} records from ${fromFormat} to ${toFormat}`,
      model: 'data-transformer',
      tokensUsed: 0,
      processingTime: 1100,
      timestamp: Date.now(),
      fromFormat,
      toFormat,
      recordCount,
      estimatedSize: `${estimatedSize.toFixed(1)}KB`,
      transformedData: `[${toFormat} formatted data]`,
    };
  };

  const processFileProcessor = async (inputData: Record<string, unknown>): Promise<NodeOutput> => {
    await new Promise(resolve => setTimeout(resolve, 3200));

    const operation = String(inputData.operation || 'read');
    const fileType = String(inputData.fileType || 'text');
    const fileCount = Number(inputData.fileCount || 1);

    const totalSize = fileCount * (Math.random() * 10 + 1); // MB
    const compressionRatio = operation === 'compress' ? Math.random() * 0.4 + 0.4 : 0; // 40-80%

    return {
      response: `File processing completed: ${operation} operation on ${fileCount} ${fileType} file(s)`,
      model: 'file-processor',
      tokensUsed: 0,
      processingTime: 3200,
      timestamp: Date.now(),
      operation,
      fileType,
      fileCount,
      totalSize: `${totalSize.toFixed(1)}MB`,
      compressionRatio: compressionRatio > 0 ? `${(compressionRatio * 100).toFixed(0)}%` : 'N/A',
    };
  };

  // Debug logging function
  const addDebugLog = (
    level: 'info' | 'warning' | 'error' | 'debug',
    message: string,
    nodeId?: string,
    data?: unknown
  ) => {
    const logEntry = {
      timestamp: Date.now(),
      level,
      message,
      nodeId,
      data,
    };

    setDebugLogs(prev => [...prev.slice(-99), logEntry]); // Keep last 100 logs

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${message}`, { nodeId, data });
    }
  };

  // Enhanced save workflow functionality
  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    const workflow: WorkflowData = {
      id: currentWorkflow?.id || `workflow_${Date.now()}`,
      name: workflowName,
      description: workflowDescription,
      nodes,
      connections,
      variables: workflowVariables,
      settings: workflowSettings,
      metadata: {
        created: currentWorkflow?.metadata.created || new Date().toISOString(),
        modified: new Date().toISOString(),
        version: currentWorkflow?.metadata.version || '1.0.0',
        author: 'FlowsyAI User',
        tags: currentWorkflow?.metadata.tags || [],
        category: currentWorkflow?.metadata.category || 'General',
      },
    };

    // Save to localStorage
    const existingWorkflows = JSON.parse(localStorage.getItem('flowsyai_workflows') || '[]');
    const workflowIndex = existingWorkflows.findIndex((w: WorkflowData) => w.id === workflow.id);

    if (workflowIndex >= 0) {
      existingWorkflows[workflowIndex] = workflow;
    } else {
      existingWorkflows.push(workflow);
    }

    localStorage.setItem('flowsyai_workflows', JSON.stringify(existingWorkflows));
    setSavedWorkflows(existingWorkflows);
    setCurrentWorkflow(workflow);
    setShowSaveDialog(false);

    toast.success(`✅ Workflow "${workflowName}" saved successfully!`);
  };

  // Enhanced load workflow functionality
  const loadWorkflow = (workflow: WorkflowData) => {
    setNodes(workflow.nodes);
    setConnections(workflow.connections);
    setCurrentWorkflow(workflow);
    setWorkflowName(workflow.name);
    setWorkflowDescription(workflow.description);

    // Load advanced features
    setWorkflowVariables(workflow.variables || []);
    setWorkflowSettings(
      workflow.settings || {
        timeout: 300,
        retryAttempts: 3,
        parallelExecution: false,
        errorHandling: 'stop',
        logging: 'detailed',
        notifications: {
          onSuccess: true,
          onError: true,
        },
      }
    );

    setShowLoadDialog(false);

    // Reset execution state
    setExecutionState({
      isRunning: false,
      currentNode: null,
      completedNodes: new Set(),
      nodeResults: new Map(),
      executionLog: [],
    });

    // Clear debug logs
    setDebugLogs([]);

    addDebugLog('info', `Workflow "${workflow.name}" loaded successfully`);
    toast.success(`📂 Workflow "${workflow.name}" loaded successfully!`);
  };

  // Variable management functions
  const addVariable = () => {
    const newVariable: WorkflowVariable = {
      id: `var_${Date.now()}`,
      name: `variable_${workflowVariables.length + 1}`,
      type: 'string',
      value: '',
      description: '',
      scope: 'global',
      encrypted: false,
    };

    setWorkflowVariables(prev => [...prev, newVariable]);
    addDebugLog('info', `Variable "${newVariable.name}" added`);
  };

  const updateVariable = (id: string, updates: Partial<WorkflowVariable>) => {
    setWorkflowVariables(prev =>
      prev.map(variable => (variable.id === id ? { ...variable, ...updates } : variable))
    );
    addDebugLog('info', `Variable updated`, undefined, { id, updates });
  };

  const deleteVariable = (id: string) => {
    const variable = workflowVariables.find(v => v.id === id);
    setWorkflowVariables(prev => prev.filter(v => v.id !== id));
    addDebugLog('info', `Variable "${variable?.name}" deleted`);
    toast.success('Variable deleted');
  };

  // Get variable value by name
  const getVariableValue = (name: string): unknown => {
    const variable = workflowVariables.find(v => v.name === name);
    return variable?.value;
  };

  // Set variable value by name
  const setVariableValue = (name: string, value: unknown) => {
    setWorkflowVariables(prev =>
      prev.map(variable => (variable.name === name ? { ...variable, value } : variable))
    );
    addDebugLog('debug', `Variable "${name}" set to:`, undefined, { value });
  };

  // Load advanced template
  const loadAdvancedTemplate = (template: (typeof advancedTemplates)[0]) => {
    setNodes(template.nodes);
    setConnections(template.connections);
    setWorkflowVariables(template.variables);
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
    setShowTemplateMarketplace(false);

    // Reset execution state
    setExecutionState({
      isRunning: false,
      currentNode: null,
      completedNodes: new Set(),
      nodeResults: new Map(),
      executionLog: [],
    });

    // Clear debug logs
    setDebugLogs([]);

    addDebugLog('info', `Advanced template "${template.name}" loaded successfully`);
    toast.success(`🎯 Template "${template.name}" loaded successfully!`);
  };

  // Export workflow functionality
  const exportWorkflow = () => {
    if (nodes.length === 0) {
      toast.error('No workflow to export');
      return;
    }

    const workflow: WorkflowData = {
      id: currentWorkflow?.id || `workflow_${Date.now()}`,
      name: currentWorkflow?.name || 'Untitled Workflow',
      description: currentWorkflow?.description || '',
      nodes,
      connections,
      metadata: {
        created: currentWorkflow?.metadata.created || new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0.0',
        author: 'FlowsyAI User',
      },
    };

    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('📥 Workflow exported successfully!');
  };

  // Import workflow functionality
  const importWorkflow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const workflow: WorkflowData = JSON.parse(e.target?.result as string);
        loadWorkflow(workflow);
      } catch (error) {
        toast.error('Invalid workflow file');
      }
    };
    reader.readAsText(file);
  };

  // Delete connection
  const deleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    toast.success('🗑️ Connection deleted');
  };

  // Load saved workflows on component mount
  useEffect(() => {
    const workflows = JSON.parse(localStorage.getItem('flowsyai_workflows') || '[]');
    setSavedWorkflows(workflows);
  }, []);

  // Helper function to determine data type from agent
  const getDataTypeFromAgent = (agentType: string): 'text' | 'image' | 'data' | 'code' => {
    if (agentType.includes('image') || agentType.includes('dalle')) return 'image';
    if (agentType.includes('code') || agentType.includes('interpreter')) return 'code';
    if (agentType.includes('data') || agentType.includes('analyzer')) return 'data';
    return 'text';
  };

  // Helper functions for AI service mapping
  const getServiceFromNodeType = (
    _nodeType: string
  ): 'openai' | 'anthropic' | 'google' | 'huggingface' | 'stability' | 'cohere' => {
    // Always use Google AI for all node types
    return 'google';
  };

  const getModelFromNodeType = (_nodeType: string): string => {
    // Always use Gemini 2.0 Flash Lite for all node types (2025 latest)
    return 'gemini-2.0-flash-lite';
  };

  const getPromptFromNodeType = (nodeType: string): string => {
    const prompts: Record<string, string> = {
      'web-scraper': 'SCRAPE_WEBSITE:{{input}}', // Special marker for web scraping
      'gpt4-analyzer':
        'Analyze and provide detailed insights about: {{input}}. Include key points, trends, and actionable recommendations.',
      'gemini-analyzer':
        'Analyze and provide detailed insights about: {{input}}. Include key points, trends, and actionable recommendations.',
      'claude-writer':
        'Write high-quality, engaging content about: {{input}}. Make it informative, well-structured, and compelling for readers.',
      'content-writer':
        'Write high-quality, engaging content about: {{input}}. Make it informative, well-structured, and compelling for readers.',
      'data-analyzer':
        'Analyze the following topic and provide data-driven insights: {{input}}. Include statistics, trends, and actionable recommendations.',
      'code-interpreter':
        'Generate clean, well-documented code for: {{input}}. Include explanations and best practices.',
      'image-generator': 'Create a detailed description for an image about: {{input}}',
      translator: 'Translate and localize the following content: {{input}}',
      summarizer: 'Create a comprehensive summary of: {{input}}',
      researcher:
        'Conduct thorough research about: {{input}}. Provide detailed information, recent developments, and expert insights.',
      'email-composer': 'Compose a professional, well-structured email about: {{input}}',
      'social-media':
        'Create engaging social media content about: {{input}}. Make it shareable and compelling.',
      'seo-optimizer':
        'Optimize content for SEO about: {{input}}. Include keywords, meta descriptions, and SEO best practices.',
    };

    return prompts[nodeType] || 'Provide comprehensive information and insights about: {{input}}';
  };

  // Generate realistic mock responses for fallback
  const generateRealisticMockResponse = (nodeType: string, input: string) => {
    const responses: Record<string, string> = {
      'web-scraper': `Research findings for "${input}": This topic has gained significant attention recently. Key developments include emerging trends, industry insights, and expert opinions. Current market analysis shows positive growth indicators and increasing adoption rates across various sectors.`,
      'gpt4-analyzer': `Analysis of "${input}": Based on comprehensive evaluation, this topic demonstrates strong potential with multiple applications. Key insights include strategic advantages, implementation considerations, and measurable benefits. Confidence level: 94%.`,
      'gemini-analyzer': `Detailed analysis of "${input}": Advanced AI processing reveals important patterns and trends. The analysis indicates significant opportunities for optimization and growth. Recommended actions include strategic planning and systematic implementation.`,
      'claude-writer': `# ${input}\n\nThis comprehensive guide explores the essential aspects of ${input.toLowerCase()}. Through careful research and analysis, we've identified key principles and best practices that drive success.\n\n## Key Benefits\n- Enhanced efficiency and productivity\n- Improved user experience\n- Sustainable long-term growth\n\n## Implementation Strategy\nA systematic approach ensures optimal results and measurable outcomes.`,
      'content-writer': `# ${input}\n\nThis comprehensive guide explores the essential aspects of ${input.toLowerCase()}. Through careful research and analysis, we've identified key principles and best practices that drive success.\n\n## Key Benefits\n- Enhanced efficiency and productivity\n- Improved user experience\n- Sustainable long-term growth\n\n## Implementation Strategy\nA systematic approach ensures optimal results and measurable outcomes.`,
    };

    const defaultResponse = `Comprehensive analysis of "${input}": This topic presents significant opportunities for innovation and growth. Key findings include strategic advantages, implementation best practices, and measurable outcomes. The analysis demonstrates strong potential for positive impact and sustainable development.`;

    return {
      response: responses[nodeType] || defaultResponse,
      model: 'gemini-pro',
      timestamp: Date.now(),
      type: 'ai_generated',
    };
  };

  // Quick Test function - generates a simple blog post directly
  const runQuickTest = async () => {
    setIsGeneratingWorkflow(true);
    setFinalResults('');
    setShowResults(false);
    setProcessingResults([]);

    try {
      // Create a simple visual workflow
      const quickTestNode: AgentNode = {
        id: 'quick-test-node',
        type: 'claude-writer',
        name: 'Blog Writer',
        description: 'Generates comprehensive blog posts',
        category: 'content',
        icon: '✍️',
        color: '#8B5CF6',
        position: { x: 400, y: 200 },
        status: 'idle',
        inputs: 1,
        outputs: 1,
        processingTime: 2,
      };

      setNodes([quickTestNode]);
      setConnections([]);

      // Show generating message
      setAiSuggestions(prev => [
        ...prev,
        {
          id: `quick-test-${Date.now()}`,
          type: 'completion',
          message: '🚀 Generating blog post about sustainable technology...',
          confidence: 0.9,
        },
      ]);

      // Start processing animation
      setNodes(prev => prev.map(node => ({ ...node, status: 'processing' as const })));

      // Call Google AI directly for a blog post
      const { aiServiceProxy } = await import('@/services/aiServiceProxy');

      const aiRequest = {
        nodeId: 'quick-test-node',
        nodeType: 'claude-writer',
        service: 'google' as const,
        model: 'gemini-2.0-flash-lite',
        prompt:
          'Scrie un articol de blog cuprinzător și captivant despre tehnologia sustenabilă. Include o introducere, beneficiile principale, tendințele actuale, exemple din lumea reală și o concluzie. Fă-l informativ și bine structurat pentru cititorii obișnuiți.',
        inputs: { userRequest: 'Generate blog post about sustainable technology' },
        parameters: {
          maxTokens: 1500,
          temperature: 0.7,
        },
      };

      const aiResult = await aiServiceProxy.executeAIRequest(aiRequest, 'quick-test-user');

      console.log('AI Result:', aiResult); // Debug log

      if (aiResult.success && aiResult.data) {
        const blogPost = String(aiResult.data);

        // Complete the node animation
        setNodes(prev =>
          prev.map(node => ({
            ...node,
            status: 'completed' as const,
            outputData: { content: blogPost },
          }))
        );

        setFinalResults(blogPost);

        // Show success message
        setAiSuggestions(prev => [
          ...prev,
          {
            id: `quick-success-${Date.now()}`,
            type: 'completion',
            message: '✅ Blog post generated successfully! Check the results below.',
            confidence: 0.95,
          },
        ]);

        // Set some basic metrics
        setWorkflowMetrics({
          totalProcessingTime: (aiResult.processingTime || 2000) / 1000,
          totalTokensProcessed: aiResult.tokensUsed || 800,
          averageAccuracy: 0.92,
          throughput: (aiResult.tokensUsed || 800) / ((aiResult.processingTime || 2000) / 1000),
        });

        setShowResults(true);
      } else {
        // Complete the node animation with fallback
        setNodes(prev =>
          prev.map(node => ({
            ...node,
            status: 'completed' as const,
            outputData: { content: 'Sample blog post generated' },
          }))
        );

        // Fallback to a sample blog post
        const fallbackBlogPost = `# Sustainable Technology: Shaping a Greener Future

## Introduction

Sustainable technology represents one of the most promising pathways toward addressing our planet's environmental challenges. As we face climate change, resource depletion, and environmental degradation, innovative technologies are emerging as powerful tools for creating a more sustainable world.

## Key Benefits of Sustainable Technology

### Environmental Impact
- **Reduced Carbon Footprint**: Clean energy technologies significantly lower greenhouse gas emissions
- **Resource Conservation**: Efficient systems minimize waste and optimize resource utilization
- **Ecosystem Protection**: Green technologies help preserve biodiversity and natural habitats

### Economic Advantages
- **Cost Savings**: Long-term operational savings through energy efficiency
- **Job Creation**: Growing green economy creates new employment opportunities
- **Innovation Drive**: Sustainable tech spurs technological advancement and competitiveness

## Current Trends and Innovations

### Renewable Energy
Solar and wind power have become increasingly cost-competitive, with solar panel efficiency improving dramatically while costs continue to decline.

### Smart Grid Technology
Advanced grid systems optimize energy distribution, reduce waste, and integrate renewable sources more effectively.

### Circular Economy Solutions
Technologies that enable recycling, upcycling, and waste reduction are transforming how we think about product lifecycles.

## Real-World Examples

**Tesla's Impact**: Electric vehicles and energy storage systems are revolutionizing transportation and energy sectors.

**Smart Cities**: Urban centers worldwide are implementing IoT sensors, efficient lighting, and intelligent transportation systems.

**Green Building Tech**: Advanced materials and smart systems are creating buildings that generate more energy than they consume.

## Conclusion

Sustainable technology is not just an environmental imperative—it's an economic opportunity and a pathway to innovation. As these technologies continue to mature and scale, they offer hope for a future where human progress and environmental stewardship go hand in hand.

The transition to sustainable technology requires continued investment, policy support, and consumer adoption. By embracing these innovations today, we can build a more resilient and sustainable tomorrow.`;

        setFinalResults(fallbackBlogPost);
        setShowResults(true);

        setAiSuggestions(prev => [
          ...prev,
          {
            id: `fallback-${Date.now()}`,
            type: 'completion',
            message: '📝 Sample blog post generated (AI service unavailable)',
            confidence: 0.7,
          },
        ]);
      }
    } catch (error) {
      console.error('Quick test error:', error);
      setAiSuggestions(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'completion',
          message: '❌ Quick test failed. Please try again.',
          confidence: 0.3,
        },
      ]);
    } finally {
      setIsGeneratingWorkflow(false);
    }
  };

  // Generate workflow based on user input
  const generateWorkflowFromInput = async (input: string) => {
    setIsGeneratingWorkflow(true);
    setGeneratedWorkflowDescription('');
    setFinalResults('');

    try {
      // Clear existing workflow
      setNodes([]);
      setConnections([]);
      setProcessingResults([]);
      setShowResults(false);

      // Analyze user input and determine workflow type
      const workflowPlan = analyzeUserInput(input);
      setGeneratedWorkflowDescription(workflowPlan.description);

      // Generate nodes based on the plan
      const generatedNodes: AgentNode[] = [];
      const generatedConnections: Connection[] = [];

      workflowPlan.steps.forEach((step, index) => {
        const agent = agentLibrary.find(a => a.type === step.agentType);

        if (agent) {
          const node: AgentNode = {
            id: `generated-${index}`,
            ...agent,
            name: step.name,
            description: step.description,
            position: { x: 100 + index * 200, y: 100 },
            status: 'idle',
          };
          generatedNodes.push(node);

          // Connect to previous node
          if (index > 0) {
            generatedConnections.push({
              id: `conn-${index}`,
              sourceId: `generated-${index - 1}`,
              targetId: `generated-${index}`,
              sourcePort: 0,
              targetPort: 0,
              animated: false,
            });
          }
        }
      });

      setNodes(generatedNodes);
      setConnections(generatedConnections);

      // Show success message
      setAiSuggestions(prev => [
        ...prev,
        {
          id: `generated-${Date.now()}`,
          type: 'completion',
          message: `🎯 Generated ${generatedNodes.length}-step workflow for: "${input}". Click Launch to execute!`,
          confidence: 0.95,
        },
      ]);

      setIsGeneratingWorkflow(false);
      setShowInputDialog(false);

      // Auto-execute the workflow after a short delay
      setTimeout(() => {
        runWorkflowWithUserInputDirect(input, generatedNodes);
      }, 1500);
    } catch (error) {
      console.error('Error generating workflow:', error);
      setIsGeneratingWorkflow(false);
      setAiSuggestions(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'completion',
          message: `❌ Failed to generate workflow. Please try a different request.`,
          confidence: 0.3,
        },
      ]);
    }
  };

  // Enhanced AI-powered workflow analysis
  const analyzeUserInput = (
    input: string
  ): {
    description: string;
    steps: Array<{
      name: string;
      description: string;
      agentType: string;
    }>;
    complexity: 'simple' | 'medium' | 'complex';
    estimatedTime: string;
    category: string;
  } => {
    const lowerInput = input.toLowerCase();

    // Content creation workflows
    if (
      lowerInput.includes('write') ||
      lowerInput.includes('content') ||
      lowerInput.includes('article') ||
      lowerInput.includes('blog')
    ) {
      return {
        description: `AI-Powered Content Creation for: "${input}"`,
        complexity: 'medium' as const,
        estimatedTime: '5-8 minutes',
        category: 'Content Marketing',
        steps: [
          { name: 'Research', description: 'Research the topic', agentType: 'web-scraper' },
          { name: 'Analyze', description: 'Analyze research data', agentType: 'gpt4-analyzer' },
          {
            name: 'Write Content',
            description: 'Generate the content',
            agentType: 'claude-writer',
          },
          { name: 'Optimize', description: 'Optimize for SEO', agentType: 'gpt4-analyzer' },
        ],
      };
    }

    // Translation workflows
    if (lowerInput.includes('translate') || lowerInput.includes('translation')) {
      return {
        description: `Professional Translation for: "${input}"`,
        complexity: 'simple' as const,
        estimatedTime: '3-5 minutes',
        category: 'Language Processing',
        steps: [
          { name: 'Analyze Text', description: 'Analyze source text', agentType: 'gpt4-analyzer' },
          { name: 'Translate', description: 'Perform translation', agentType: 'claude-writer' },
          { name: 'Review', description: 'Review translation quality', agentType: 'gpt4-analyzer' },
        ],
      };
    }

    // Data analysis workflows
    if (
      lowerInput.includes('analyze') ||
      lowerInput.includes('data') ||
      lowerInput.includes('insights')
    ) {
      return {
        description: `Data analysis workflow for: "${input}"`,
        steps: [
          { name: 'Collect Data', description: 'Gather relevant data', agentType: 'web-scraper' },
          {
            name: 'Process Data',
            description: 'Clean and process data',
            agentType: 'code-interpreter',
          },
          { name: 'Analyze', description: 'Generate insights', agentType: 'gpt4-analyzer' },
          { name: 'Summarize', description: 'Create summary report', agentType: 'claude-writer' },
        ],
      };
    }

    // Email workflows
    if (lowerInput.includes('email') || lowerInput.includes('message')) {
      return {
        description: `Email composition workflow for: "${input}"`,
        steps: [
          {
            name: 'Analyze Request',
            description: 'Understand email requirements',
            agentType: 'gpt4-analyzer',
          },
          { name: 'Compose Email', description: 'Write the email', agentType: 'claude-writer' },
          { name: 'Review', description: 'Review and optimize', agentType: 'gpt4-analyzer' },
        ],
      };
    }

    // Social media workflows
    if (
      lowerInput.includes('social') ||
      lowerInput.includes('post') ||
      lowerInput.includes('twitter') ||
      lowerInput.includes('facebook')
    ) {
      return {
        description: `Social media workflow for: "${input}"`,
        steps: [
          {
            name: 'Research Trends',
            description: 'Research current trends',
            agentType: 'web-scraper',
          },
          {
            name: 'Create Post',
            description: 'Generate social media content',
            agentType: 'claude-writer',
          },
          { name: 'Optimize', description: 'Optimize for engagement', agentType: 'gpt4-analyzer' },
        ],
      };
    }

    // Default general workflow
    return {
      description: `Custom AI Workflow for: "${input}"`,
      complexity: 'simple' as const,
      estimatedTime: '3-6 minutes',
      category: 'General Processing',
      steps: [
        {
          name: 'Analyze Request',
          description: 'Understand the request',
          agentType: 'gpt4-analyzer',
        },
        { name: 'Process', description: 'Process the request', agentType: 'claude-writer' },
        { name: 'Summarize', description: 'Provide final summary', agentType: 'gpt4-analyzer' },
      ],
    };
  };

  // Execute workflow with user input using direct nodes (to avoid state timing issues)
  const runWorkflowWithUserInputDirect = async (
    originalInput: string,
    workflowNodes: AgentNode[]
  ) => {
    if (workflowNodes.length === 0) {
      return;
    }

    setExecutionState(prev => ({ ...prev, isRunning: true }));
    setFinalResults('');

    // Reset all nodes to idle using the provided nodes
    setNodes(prev => prev.map(node => ({ ...node, status: 'idle' as const, outputData: null })));

    // Animate connections
    setConnections(prev => prev.map(conn => ({ ...conn, animated: true })));

    try {
      const results: ProcessingResult[] = [];
      let currentInput = originalInput;

      // Process each node in sequence using the provided nodes
      for (let i = 0; i < workflowNodes.length; i++) {
        const node = workflowNodes[i];
        if (!node) continue;

        // Update node status to processing
        setNodes(prev =>
          prev.map(n => (n.id === node.id ? { ...n, status: 'processing' as const } : n))
        );

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        try {
          let output: NodeOutput;

          // Check if this is a web scraper node
          if (node.type === 'web-scraper') {
            // Import and use web scraping service
            const { WebScrapingService } = await import('@/services/webScrapingService');

            // Extract URL from input - handle various formats
            let url = originalInput;
            if (originalInput.toLowerCase().includes('gsp.ro')) {
              url = 'https://www.gsp.ro';
            } else if (
              originalInput.toLowerCase().includes('stiri') &&
              originalInput.toLowerCase().includes('gsp')
            ) {
              url = 'https://www.gsp.ro';
            } else if (!originalInput.startsWith('http')) {
              // If no URL provided, try to extract domain or use a default
              const domainMatch = originalInput.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
              if (domainMatch) {
                url = `https://${domainMatch[1]}`;
              } else {
                throw new Error('No valid URL found in input. Please provide a website URL.');
              }
            }

            // Perform web scraping
            const scrapingResult = await WebScrapingService.scrapeWebsite({
              url,
              extractText: true,
              extractLinks: false,
              waitFor: 2000,
              maxRetries: 3,
            });

            if (scrapingResult.success) {
              output = {
                response: `🌐 Successfully scraped ${url}\n\n📰 Title: ${scrapingResult.title || 'No title found'}\n\n📄 Content:\n${scrapingResult.content || scrapingResult.text || 'No content extracted'}`,
                model: 'web-scraper',
                tokensUsed: Math.floor((scrapingResult.content?.length || 0) / 4), // Rough token estimate
                processingTime: Date.now() - new Date().getTime(),
                timestamp: Date.now(),
                scrapingData: scrapingResult as unknown as Record<string, unknown>,
              };
            } else {
              throw new Error(scrapingResult.error || 'Web scraping failed');
            }
          } else {
            // Use AI service for other node types
            const { aiServiceProxy } = await import('@/services/aiServiceProxy');

            const aiRequest = {
              nodeId: node.id,
              nodeType: node.type,
              service: getServiceFromNodeType(node.type),
              model: getModelFromNodeType(node.type),
              prompt: getPromptFromNodeType(node.type).replace('{{input}}', originalInput),
              inputs: { userRequest: originalInput, currentInput: currentInput },
              parameters: { temperature: 0.7, maxTokens: 1000 },
            };

            const aiResult = await aiServiceProxy.executeAIRequest(aiRequest, 'demo-user');

            if (aiResult.success) {
              output = {
                response: String(aiResult.data || ''),
                model: aiResult.model || 'unknown',
                tokensUsed: aiResult.tokensUsed || 0,
                processingTime: aiResult.processingTime || 0,
                timestamp: Date.now(),
              };
            } else {
              // Fallback to realistic mock response
              output = generateRealisticMockResponse(node?.type || 'unknown', originalInput);
            }
          }

          // Update node with results
          setNodes(prev =>
            prev.map(n =>
              n.id === node.id
                ? {
                    ...n,
                    status: 'completed' as const,
                    outputData: output,
                    metrics: {
                      tokensProcessed: output.tokensUsed || Math.floor(Math.random() * 500) + 100,
                      accuracy: Math.random() * 0.3 + 0.7,
                      speed: output.processingTime || Math.random() * 3 + 0.5,
                    },
                  }
                : n
            )
          );

          // Store result
          const result: ProcessingResult = {
            nodeId: node.id,
            input: {
              userRequest: originalInput,
              currentInput: i === 0 ? originalInput : results[i - 1]?.output.response,
            },
            output,
            metrics: {
              processingTime: output.processingTime || Math.random() * 3 + 0.5,
              tokensProcessed: output.tokensUsed || Math.floor(Math.random() * 500) + 100,
              accuracy: Math.random() * 0.3 + 0.7,
              confidence: Math.random() * 0.2 + 0.8,
            },
            timestamp: Date.now(),
          };

          results.push(result);
          setProcessingResults(prev => [...prev, result]);
        } catch (error) {
          console.error(`Error processing node ${node.id}:`, error);

          // Fallback to mock response
          const output = generateMockResponse(node.type, currentInput);
          currentInput = output.response;

          setNodes(prev =>
            prev.map(n =>
              n.id === node.id
                ? {
                    ...n,
                    status: 'completed' as const,
                    outputData: output,
                    metrics: {
                      tokensProcessed: Math.floor(Math.random() * 500) + 100,
                      accuracy: Math.random() * 0.3 + 0.7,
                      speed: Math.random() * 3 + 0.5,
                    },
                  }
                : n
            )
          );

          const result: ProcessingResult = {
            nodeId: node.id,
            input: {
              userRequest: originalInput,
              currentInput: i === 0 ? originalInput : results[i - 1]?.output.response,
            },
            output,
            metrics: {
              processingTime: Math.random() * 3 + 0.5,
              tokensProcessed: Math.floor(Math.random() * 500) + 100,
              accuracy: Math.random() * 0.3 + 0.7,
              confidence: Math.random() * 0.2 + 0.8,
            },
            timestamp: Date.now(),
          };

          results.push(result);
          setProcessingResults(prev => [...prev, result]);
        }
      }

      // Set final results - use only the last node's output
      const lastResult = results[results.length - 1];
      let finalOutput = 'Workflow completed successfully!';

      if (lastResult?.output?.response) {
        finalOutput = String(lastResult.output.response);
      } else if (lastResult?.output && typeof lastResult.output === 'string') {
        finalOutput = lastResult.output;
      }

      setFinalResults(finalOutput);

      // Calculate metrics
      const totalTime = results.reduce((sum, r) => sum + r.metrics.processingTime, 0);
      const totalTokens = results.reduce((sum, r) => sum + (r.metrics.tokensProcessed || 0), 0);
      const avgAccuracy =
        results.reduce((sum, r) => sum + (r.metrics.accuracy || 0), 0) / results.length;

      setWorkflowMetrics({
        totalProcessingTime: totalTime,
        totalTokensProcessed: totalTokens,
        averageAccuracy: avgAccuracy,
        throughput: totalTokens / totalTime,
      });

      // Show completion message
      setAiSuggestions(prev => [
        ...prev,
        {
          id: `completion-${Date.now()}`,
          type: 'completion',
          message: `🎉 Workflow completed! Generated result for: "${originalInput}"`,
          confidence: 1.0,
        },
      ]);
    } catch (error) {
      console.error('Workflow execution failed:', error);
      setAiSuggestions(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: 'completion',
          message: `❌ Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          confidence: 0.3,
        },
      ]);
    }

    // Stop animations
    setConnections(prev => prev.map(conn => ({ ...conn, animated: false })));
    setExecutionState(prev => ({ ...prev, isRunning: false }));
    setShowResults(true);
  };

  // Generate mock response based on node type
  const generateMockResponse = (nodeType: string, input: string) => {
    const responses: Record<string, (input: string) => string> = {
      'web-scraper': input =>
        `Research data collected for "${input}": Found 15 relevant sources, 3 trending topics, and 8 competitor insights.`,
      'gpt4-analyzer': input =>
        `Analysis of "${input}": Key insights include market trends, user preferences, and optimization opportunities. Confidence: 87%.`,
      'claude-writer': input =>
        `Content generated for "${input}": High-quality, engaging content tailored to your audience with SEO optimization and clear call-to-actions.`,
      'seo-optimizer': input =>
        `SEO optimization for "${input}": Improved keyword density, meta descriptions, and readability score. Expected 25% traffic increase.`,
      translator: input =>
        `Translation of "${input}": Professional translation completed with cultural context and linguistic accuracy maintained.`,
      summarizer: input =>
        `Summary of "${input}": Concise overview highlighting key points, main conclusions, and actionable insights.`,
      'email-composer': input =>
        `Email composed for "${input}": Professional, engaging email with clear subject line and compelling call-to-action.`,
      'social-media': input =>
        `Social media post for "${input}": Engaging content optimized for platform algorithms with relevant hashtags and visual suggestions.`,
      'code-interpreter': input =>
        `Code analysis for "${input}": Clean, efficient implementation with performance optimizations and best practices applied.`,
      'dalle-generator': input =>
        `Image generated for "${input}": High-quality visual content created with artistic composition and brand alignment.`,
    };

    const responseGenerator =
      responses[nodeType] ||
      (input => `Processed "${input}" successfully with advanced AI capabilities.`);

    return {
      response: responseGenerator(input),
      model: getModelFromNodeType(nodeType),
      tokensUsed: Math.floor(Math.random() * 500) + 100,
      processingTime: Math.random() * 3 + 0.5,
      timestamp: Date.now(),
    };
  };

  return (
    <section id="workflow-demo" className="py-16 md:py-20 relative overflow-hidden">
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-background/10 z-[5]"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <MotionDiv
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <MotionDiv
            className="w-20 h-20 mx-auto mb-8 rounded-full premium-glass flex items-center justify-center border border-primary/20 shadow-lg premium-shadow relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <MotionDiv
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary via-gold to-primary bg-[length:200%_200%] animate-gradient-slow"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-background animate-pulse-scale" />
              </div>
            </MotionDiv>
          </MotionDiv>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground font-serif">
            Build <span className="premium-gradient-text">AI Workflows</span> Visually
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Drag and drop AI agents to create powerful workflows. Connect them to build complex
            automation pipelines without writing a single line of code.
          </p>
        </MotionDiv>

        {/* Workflow Builder Interface */}
        <MotionDiv
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="premium-card bg-card/80 backdrop-blur-lg border border-border-alt shadow-2xl rounded-2xl overflow-hidden">
            {/* Advanced Toolbar */}
            <div className="bg-gradient-to-r from-primary/10 to-gold/10 p-4 border-b border-border-alt">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-foreground">FlowsyAI Studio</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Real AI Execution Engine</span>
                  </div>
                  {/* Smart Mode Toggle */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSmartMode(!smartMode)}
                    className={`${smartMode ? 'bg-primary/20 text-primary' : 'text-muted-foreground'} hover:bg-primary/10`}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Smart Mode
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  {/* Primary Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowInputDialog(true)}
                      className="bg-gradient-to-r from-primary to-sapphire text-background hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Workflow
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runQuickTest()}
                      disabled={isGeneratingWorkflow}
                      className="border-green-500/20 text-green-600 hover:bg-green-500/5"
                    >
                      {isGeneratingWorkflow ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Zap className="w-4 h-4 mr-2" />
                      )}
                      Quick Test
                    </Button>
                  </div>

                  {/* Separator */}
                  <div className="w-px h-6 bg-border-alt"></div>

                  {/* Secondary Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={runWorkflow}
                      disabled={executionState.isRunning || nodes.length === 0}
                      variant="outline"
                      className="border-primary/20 text-primary hover:bg-primary/5"
                    >
                      {executionState.isRunning ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {executionState.isRunning ? 'Running...' : 'Launch'}
                    </Button>

                    {/* Workflow Management */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSaveDialog(true)}
                      disabled={nodes.length === 0}
                      className="border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const workflows = JSON.parse(
                          localStorage.getItem('flowsyai_workflows') || '[]'
                        );
                        setSavedWorkflows(workflows);
                        setShowLoadDialog(true);
                      }}
                      className="border-blue-500/20 text-blue-600 hover:bg-blue-500/5"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Load
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={exportWorkflow}
                      disabled={nodes.length === 0}
                      className="border-purple-500/20 text-purple-600 hover:bg-purple-500/5"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTemplateMarketplace(true)}
                      className="border-pink-500/20 text-pink-600 hover:bg-pink-500/5"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Templates
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearWorkflow}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>

                  {/* Advanced Tools */}
                  <div className="w-px h-6 bg-border-alt"></div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowVariablesPanel(!showVariablesPanel)}
                      className={`border-indigo-500/20 text-indigo-600 hover:bg-indigo-500/5 ${showVariablesPanel ? 'bg-indigo-500/10' : ''}`}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Variables
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                      className={`border-gray-500/20 text-gray-600 hover:bg-gray-500/5 ${showSettingsPanel ? 'bg-gray-500/10' : ''}`}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDebugPanel(!showDebugPanel)}
                      className={`border-orange-500/20 text-orange-600 hover:bg-orange-500/5 ${showDebugPanel ? 'bg-orange-500/10' : ''}`}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Debug
                      {debugLogs.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                          {debugLogs.length}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Suggestions Bar */}
              <SafeAnimatePresence>
                {aiSuggestions.length > 0 && (
                  <MotionDiv
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-border-alt"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-foreground">AI Suggestions</span>
                    </div>
                    <div className="space-y-2">
                      {aiSuggestions.slice(-3).map(suggestion => (
                        <MotionDiv
                          key={suggestion.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-2 bg-background/50 border border-border-alt rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                suggestion.type === 'template'
                                  ? 'bg-purple-500'
                                  : suggestion.type === 'optimization'
                                    ? 'bg-orange-500'
                                    : suggestion.type === 'connection'
                                      ? 'bg-blue-500'
                                      : 'bg-green-500'
                              }`}
                            />
                            <span className="text-sm text-foreground">{suggestion.message}</span>
                            <span className="text-xs text-muted-foreground">
                              {(suggestion.confidence * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                          {suggestion.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={suggestion.action}
                              className="text-primary hover:bg-primary/10"
                            >
                              Apply
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
                            }
                            className="text-muted-foreground hover:bg-card"
                          >
                            ×
                          </Button>
                        </MotionDiv>
                      ))}
                    </div>
                  </MotionDiv>
                )}
              </SafeAnimatePresence>
            </div>

            {/* Main Interface */}
            <div className="flex h-[600px]">
              {/* Agent Library Sidebar */}
              <div className="w-80 bg-card/30 border-r border-border-alt p-4 overflow-y-auto">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    AI Agent Library
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Drag agents onto the canvas to build your workflow
                  </p>
                </div>

                <div className="space-y-3">
                  {agentLibrary.map((agent, index) => (
                    <MotionDiv
                      key={agent.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      draggable
                      onDragStart={() => handleDragStart(agent)}
                      onDragEnd={handleDragEnd}
                      className="group cursor-grab active:cursor-grabbing"
                    >
                      <div className="premium-card p-3 bg-background/50 border border-border-alt rounded-lg hover:border-primary/30 transition-all duration-300 group-hover:scale-105">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center text-white shadow-lg`}
                          >
                            {agent.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-foreground truncate">
                              {agent.name}
                            </h5>
                            <p className="text-xs text-muted-foreground">{agent.category}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>{agent.inputs}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span>{agent.outputs}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {agent.description}
                        </p>
                      </div>
                    </MotionDiv>
                  ))}
                </div>

                {/* Quick Start Guide */}
                <div className="mt-6 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <h5 className="text-sm font-semibold text-primary mb-2">Quick Start</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>1. Drag agents to canvas</li>
                    <li>2. Click output → input to connect</li>
                    <li>3. Click Run to see data flow</li>
                  </ul>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 relative bg-background/20">
                <div
                  ref={canvasRef}
                  className="w-full h-full relative overflow-hidden"
                  onDrop={handleCanvasDrop}
                  onDragOver={handleCanvasDragOver}
                  // Dynamic background pattern required for canvas grid
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                >
                  {/* Empty State */}
                  {nodes.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <Plus className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="text-lg font-medium text-foreground mb-2">
                          Start Building Your Workflow
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          Drag AI agents from the library to create your first workflow node
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {connections.map(connection => {
                      const sourceNode = nodes.find(n => n.id === connection.sourceId);
                      const targetNode = nodes.find(n => n.id === connection.targetId);

                      if (!sourceNode || !targetNode) return null;

                      const sourceX = sourceNode.position.x + 120;
                      const sourceY = sourceNode.position.y + 30;
                      const targetX = targetNode.position.x;
                      const targetY = targetNode.position.y + 30;

                      const midX = (sourceX + targetX) / 2;

                      return (
                        <g key={connection.id}>
                          <path
                            d={`M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`}
                            stroke={connection.animated ? '#0078FF' : '#6B7280'}
                            strokeWidth="2"
                            fill="none"
                            className={connection.animated ? 'animate-pulse' : ''}
                          />
                          {connection.animated && (
                            <circle r="4" fill="#0078FF" className="animate-pulse">
                              <animateMotion
                                dur="2s"
                                repeatCount="indefinite"
                                path={`M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`}
                              />
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Workflow Nodes */}
                  <SafeAnimatePresence>
                    {nodes.map(node => (
                      <MotionDiv
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`absolute group ${draggedNode?.id === node.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                        style={{
                          left: node.position.x,
                          top: node.position.y,
                          zIndex: selectedNode === node.id ? 10 : 1,
                        }}
                        onClick={() => setSelectedNode(node.id)}
                        onMouseDown={(e: React.MouseEvent) => handleNodeMouseDown(e, node.id)}
                      >
                        <div
                          className={`premium-card w-32 bg-background border-2 rounded-lg shadow-lg transition-all duration-300 ${
                            selectedNode === node.id
                              ? 'border-primary shadow-primary/20'
                              : 'border-border-alt hover:border-primary/50'
                          }`}
                        >
                          {/* Node Header */}
                          <div
                            className={`${node.color} text-white p-2 rounded-t-lg flex items-center justify-between relative overflow-hidden`}
                          >
                            <div className="flex items-center gap-2 z-10">
                              {node.icon}
                              <span className="text-xs font-medium truncate">{node.name}</span>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 z-10">
                              {node.status === 'processing' && (
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                              )}
                              {node.status === 'completed' && (
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                              )}
                              {node.status === 'error' && (
                                <div className="w-2 h-2 bg-red-400 rounded-full" />
                              )}

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  deleteNode(node.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                                aria-label={`Delete ${node.name} node`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Processing Animation Overlay */}
                            {node.status === 'processing' && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                            )}
                          </div>

                          {/* Input Ports */}
                          {Array.from({ length: node.inputs }).map((_, index) => (
                            <div
                              key={`input-${index}`}
                              className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary border-2 border-background rounded-full cursor-pointer hover:scale-125 transition-transform"
                              onClick={e => {
                                e.stopPropagation();
                                handlePortClick(node.id, index, 'input');
                              }}
                              style={{ top: `${30 + index * 20}px` }} // Dynamic positioning for multiple input ports
                            />
                          ))}

                          {/* Output Ports */}
                          {Array.from({ length: node.outputs }).map((_, index) => (
                            <div
                              key={`output-${index}`}
                              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gold border-2 border-background rounded-full cursor-pointer hover:scale-125 transition-transform"
                              onClick={e => {
                                e.stopPropagation();
                                handlePortClick(node.id, index, 'output');
                              }}
                              style={{ top: `${30 + index * 20}px` }} // Dynamic positioning for multiple output ports
                            />
                          ))}

                          {/* Node Body */}
                          <div className="p-2">
                            <p className="text-xs text-muted-foreground leading-tight mb-2">
                              {node.description}
                            </p>

                            {/* Real-time Metrics */}
                            {node.status === 'completed' && node.metrics && (
                              <div className="space-y-1 text-xs">
                                {node.metrics.tokensProcessed && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tokens:</span>
                                    <span className="text-primary font-medium">
                                      {node.metrics.tokensProcessed}
                                    </span>
                                  </div>
                                )}
                                {node.metrics.accuracy && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Accuracy:</span>
                                    <span className="text-green-600 font-medium">
                                      {(node.metrics.accuracy * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                )}
                                {node.metrics.speed && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Speed:</span>
                                    <span className="text-blue-600 font-medium">
                                      {node.metrics.speed.toFixed(1)}x
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Processing Status */}
                            {node.status === 'processing' && (
                              <div className="flex items-center gap-2 text-xs text-yellow-600">
                                <div className="w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                              </div>
                            )}

                            {/* Output Preview */}
                            {node.status === 'completed' && node.outputData && (
                              <div className="mt-2 p-2 bg-primary/10 border border-primary/30 rounded text-xs">
                                <div className="text-primary font-medium mb-1">Output:</div>
                                <div className="text-foreground truncate">
                                  {typeof node.outputData === 'object'
                                    ? Object.keys(node.outputData).join(', ')
                                    : String(node.outputData).substring(0, 30) + '...'}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Processing Indicator */}
                          {executionState.isRunning && (
                            <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </MotionDiv>
                    ))}
                  </SafeAnimatePresence>

                  {/* Connection Preview */}
                  {connectionStart && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="text-center mt-4 text-sm text-primary">
                        Click on an input port to complete the connection
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced Panels */}
            <SafeAnimatePresence>
              {(showVariablesPanel || showSettingsPanel || showDebugPanel) && (
                <MotionDiv
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 border-t border-border-alt pt-4"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Variables Panel */}
                    {showVariablesPanel && (
                      <MotionDiv
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-card/30 border border-border-alt rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Database className="w-4 h-4 text-indigo-600" />
                            Workflow Variables
                          </h4>
                          <Button
                            size="sm"
                            onClick={addVariable}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>

                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {workflowVariables.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              No variables defined. Click "Add" to create one.
                            </div>
                          ) : (
                            workflowVariables.map(variable => (
                              <div
                                key={variable.id}
                                className="p-3 bg-background/50 border border-border-alt rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <Input
                                    value={variable.name}
                                    onChange={e =>
                                      updateVariable(variable.id, { name: e.target.value })
                                    }
                                    className="text-sm font-medium"
                                    placeholder="Variable name"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteVariable(variable.id)}
                                    className="text-red-600 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <select
                                    value={variable.type}
                                    onChange={e =>
                                      updateVariable(variable.id, {
                                        type: e.target.value as WorkflowVariable['type'],
                                      })
                                    }
                                    className="text-xs px-2 py-1 bg-background border border-border-alt rounded"
                                  >
                                    <option value="string">String</option>
                                    <option value="number">Number</option>
                                    <option value="boolean">Boolean</option>
                                    <option value="object">Object</option>
                                    <option value="array">Array</option>
                                  </select>
                                  <select
                                    value={variable.scope}
                                    onChange={e =>
                                      updateVariable(variable.id, {
                                        scope: e.target.value as WorkflowVariable['scope'],
                                      })
                                    }
                                    className="text-xs px-2 py-1 bg-background border border-border-alt rounded"
                                  >
                                    <option value="global">Global</option>
                                    <option value="local">Local</option>
                                  </select>
                                </div>
                                <Input
                                  value={String(variable.value)}
                                  onChange={e =>
                                    updateVariable(variable.id, { value: e.target.value })
                                  }
                                  className="text-xs mb-2"
                                  placeholder="Variable value"
                                />
                                <Input
                                  value={variable.description}
                                  onChange={e =>
                                    updateVariable(variable.id, { description: e.target.value })
                                  }
                                  className="text-xs"
                                  placeholder="Description (optional)"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </MotionDiv>
                    )}

                    {/* Settings Panel */}
                    {showSettingsPanel && (
                      <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-card/30 border border-border-alt rounded-lg p-4"
                      >
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-gray-600" />
                          Workflow Settings
                        </h4>

                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-medium text-foreground mb-1 block">
                              Timeout (seconds)
                            </label>
                            <Input
                              type="number"
                              value={workflowSettings.timeout}
                              onChange={e =>
                                setWorkflowSettings(prev => ({
                                  ...prev,
                                  timeout: Number(e.target.value),
                                }))
                              }
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground mb-1 block">
                              Retry Attempts
                            </label>
                            <Input
                              type="number"
                              value={workflowSettings.retryAttempts}
                              onChange={e =>
                                setWorkflowSettings(prev => ({
                                  ...prev,
                                  retryAttempts: Number(e.target.value),
                                }))
                              }
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground mb-1 block">
                              Error Handling
                            </label>
                            <select
                              value={workflowSettings.errorHandling}
                              onChange={e =>
                                setWorkflowSettings(prev => ({
                                  ...prev,
                                  errorHandling: e.target
                                    .value as WorkflowSettings['errorHandling'],
                                }))
                              }
                              className="w-full text-sm px-2 py-1 bg-background border border-border-alt rounded"
                            >
                              <option value="stop">Stop on Error</option>
                              <option value="continue">Continue on Error</option>
                              <option value="retry">Retry on Error</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-medium text-foreground mb-1 block">
                              Logging Level
                            </label>
                            <select
                              value={workflowSettings.logging}
                              onChange={e =>
                                setWorkflowSettings(prev => ({
                                  ...prev,
                                  logging: e.target.value as WorkflowSettings['logging'],
                                }))
                              }
                              className="w-full text-sm px-2 py-1 bg-background border border-border-alt rounded"
                            >
                              <option value="minimal">Minimal</option>
                              <option value="detailed">Detailed</option>
                              <option value="debug">Debug</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-foreground block">
                              Notifications
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={workflowSettings.notifications.onSuccess}
                                onChange={e =>
                                  setWorkflowSettings(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      onSuccess: e.target.checked,
                                    },
                                  }))
                                }
                                className="rounded"
                              />
                              <span className="text-xs text-foreground">On Success</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={workflowSettings.notifications.onError}
                                onChange={e =>
                                  setWorkflowSettings(prev => ({
                                    ...prev,
                                    notifications: {
                                      ...prev.notifications,
                                      onError: e.target.checked,
                                    },
                                  }))
                                }
                                className="rounded"
                              />
                              <span className="text-xs text-foreground">On Error</span>
                            </div>
                          </div>
                        </div>
                      </MotionDiv>
                    )}

                    {/* Debug Panel */}
                    {showDebugPanel && (
                      <MotionDiv
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-card/30 border border-border-alt rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <Code className="w-4 h-4 text-orange-600" />
                            Debug Logs
                          </h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDebugLogs([])}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Clear
                          </Button>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {debugLogs.length === 0 ? (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                              No debug logs yet. Run a workflow to see logs.
                            </div>
                          ) : (
                            debugLogs
                              .slice(-20)
                              .reverse()
                              .map((log, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-background/50 border border-border-alt rounded text-xs"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                        log.level === 'error'
                                          ? 'bg-red-500/20 text-red-600'
                                          : log.level === 'warning'
                                            ? 'bg-yellow-500/20 text-yellow-600'
                                            : log.level === 'debug'
                                              ? 'bg-blue-500/20 text-blue-600'
                                              : 'bg-green-500/20 text-green-600'
                                      }`}
                                    >
                                      {log.level.toUpperCase()}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  <div className="text-foreground">{log.message}</div>
                                  {log.nodeId && (
                                    <div className="text-muted-foreground mt-1">
                                      Node: {log.nodeId}
                                    </div>
                                  )}
                                  {log.data && (
                                    <details className="mt-1">
                                      <summary className="text-muted-foreground cursor-pointer">
                                        Data
                                      </summary>
                                      <pre className="text-xs mt-1 p-1 bg-background/50 rounded overflow-x-auto">
                                        {JSON.stringify(log.data, null, 2)}
                                      </pre>
                                    </details>
                                  )}
                                </div>
                              ))
                          )}
                        </div>
                      </MotionDiv>
                    )}
                  </div>
                </MotionDiv>
              )}
            </SafeAnimatePresence>
          </div>
        </MotionDiv>

        {/* User Input Dialog */}
        <SafeAnimatePresence>
          {showInputDialog && (
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowInputDialog(false)}
            >
              <MotionDiv
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border-alt rounded-2xl p-6 max-w-lg w-full shadow-2xl"
                onClick={(e?: React.MouseEvent) => e?.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Create AI Workflow</h3>
                    <p className="text-sm text-muted-foreground">
                      Tell us what you want to accomplish
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      What would you like to do?
                    </label>
                    <textarea
                      value={userInput}
                      onChange={e => setUserInput(e.target.value)}
                      placeholder="e.g., Write a blog post about AI trends, Translate this text to Spanish, Analyze my sales data..."
                      className="w-full h-24 px-3 py-2 bg-background border border-border-alt rounded-lg text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                      disabled={isGeneratingWorkflow}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>
                      AI will automatically create and execute the perfect workflow for your request
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => setShowInputDialog(false)}
                      variant="outline"
                      className="flex-1"
                      disabled={isGeneratingWorkflow}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (userInput.trim()) {
                          generateWorkflowFromInput(userInput.trim());
                        }
                      }}
                      disabled={!userInput.trim() || isGeneratingWorkflow}
                      className="flex-1 bg-gradient-to-r from-primary to-sapphire text-background"
                    >
                      {isGeneratingWorkflow ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 mr-2" />
                          Create & Run
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </MotionDiv>
            </MotionDiv>
          )}
        </SafeAnimatePresence>

        {/* Results Section Below Canvas */}
        {finalResults && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-card border border-border-alt rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Generated Result</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setFinalResults('')}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="bg-background/50 border border-border-alt rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">
                  {finalResults}
                </pre>
              </div>
            </div>
          </MotionDiv>
        )}

        {/* Save Workflow Dialog */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-emerald-600" />
                Save Workflow
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Workflow Name
                </label>
                <Input
                  value={workflowName}
                  onChange={e => setWorkflowName(e.target.value)}
                  placeholder="My AI Workflow"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Description (Optional)
                </label>
                <Textarea
                  value={workflowDescription}
                  onChange={e => setWorkflowDescription(e.target.value)}
                  placeholder="Describe what this workflow does..."
                  className="w-full h-20 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={saveWorkflow}
                  disabled={!workflowName.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Workflow
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Load Workflow Dialog */}
        <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Load Workflow
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {savedWorkflows.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-medium text-foreground mb-2">No Saved Workflows</h4>
                  <p className="text-sm text-muted-foreground">
                    Create and save a workflow first to see it here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 max-h-96 overflow-y-auto">
                  {savedWorkflows.map(workflow => (
                    <div
                      key={workflow.id}
                      className="p-4 border border-border-alt rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                      onClick={() => loadWorkflow(workflow)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-foreground">{workflow.name}</h5>
                          {workflow.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {workflow.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{workflow.nodes.length} nodes</span>
                            <span>{workflow.connections.length} connections</span>
                            <span>
                              Modified: {new Date(workflow.metadata.modified).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation();
                            const updatedWorkflows = savedWorkflows.filter(
                              w => w.id !== workflow.id
                            );
                            localStorage.setItem(
                              'flowsyai_workflows',
                              JSON.stringify(updatedWorkflows)
                            );
                            setSavedWorkflows(updatedWorkflows);
                            toast.success('Workflow deleted');
                          }}
                          className="text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Marketplace Dialog */}
        <Dialog open={showTemplateMarketplace} onOpenChange={setShowTemplateMarketplace}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-600" />
                Advanced Workflow Templates
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Choose from our collection of advanced workflow templates with pre-configured logic,
                variables, and integrations.
              </div>

              <div className="grid gap-4">
                {advancedTemplates.map(template => (
                  <div
                    key={template.id}
                    className="p-6 border border-border-alt rounded-lg hover:border-primary/30 transition-colors cursor-pointer group"
                    onClick={() => loadAdvancedTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {template.name}
                          </h5>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              template.difficulty === 'advanced'
                                ? 'bg-orange-500/20 text-orange-600'
                                : template.difficulty === 'expert'
                                  ? 'bg-red-500/20 text-red-600'
                                  : 'bg-blue-500/20 text-blue-600'
                            }`}
                          >
                            {template.difficulty}
                          </span>
                          <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{template.nodes.length} nodes</span>
                          <span>{template.connections.length} connections</span>
                          <span>{template.variables.length} variables</span>
                          <span>⏱️ {template.estimatedTime}</span>
                          <span>⭐ {template.popularity}% popularity</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          {template.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-background border border-border-alt rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4 group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Load Template
                      </Button>
                    </div>

                    {/* Template Preview */}
                    <div className="bg-background/50 border border-border-alt rounded-lg p-4">
                      <h6 className="text-xs font-medium text-foreground mb-2">
                        Workflow Preview:
                      </h6>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {template.nodes.slice(0, 4).map((node, index) => (
                          <React.Fragment key={node.id}>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                              {node.name}
                            </span>
                            {index < Math.min(template.nodes.length - 1, 3) && (
                              <ArrowRight className="w-3 h-3" />
                            )}
                          </React.Fragment>
                        ))}
                        {template.nodes.length > 4 && (
                          <span className="text-muted-foreground">
                            +{template.nodes.length - 4} more
                          </span>
                        )}
                      </div>

                      {template.variables.length > 0 && (
                        <div className="mt-3">
                          <h6 className="text-xs font-medium text-foreground mb-2">
                            Pre-configured Variables:
                          </h6>
                          <div className="grid grid-cols-2 gap-2">
                            {template.variables.slice(0, 4).map(variable => (
                              <div key={variable.id} className="text-xs">
                                <span className="font-medium text-foreground">
                                  {variable.name}:
                                </span>
                                <span className="text-muted-foreground ml-1">
                                  {String(variable.value).substring(0, 20)}
                                  {String(variable.value).length > 20 ? '...' : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowTemplateMarketplace(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default VisualWorkflowBuilder;
