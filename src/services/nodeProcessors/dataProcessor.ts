import { NodeProcessor, NodeExecutionResult, ExecutionContext } from '@/types/execution';
import { logger } from '@/lib/logger';

export class DataProcessor implements NodeProcessor {
  
  canProcess(nodeType: string): boolean {
    return ['data-processor', 'database', 'transform', 'filter', 'map'].includes(nodeType);
  }

  getRequiredInputs(node: any): string[] {
    const operation = node.data?.operation || 'transform';
    
    switch (operation) {
      case 'filter':
        return ['data', 'condition'];
      case 'map':
        return ['data', 'mapping'];
      case 'transform':
        return ['data'];
      case 'aggregate':
        return ['data', 'aggregation'];
      default:
        return ['data'];
    }
  }

  validateInputs(node: any, inputs: Record<string, any>): boolean {
    const required = this.getRequiredInputs(node);
    
    for (const input of required) {
      if (!(input in inputs) || inputs[input] === undefined) {
        logger.warn('Missing required input for data processor', { 
          nodeId: node.id, 
          missingInput: input 
        });
        return false;
      }
    }
    
    return true;
  }

  async processNode(
    node: any, 
    inputs: Record<string, any>, 
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const startTime = new Date();
    
    logger.info('Processing data processor node', { 
      nodeId: node.id, 
      operation: node.data?.operation,
      executionId: context.executionId
    });

    try {
      if (!this.validateInputs(node, inputs)) {
        throw new Error('Invalid inputs for data processor node');
      }

      const operation = node.data?.operation || 'transform';
      const outputs = await this.executeDataOperation(operation, node.data, inputs);

      const processingTime = Date.now() - startTime.getTime();

      logger.info('Data processor node completed', { 
        nodeId: node.id, 
        operation,
        processingTime,
        outputSize: this.getDataSize(outputs.data)
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
      
      logger.error('Data processor node failed', { 
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

  private async executeDataOperation(
    operation: string, 
    nodeData: any, 
    inputs: Record<string, any>
  ): Promise<Record<string, any>> {
    const data = inputs.data;
    
    switch (operation) {
      case 'filter':
        return this.filterData(data, inputs.condition || nodeData.condition);
      
      case 'map':
        return this.mapData(data, inputs.mapping || nodeData.mapping);
      
      case 'transform':
        return this.transformData(data, nodeData.transformation);
      
      case 'aggregate':
        return this.aggregateData(data, inputs.aggregation || nodeData.aggregation);
      
      case 'sort':
        return this.sortData(data, nodeData.sortBy, nodeData.sortOrder);
      
      case 'group':
        return this.groupData(data, nodeData.groupBy);
      
      case 'join':
        return this.joinData(data, inputs.joinData || nodeData.joinData, nodeData.joinKey);
      
      default:
        return { data, operation: 'passthrough' };
    }
  }

  private filterData(data: any, condition: any): Record<string, any> {
    if (!Array.isArray(data)) {
      throw new Error('Filter operation requires array data');
    }

    let filtered;
    
    if (typeof condition === 'function') {
      filtered = data.filter(condition);
    } else if (typeof condition === 'object') {
      // Simple object-based filtering
      filtered = data.filter(item => {
        return Object.entries(condition).every(([key, value]) => {
          return item[key] === value;
        });
      });
    } else if (typeof condition === 'string') {
      // Simple string-based filtering (contains)
      filtered = data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(condition.toLowerCase())
      );
    } else {
      filtered = data;
    }

    return {
      data: filtered,
      originalCount: data.length,
      filteredCount: filtered.length,
      operation: 'filter'
    };
  }

  private mapData(data: any, mapping: any): Record<string, any> {
    if (!Array.isArray(data)) {
      throw new Error('Map operation requires array data');
    }

    let mapped;
    
    if (typeof mapping === 'function') {
      mapped = data.map(mapping);
    } else if (typeof mapping === 'object') {
      // Object-based field mapping
      mapped = data.map(item => {
        const newItem: any = {};
        Object.entries(mapping).forEach(([newKey, oldKey]) => {
          newItem[newKey] = item[oldKey as string];
        });
        return newItem;
      });
    } else {
      mapped = data;
    }

    return {
      data: mapped,
      count: mapped.length,
      operation: 'map'
    };
  }

  private transformData(data: any, transformation: any): Record<string, any> {
    if (!transformation) {
      return { data, operation: 'transform' };
    }

    let transformed = data;

    // Apply transformations
    if (transformation.toUpperCase && typeof data === 'string') {
      transformed = data.toUpperCase();
    } else if (transformation.toLowerCase && typeof data === 'string') {
      transformed = data.toLowerCase();
    } else if (transformation.parseJson && typeof data === 'string') {
      try {
        transformed = JSON.parse(data);
      } catch (error) {
        throw new Error('Failed to parse JSON data');
      }
    } else if (transformation.stringify) {
      transformed = JSON.stringify(data);
    } else if (transformation.flatten && Array.isArray(data)) {
      transformed = data.flat(transformation.depth || 1);
    }

    return {
      data: transformed,
      operation: 'transform',
      transformation: transformation
    };
  }

  private aggregateData(data: any, aggregation: any): Record<string, any> {
    if (!Array.isArray(data)) {
      throw new Error('Aggregate operation requires array data');
    }

    const result: any = {
      count: data.length,
      operation: 'aggregate'
    };

    if (aggregation.sum && aggregation.field) {
      result.sum = data.reduce((sum, item) => sum + (Number(item[aggregation.field]) || 0), 0);
    }

    if (aggregation.average && aggregation.field) {
      const sum = data.reduce((sum, item) => sum + (Number(item[aggregation.field]) || 0), 0);
      result.average = data.length > 0 ? sum / data.length : 0;
    }

    if (aggregation.min && aggregation.field) {
      result.min = Math.min(...data.map(item => Number(item[aggregation.field]) || 0));
    }

    if (aggregation.max && aggregation.field) {
      result.max = Math.max(...data.map(item => Number(item[aggregation.field]) || 0));
    }

    return result;
  }

  private sortData(data: any, sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Record<string, any> {
    if (!Array.isArray(data)) {
      throw new Error('Sort operation requires array data');
    }

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return {
      data: sorted,
      count: sorted.length,
      operation: 'sort',
      sortBy,
      sortOrder
    };
  }

  private groupData(data: any, groupBy: string): Record<string, any> {
    if (!Array.isArray(data)) {
      throw new Error('Group operation requires array data');
    }

    const grouped = data.reduce((groups, item) => {
      const key = item[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<string, any[]>);

    return {
      data: grouped,
      groups: Object.keys(grouped),
      groupCount: Object.keys(grouped).length,
      operation: 'group',
      groupBy
    };
  }

  private joinData(leftData: any, rightData: any, joinKey: string): Record<string, any> {
    if (!Array.isArray(leftData) || !Array.isArray(rightData)) {
      throw new Error('Join operation requires array data');
    }

    const joined = leftData.map(leftItem => {
      const rightItem = rightData.find(right => right[joinKey] === leftItem[joinKey]);
      return rightItem ? { ...leftItem, ...rightItem } : leftItem;
    });

    return {
      data: joined,
      count: joined.length,
      operation: 'join',
      joinKey
    };
  }

  private getDataSize(data: any): string {
    if (Array.isArray(data)) {
      return `${data.length} items`;
    } else if (typeof data === 'object') {
      return `${Object.keys(data).length} properties`;
    } else if (typeof data === 'string') {
      return `${data.length} characters`;
    } else {
      return 'single value';
    }
  }
}
