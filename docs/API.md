# 📚 API Documentation

## Overview

AI Flow provides a comprehensive REST API for managing workflows, AI agents, and
user data. All API endpoints are built on top of Supabase and follow RESTful
conventions.

## Base URL

```
Production: https://your-project.supabase.co/rest/v1
Development: http://localhost:54321/rest/v1
```

## Authentication

All API requests require authentication using Supabase JWT tokens.

### Headers

```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
apikey: <your-supabase-anon-key>
```

## Endpoints

### Authentication

#### POST /auth/v1/signup

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "full_name": "John Doe"
  }
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2023-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  }
}
```

#### POST /auth/v1/token

Sign in with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Workflows

#### GET /workflows

List all workflows for the authenticated user.

**Query Parameters:**

- `status` (optional): Filter by workflow status
- `category` (optional): Filter by workflow category
- `limit` (optional): Number of results to return (default: 10)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "My Workflow",
      "description": "A sample workflow",
      "status": "draft",
      "category": "automation",
      "nodes": [],
      "edges": [],
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

#### POST /workflows

Create a new workflow.

**Request Body:**

```json
{
  "name": "New Workflow",
  "description": "Description of the workflow",
  "category": "automation",
  "nodes": [],
  "edges": []
}
```

#### GET /workflows/{id}

Get a specific workflow by ID.

**Response:**

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "A sample workflow",
  "status": "draft",
  "category": "automation",
  "nodes": [
    {
      "id": "node-1",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": { "label": "Start" }
    }
  ],
  "edges": [],
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### PUT /workflows/{id}

Update an existing workflow.

**Request Body:**

```json
{
  "name": "Updated Workflow",
  "description": "Updated description",
  "nodes": [...],
  "edges": [...]
}
```

#### DELETE /workflows/{id}

Delete a workflow.

**Response:**

```json
{
  "message": "Workflow deleted successfully"
}
```

### AI Agents

#### GET /ai_agents

List all available AI agents.

**Query Parameters:**

- `category` (optional): Filter by agent category
- `search` (optional): Search agents by name or description

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "GPT-4 Assistant",
      "description": "Advanced language model",
      "category": "language",
      "capabilities": ["text-generation", "analysis"],
      "pricing": {
        "type": "usage",
        "cost_per_request": 0.01
      },
      "rating": 4.8,
      "downloads": 10000
    }
  ]
}
```

#### GET /ai_agents/{id}

Get details of a specific AI agent.

### Templates

#### GET /workflow_templates

List all workflow templates.

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Email Automation",
      "description": "Automate email responses",
      "category": "automation",
      "difficulty": "beginner",
      "estimated_time": "5 minutes",
      "nodes": [...],
      "edges": [...],
      "tags": ["email", "automation"],
      "downloads": 500,
      "rating": 4.5
    }
  ]
}
```

### User Profile

#### GET /profiles

Get the current user's profile.

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### PUT /profiles

Update the current user's profile.

**Request Body:**

```json
{
  "full_name": "John Smith",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

## Error Handling

All API endpoints return standard HTTP status codes and error responses.

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

AI Flow supports webhooks for real-time notifications of workflow events.

### Webhook Events

- `workflow.created` - New workflow created
- `workflow.updated` - Workflow updated
- `workflow.executed` - Workflow execution completed
- `workflow.failed` - Workflow execution failed

### Webhook Payload

```json
{
  "event": "workflow.executed",
  "data": {
    "workflow_id": "uuid",
    "execution_id": "uuid",
    "status": "completed",
    "duration": 1500,
    "timestamp": "2023-01-01T00:00:00Z"
  }
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @ai-flow/sdk
```

```typescript
import { AIFlowClient } from '@ai-flow/sdk';

const client = new AIFlowClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-project.supabase.co',
});

// List workflows
const workflows = await client.workflows.list();

// Create workflow
const workflow = await client.workflows.create({
  name: 'My Workflow',
  description: 'A new workflow',
});
```

## Examples

### Creating a Complete Workflow

```javascript
// 1. Create workflow
const workflow = await fetch('/workflows', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Email Processing Workflow',
    description: 'Process incoming emails with AI',
    category: 'automation',
  }),
});

// 2. Add nodes and edges
await fetch(`/workflows/${workflow.id}`, {
  method: 'PUT',
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nodes: [
      {
        id: 'trigger-1',
        type: 'email-trigger',
        position: { x: 100, y: 100 },
        data: { label: 'Email Received' },
      },
      {
        id: 'ai-1',
        type: 'ai-processor',
        position: { x: 300, y: 100 },
        data: {
          label: 'AI Analysis',
          agent_id: 'gpt-4-assistant',
        },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'trigger-1',
        target: 'ai-1',
      },
    ],
  }),
});
```

## Support

For API support and questions:

- **Documentation**: [Full API docs](https://docs.ai-flow.com)
- **Support**: support@ai-flow.com
- **Status Page**: https://status.ai-flow.com
