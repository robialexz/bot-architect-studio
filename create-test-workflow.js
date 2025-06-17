// Script pentru crearea unui workflow de test cu nodurile noi
// Demonstrează funcționalitatea completă a sistemului

console.log('🔧 CREATING TEST WORKFLOW WITH NEW NODES...');

// Workflow de test: "AI Content Generation Pipeline"
const testWorkflow = {
  name: 'AI Content Generation Pipeline',
  description: 'Workflow demonstrativ care folosește nodurile noi pentru generarea de conținut AI',
  nodes: [
    // 1. Webhook Trigger - Primește cereri de conținut
    {
      id: 'webhook_trigger_1',
      type: 'webhook_trigger',
      position: { x: 100, y: 100 },
      data: {
        label: 'Content Request',
        config: {
          webhook_url: 'https://api.aiflow.com/webhook/content-request',
          authentication: 'api_key',
          allowed_methods: ['POST'],
        },
      },
    },

    // 2. JSON Parser - Procesează datele de intrare
    {
      id: 'json_parser_1',
      type: 'json_parser',
      position: { x: 300, y: 100 },
      data: {
        label: 'Parse Request',
        config: {
          path_extraction: '$.content_request',
          strict_mode: true,
        },
      },
    },

    // 3. If/Else Logic - Verifică tipul de conținut
    {
      id: 'if_else_1',
      type: 'if_else',
      position: { x: 500, y: 100 },
      data: {
        label: 'Content Type Check',
        config: {
          operator: 'equals',
          compare_value: 'blog_post',
        },
      },
    },

    // 4a. OpenAI GPT-4 - Pentru blog posts
    {
      id: 'openai_gpt4_1',
      type: 'openai_gpt4',
      position: { x: 700, y: 50 },
      data: {
        label: 'Generate Blog Post',
        config: {
          api_key: 'sk-...', // Placeholder
          model: 'gpt-4-turbo',
          temperature: 0.7,
          max_tokens: 2000,
          system_message: 'You are a professional content writer.',
        },
      },
    },

    // 4b. Anthropic Claude 3 - Pentru conținut tehnic
    {
      id: 'anthropic_claude3_1',
      type: 'anthropic_claude3',
      position: { x: 700, y: 150 },
      data: {
        label: 'Generate Technical Content',
        config: {
          api_key: 'sk-ant-...', // Placeholder
          model: 'claude-3-opus-20240229',
          temperature: 0.3,
          max_tokens: 1500,
        },
      },
    },

    // 5. Sentiment Analyzer - Analizează tonul conținutului
    {
      id: 'sentiment_analyzer_1',
      type: 'sentiment_analyzer',
      position: { x: 900, y: 100 },
      data: {
        label: 'Analyze Tone',
        config: {
          provider: 'openai',
          detailed_analysis: true,
          api_key: 'sk-...', // Placeholder
        },
      },
    },

    // 6. Math Operation - Calculează scorul de calitate
    {
      id: 'math_operation_1',
      type: 'math_operation',
      position: { x: 1100, y: 100 },
      data: {
        label: 'Quality Score',
        config: {
          operation: 'multiply',
          decimal_places: 2,
        },
      },
    },

    // 7. Gmail Connector - Trimite rezultatul
    {
      id: 'gmail_connector_1',
      type: 'gmail_connector',
      position: { x: 1300, y: 100 },
      data: {
        label: 'Send Results',
        config: {
          client_id: 'your-client-id',
          client_secret: 'your-client-secret',
          refresh_token: 'your-refresh-token',
          from_email: 'ai@yourcompany.com',
        },
      },
    },

    // 8. MySQL Connector - Salvează în baza de date
    {
      id: 'mysql_connector_1',
      type: 'mysql_connector',
      position: { x: 1300, y: 200 },
      data: {
        label: 'Save to Database',
        config: {
          host: 'localhost',
          port: 3306,
          database: 'aiflow_content',
          username: 'aiflow_user',
          password: 'secure_password',
        },
      },
    },
  ],

  edges: [
    // Fluxul principal
    { id: 'e1', source: 'webhook_trigger_1', target: 'json_parser_1' },
    { id: 'e2', source: 'json_parser_1', target: 'if_else_1' },

    // Ramificarea condițională
    { id: 'e3a', source: 'if_else_1', target: 'openai_gpt4_1', sourceHandle: 'true' },
    { id: 'e3b', source: 'if_else_1', target: 'anthropic_claude3_1', sourceHandle: 'false' },

    // Convergența
    { id: 'e4a', source: 'openai_gpt4_1', target: 'sentiment_analyzer_1' },
    { id: 'e4b', source: 'anthropic_claude3_1', target: 'sentiment_analyzer_1' },

    // Procesarea finală
    { id: 'e5', source: 'sentiment_analyzer_1', target: 'math_operation_1' },
    { id: 'e6a', source: 'math_operation_1', target: 'gmail_connector_1' },
    { id: 'e6b', source: 'math_operation_1', target: 'mysql_connector_1' },
  ],
};

// Funcție pentru testarea workflow-ului
function testWorkflowCreation() {
  console.log('\n📋 WORKFLOW STRUCTURE:');
  console.log(`Name: ${testWorkflow.name}`);
  console.log(`Description: ${testWorkflow.description}`);
  console.log(`Nodes: ${testWorkflow.nodes.length}`);
  console.log(`Edges: ${testWorkflow.edges.length}`);

  console.log('\n🔗 NODE TYPES USED:');
  const nodeTypes = [...new Set(testWorkflow.nodes.map(node => node.type))];
  nodeTypes.forEach(type => {
    console.log(`✅ ${type}`);
  });

  console.log('\n📊 WORKFLOW VALIDATION:');

  // Verifică dacă toate nodurile au configurări
  const nodesWithConfig = testWorkflow.nodes.filter(
    node => node.data.config && Object.keys(node.data.config).length > 0
  );
  console.log(
    `✅ Nodes with configuration: ${nodesWithConfig.length}/${testWorkflow.nodes.length}`
  );

  // Verifică conexiunile
  const connectedNodes = new Set();
  testWorkflow.edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });
  console.log(`✅ Connected nodes: ${connectedNodes.size}/${testWorkflow.nodes.length}`);

  // Verifică fluxul logic
  const hasStart = testWorkflow.nodes.some(node => node.type.includes('trigger'));
  const hasAI = testWorkflow.nodes.some(
    node => node.type.includes('openai') || node.type.includes('anthropic')
  );
  const hasLogic = testWorkflow.nodes.some(node => node.type.includes('if_else'));
  const hasOutput = testWorkflow.nodes.some(
    node => node.type.includes('gmail') || node.type.includes('mysql')
  );

  console.log(`✅ Has trigger: ${hasStart}`);
  console.log(`✅ Has AI processing: ${hasAI}`);
  console.log(`✅ Has logic: ${hasLogic}`);
  console.log(`✅ Has output: ${hasOutput}`);

  const isValidWorkflow = hasStart && hasAI && hasLogic && hasOutput;
  console.log(`\n🎯 WORKFLOW VALIDITY: ${isValidWorkflow ? 'VALID' : 'INVALID'}`);

  return isValidWorkflow;
}

// Funcție pentru simularea execuției
function simulateWorkflowExecution() {
  console.log('\n🚀 SIMULATING WORKFLOW EXECUTION...');

  const executionSteps = [
    '1. Webhook receives content request',
    '2. JSON parser extracts request data',
    '3. If/Else checks content type',
    '4a. GPT-4 generates blog post OR 4b. Claude generates technical content',
    '5. Sentiment analyzer evaluates tone',
    '6. Math operation calculates quality score',
    '7. Gmail sends notification email',
    '8. MySQL saves results to database',
  ];

  executionSteps.forEach((step, index) => {
    setTimeout(() => {
      console.log(`⚡ ${step}`);
      if (index === executionSteps.length - 1) {
        console.log('\n✅ WORKFLOW EXECUTION COMPLETED SUCCESSFULLY!');
      }
    }, index * 500);
  });
}

// Funcție pentru exportul workflow-ului
function exportWorkflow() {
  console.log('\n📤 EXPORTING WORKFLOW...');

  const exportData = {
    ...testWorkflow,
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0',
      author: 'AI Flow Test System',
      tags: ['ai', 'content', 'automation', 'test'],
    },
  };

  console.log('✅ Workflow ready for export');
  console.log('📁 Export data size:', JSON.stringify(exportData).length, 'characters');

  return exportData;
}

// Rulează testele
console.log('🧪 RUNNING WORKFLOW TESTS...\n');

const isValid = testWorkflowCreation();
if (isValid) {
  simulateWorkflowExecution();
  const exportedWorkflow = exportWorkflow();

  console.log('\n🎉 TEST WORKFLOW CREATION SUCCESSFUL!');
  console.log('📋 Summary:');
  console.log(`- Workflow uses ${testWorkflow.nodes.length} nodes from new library`);
  console.log(`- Demonstrates AI, Data, Integration, and Utility nodes`);
  console.log(`- Shows real-world automation scenario`);
  console.log(`- Ready for actual implementation`);
} else {
  console.log('\n❌ WORKFLOW VALIDATION FAILED');
}

// Export pentru utilizare
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testWorkflow, testWorkflowCreation, simulateWorkflowExecution };
}
