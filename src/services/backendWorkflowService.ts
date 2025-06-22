/**
 * Backend Workflow Service
 * Replaces the frontend workflowService with Python backend integration
 */

import { apiClient } from './apiClient';
import { logger } from '@/lib/logger';

// Types
export interface WorkflowData {
  id?: number;
  name: string;
  description?: string;
  workflow_data: Record<string, any>;
  tags?: string[];
  category?: string;
  status?: 'draft' | 'active' | 'paused' | 'archived';
  visibility?: 'private' | 'public' | 'shared';
}

export interface WorkflowResponse extends WorkflowData {
  id: number;
  version: string;
  execution_count: number;
  success_count: number;
  failure_count: number;
  avg_execution_time: number;
  success_rate: number;
  tokens_used: number;
  api_calls_made: number;
  is_template: boolean;
  is_featured: boolean;
  clone_count: number;
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  owner_id: number;
}

export interface WorkflowExecution {
  id: number;
  status: string;
  input_data?: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  execution_time?: number;
  tokens_used: number;
  api_calls_made: number;
  trigger_type?: string;
  trigger_data?: Record<string, any>;
  started_at: string;
  completed_at?: string;
  workflow_id: number;
  user_id: number;
}

export interface WorkflowSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  status?: string;
  visibility?: string;
  is_template?: boolean;
  limit?: number;
  offset?: number;
}

class BackendWorkflowService {
  private readonly baseUrl = '/workflows';

  /**
   * Create a new workflow
   */
  async createWorkflow(workflowData: Omit<WorkflowData, 'id'>): Promise<WorkflowResponse> {
    try {
      logger.info('Creating workflow:', workflowData.name);
      
      const response = await apiClient.post<WorkflowResponse>(this.baseUrl, workflowData);
      
      logger.info('Workflow created successfully:', response.id);
      return response;
    } catch (error) {
      logger.error('Failed to create workflow:', error);
      throw new Error('Failed to create workflow');
    }
  }

  /**
   * Get all workflows with optional filtering
   */
  async getWorkflows(params: WorkflowSearchParams = {}): Promise<WorkflowResponse[]> {
    try {
      logger.debug('Fetching workflows with params:', params);
      
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('query', params.query);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.visibility) queryParams.append('visibility', params.visibility);
      if (params.is_template !== undefined) queryParams.append('is_template', params.is_template.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      
      const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
      const workflows = await apiClient.get<WorkflowResponse[]>(url);
      
      logger.debug(`Fetched ${workflows.length} workflows`);
      return workflows;
    } catch (error) {
      logger.error('Failed to fetch workflows:', error);
      throw new Error('Failed to fetch workflows');
    }
  }

  /**
   * Get a specific workflow by ID
   */
  async getWorkflow(id: number): Promise<WorkflowResponse> {
    try {
      logger.debug('Fetching workflow:', id);
      
      const workflow = await apiClient.get<WorkflowResponse>(`${this.baseUrl}/${id}`);
      
      logger.debug('Workflow fetched successfully:', workflow.name);
      return workflow;
    } catch (error) {
      logger.error('Failed to fetch workflow:', error);
      throw new Error('Failed to fetch workflow');
    }
  }

  /**
   * Update an existing workflow
   */
  async updateWorkflow(id: number, updates: Partial<WorkflowData>): Promise<WorkflowResponse> {
    try {
      logger.info('Updating workflow:', id);
      
      const workflow = await apiClient.put<WorkflowResponse>(`${this.baseUrl}/${id}`, updates);
      
      logger.info('Workflow updated successfully:', workflow.name);
      return workflow;
    } catch (error) {
      logger.error('Failed to update workflow:', error);
      throw new Error('Failed to update workflow');
    }
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: number): Promise<void> {
    try {
      logger.info('Deleting workflow:', id);
      
      await apiClient.delete(`${this.baseUrl}/${id}`);
      
      logger.info('Workflow deleted successfully');
    } catch (error) {
      logger.error('Failed to delete workflow:', error);
      throw new Error('Failed to delete workflow');
    }
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(id: number, inputData: Record<string, any> = {}): Promise<WorkflowExecution> {
    try {
      logger.info('Executing workflow:', id);
      
      const execution = await apiClient.post<WorkflowExecution>(
        `${this.baseUrl}/${id}/execute`,
        { input_data: inputData }
      );
      
      logger.info('Workflow execution started:', execution.id);
      return execution;
    } catch (error) {
      logger.error('Failed to execute workflow:', error);
      throw new Error('Failed to execute workflow');
    }
  }

  /**
   * Get workflow execution status
   */
  async getExecutionStatus(executionId: number): Promise<WorkflowExecution> {
    try {
      const execution = await apiClient.get<WorkflowExecution>(`/executions/${executionId}`);
      return execution;
    } catch (error) {
      logger.error('Failed to get execution status:', error);
      throw new Error('Failed to get execution status');
    }
  }

  /**
   * Get workflow executions history
   */
  async getWorkflowExecutions(workflowId: number, limit = 20): Promise<WorkflowExecution[]> {
    try {
      const executions = await apiClient.get<WorkflowExecution[]>(
        `${this.baseUrl}/${workflowId}/executions?limit=${limit}`
      );
      return executions;
    } catch (error) {
      logger.error('Failed to get workflow executions:', error);
      throw new Error('Failed to get workflow executions');
    }
  }

  /**
   * Clone a workflow
   */
  async cloneWorkflow(id: number, name?: string): Promise<WorkflowResponse> {
    try {
      logger.info('Cloning workflow:', id);
      
      const cloned = await apiClient.post<WorkflowResponse>(`${this.baseUrl}/${id}/clone`, {
        name: name || `Copy of Workflow ${id}`
      });
      
      logger.info('Workflow cloned successfully:', cloned.id);
      return cloned;
    } catch (error) {
      logger.error('Failed to clone workflow:', error);
      throw new Error('Failed to clone workflow');
    }
  }

  /**
   * Search workflows
   */
  async searchWorkflows(query: string, filters: Partial<WorkflowSearchParams> = {}): Promise<WorkflowResponse[]> {
    return this.getWorkflows({ ...filters, query });
  }

  /**
   * Get workflow templates
   */
  async getTemplates(): Promise<WorkflowResponse[]> {
    return this.getWorkflows({ is_template: true, visibility: 'public' });
  }

  /**
   * Get user's workflows
   */
  async getUserWorkflows(): Promise<WorkflowResponse[]> {
    return this.getWorkflows({ visibility: 'private' });
  }

  /**
   * Get public workflows
   */
  async getPublicWorkflows(): Promise<WorkflowResponse[]> {
    return this.getWorkflows({ visibility: 'public' });
  }
}

// Create singleton instance
export const backendWorkflowService = new BackendWorkflowService();

// Export default
export default backendWorkflowService;
