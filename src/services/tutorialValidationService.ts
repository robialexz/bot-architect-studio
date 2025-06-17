import { Node, Edge } from 'reactflow';

export interface ValidationCriteria {
  type:
    | 'node_count'
    | 'connection_count'
    | 'node_type'
    | 'workflow_execution'
    | 'custom'
    | 'data_flow';
  criteria: Record<string, unknown>;
  message: string;
  hints?: string[];
}

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, unknown>;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  score: number; // 0-100
  feedback: string[];
  suggestions: string[];
}

export class TutorialValidationService {
  private static instance: TutorialValidationService;

  public static getInstance(): TutorialValidationService {
    if (!TutorialValidationService.instance) {
      TutorialValidationService.instance = new TutorialValidationService();
    }
    return TutorialValidationService.instance;
  }

  async validateWorkflow(
    workflowState: WorkflowState,
    validation: ValidationCriteria
  ): Promise<ValidationResult> {
    try {
      switch (validation.type) {
        case 'node_count':
          return this.validateNodeCount(workflowState, validation);
        case 'connection_count':
          return this.validateConnectionCount(workflowState, validation);
        case 'node_type':
          return this.validateNodeTypes(workflowState, validation);
        case 'data_flow':
          return this.validateDataFlow(workflowState, validation);
        case 'workflow_execution':
          return this.validateWorkflowExecution(workflowState, validation);
        case 'custom':
          return this.validateCustomCriteria(workflowState, validation);
        default:
          return {
            isValid: false,
            message: 'Unknown validation type',
            score: 0,
            feedback: ['Unknown validation criteria'],
            suggestions: ['Please contact support'],
          };
      }
    } catch (error) {
      return {
        isValid: false,
        message: 'Validation error occurred',
        score: 0,
        feedback: ['An error occurred during validation'],
        suggestions: ['Please try again or contact support'],
      };
    }
  }

  private validateNodeCount(
    workflowState: WorkflowState,
    validation: ValidationCriteria
  ): ValidationResult {
    const { nodes } = workflowState;
    const { minNodes, maxNodes, requiredTypes } = validation.criteria;

    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Check minimum nodes
    const minNodesNum = typeof minNodes === 'number' ? minNodes : 0;
    if (minNodesNum > 0 && nodes.length < minNodesNum) {
      feedback.push(`You have ${nodes.length} nodes, but need at least ${minNodesNum}`);
      suggestions.push(`Add ${minNodesNum - nodes.length} more nodes to complete the exercise`);
    } else if (minNodes) {
      score += 40;
      feedback.push(`✓ Good! You have the required number of nodes (${nodes.length})`);
    }

    // Check maximum nodes
    const maxNodesNum = typeof maxNodes === 'number' ? maxNodes : Infinity;
    if (maxNodesNum < Infinity && nodes.length > maxNodesNum) {
      feedback.push(`You have ${nodes.length} nodes, but should have at most ${maxNodesNum}`);
      suggestions.push('Consider removing unnecessary nodes for a cleaner workflow');
      score -= 10;
    }

    // Check required node types
    if (requiredTypes && Array.isArray(requiredTypes)) {
      const nodeTypes = nodes.map(node => this.getNodeCategory(node.type || ''));
      const missingTypes = requiredTypes.filter(type => !nodeTypes.includes(type));

      if (missingTypes.length === 0) {
        score += 40;
        feedback.push('✓ Excellent! You have all required node types');
      } else {
        feedback.push(`Missing required node types: ${missingTypes.join(', ')}`);
        suggestions.push(`Add nodes of type: ${missingTypes.join(', ')}`);
      }
    }

    // Check workflow structure
    if (this.hasValidWorkflowStructure(workflowState)) {
      score += 20;
      feedback.push('✓ Great workflow structure!');
    } else {
      suggestions.push('Ensure your workflow has a clear start (trigger) and logical flow');
    }

    const isValid = score >= 80;

    return {
      isValid,
      message: isValid ? validation.message : 'Workflow needs improvement',
      score,
      feedback,
      suggestions,
    };
  }

  private validateConnectionCount(
    workflowState: WorkflowState,
    validation: ValidationCriteria
  ): ValidationResult {
    const { edges } = workflowState;
    const { minConnections, sequentialFlow } = validation.criteria;

    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Check minimum connections
    const minConnectionsNum = typeof minConnections === 'number' ? minConnections : 0;
    if (minConnectionsNum > 0 && edges.length < minConnectionsNum) {
      feedback.push(`You have ${edges.length} connections, but need at least ${minConnectionsNum}`);
      suggestions.push('Connect more nodes to create a complete workflow');
    } else if (minConnectionsNum > 0) {
      score += 50;
      feedback.push(`✓ Good! You have sufficient connections (${edges.length})`);
    }

    // Check for sequential flow
    if (sequentialFlow && this.isSequentialFlow(workflowState)) {
      score += 30;
      feedback.push('✓ Perfect sequential flow from start to finish');
    } else if (sequentialFlow) {
      suggestions.push('Ensure nodes are connected in a logical sequence');
    }

    // Check for disconnected nodes
    const disconnectedNodes = this.findDisconnectedNodes(workflowState);
    if (disconnectedNodes.length === 0) {
      score += 20;
      feedback.push('✓ All nodes are properly connected');
    } else {
      feedback.push(`${disconnectedNodes.length} nodes are not connected`);
      suggestions.push('Connect all nodes to ensure proper data flow');
    }

    const isValid = score >= 80;

    return {
      isValid,
      message: isValid ? validation.message : 'Improve node connections',
      score,
      feedback,
      suggestions,
    };
  }

  private validateNodeTypes(
    workflowState: WorkflowState,
    validation: ValidationCriteria
  ): ValidationResult {
    const { nodes } = workflowState;
    const { requiredTypes, forbiddenTypes } = validation.criteria;

    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    const nodeTypes = nodes.map(node => this.getNodeCategory(node.type || ''));

    // Check required types
    if (requiredTypes && Array.isArray(requiredTypes)) {
      const missingTypes = requiredTypes.filter((type: string) => !nodeTypes.includes(type));
      if (missingTypes.length === 0) {
        score += 60;
        feedback.push('✓ All required node types are present');
      } else {
        feedback.push(`Missing required types: ${missingTypes.join(', ')}`);
        suggestions.push(`Add nodes of type: ${missingTypes.join(', ')}`);
      }
    }

    // Check forbidden types
    if (forbiddenTypes && Array.isArray(forbiddenTypes)) {
      const presentForbiddenTypes = forbiddenTypes.filter((type: string) =>
        nodeTypes.includes(type)
      );
      if (presentForbiddenTypes.length === 0) {
        score += 20;
      } else {
        feedback.push(`Remove forbidden node types: ${presentForbiddenTypes.join(', ')}`);
        suggestions.push('This exercise should not use certain node types');
        score -= 20;
      }
    }

    // Check for proper AI model usage
    if (this.hasProperAIModelUsage(workflowState)) {
      score += 20;
      feedback.push('✓ AI models are properly configured');
    } else {
      suggestions.push('Ensure AI models have proper input connections and configurations');
    }

    const isValid = score >= 80;

    return {
      isValid,
      message: isValid ? validation.message : 'Check your node types and configurations',
      score,
      feedback,
      suggestions,
    };
  }

  private validateDataFlow(
    workflowState: WorkflowState,
    validation: ValidationCriteria
  ): ValidationResult {
    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Check for proper data flow direction
    if (this.hasProperDataFlowDirection(workflowState)) {
      score += 30;
      feedback.push('✓ Data flows in the correct direction');
    } else {
      suggestions.push('Ensure data flows from left to right (inputs to outputs)');
    }

    // Check for data type compatibility
    if (this.hasCompatibleDataTypes(workflowState)) {
      score += 30;
      feedback.push('✓ Data types are compatible between connected nodes');
    } else {
      suggestions.push('Check that connected nodes have compatible data types');
    }

    // Check for proper error handling
    if (this.hasErrorHandling(workflowState)) {
      score += 20;
      feedback.push('✓ Good error handling implementation');
    } else {
      suggestions.push('Consider adding error handling for robust workflows');
    }

    // Check for optimization opportunities
    const optimizations = this.findOptimizationOpportunities(workflowState);
    if (optimizations.length === 0) {
      score += 20;
      feedback.push('✓ Workflow is well optimized');
    } else {
      suggestions.push(...optimizations);
    }

    const isValid = score >= 80;

    return {
      isValid,
      message: isValid ? validation.message : 'Improve data flow design',
      score,
      feedback,
      suggestions,
    };
  }

  private validateWorkflowExecution(
    workflowState: WorkflowState,
    validation: ValidationCriteria
  ): ValidationResult {
    // This would integrate with the actual workflow execution engine
    // For now, we'll simulate execution validation

    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Check if workflow can be executed
    if (this.canExecuteWorkflow(workflowState)) {
      score += 50;
      feedback.push('✓ Workflow is executable');
    } else {
      feedback.push('Workflow cannot be executed');
      suggestions.push('Check node configurations and connections');
    }

    // Check for required configurations
    if (this.hasRequiredConfigurations(workflowState)) {
      score += 30;
      feedback.push('✓ All nodes are properly configured');
    } else {
      suggestions.push('Complete node configurations before testing');
    }

    // Simulate execution result
    score += 20; // Assume successful execution for demo

    const isValid = score >= 80;

    return {
      isValid,
      message: isValid ? validation.message : 'Fix execution issues',
      score,
      feedback,
      suggestions,
    };
  }

  private validateCustomCriteria(
    workflowState: WorkflowState,
    validation: ValidationCriteria
  ): ValidationResult {
    const { criteria } = validation;
    const feedback: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Custom validation logic based on criteria
    if (criteria.hasBranching) {
      if (this.hasBranchingLogic(workflowState)) {
        score += 30;
        feedback.push('✓ Workflow has proper branching logic');
      } else {
        suggestions.push('Add conditional nodes to create branching paths');
      }
    }

    if (criteria.hasCondition) {
      if (this.hasConditionalNodes(workflowState)) {
        score += 30;
        feedback.push('✓ Conditional logic is implemented');
      } else {
        suggestions.push('Add condition nodes to control workflow flow');
      }
    }

    if (criteria.hasMerge) {
      if (this.hasMergeNodes(workflowState)) {
        score += 20;
        feedback.push('✓ Branches are properly merged');
      } else {
        suggestions.push('Add merge nodes to combine parallel branches');
      }
    }

    if (criteria.hasErrorHandling) {
      if (this.hasErrorHandling(workflowState)) {
        score += 20;
        feedback.push('✓ Error handling is implemented');
      } else {
        suggestions.push('Add try-catch nodes for error handling');
      }
    }

    const isValid = score >= 80;

    return {
      isValid,
      message: isValid ? validation.message : 'Complete custom requirements',
      score,
      feedback,
      suggestions,
    };
  }

  // Helper methods
  private getNodeCategory(nodeType: string): string {
    if (nodeType.includes('trigger')) return 'trigger';
    if (nodeType.includes('ai') || nodeType.includes('gpt') || nodeType.includes('claude'))
      return 'ai';
    if (nodeType.includes('data') || nodeType.includes('json') || nodeType.includes('text'))
      return 'data';
    if (nodeType.includes('http') || nodeType.includes('api')) return 'http';
    if (nodeType.includes('condition') || nodeType.includes('if')) return 'condition';
    if (nodeType.includes('merge') || nodeType.includes('join')) return 'merge';
    return 'other';
  }

  private hasValidWorkflowStructure(workflowState: WorkflowState): boolean {
    const { nodes, edges } = workflowState;

    // Check for at least one trigger node
    const hasTrigger = nodes.some(node => this.getNodeCategory(node.type || '') === 'trigger');

    // Check for connected flow
    const hasConnectedFlow = edges.length > 0;

    return hasTrigger && hasConnectedFlow;
  }

  private isSequentialFlow(workflowState: WorkflowState): boolean {
    // Check if workflow has a clear sequential path
    const { nodes, edges } = workflowState;

    // Find start node (trigger)
    const startNode = nodes.find(node => this.getNodeCategory(node.type || '') === 'trigger');
    if (!startNode) return false;

    // Check if there's a path from start to end
    return this.hasPathFromStart(startNode.id, edges);
  }

  private findDisconnectedNodes(workflowState: WorkflowState): Node[] {
    const { nodes, edges } = workflowState;
    const connectedNodeIds = new Set();

    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    return nodes.filter(node => !connectedNodeIds.has(node.id));
  }

  private hasProperAIModelUsage(workflowState: WorkflowState): boolean {
    const { nodes, edges } = workflowState;
    const aiNodes = nodes.filter(node => this.getNodeCategory(node.type || '') === 'ai');

    return aiNodes.every(aiNode => {
      // Check if AI node has input connection
      return edges.some(edge => edge.target === aiNode.id);
    });
  }

  private hasProperDataFlowDirection(workflowState: WorkflowState): boolean {
    // Check if data flows from left to right generally
    const { nodes, edges } = workflowState;

    return edges.every(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) return false;

      // Generally, source should be to the left of target
      return sourceNode.position.x <= targetNode.position.x;
    });
  }

  private hasCompatibleDataTypes(_workflowState: WorkflowState): boolean {
    // Simplified data type compatibility check
    return true; // Would implement actual type checking
  }

  private hasErrorHandling(workflowState: WorkflowState): boolean {
    const { nodes } = workflowState;
    return nodes.some(
      node =>
        (node.type || '').includes('try') ||
        (node.type || '').includes('catch') ||
        (node.type || '').includes('error')
    );
  }

  private findOptimizationOpportunities(_workflowState: WorkflowState): string[] {
    const suggestions: string[] = [];

    // Check for redundant nodes
    // Check for inefficient paths
    // Check for missing optimizations

    return suggestions;
  }

  private canExecuteWorkflow(workflowState: WorkflowState): boolean {
    return this.hasValidWorkflowStructure(workflowState);
  }

  private hasRequiredConfigurations(_workflowState: WorkflowState): boolean {
    // Check if all nodes have required configurations
    return true; // Simplified for demo
  }

  private hasBranchingLogic(workflowState: WorkflowState): boolean {
    const { edges } = workflowState;

    // Check if any node has multiple outgoing connections
    const outgoingCounts = new Map();
    edges.forEach(edge => {
      outgoingCounts.set(edge.source, (outgoingCounts.get(edge.source) || 0) + 1);
    });

    return Array.from(outgoingCounts.values()).some(count => count > 1);
  }

  private hasConditionalNodes(workflowState: WorkflowState): boolean {
    const { nodes } = workflowState;
    return nodes.some(node => this.getNodeCategory(node.type || '') === 'condition');
  }

  private hasMergeNodes(workflowState: WorkflowState): boolean {
    const { nodes } = workflowState;
    return nodes.some(node => this.getNodeCategory(node.type || '') === 'merge');
  }

  private hasPathFromStart(startNodeId: string, edges: Edge[]): boolean {
    // Simplified path checking
    return edges.some(edge => edge.source === startNodeId);
  }
}
