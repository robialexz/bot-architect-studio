import { NodeProcessor, NodeExecutionResult, ExecutionContext } from '@/types/execution';
import { logger } from '@/lib/logger';

export class ConditionalProcessor implements NodeProcessor {
  canProcess(nodeType: string): boolean {
    return ['conditional', 'if-else', 'switch', 'decision'].includes(nodeType);
  }

  getRequiredInputs(node: Record<string, unknown>): string[] {
    const conditionType = (node.data as Record<string, unknown>)?.conditionType || 'simple';

    switch (conditionType) {
      case 'simple':
        return ['value', 'condition'];
      case 'expression':
        return ['expression'];
      case 'switch':
        return ['value', 'cases'];
      default:
        return ['condition'];
    }
  }

  validateInputs(node: Record<string, unknown>, inputs: Record<string, unknown>): boolean {
    const required = this.getRequiredInputs(node);

    for (const input of required) {
      if (!(input in inputs) || inputs[input] === undefined) {
        logger.warn('Missing required input for conditional node', {
          nodeId: node.id,
          missingInput: input,
        });
        return false;
      }
    }

    return true;
  }

  async processNode(
    node: Record<string, unknown>,
    inputs: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const startTime = new Date();

    logger.info('Processing conditional node', {
      nodeId: node.id,
      conditionType: node.data?.conditionType,
      executionId: context.executionId,
    });

    try {
      if (!this.validateInputs(node, inputs)) {
        throw new Error('Invalid inputs for conditional node');
      }

      const conditionType = node.data?.conditionType || 'simple';
      const result = this.evaluateCondition(conditionType, node.data, inputs);

      const outputs = {
        ...inputs,
        conditionResult: result.passed,
        conditionValue: result.value,
        conditionType,
        branch: result.branch || (result.passed ? 'true' : 'false'),
        evaluatedAt: new Date().toISOString(),
      };

      // Add branch-specific outputs
      if (result.passed && node.data?.trueOutputs) {
        Object.assign(outputs, node.data.trueOutputs);
      } else if (!result.passed && node.data?.falseOutputs) {
        Object.assign(outputs, node.data.falseOutputs);
      }

      const processingTime = Date.now() - startTime.getTime();

      logger.info('Conditional node completed', {
        nodeId: node.id,
        conditionResult: result.passed,
        branch: result.branch,
        processingTime,
      });

      return {
        nodeId: node.id,
        nodeType: node.type,
        status: 'completed',
        inputs,
        outputs,
        processingTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      logger.error('Conditional node failed', {
        nodeId: node.id,
        error: errorMessage,
        executionId: context.executionId,
      });

      return {
        nodeId: node.id,
        nodeType: node.type,
        status: 'failed',
        inputs,
        outputs: {},
        error: errorMessage,
        processingTime: Date.now() - startTime.getTime(),
      };
    }
  }

  private evaluateCondition(
    conditionType: string,
    nodeData: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): { passed: boolean; value: unknown; branch?: string } {
    switch (conditionType) {
      case 'simple':
        return this.evaluateSimpleCondition(nodeData, inputs);

      case 'expression':
        return this.evaluateExpression(nodeData, inputs);

      case 'switch':
        return this.evaluateSwitch(nodeData, inputs);

      case 'range':
        return this.evaluateRange(nodeData, inputs);

      case 'regex':
        return this.evaluateRegex(nodeData, inputs);

      default:
        throw new Error(`Unknown condition type: ${conditionType}`);
    }
  }

  private evaluateSimpleCondition(
    nodeData: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): { passed: boolean; value: unknown } {
    const value = inputs.value;
    const condition = inputs.condition || nodeData.condition;
    const operator = nodeData.operator || '==';
    const compareValue = nodeData.compareValue;

    let passed = false;

    switch (operator) {
      case '==':
      case 'equals':
        passed = value == compareValue;
        break;
      case '===':
      case 'strictEquals':
        passed = value === compareValue;
        break;
      case '!=':
      case 'notEquals':
        passed = value != compareValue;
        break;
      case '>':
      case 'greaterThan':
        passed = Number(value) > Number(compareValue);
        break;
      case '>=':
      case 'greaterThanOrEqual':
        passed = Number(value) >= Number(compareValue);
        break;
      case '<':
      case 'lessThan':
        passed = Number(value) < Number(compareValue);
        break;
      case '<=':
      case 'lessThanOrEqual':
        passed = Number(value) <= Number(compareValue);
        break;
      case 'contains':
        passed = String(value).includes(String(compareValue));
        break;
      case 'startsWith':
        passed = String(value).startsWith(String(compareValue));
        break;
      case 'endsWith':
        passed = String(value).endsWith(String(compareValue));
        break;
      case 'isEmpty':
        passed = !value || value === '' || (Array.isArray(value) && value.length === 0);
        break;
      case 'isNotEmpty':
        passed = !!value && value !== '' && (!Array.isArray(value) || value.length > 0);
        break;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }

    return { passed, value };
  }

  private evaluateExpression(
    nodeData: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): { passed: boolean; value: unknown } {
    const expression = inputs.expression || nodeData.expression;

    if (!expression) {
      throw new Error('No expression provided');
    }

    try {
      // Simple expression evaluation (for security, we'll use a limited evaluator)
      const result = this.safeEvaluateExpression(expression, inputs);
      return { passed: !!result, value: result };
    } catch (error) {
      throw new Error(`Expression evaluation failed: ${error}`);
    }
  }

  private evaluateSwitch(
    nodeData: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): { passed: boolean; value: unknown; branch: string } {
    const value = inputs.value;
    const cases = inputs.cases || nodeData.cases || {};
    const defaultCase = nodeData.defaultCase;

    // Check each case
    for (const [caseValue, caseResult] of Object.entries(cases)) {
      if (String(value) === String(caseValue)) {
        return {
          passed: true,
          value: caseResult,
          branch: caseValue,
        };
      }
    }

    // Default case
    if (defaultCase !== undefined) {
      return {
        passed: true,
        value: defaultCase,
        branch: 'default',
      };
    }

    return {
      passed: false,
      value: null,
      branch: 'none',
    };
  }

  private evaluateRange(
    nodeData: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): { passed: boolean; value: unknown } {
    const value = Number(inputs.value);
    const min = Number(nodeData.min);
    const max = Number(nodeData.max);
    const inclusive = nodeData.inclusive !== false;

    let passed;
    if (inclusive) {
      passed = value >= min && value <= max;
    } else {
      passed = value > min && value < max;
    }

    return { passed, value };
  }

  private evaluateRegex(
    nodeData: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): { passed: boolean; value: unknown } {
    const value = String(inputs.value);
    const pattern = nodeData.pattern;
    const flags = nodeData.flags || 'i';

    if (!pattern) {
      throw new Error('No regex pattern provided');
    }

    try {
      const regex = new RegExp(pattern, flags);
      const match = regex.exec(value);

      return {
        passed: !!match,
        value: match ? match[0] : null,
      };
    } catch (error) {
      throw new Error(`Invalid regex pattern: ${pattern}`);
    }
  }

  private safeEvaluateExpression(expression: string, inputs: Record<string, unknown>): unknown {
    // Simple and safe expression evaluator
    // Replace input variables in the expression
    let processedExpression = expression;

    Object.entries(inputs).forEach(([key, value]) => {
      const placeholder = new RegExp(`\\b${key}\\b`, 'g');
      const safeValue = typeof value === 'string' ? `"${value}"` : String(value);
      processedExpression = processedExpression.replace(placeholder, safeValue);
    });

    // Only allow safe operations
    const safePattern = /^[\d\s+\-*/().<>=!&|"']+$/;
    if (!safePattern.test(processedExpression)) {
      throw new Error('Expression contains unsafe characters');
    }

    // Use Function constructor for evaluation (safer than eval)
    try {
      return new Function(`return ${processedExpression}`)();
    } catch (error) {
      throw new Error(`Expression evaluation error: ${error}`);
    }
  }
}
