import { NodeProcessor } from '@/types/execution';
import { logger } from '@/lib/logger';

// Import node processors
import { AIAgentProcessor } from './aiAgentProcessor';
import { TriggerProcessor } from './triggerProcessor';
import { DataProcessor } from './dataProcessor';
import { ConditionalProcessor } from './conditionalProcessor';
import { EmailProcessor } from './emailProcessor';
import { WebhookProcessor } from './webhookProcessor';

export class NodeProcessorRegistry {
  private processors: Map<string, NodeProcessor> = new Map();

  constructor() {
    this.registerDefaultProcessors();
  }

  private registerDefaultProcessors(): void {
    // Register all available node processors
    this.registerProcessor('trigger', new TriggerProcessor());
    this.registerProcessor('ai-agent', new AIAgentProcessor());
    this.registerProcessor('ai-processor', new AIAgentProcessor()); // Alias
    this.registerProcessor('data-processor', new DataProcessor());
    this.registerProcessor('database', new DataProcessor()); // Alias
    this.registerProcessor('conditional', new ConditionalProcessor());
    this.registerProcessor('if-else', new ConditionalProcessor()); // Alias
    this.registerProcessor('email', new EmailProcessor());
    this.registerProcessor('webhook', new WebhookProcessor());
    this.registerProcessor('http', new WebhookProcessor()); // Alias

    logger.info('Node processors registered', { 
      count: this.processors.size,
      types: Array.from(this.processors.keys())
    });
  }

  registerProcessor(nodeType: string, processor: NodeProcessor): void {
    this.processors.set(nodeType, processor);
    logger.debug('Registered node processor', { nodeType });
  }

  getProcessor(nodeType: string): NodeProcessor | null {
    const processor = this.processors.get(nodeType);
    if (!processor) {
      logger.warn('No processor found for node type', { nodeType });
      return null;
    }
    return processor;
  }

  getSupportedNodeTypes(): string[] {
    return Array.from(this.processors.keys());
  }

  hasProcessor(nodeType: string): boolean {
    return this.processors.has(nodeType);
  }

  unregisterProcessor(nodeType: string): boolean {
    const removed = this.processors.delete(nodeType);
    if (removed) {
      logger.debug('Unregistered node processor', { nodeType });
    }
    return removed;
  }

  // Get processor info for debugging
  getProcessorInfo(): Array<{ nodeType: string; canProcess: boolean }> {
    return Array.from(this.processors.entries()).map(([nodeType, processor]) => ({
      nodeType,
      canProcess: processor.canProcess(nodeType)
    }));
  }
}
