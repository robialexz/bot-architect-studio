// Execution types for workflow engine
export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export type ExecutionStatusType =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'cancelled';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  status: ExecutionStatusType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NodeExecution {
  id: string;
  executionId: string;
  nodeId: string;
  nodeType: string;
  status: ExecutionStatusType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  errorMessage?: string;
  startedAt?: Date;
  completedAt?: Date;
  processingTimeMs?: number;
  createdAt: Date;
}

export interface AIUsageRecord {
  id: string;
  userId: string;
  executionId?: string;
  nodeExecutionId?: string;
  serviceProvider: string; // 'openai', 'anthropic', etc.
  modelName: string;
  tokensUsed: number;
  estimatedCost: number;
  requestData: Record<string, unknown>;
  responseData: Record<string, unknown>;
  createdAt: Date;
}

export interface ExecutionResult {
  executionId: string;
  status: ExecutionStatusType;
  outputs: Record<string, unknown>;
  error?: string;
  startTime: Date;
  endTime?: Date;
  nodeResults: NodeExecutionResult[];
  totalProcessingTime?: number;
  aiUsage: AIUsageRecord[];
}

export interface NodeExecutionResult {
  nodeId: string;
  nodeType: string;
  status: ExecutionStatusType;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  error?: string;
  processingTime?: number;
  aiUsage?: AIUsageRecord;
}

export interface ExecutionContext {
  executionId: string;
  userId: string;
  workflowId: string;
  variables: Record<string, unknown>;
  nodeResults: Map<string, NodeExecutionResult>;
  startTime: Date;
}

export interface NodeProcessor {
  processNode(
    node: Record<string, unknown>,
    inputs: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<NodeExecutionResult>;

  canProcess(nodeType: string): boolean;

  getRequiredInputs(node: Record<string, unknown>): string[];

  validateInputs(node: Record<string, unknown>, inputs: Record<string, unknown>): boolean;
}

export interface WorkflowExecutor {
  executeWorkflow(workflowId: string, inputs: Record<string, unknown>): Promise<ExecutionResult>;

  getExecutionStatus(executionId: string): Promise<WorkflowExecution | null>;

  pauseExecution(executionId: string): Promise<void>;

  resumeExecution(executionId: string): Promise<void>;

  cancelExecution(executionId: string): Promise<void>;

  getExecutionHistory(workflowId: string, limit?: number): Promise<WorkflowExecution[]>;

  getNodeExecutions(executionId: string): Promise<NodeExecution[]>;
}

// AI Service interfaces
export interface AIRequest {
  nodeId: string;
  nodeType: string;
  service: 'openai' | 'anthropic' | 'google' | 'huggingface' | 'stability' | 'cohere';
  model: string;
  prompt?: string;
  inputs: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface AIResponse {
  success: boolean;
  data: unknown;
  error?: string;
  tokensUsed?: number;
  estimatedCost?: number;
  processingTime?: number;
  model?: string;
}

export interface AIServiceProxy {
  executeAIRequest(request: AIRequest, userId: string): Promise<AIResponse>;

  validateAPIKey(service: string): boolean;

  checkRateLimit(userId: string, service: string): boolean;

  trackUsage(userId: string, usage: AIUsageRecord): Promise<void>;

  getUsageStats(userId: string, timeframe?: 'day' | 'week' | 'month'): Promise<UsageStats>;
}

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  serviceBreakdown: Record<
    string,
    {
      requests: number;
      tokens: number;
      cost: number;
    }
  >;
}

// Workflow execution events for real-time updates
export interface ExecutionEvent {
  type:
    | 'execution_started'
    | 'execution_completed'
    | 'execution_failed'
    | 'node_started'
    | 'node_completed'
    | 'node_failed'
    | 'execution_paused';
  executionId: string;
  nodeId?: string;
  data?: unknown;
  timestamp: Date;
}

export interface ExecutionEventListener {
  onExecutionEvent(event: ExecutionEvent): void;
}
