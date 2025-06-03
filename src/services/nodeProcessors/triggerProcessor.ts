import { NodeProcessor, NodeExecutionResult, ExecutionContext } from '@/types/execution';
import { logger } from '@/lib/logger';

export class TriggerProcessor implements NodeProcessor {
  
  canProcess(nodeType: string): boolean {
    return ['trigger', 'start', 'input', 'manual'].includes(nodeType);
  }

  getRequiredInputs(node: any): string[] {
    // Trigger nodes typically don't require specific inputs
    // They use whatever inputs are provided to the workflow
    return [];
  }

  validateInputs(node: any, inputs: Record<string, any>): boolean {
    // Trigger nodes are flexible with inputs
    return true;
  }

  async processNode(
    node: any, 
    inputs: Record<string, any>, 
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const startTime = new Date();
    
    logger.info('Processing trigger node', { 
      nodeId: node.id, 
      nodeType: node.type,
      executionId: context.executionId
    });

    try {
      // Trigger nodes pass through inputs and can add metadata
      const outputs = {
        ...inputs,
        triggeredAt: startTime.toISOString(),
        triggerType: node.data?.triggerType || 'manual',
        workflowId: context.workflowId,
        executionId: context.executionId
      };

      // Add any configured default values
      if (node.data?.defaultValues) {
        Object.assign(outputs, node.data.defaultValues);
      }

      // Apply any input transformations
      if (node.data?.inputTransforms) {
        this.applyInputTransforms(outputs, node.data.inputTransforms);
      }

      const processingTime = Date.now() - startTime.getTime();

      logger.info('Trigger node completed', { 
        nodeId: node.id, 
        processingTime,
        outputKeys: Object.keys(outputs)
      });

      return {
        nodeId: node.id,
        nodeType: node.type,
        status: 'completed',
        inputs,
        outputs,
        processingTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error('Trigger node failed', { 
        nodeId: node.id, 
        error: errorMessage,
        executionId: context.executionId
      });

      return {
        nodeId: node.id,
        nodeType: node.type,
        status: 'failed',
        inputs,
        outputs: {},
        error: errorMessage,
        processingTime: Date.now() - startTime.getTime()
      };
    }
  }

  private applyInputTransforms(outputs: Record<string, any>, transforms: any[]): void {
    transforms.forEach(transform => {
      try {
        switch (transform.type) {
          case 'rename':
            if (transform.from && transform.to && outputs[transform.from] !== undefined) {
              outputs[transform.to] = outputs[transform.from];
              delete outputs[transform.from];
            }
            break;
          
          case 'default':
            if (transform.field && outputs[transform.field] === undefined) {
              outputs[transform.field] = transform.value;
            }
            break;
          
          case 'format':
            if (transform.field && outputs[transform.field] !== undefined) {
              outputs[transform.field] = this.formatValue(outputs[transform.field], transform.format);
            }
            break;
        }
      } catch (error) {
        logger.warn('Failed to apply input transform', { transform, error });
      }
    });
  }

  private formatValue(value: any, format: string): any {
    switch (format) {
      case 'string':
        return String(value);
      case 'number':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      case 'uppercase':
        return String(value).toUpperCase();
      case 'lowercase':
        return String(value).toLowerCase();
      case 'trim':
        return String(value).trim();
      default:
        return value;
    }
  }
}
