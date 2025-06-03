import { NodeProcessor, NodeExecutionResult, ExecutionContext, AIRequest } from '@/types/execution';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { aiServiceProxy } from '../aiServiceProxy';

export class AIAgentProcessor implements NodeProcessor {
  
  canProcess(nodeType: string): boolean {
    return ['ai-agent', 'ai-processor', 'chat', 'gpt', 'claude'].includes(nodeType);
  }

  getRequiredInputs(node: any): string[] {
    // Basic required inputs for AI processing
    const required = [];
    
    if (node.data?.requiresPrompt !== false) {
      required.push('prompt');
    }
    
    // Add custom required inputs from node configuration
    if (node.data?.requiredInputs) {
      required.push(...node.data.requiredInputs);
    }
    
    return required;
  }

  validateInputs(node: any, inputs: Record<string, any>): boolean {
    const required = this.getRequiredInputs(node);
    
    for (const input of required) {
      if (!(input in inputs) || inputs[input] === undefined || inputs[input] === null) {
        logger.warn('Missing required input for AI node', { 
          nodeId: node.id, 
          missingInput: input,
          availableInputs: Object.keys(inputs)
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
    
    logger.info('Processing AI agent node', { 
      nodeId: node.id, 
      nodeType: node.type,
      executionId: context.executionId
    });

    try {
      // Validate inputs
      if (!this.validateInputs(node, inputs)) {
        throw new Error('Invalid inputs for AI agent node');
      }

      // Create node execution record
      const nodeExecution = await this.createNodeExecution(
        context.executionId,
        node,
        inputs,
        startTime
      );

      // Prepare AI request
      const aiRequest = this.prepareAIRequest(node, inputs);
      
      // Execute AI request
      const aiResponse = await aiServiceProxy.executeAIRequest(aiRequest, context.userId);
      
      if (!aiResponse.success) {
        throw new Error(aiResponse.error || 'AI request failed');
      }

      // Process AI response
      const outputs = this.processAIResponse(node, aiResponse);
      
      // Track AI usage (disabled temporarily to avoid Supabase errors)
      if (aiResponse.tokensUsed || aiResponse.estimatedCost) {
        // TODO: Re-enable when ai_usage table is created in Supabase
        // await this.trackAIUsage(context, nodeExecution.id, aiRequest, aiResponse);
        logger.info('AI usage tracked locally', {
          nodeId: node.id,
          service: aiRequest.service,
          model: aiRequest.model,
          tokens: aiResponse.tokensUsed
        });
      }

      const endTime = new Date();
      const processingTime = endTime.getTime() - startTime.getTime();

      // Update node execution record
      await this.updateNodeExecution(nodeExecution.id, {
        status: 'completed',
        outputs,
        completedAt: endTime,
        processingTimeMs: processingTime
      });

      const result: NodeExecutionResult = {
        nodeId: node.id,
        nodeType: node.type,
        status: 'completed',
        inputs,
        outputs,
        processingTime
      };

      logger.info('AI agent node completed', { 
        nodeId: node.id, 
        processingTime,
        tokensUsed: aiResponse.tokensUsed
      });

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error('AI agent node failed', { 
        nodeId: node.id, 
        error: errorMessage,
        executionId: context.executionId
      });

      // Update node execution with error
      const nodeExecution = await this.getNodeExecution(context.executionId, node.id);
      if (nodeExecution) {
        await this.updateNodeExecution(nodeExecution.id, {
          status: 'failed',
          errorMessage,
          completedAt: new Date()
        });
      }

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

  private prepareAIRequest(node: any, inputs: Record<string, any>): AIRequest {
    const nodeData = node.data || {};
    
    // Determine service and model
    const service = nodeData.service || nodeData.provider || 'openai';
    const model = nodeData.model || this.getDefaultModel(service);
    
    // Prepare prompt
    let prompt = inputs.prompt || inputs.text || inputs.message;
    
    // Apply prompt template if configured
    if (nodeData.promptTemplate) {
      prompt = this.applyPromptTemplate(nodeData.promptTemplate, inputs);
    }
    
    // Prepare parameters
    const parameters = {
      temperature: nodeData.temperature || 0.7,
      maxTokens: nodeData.maxTokens || 1000,
      topP: nodeData.topP || 1,
      ...nodeData.parameters
    };

    return {
      nodeId: node.id,
      nodeType: node.type,
      service: service as any,
      model,
      prompt,
      inputs,
      parameters
    };
  }

  private getDefaultModel(service: string): string {
    const defaults = {
      openai: 'gpt-3.5-turbo',
      anthropic: 'claude-3-sonnet-20240229',
      huggingface: 'microsoft/DialoGPT-medium',
      cohere: 'command',
      stability: 'stable-diffusion-xl-1024-v1-0'
    };
    
    return defaults[service as keyof typeof defaults] || 'gpt-3.5-turbo';
  }

  private applyPromptTemplate(template: string, inputs: Record<string, any>): string {
    let result = template;
    
    // Replace placeholders like {{input_name}}
    Object.entries(inputs).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return result;
  }

  private processAIResponse(node: any, aiResponse: any): Record<string, any> {
    const outputs: Record<string, any> = {};
    
    // Extract main response
    if (aiResponse.data) {
      if (typeof aiResponse.data === 'string') {
        outputs.response = aiResponse.data;
        outputs.text = aiResponse.data;
      } else if (aiResponse.data.response) {
        outputs.response = aiResponse.data.response;
        outputs.text = aiResponse.data.response;
      } else if (aiResponse.data.generated_text) {
        outputs.response = aiResponse.data.generated_text;
        outputs.text = aiResponse.data.generated_text;
      } else {
        outputs.response = JSON.stringify(aiResponse.data);
        outputs.text = outputs.response;
      }
    }
    
    // Add metadata
    outputs.model = aiResponse.model;
    outputs.tokensUsed = aiResponse.tokensUsed || 0;
    outputs.processingTime = aiResponse.processingTime || 0;
    
    // Apply output transformations if configured
    const nodeData = node.data || {};
    if (nodeData.outputTransform) {
      return this.applyOutputTransform(outputs, nodeData.outputTransform);
    }
    
    return outputs;
  }

  private applyOutputTransform(outputs: Record<string, any>, transform: any): Record<string, any> {
    // Simple output transformation logic
    if (transform.extractJson && outputs.response) {
      try {
        const jsonMatch = outputs.response.match(/\{.*\}/s);
        if (jsonMatch) {
          outputs.extractedJson = JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        logger.warn('Failed to extract JSON from response', { error });
      }
    }
    
    if (transform.toLowerCase && outputs.response) {
      outputs.response = outputs.response.toLowerCase();
    }
    
    if (transform.trim && outputs.response) {
      outputs.response = outputs.response.trim();
    }
    
    return outputs;
  }

  // Database operations
  private async createNodeExecution(
    executionId: string,
    node: any,
    inputs: Record<string, any>,
    startTime: Date
  ): Promise<any> {
    const { data, error } = await supabase
      .from('node_executions')
      .insert({
        execution_id: executionId,
        node_id: node.id,
        node_type: node.type,
        inputs,
        status: 'running',
        started_at: startTime.toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create node execution: ${error.message}`);
    }

    return data;
  }

  private async updateNodeExecution(nodeExecutionId: string, updates: any): Promise<void> {
    const { error } = await supabase
      .from('node_executions')
      .update(updates)
      .eq('id', nodeExecutionId);

    if (error) {
      logger.error('Failed to update node execution', { nodeExecutionId, error });
    }
  }

  private async getNodeExecution(executionId: string, nodeId: string): Promise<any> {
    const { data, error } = await supabase
      .from('node_executions')
      .select('*')
      .eq('execution_id', executionId)
      .eq('node_id', nodeId)
      .single();

    if (error) {
      logger.error('Failed to get node execution', { executionId, nodeId, error });
      return null;
    }

    return data;
  }

  private async trackAIUsage(
    context: ExecutionContext,
    nodeExecutionId: string,
    request: AIRequest,
    response: any
  ): Promise<void> {
    try {
      await supabase
        .from('ai_usage')
        .insert({
          user_id: context.userId,
          execution_id: context.executionId,
          node_execution_id: nodeExecutionId,
          service_provider: request.service,
          model_name: request.model,
          tokens_used: response.tokensUsed || 0,
          estimated_cost: response.estimatedCost || 0,
          request_data: {
            prompt: request.prompt,
            parameters: request.parameters
          },
          response_data: {
            response: response.data,
            processingTime: response.processingTime
          }
        });
    } catch (error) {
      logger.error('Failed to track AI usage', { error });
    }
  }
}
