// Enterprise integration service for connecting with major business systems
export interface EnterpriseIntegration {
  id: string;
  name: string;
  category: 'crm' | 'erp' | 'hr' | 'finance' | 'marketing' | 'analytics' | 'communication';
  provider: string;
  description: string;
  icon: string;
  status: 'available' | 'connected' | 'error' | 'deprecated';
  tier: 'free' | 'premium' | 'enterprise';
  capabilities: IntegrationCapability[];
  authentication: AuthenticationMethod;
  endpoints: IntegrationEndpoint[];
  configuration: IntegrationConfig[];
  pricing: {
    model: 'free' | 'per_call' | 'monthly' | 'enterprise';
    cost?: number;
    currency?: string;
    limits?: {
      calls_per_month?: number;
      data_transfer_gb?: number;
    };
  };
  compliance: string[];
  documentation: {
    quickStart: string;
    apiReference: string;
    examples: string;
  };
}

export interface IntegrationCapability {
  id: string;
  name: string;
  description: string;
  type: 'read' | 'write' | 'bidirectional';
  dataTypes: string[];
  realTime: boolean;
  batchSupport: boolean;
}

export interface AuthenticationMethod {
  type: 'oauth2' | 'api_key' | 'basic_auth' | 'jwt' | 'saml' | 'custom';
  scopes?: string[];
  redirectUrl?: string;
  tokenEndpoint?: string;
  authorizationEndpoint?: string;
  customFields?: Array<{
    name: string;
    type: 'text' | 'password' | 'url';
    required: boolean;
    description: string;
  }>;
}

export interface IntegrationEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: EndpointParameter[];
  responseSchema: Record<string, unknown>;
  rateLimit?: {
    requests: number;
    window: string;
  };
}

export interface EndpointParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example?: unknown;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json';
  required: boolean;
  description: string;
  defaultValue?: unknown;
  options?: Array<{ label: string; value: unknown }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
}

export class EnterpriseIntegrationsService {
  private static instance: EnterpriseIntegrationsService;
  private integrations: Map<string, EnterpriseIntegration> = new Map();

  static getInstance(): EnterpriseIntegrationsService {
    if (!EnterpriseIntegrationsService.instance) {
      EnterpriseIntegrationsService.instance = new EnterpriseIntegrationsService();
      EnterpriseIntegrationsService.instance.initializeIntegrations();
    }
    return EnterpriseIntegrationsService.instance;
  }

  private initializeIntegrations(): void {
    // Salesforce CRM Integration
    this.addIntegration({
      id: 'salesforce-crm',
      name: 'Salesforce CRM',
      category: 'crm',
      provider: 'Salesforce',
      description:
        'Connect with Salesforce to sync leads, contacts, opportunities, and custom objects',
      icon: '☁️',
      status: 'available',
      tier: 'enterprise',
      capabilities: [
        {
          id: 'lead-management',
          name: 'Lead Management',
          description: 'Create, update, and query leads',
          type: 'bidirectional',
          dataTypes: ['leads', 'contacts', 'accounts'],
          realTime: true,
          batchSupport: true,
        },
        {
          id: 'opportunity-tracking',
          name: 'Opportunity Tracking',
          description: 'Manage sales opportunities and forecasting',
          type: 'bidirectional',
          dataTypes: ['opportunities', 'quotes', 'products'],
          realTime: true,
          batchSupport: true,
        },
      ],
      authentication: {
        type: 'oauth2',
        scopes: ['api', 'refresh_token', 'offline_access'],
        authorizationEndpoint: 'https://login.salesforce.com/services/oauth2/authorize',
        tokenEndpoint: 'https://login.salesforce.com/services/oauth2/token',
      },
      endpoints: [
        {
          id: 'create-lead',
          name: 'Create Lead',
          method: 'POST',
          path: '/services/data/v58.0/sobjects/Lead',
          description: 'Create a new lead in Salesforce',
          parameters: [
            { name: 'FirstName', type: 'string', required: false, description: 'Lead first name' },
            { name: 'LastName', type: 'string', required: true, description: 'Lead last name' },
            { name: 'Email', type: 'string', required: true, description: 'Lead email address' },
            { name: 'Company', type: 'string', required: true, description: 'Lead company' },
          ],
          responseSchema: { id: 'string', success: 'boolean', errors: 'array' },
        },
      ],
      configuration: [
        {
          id: 'instance_url',
          name: 'Instance URL',
          type: 'text',
          required: true,
          description: 'Your Salesforce instance URL (e.g., https://mycompany.salesforce.com)',
        },
        {
          id: 'api_version',
          name: 'API Version',
          type: 'select',
          required: true,
          description: 'Salesforce API version to use',
          defaultValue: 'v58.0',
          options: [
            { label: 'v58.0 (Latest)', value: 'v58.0' },
            { label: 'v57.0', value: 'v57.0' },
            { label: 'v56.0', value: 'v56.0' },
          ],
        },
      ],
      pricing: {
        model: 'enterprise',
        cost: 500,
        currency: 'USD',
        limits: {
          calls_per_month: 100000,
        },
      },
      compliance: ['SOC2', 'GDPR', 'HIPAA', 'ISO27001'],
      documentation: {
        quickStart: 'https://docs.example.com/salesforce/quickstart',
        apiReference: 'https://developer.salesforce.com/docs/api-explorer',
        examples: 'https://docs.example.com/salesforce/examples',
      },
    });

    // SAP ERP Integration
    this.addIntegration({
      id: 'sap-erp',
      name: 'SAP ERP',
      category: 'erp',
      provider: 'SAP',
      description:
        'Integrate with SAP ERP for financial data, inventory management, and business processes',
      icon: '🏢',
      status: 'available',
      tier: 'enterprise',
      capabilities: [
        {
          id: 'financial-data',
          name: 'Financial Data Access',
          description: 'Access financial records, invoices, and accounting data',
          type: 'read',
          dataTypes: ['invoices', 'payments', 'accounts', 'cost_centers'],
          realTime: false,
          batchSupport: true,
        },
        {
          id: 'inventory-management',
          name: 'Inventory Management',
          description: 'Manage inventory levels, stock movements, and procurement',
          type: 'bidirectional',
          dataTypes: ['materials', 'stock_levels', 'purchase_orders'],
          realTime: true,
          batchSupport: true,
        },
      ],
      authentication: {
        type: 'basic_auth',
        customFields: [
          { name: 'server_url', type: 'url', required: true, description: 'SAP server URL' },
          { name: 'client', type: 'text', required: true, description: 'SAP client number' },
          { name: 'system_id', type: 'text', required: true, description: 'SAP system ID' },
        ],
      },
      endpoints: [
        {
          id: 'get-materials',
          name: 'Get Materials',
          method: 'GET',
          path: '/sap/opu/odata/sap/API_MATERIAL_SRV/A_Product',
          description: 'Retrieve material master data',
          parameters: [
            {
              name: '$filter',
              type: 'string',
              required: false,
              description: 'OData filter expression',
            },
            {
              name: '$top',
              type: 'number',
              required: false,
              description: 'Number of records to return',
            },
          ],
          responseSchema: { d: { results: 'array' } },
          rateLimit: { requests: 1000, window: 'hour' },
        },
      ],
      configuration: [
        {
          id: 'environment',
          name: 'Environment',
          type: 'select',
          required: true,
          description: 'SAP environment to connect to',
          options: [
            { label: 'Production', value: 'prod' },
            { label: 'Quality Assurance', value: 'qa' },
            { label: 'Development', value: 'dev' },
          ],
        },
      ],
      pricing: {
        model: 'enterprise',
      },
      compliance: ['SOC2', 'ISO27001'],
      documentation: {
        quickStart: 'https://docs.example.com/sap/quickstart',
        apiReference: 'https://api.sap.com/api/API_MATERIAL_SRV',
        examples: 'https://docs.example.com/sap/examples',
      },
    });

    // Microsoft Teams Integration
    this.addIntegration({
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      category: 'communication',
      provider: 'Microsoft',
      description: 'Send messages, create channels, and manage Teams conversations',
      icon: '💬',
      status: 'available',
      tier: 'free',
      capabilities: [
        {
          id: 'messaging',
          name: 'Team Messaging',
          description: 'Send messages to channels and users',
          type: 'write',
          dataTypes: ['messages', 'mentions', 'attachments'],
          realTime: true,
          batchSupport: false,
        },
        {
          id: 'channel-management',
          name: 'Channel Management',
          description: 'Create and manage team channels',
          type: 'bidirectional',
          dataTypes: ['channels', 'teams', 'members'],
          realTime: true,
          batchSupport: true,
        },
      ],
      authentication: {
        type: 'oauth2',
        scopes: [
          'https://graph.microsoft.com/ChannelMessage.Send',
          'https://graph.microsoft.com/Team.ReadBasic.All',
        ],
        authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      },
      endpoints: [
        {
          id: 'send-message',
          name: 'Send Channel Message',
          method: 'POST',
          path: '/v1.0/teams/{team-id}/channels/{channel-id}/messages',
          description: 'Send a message to a Teams channel',
          parameters: [
            { name: 'team-id', type: 'string', required: true, description: 'Teams team ID' },
            { name: 'channel-id', type: 'string', required: true, description: 'Channel ID' },
            { name: 'body', type: 'object', required: true, description: 'Message content' },
          ],
          responseSchema: { id: 'string', createdDateTime: 'string' },
          rateLimit: { requests: 300, window: 'minute' },
        },
      ],
      configuration: [
        {
          id: 'tenant_id',
          name: 'Tenant ID',
          type: 'text',
          required: true,
          description: 'Microsoft 365 tenant ID',
        },
      ],
      pricing: {
        model: 'free',
        limits: {
          calls_per_month: 10000,
        },
      },
      compliance: ['SOC2', 'GDPR', 'ISO27001'],
      documentation: {
        quickStart: 'https://docs.example.com/teams/quickstart',
        apiReference: 'https://docs.microsoft.com/en-us/graph/api/resources/teams-api-overview',
        examples: 'https://docs.example.com/teams/examples',
      },
    });
  }

  private addIntegration(integration: EnterpriseIntegration): void {
    this.integrations.set(integration.id, integration);
  }

  getAllIntegrations(): EnterpriseIntegration[] {
    return Array.from(this.integrations.values());
  }

  getIntegrationsByCategory(category: string): EnterpriseIntegration[] {
    return this.getAllIntegrations().filter(integration => integration.category === category);
  }

  getIntegrationsByTier(tier: string): EnterpriseIntegration[] {
    return this.getAllIntegrations().filter(integration => integration.tier === tier);
  }

  getIntegration(id: string): EnterpriseIntegration | undefined {
    return this.integrations.get(id);
  }

  searchIntegrations(query: string): EnterpriseIntegration[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllIntegrations().filter(
      integration =>
        integration.name.toLowerCase().includes(lowercaseQuery) ||
        integration.description.toLowerCase().includes(lowercaseQuery) ||
        integration.provider.toLowerCase().includes(lowercaseQuery)
    );
  }

  async testConnection(
    integrationId: string,
    config: Record<string, unknown>
  ): Promise<{
    success: boolean;
    message: string;
    details?: Record<string, unknown>;
  }> {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));

    const integration = this.getIntegration(integrationId);
    if (!integration) {
      return { success: false, message: 'Integration not found' };
    }

    // Simulate various test outcomes
    const testResults = [
      { success: true, message: 'Connection successful' },
      { success: false, message: 'Authentication failed - please check credentials' },
      { success: false, message: 'Network timeout - please check server URL' },
      {
        success: true,
        message: 'Connection successful with warnings',
        details: { warnings: ['Rate limit detected'] },
      },
    ];

    return testResults[Math.floor(Math.random() * testResults.length)];
  }

  async getIntegrationMetrics(integrationId: string): Promise<{
    totalCalls: number;
    successRate: number;
    averageResponseTime: number;
    errorBreakdown: Record<string, number>;
    usageByEndpoint: Array<{ endpoint: string; calls: number }>;
  }> {
    // Simulate metrics retrieval
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      totalCalls: 15420,
      successRate: 98.5,
      averageResponseTime: 245,
      errorBreakdown: {
        'Rate Limit': 12,
        Authentication: 8,
        'Network Timeout': 5,
        'Server Error': 3,
      },
      usageByEndpoint: [
        { endpoint: 'create-lead', calls: 8500 },
        { endpoint: 'update-contact', calls: 4200 },
        { endpoint: 'get-opportunities', calls: 2720 },
      ],
    };
  }
}
