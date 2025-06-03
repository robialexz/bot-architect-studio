// Enhanced workflow service for AI automation platform
import { supabase } from '@/lib/supabase';
import {
  Workflow,
  WorkflowNode,
  Edge,
  WorkflowStatus,
  WorkflowCategory,
} from '@/types/workflow';
import {
  ExecutionResult,
  NodeExecutionResult,
  ExecutionStatus,
} from '@/types/execution';
import {
  NodeTemplate,
  WorkflowTemplate,
  NodeExecutionContext,
  NodeExecutionResponse,
  ExecutionUpdate,
} from '@/types/nodeTemplates';

export class EnhancedWorkflowService {
  private static instance: EnhancedWorkflowService;
  private executionListeners: Map<string, (update: ExecutionUpdate) => void> = new Map();

  static getInstance(): EnhancedWorkflowService {
    if (!EnhancedWorkflowService.instance) {
      EnhancedWorkflowService.instance = new EnhancedWorkflowService();
    }
    return EnhancedWorkflowService.instance;
  }

  // Workflow CRUD operations
  async createWorkflow(
    workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Workflow> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert({
          ...workflow,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToWorkflow(data);
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw new Error('Failed to create workflow');
    }
  }

  async getWorkflow(id: string): Promise<Workflow | null> {
    try {
      const { data, error } = await supabase.from('workflows').select('*').eq('id', id).single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return this.mapDatabaseToWorkflow(data);
    } catch (error) {
      console.error('Error fetching workflow:', error);
      throw new Error('Failed to fetch workflow');
    }
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToWorkflow(data);
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw new Error('Failed to update workflow');
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('workflows').delete().eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw new Error('Failed to delete workflow');
    }
  }

  async getUserWorkflows(userId: string): Promise<Workflow[]> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data.map(this.mapDatabaseToWorkflow);
    } catch (error) {
      console.error('Error fetching user workflows:', error);
      throw new Error('Failed to fetch workflows');
    }
  }

  async getPublicWorkflows(category?: WorkflowCategory): Promise<Workflow[]> {
    try {
      let query = supabase.from('workflows').select('*').eq('is_public', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('execution_count', { ascending: false });

      if (error) throw error;
      return data.map(this.mapDatabaseToWorkflow);
    } catch (error) {
      console.error('Error fetching public workflows:', error);
      throw new Error('Failed to fetch public workflows');
    }
  }

  // Workflow execution
  async executeWorkflow(
    workflowId: string,
    inputs?: Record<string, unknown>
  ): Promise<ExecutionResult> {
    try {
      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error('Workflow not found');
      }

      const executionId = crypto.randomUUID();
      const execution: ExecutionResult = {
        id: executionId,
        workflowId,
        status: ExecutionStatus.RUNNING,
        startTime: new Date().toISOString(),
        nodeResults: {},
        triggeredBy: 'manual',
      };

      // Save execution record
      await this.saveExecutionResult(execution);

      // Execute nodes in topological order
      const sortedNodes = this.topologicalSort(workflow.nodes, workflow.edges);
      const nodeResults: Record<string, unknown> = {};

      for (const node of sortedNodes) {
        try {
          this.notifyExecutionUpdate({
            executionId,
            nodeId: node.id,
            status: 'started',
            timestamp: new Date().toISOString(),
          });

          const context: NodeExecutionContext = {
            nodeId: node.id,
            workflowId,
            executionId,
            inputs: this.getNodeInputs(node, nodeResults, inputs),
            configuration: node.data.config || {},
            previousResults: nodeResults,
            userId: workflow.userId,
            environment: 'production',
            secrets: {}, // TODO: Implement secrets management
          };

          const result = await this.executeNode(node, context);

          const nodeResult: NodeExecutionResult = {
            nodeId: node.id,
            status: result.success ? ExecutionStatus.SUCCESS : ExecutionStatus.ERROR,
            input: context.inputs,
            output: result.outputs,
            error: result.error,
            duration: 0, // TODO: Implement timing
            timestamp: new Date().toISOString(),
          };

          execution.nodeResults[node.id] = nodeResult;
          nodeResults[node.id] = result.outputs;

          this.notifyExecutionUpdate({
            executionId,
            nodeId: node.id,
            status: result.success ? 'completed' : 'error',
            timestamp: new Date().toISOString(),
            data: result.outputs,
            error: result.error,
          });

          if (!result.success) {
            execution.status = ExecutionStatus.ERROR;
            execution.error = result.error;
            break;
          }
        } catch (error) {
          execution.status = ExecutionStatus.ERROR;
          execution.error = error instanceof Error ? error.message : 'Unknown error';
          break;
        }
      }

      execution.endTime = new Date().toISOString();
      if (execution.status === ExecutionStatus.RUNNING) {
        execution.status = ExecutionStatus.SUCCESS;
      }

      // Update execution record
      await this.saveExecutionResult(execution);

      // Update workflow execution count
      await this.updateWorkflow(workflowId, {
        ...workflow,
        executionCount: workflow.executionCount + 1,
        lastExecuted: execution.endTime,
      });

      return execution;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw new Error('Failed to execute workflow');
    }
  }

  // Node execution
  private async executeNode(
    node: WorkflowNode,
    context: NodeExecutionContext
  ): Promise<NodeExecutionResponse> {
    // This is where we'll implement the actual node execution logic
    // For now, return a mock response
    return {
      success: true,
      outputs: { result: `Executed ${node.type} node` },
      logs: [`Node ${node.id} executed successfully`],
    };
  }

  // Utility methods
  private topologicalSort(nodes: WorkflowNode[], edges: Edge[]): WorkflowNode[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize graph
    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    // Build graph and calculate in-degrees
    edges.forEach(edge => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Topological sort using Kahn's algorithm
    const queue: string[] = [];
    const result: WorkflowNode[] = [];

    // Find nodes with no incoming edges
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        result.push(node);
      }

      // Reduce in-degree for adjacent nodes
      graph.get(nodeId)?.forEach(adjacentId => {
        const newDegree = (inDegree.get(adjacentId) || 0) - 1;
        inDegree.set(adjacentId, newDegree);
        if (newDegree === 0) {
          queue.push(adjacentId);
        }
      });
    }

    return result;
  }

  private getNodeInputs(
    node: WorkflowNode,
    nodeResults: Record<string, unknown>,
    initialInputs?: Record<string, unknown>
  ): Record<string, unknown> {
    // TODO: Implement proper input resolution based on edges
    return initialInputs || {};
  }

  private async saveExecutionResult(execution: ExecutionResult): Promise<void> {
    try {
      const { error } = await supabase.from('workflow_executions').upsert({
        id: execution.id,
        workflow_id: execution.workflowId,
        status: execution.status,
        start_time: execution.startTime,
        end_time: execution.endTime,
        duration: execution.duration,
        node_results: execution.nodeResults,
        error: execution.error,
        triggered_by: execution.triggeredBy,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving execution result:', error);
    }
  }

  private notifyExecutionUpdate(update: ExecutionUpdate): void {
    const listener = this.executionListeners.get(update.executionId);
    if (listener) {
      listener(update);
    }
  }

  // Real-time execution monitoring
  subscribeToExecution(
    executionId: string,
    callback: (update: ExecutionUpdate) => void
  ): () => void {
    this.executionListeners.set(executionId, callback);
    return () => {
      this.executionListeners.delete(executionId);
    };
  }

  // Database mapping
  private mapDatabaseToWorkflow(data: Record<string, unknown>): Workflow {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      nodes: data.nodes || [],
      edges: data.edges || [],
      userId: data.user_id,
      isPublic: data.is_public,
      tags: data.tags || [],
      category: data.category,
      status: data.status,
      version: data.version || 1,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastExecuted: data.last_executed,
      executionCount: data.execution_count || 0,
      settings: data.settings || {
        autoSave: true,
        executionTimeout: 300,
        retryOnFailure: false,
        maxRetries: 3,
        enableLogging: true,
        enableAnalytics: true,
      },
    };
  }
}
