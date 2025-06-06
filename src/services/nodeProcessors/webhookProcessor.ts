import { NodeProcessor, NodeExecutionResult, ExecutionContext } from '@/types/execution';
import { logger } from '@/lib/logger';

export class WebhookProcessor implements NodeProcessor {
  canProcess(nodeType: string): boolean {
    return ['webhook', 'http', 'api-call', 'rest'].includes(nodeType);
  }

  getRequiredInputs(node: any): string[] {
    return ['url', 'method'];
  }

  validateInputs(node: any, inputs: Record<string, any>): boolean {
    const required = this.getRequiredInputs(node);

    for (const input of required) {
      if (!(input in inputs) || inputs[input] === undefined || inputs[input] === '') {
        logger.warn('Missing required input for webhook node', {
          nodeId: node.id,
          missingInput: input,
        });
        return false;
      }
    }

    // Validate URL format
    if (inputs.url && !this.isValidUrl(inputs.url)) {
      logger.warn('Invalid URL format', { nodeId: node.id, url: inputs.url });
      return false;
    }

    // Validate HTTP method
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    if (inputs.method && !validMethods.includes(inputs.method.toUpperCase())) {
      logger.warn('Invalid HTTP method', { nodeId: node.id, method: inputs.method });
      return false;
    }

    return true;
  }

  async processNode(
    node: any,
    inputs: Record<string, any>,
    context: ExecutionContext
  ): Promise<NodeExecutionResult> {
    const startTime = new Date();

    logger.info('Processing webhook node', {
      nodeId: node.id,
      url: inputs.url,
      method: inputs.method,
      executionId: context.executionId,
    });

    try {
      if (!this.validateInputs(node, inputs)) {
        throw new Error('Invalid inputs for webhook node');
      }

      // Prepare request data
      const requestData = this.prepareRequestData(node, inputs);

      // Make HTTP request
      const response = await this.makeHttpRequest(requestData);

      const outputs = {
        statusCode: response.status,
        responseData: response.data,
        responseHeaders: response.headers,
        requestUrl: requestData.url,
        requestMethod: requestData.method,
        success: response.status >= 200 && response.status < 300,
        executedAt: new Date().toISOString(),
        ...inputs,
      };

      const processingTime = Date.now() - startTime.getTime();

      logger.info('Webhook node completed', {
        nodeId: node.id,
        statusCode: response.status,
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

      logger.error('Webhook node failed', {
        nodeId: node.id,
        error: errorMessage,
        executionId: context.executionId,
      });

      return {
        nodeId: node.id,
        nodeType: node.type,
        status: 'failed',
        inputs,
        outputs: {
          success: false,
          error: errorMessage,
          ...inputs,
        },
        error: errorMessage,
        processingTime: Date.now() - startTime.getTime(),
      };
    }
  }

  private prepareRequestData(node: any, inputs: Record<string, any>): any {
    const nodeData = node.data || {};

    const requestData = {
      url: inputs.url,
      method: (inputs.method || 'GET').toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FlowsyAI-Workflow-Engine/1.0',
        ...nodeData.headers,
        ...inputs.headers,
      },
      timeout: inputs.timeout || nodeData.timeout || 30000,
      body: undefined as any,
    };

    // Add request body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(requestData.method)) {
      if (inputs.body) {
        requestData.body = inputs.body;
      } else if (inputs.data) {
        requestData.body = inputs.data;
      } else if (nodeData.body) {
        requestData.body = nodeData.body;
      }
    }

    // Add query parameters
    if (inputs.params || nodeData.params) {
      const params = { ...nodeData.params, ...inputs.params };
      const urlObj = new URL(requestData.url);
      Object.entries(params).forEach(([key, value]) => {
        urlObj.searchParams.set(key, String(value));
      });
      requestData.url = urlObj.toString();
    }

    // Add authentication
    if (inputs.auth || nodeData.auth) {
      const auth = { ...nodeData.auth, ...inputs.auth };
      this.addAuthentication(requestData, auth);
    }

    return requestData;
  }

  private addAuthentication(requestData: any, auth: any): void {
    switch (auth.type) {
      case 'bearer':
        requestData.headers['Authorization'] = `Bearer ${auth.token}`;
        break;

      case 'basic':
        const credentials = btoa(`${auth.username}:${auth.password}`);
        requestData.headers['Authorization'] = `Basic ${credentials}`;
        break;

      case 'api-key':
        if (auth.header) {
          requestData.headers[auth.header] = auth.key;
        } else {
          requestData.headers['X-API-Key'] = auth.key;
        }
        break;

      case 'custom':
        if (auth.headers) {
          Object.assign(requestData.headers, auth.headers);
        }
        break;
    }
  }

  private async makeHttpRequest(requestData: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestData.timeout);

    try {
      const fetchOptions: RequestInit = {
        method: requestData.method,
        headers: requestData.headers,
        signal: controller.signal,
      };

      // Add body for methods that support it
      if (requestData.body && ['POST', 'PUT', 'PATCH'].includes(requestData.method)) {
        if (typeof requestData.body === 'object') {
          fetchOptions.body = JSON.stringify(requestData.body);
        } else {
          fetchOptions.body = requestData.body;
        }
      }

      const response = await fetch(requestData.url, fetchOptions);

      clearTimeout(timeoutId);

      // Parse response data
      let responseData;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch (error) {
          responseData = await response.text();
        }
      } else {
        responseData = await response.text();
      }

      // Convert headers to object
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: responseHeaders,
        ok: response.ok,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${requestData.timeout}ms`);
      }

      throw error;
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
