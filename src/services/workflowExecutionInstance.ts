import { WorkflowExecutionService } from './workflowExecutionService';
import { logger } from '@/lib/logger';

// Create singleton instance of the workflow execution service
export const workflowExecutionService = new WorkflowExecutionService();

// Initialize the service
logger.info('Workflow execution service initialized');

// Export the service for use throughout the application
export default workflowExecutionService;
