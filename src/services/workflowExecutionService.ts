import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { 
  WorkflowExecutor, 
  ExecutionResult, 
  WorkflowExecution, 
  NodeExecution,
  ExecutionContext,
  NodeExecutionResult,
  ExecutionStatus,
  ExecutionEvent,
  ExecutionEventListener
} from '@/types/execution';
import { Workflow } from '@/types/workflow';
import { NodeProcessorRegistry } from './nodeProcessors/nodeProcessorRegistry';

export class WorkflowExecutionService implements WorkflowExecutor {
  private nodeProcessorRegistry: NodeProcessorRegistry;
  private eventListeners: ExecutionEventListener[] = [];
  private activeExecutions: Map<string, ExecutionContext> = new Map();

  constructor() {
    this.nodeProcessorRegistry = new NodeProcessorRegistry();
  }

  async executeWorkflow(workflowId: string, inputs: Record<string, any>): Promise<ExecutionResult> {
    const startTime = new Date();
    logger.info('Starting workflow execution', { workflowId, inputs });

    try {
      // Get workflow data
      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      // Create execution record
      const execution = await this.createExecution(workflowId, inputs);
      
      // Create execution context
      const context: ExecutionContext = {
        executionId: execution.id,
        userId: execution.userId,
        workflowId,
        variables: { ...inputs },
        nodeResults: new Map(),
        startTime
      };

      this.activeExecutions.set(execution.id, context);
      this.emitEvent({
        type: 'execution_started',
        executionId: execution.id,
        timestamp: startTime
      });

      // Update execution status to running
      await this.updateExecutionStatus(execution.id, 'running', { startedAt: startTime });

      try {
        // Execute workflow nodes
        const nodeResults = await this.executeWorkflowNodes(workflow, context);
        
        // Calculate total processing time
        const endTime = new Date();
        const totalProcessingTime = endTime.getTime() - startTime.getTime();

        // Update execution as completed
        await this.updateExecutionStatus(execution.id, 'completed', {
          completedAt: endTime,
          outputs: this.collectOutputs(nodeResults)
        });

        const result: ExecutionResult = {
          executionId: execution.id,
          status: 'completed',
          outputs: this.collectOutputs(nodeResults),
          startTime,
          endTime,
          nodeResults,
          totalProcessingTime,
          aiUsage: await this.getAIUsageForExecution(execution.id)
        };

        this.emitEvent({
          type: 'execution_completed',
          executionId: execution.id,
          data: result,
          timestamp: endTime
        });

        logger.info('Workflow execution completed', { 
          executionId: execution.id, 
          processingTime: totalProcessingTime 
        });

        return result;

      } catch (error) {
        // Handle execution failure
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        await this.updateExecutionStatus(execution.id, 'failed', {
          errorMessage,
          completedAt: new Date()
        });

        this.emitEvent({
          type: 'execution_failed',
          executionId: execution.id,
          data: { error: errorMessage },
          timestamp: new Date()
        });

        logger.error('Workflow execution failed', { 
          executionId: execution.id, 
          error: errorMessage 
        });

        throw error;
      } finally {
        this.activeExecutions.delete(execution.id);
      }

    } catch (error) {
      logger.error('Failed to start workflow execution', { workflowId, error });
      throw error;
    }
  }

  async getExecutionStatus(executionId: string): Promise<WorkflowExecution | null> {
    try {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('id', executionId)
        .single();

      if (error) {
        logger.error('Failed to get execution status', { executionId, error });
        return null;
      }

      return this.mapExecutionData(data);
    } catch (error) {
      logger.error('Error getting execution status', { executionId, error });
      return null;
    }
  }

  async pauseExecution(executionId: string): Promise<void> {
    await this.updateExecutionStatus(executionId, 'paused');
    this.emitEvent({
      type: 'execution_paused',
      executionId,
      timestamp: new Date()
    });
  }

  async resumeExecution(executionId: string): Promise<void> {
    await this.updateExecutionStatus(executionId, 'running');
    // TODO: Implement resume logic
  }

  async cancelExecution(executionId: string): Promise<void> {
    await this.updateExecutionStatus(executionId, 'cancelled');
    this.activeExecutions.delete(executionId);
  }

  async getExecutionHistory(workflowId: string, limit: number = 50): Promise<WorkflowExecution[]> {
    try {
      const { data, error } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Failed to get execution history', { workflowId, error });
        return [];
      }

      return data.map(this.mapExecutionData);
    } catch (error) {
      logger.error('Error getting execution history', { workflowId, error });
      return [];
    }
  }

  async getNodeExecutions(executionId: string): Promise<NodeExecution[]> {
    try {
      const { data, error } = await supabase
        .from('node_executions')
        .select('*')
        .eq('execution_id', executionId)
        .order('created_at', { ascending: true });

      if (error) {
        logger.error('Failed to get node executions', { executionId, error });
        return [];
      }

      return data.map(this.mapNodeExecutionData);
    } catch (error) {
      logger.error('Error getting node executions', { executionId, error });
      return [];
    }
  }

  // Event system
  addEventListener(listener: ExecutionEventListener): void {
    this.eventListeners.push(listener);
  }

  removeEventListener(listener: ExecutionEventListener): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private emitEvent(event: ExecutionEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener.onExecutionEvent(event);
      } catch (error) {
        logger.error('Error in execution event listener', { error });
      }
    });
  }

  // Private helper methods
  private async getWorkflow(workflowId: string): Promise<Workflow | null> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', workflowId)
        .single();

      if (error) {
        logger.error('Failed to get workflow', { workflowId, error });
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        nodes: data.data?.nodes || [],
        edges: data.data?.edges || [],
        userId: data.user_id,
        isPublic: data.is_public,
        tags: data.data?.tags || [],
        category: data.data?.category || 'custom',
        status: data.data?.status || 'draft',
        version: data.data?.version || 1,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        executionCount: 0,
        settings: data.data?.settings || {}
      };
    } catch (error) {
      logger.error('Error getting workflow', { workflowId, error });
      return null;
    }
  }

  private async createExecution(workflowId: string, inputs: Record<string, any>): Promise<WorkflowExecution> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('workflow_executions')
        .insert({
          workflow_id: workflowId,
          user_id: userData.user.id,
          inputs,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create execution: ${error.message}`);
      }

      return this.mapExecutionData(data);
    } catch (error) {
      logger.error('Error creating execution', { workflowId, error });
      throw error;
    }
  }

  private async updateExecutionStatus(
    executionId: string,
    status: ExecutionStatus,
    additionalData?: Partial<WorkflowExecution>
  ): Promise<void> {
    try {
      const updateData: any = { status };

      if (additionalData?.startedAt) {
        updateData.started_at = additionalData.startedAt.toISOString();
      }
      if (additionalData?.completedAt) {
        updateData.completed_at = additionalData.completedAt.toISOString();
      }
      if (additionalData?.outputs) {
        updateData.outputs = additionalData.outputs;
      }
      if (additionalData?.errorMessage) {
        updateData.error_message = additionalData.errorMessage;
      }

      const { error } = await supabase
        .from('workflow_executions')
        .update(updateData)
        .eq('id', executionId);

      if (error) {
        throw new Error(`Failed to update execution status: ${error.message}`);
      }
    } catch (error) {
      logger.error('Error updating execution status', { executionId, status, error });
      throw error;
    }
  }

  private async executeWorkflowNodes(workflow: Workflow, context: ExecutionContext): Promise<NodeExecutionResult[]> {
    const results: NodeExecutionResult[] = [];
    const processedNodes = new Set<string>();

    // Find starting nodes (nodes with no incoming edges)
    const startingNodes = this.findStartingNodes(workflow);

    // Process nodes in topological order
    const nodeQueue = [...startingNodes];

    while (nodeQueue.length > 0) {
      const currentNode = nodeQueue.shift()!;

      if (processedNodes.has(currentNode.id)) {
        continue;
      }

      // Check if all dependencies are satisfied
      const dependencies = this.getNodeDependencies(workflow, currentNode.id);
      const allDependenciesMet = dependencies.every(depId => processedNodes.has(depId));

      if (!allDependenciesMet) {
        // Put node back in queue and continue
        nodeQueue.push(currentNode);
        continue;
      }

      try {
        // Process the node
        const nodeResult = await this.processNode(currentNode, context);
        results.push(nodeResult);
        context.nodeResults.set(currentNode.id, nodeResult);
        processedNodes.add(currentNode.id);

        // Add dependent nodes to queue
        const dependentNodes = this.getNodeDependents(workflow, currentNode.id);
        dependentNodes.forEach(node => {
          if (!processedNodes.has(node.id) && !nodeQueue.some(n => n.id === node.id)) {
            nodeQueue.push(node);
          }
        });

      } catch (error) {
        logger.error('Node processing failed', { nodeId: currentNode.id, error });
        throw error;
      }
    }

    return results;
  }

  private findStartingNodes(workflow: Workflow): any[] {
    return workflow.nodes.filter(node => {
      return !workflow.edges.some(edge => edge.target === node.id);
    });
  }

  private getNodeDependencies(workflow: Workflow, nodeId: string): string[] {
    return workflow.edges
      .filter(edge => edge.target === nodeId)
      .map(edge => edge.source);
  }

  private getNodeDependents(workflow: Workflow, nodeId: string): any[] {
    const dependentIds = workflow.edges
      .filter(edge => edge.source === nodeId)
      .map(edge => edge.target);

    return workflow.nodes.filter(node => dependentIds.includes(node.id));
  }

  private async processNode(node: any, context: ExecutionContext): Promise<NodeExecutionResult> {
    const startTime = new Date();

    this.emitEvent({
      type: 'node_started',
      executionId: context.executionId,
      nodeId: node.id,
      timestamp: startTime
    });

    try {
      // Get node processor
      const processor = this.nodeProcessorRegistry.getProcessor(node.type);
      if (!processor) {
        throw new Error(`No processor found for node type: ${node.type}`);
      }

      // Collect inputs from previous nodes
      const inputs = this.collectNodeInputs(node, context);

      // Process the node
      const result = await processor.processNode(node, inputs, context);

      this.emitEvent({
        type: 'node_completed',
        executionId: context.executionId,
        nodeId: node.id,
        data: result,
        timestamp: new Date()
      });

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      this.emitEvent({
        type: 'node_failed',
        executionId: context.executionId,
        nodeId: node.id,
        data: { error: errorMessage },
        timestamp: new Date()
      });

      throw error;
    }
  }

  private collectNodeInputs(node: any, context: ExecutionContext): Record<string, any> {
    const inputs: Record<string, any> = { ...context.variables };

    // Collect outputs from connected nodes
    const dependencies = context.nodeResults;
    dependencies.forEach((result, nodeId) => {
      if (result.outputs) {
        Object.assign(inputs, result.outputs);
      }
    });

    return inputs;
  }

  private collectOutputs(nodeResults: NodeExecutionResult[]): Record<string, any> {
    const outputs: Record<string, any> = {};

    nodeResults.forEach(result => {
      if (result.outputs) {
        Object.assign(outputs, result.outputs);
      }
    });

    return outputs;
  }

  private async getAIUsageForExecution(executionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_usage')
        .select('*')
        .eq('execution_id', executionId);

      if (error) {
        logger.error('Failed to get AI usage', { executionId, error });
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error getting AI usage', { executionId, error });
      return [];
    }
  }

  private mapExecutionData(data: any): WorkflowExecution {
    return {
      id: data.id,
      workflowId: data.workflow_id,
      userId: data.user_id,
      status: data.status,
      inputs: data.inputs || {},
      outputs: data.outputs || {},
      errorMessage: data.error_message,
      startedAt: data.started_at ? new Date(data.started_at) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapNodeExecutionData(data: any): NodeExecution {
    return {
      id: data.id,
      executionId: data.execution_id,
      nodeId: data.node_id,
      nodeType: data.node_type,
      status: data.status,
      inputs: data.inputs || {},
      outputs: data.outputs || {},
      errorMessage: data.error_message,
      startedAt: data.started_at ? new Date(data.started_at) : undefined,
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      processingTimeMs: data.processing_time_ms,
      createdAt: new Date(data.created_at)
    };
  }
}
