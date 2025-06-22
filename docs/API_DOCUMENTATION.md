# FlowsyAI Backend API Documentation

## Overview

The FlowsyAI Backend API is a comprehensive RESTful API that powers the FlowsyAI workflow automation platform. It provides endpoints for workflow management, AI service integration, file processing, user management, and analytics.

## Base URL

- **Production**: `https://api.flowsyai.com`
- **Staging**: `https://staging-api.flowsyai.com`
- **Development**: `http://localhost:8000`

## Authentication

### JWT Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### API Key Authentication

For service-to-service communication, use API keys:

```
X-API-Key: <your_api_key>
```

### Getting Started

1. **Register a new account**:
   ```bash
   POST /api/v1/auth/register
   ```

2. **Login to get JWT token**:
   ```bash
   POST /api/v1/auth/login
   ```

3. **Use the token in subsequent requests**:
   ```bash
   curl -H "Authorization: Bearer <token>" https://api.flowsyai.com/api/v1/workflows
   ```

## Rate Limiting

API requests are rate limited to ensure fair usage:

- **Per minute**: 100 requests
- **Per hour**: 1,000 requests  
- **Per day**: 10,000 requests

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Error Handling

The API uses standard HTTP status codes and returns detailed error information:

### Error Response Format

```json
{
  "detail": "Error description",
  "error_code": "SPECIFIC_ERROR_CODE",
  "timestamp": "2024-01-22T10:30:00Z",
  "request_id": "req_123456789"
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

## API Endpoints

### Authentication

#### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "id": "user_123456789",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2024-01-22T10:30:00Z"
}
```

#### POST /api/v1/auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "user_123456789",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

### Workflows

#### GET /api/v1/workflows
List user's workflows with pagination and filtering.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `size` (int): Items per page (default: 20)
- `category` (string): Filter by category
- `is_active` (boolean): Filter by active status
- `search` (string): Search in name and description

**Response:**
```json
{
  "items": [
    {
      "id": "wf_123456789",
      "name": "Content Generation Workflow",
      "description": "Generate blog posts using AI",
      "category": "content",
      "is_active": true,
      "created_at": "2024-01-22T10:30:00Z",
      "updated_at": "2024-01-22T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 20,
  "pages": 1
}
```

#### POST /api/v1/workflows
Create a new workflow.

**Request Body:**
```json
{
  "name": "Image Analysis Workflow",
  "description": "Analyze uploaded images using AI",
  "workflow_data": {
    "nodes": [
      {
        "id": "upload_1",
        "type": "file_input",
        "data": {"label": "Image Upload"}
      },
      {
        "id": "ai_1",
        "type": "ai_vision",
        "data": {"label": "Image Analysis", "model": "gpt-4-vision"}
      }
    ],
    "connections": [
      {"source": "upload_1", "target": "ai_1"}
    ]
  },
  "category": "image_processing",
  "tags": ["ai", "vision"]
}
```

#### GET /api/v1/workflows/{workflow_id}
Get workflow details.

#### PUT /api/v1/workflows/{workflow_id}
Update workflow.

#### DELETE /api/v1/workflows/{workflow_id}
Delete workflow.

#### POST /api/v1/workflows/{workflow_id}/execute
Execute workflow with input data.

**Request Body:**
```json
{
  "input_data": {
    "topic": "Artificial Intelligence",
    "style": "professional"
  },
  "async": true
}
```

**Response:**
```json
{
  "execution_id": "exec_123456789",
  "status": "running",
  "started_at": "2024-01-22T10:30:00Z"
}
```

### AI Services

#### POST /api/v1/ai/chat
Send chat completion request to AI models.

**Request Body:**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "user",
      "content": "Explain quantum computing"
    }
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

#### POST /api/v1/ai/image/generate
Generate images using AI models.

**Request Body:**
```json
{
  "model": "dall-e-3",
  "prompt": "A futuristic city with flying cars",
  "size": "1024x1024",
  "quality": "hd"
}
```

#### POST /api/v1/ai/image/analyze
Analyze images using vision models.

### Files

#### POST /api/v1/files/upload
Upload files for processing.

**Request:** Multipart form data
- `file`: File to upload
- `description`: Optional description
- `process_immediately`: Boolean flag
- `workflow_id`: Optional workflow ID

**Response:**
```json
{
  "id": "file_123456789",
  "filename": "document.pdf",
  "size": 1048576,
  "category": "document",
  "status": "uploaded"
}
```

#### GET /api/v1/files
List user's files.

#### GET /api/v1/files/{file_id}
Get file information.

#### GET /api/v1/files/{file_id}/download
Download file.

#### POST /api/v1/files/{file_id}/process
Process file.

#### DELETE /api/v1/files/{file_id}
Delete file.

### Analytics

#### GET /api/v1/analytics/usage
Get usage analytics.

**Response:**
```json
{
  "api_calls_count": 1250,
  "total_tokens_used": 45000,
  "cost_breakdown": {
    "openai": 25.50,
    "anthropic": 18.20
  },
  "performance_metrics": {
    "avg_response_time": 2.5,
    "success_rate": 0.98
  }
}
```

#### GET /api/v1/analytics/workflows
Get workflow analytics.

#### GET /api/v1/analytics/costs
Get cost analytics.

### WebSockets

#### WS /api/v1/ws/workflows/{workflow_id}
Real-time workflow execution updates.

**Message Format:**
```json
{
  "type": "execution_update",
  "execution_id": "exec_123456789",
  "status": "running",
  "progress": 45,
  "current_step": "Processing AI request",
  "timestamp": "2024-01-22T10:30:00Z"
}
```

## SDKs and Libraries

### Python SDK

```bash
pip install flowsyai-python
```

```python
from flowsyai import FlowsyAI

client = FlowsyAI(api_key="your_api_key")

# Create workflow
workflow = client.workflows.create({
    "name": "My Workflow",
    "workflow_data": {...}
})

# Execute workflow
execution = client.workflows.execute(workflow.id, {
    "input_data": {"topic": "AI"}
})
```

### JavaScript SDK

```bash
npm install flowsyai-js
```

```javascript
import { FlowsyAI } from 'flowsyai-js';

const client = new FlowsyAI({ apiKey: 'your_api_key' });

// Create workflow
const workflow = await client.workflows.create({
  name: 'My Workflow',
  workflowData: {...}
});

// Execute workflow
const execution = await client.workflows.execute(workflow.id, {
  inputData: { topic: 'AI' }
});
```

## Webhooks

Configure webhooks to receive real-time notifications about events.

### Webhook Events

- `workflow.execution.started`
- `workflow.execution.completed`
- `workflow.execution.failed`
- `file.processing.completed`
- `user.quota.exceeded`

### Webhook Payload

```json
{
  "event": "workflow.execution.completed",
  "data": {
    "execution_id": "exec_123456789",
    "workflow_id": "wf_123456789",
    "status": "completed",
    "output_data": {...}
  },
  "timestamp": "2024-01-22T10:30:00Z"
}
```

## Best Practices

### 1. Error Handling
Always handle errors gracefully and check response status codes.

### 2. Rate Limiting
Implement exponential backoff for rate limit errors.

### 3. Pagination
Use pagination for large datasets to improve performance.

### 4. Caching
Cache frequently accessed data to reduce API calls.

### 5. Security
- Never expose API keys in client-side code
- Use HTTPS for all requests
- Validate all input data

## Code Examples

### Complete Workflow Example (Python)

```python
import requests
import json
import time

class FlowsyAIClient:
    def __init__(self, api_key, base_url="https://api.flowsyai.com"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def create_workflow(self, workflow_data):
        response = requests.post(
            f"{self.base_url}/api/v1/workflows",
            headers=self.headers,
            json=workflow_data
        )
        return response.json()

    def execute_workflow(self, workflow_id, input_data):
        response = requests.post(
            f"{self.base_url}/api/v1/workflows/{workflow_id}/execute",
            headers=self.headers,
            json={"input_data": input_data, "async": True}
        )
        return response.json()

    def get_execution_status(self, execution_id):
        response = requests.get(
            f"{self.base_url}/api/v1/executions/{execution_id}",
            headers=self.headers
        )
        return response.json()

# Usage example
client = FlowsyAIClient("your_api_key")

# Create a content generation workflow
workflow = client.create_workflow({
    "name": "Blog Post Generator",
    "description": "Generate SEO-optimized blog posts",
    "workflow_data": {
        "nodes": [
            {
                "id": "input_1",
                "type": "input",
                "data": {"label": "Topic", "type": "text"}
            },
            {
                "id": "ai_1",
                "type": "ai_model",
                "data": {
                    "label": "Content Generator",
                    "model": "gpt-4",
                    "prompt": "Write a comprehensive blog post about: {input_1}"
                }
            },
            {
                "id": "output_1",
                "type": "output",
                "data": {"label": "Generated Post"}
            }
        ],
        "connections": [
            {"source": "input_1", "target": "ai_1"},
            {"source": "ai_1", "target": "output_1"}
        ]
    }
})

# Execute the workflow
execution = client.execute_workflow(workflow["id"], {
    "topic": "The Future of Artificial Intelligence"
})

# Monitor execution
while True:
    status = client.get_execution_status(execution["execution_id"])
    print(f"Status: {status['status']}")

    if status["status"] in ["completed", "failed"]:
        break

    time.sleep(2)

print("Final result:", status.get("output_data"))
```

### File Upload Example (JavaScript)

```javascript
async function uploadAndProcessFile(file, apiKey) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('process_immediately', 'true');
    formData.append('description', 'Document for analysis');

    try {
        const response = await fetch('https://api.flowsyai.com/api/v1/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });

        const result = await response.json();
        console.log('File uploaded:', result);

        // Monitor processing status
        if (result.status === 'processing') {
            await monitorFileProcessing(result.id, apiKey);
        }

        return result;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}

async function monitorFileProcessing(fileId, apiKey) {
    while (true) {
        const response = await fetch(`https://api.flowsyai.com/api/v1/files/${fileId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const fileInfo = await response.json();
        console.log(`Processing status: ${fileInfo.status}`);

        if (fileInfo.status === 'processed') {
            console.log('Processing completed:', fileInfo.processing_result);
            break;
        } else if (fileInfo.status === 'failed') {
            console.error('Processing failed:', fileInfo.processing_result);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}
```

### WebSocket Real-time Updates (JavaScript)

```javascript
function connectToWorkflowUpdates(workflowId, apiKey) {
    const ws = new WebSocket(`wss://api.flowsyai.com/api/v1/ws/workflows/${workflowId}?token=${apiKey}`);

    ws.onopen = function(event) {
        console.log('Connected to workflow updates');
    };

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);

        switch(data.type) {
            case 'execution_update':
                console.log(`Execution ${data.execution_id}: ${data.status} (${data.progress}%)`);
                updateProgressBar(data.progress);
                break;

            case 'execution_completed':
                console.log('Execution completed:', data.output_data);
                displayResults(data.output_data);
                break;

            case 'execution_failed':
                console.error('Execution failed:', data.error);
                showError(data.error);
                break;
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    ws.onclose = function(event) {
        console.log('WebSocket connection closed');
        // Implement reconnection logic if needed
    };

    return ws;
}
```

## Support

- **Documentation**: https://docs.flowsyai.com
- **API Reference**: https://api.flowsyai.com/docs
- **Support Email**: support@flowsyai.com
- **Community**: https://community.flowsyai.com
- **Status Page**: https://status.flowsyai.com
