"""
Documentation endpoints for FlowsyAI Backend API
Provides enhanced API documentation and examples
"""

from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from typing import Dict, Any

from app.core.config import settings
from app.api.docs import API_EXAMPLES, RESPONSE_SCHEMAS

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def api_documentation_home(request: Request):
    """Enhanced API documentation homepage"""
    return templates.TemplateResponse("docs/index.html", {
        "request": request,
        "title": "FlowsyAI API Documentation",
        "version": "1.0.0",
        "base_url": settings.API_BASE_URL
    })

@router.get("/examples")
async def get_api_examples() -> Dict[str, Any]:
    """Get API usage examples"""
    return {
        "examples": API_EXAMPLES,
        "description": "Comprehensive API usage examples for all endpoints"
    }

@router.get("/examples/{endpoint_name}")
async def get_endpoint_example(endpoint_name: str) -> Dict[str, Any]:
    """Get specific endpoint example"""
    if endpoint_name not in API_EXAMPLES:
        return {"error": "Example not found"}
    
    return {
        "endpoint": endpoint_name,
        "example": API_EXAMPLES[endpoint_name],
        "description": f"Example for {endpoint_name} endpoint"
    }

@router.get("/schemas")
async def get_response_schemas() -> Dict[str, Any]:
    """Get API response schemas"""
    return {
        "schemas": RESPONSE_SCHEMAS,
        "description": "Standard response schemas used across the API"
    }

@router.get("/postman")
async def get_postman_collection() -> Dict[str, Any]:
    """Generate Postman collection for API testing"""
    
    collection = {
        "info": {
            "name": "FlowsyAI API",
            "description": "Complete API collection for FlowsyAI Backend",
            "version": "1.0.0",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "auth": {
            "type": "bearer",
            "bearer": [
                {
                    "key": "token",
                    "value": "{{jwt_token}}",
                    "type": "string"
                }
            ]
        },
        "variable": [
            {
                "key": "base_url",
                "value": "https://api.flowsyai.com",
                "type": "string"
            },
            {
                "key": "jwt_token",
                "value": "",
                "type": "string"
            }
        ],
        "item": [
            {
                "name": "Authentication",
                "item": [
                    {
                        "name": "Register",
                        "request": {
                            "method": "POST",
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "body": {
                                "mode": "raw",
                                "raw": '{\n  "email": "user@example.com",\n  "password": "securepassword123",\n  "full_name": "John Doe"\n}'
                            },
                            "url": {
                                "raw": "{{base_url}}/api/v1/auth/register",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "auth", "register"]
                            }
                        }
                    },
                    {
                        "name": "Login",
                        "request": {
                            "method": "POST",
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "body": {
                                "mode": "raw",
                                "raw": '{\n  "email": "user@example.com",\n  "password": "securepassword123"\n}'
                            },
                            "url": {
                                "raw": "{{base_url}}/api/v1/auth/login",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "auth", "login"]
                            }
                        },
                        "event": [
                            {
                                "listen": "test",
                                "script": {
                                    "exec": [
                                        "if (pm.response.code === 200) {",
                                        "    const response = pm.response.json();",
                                        "    pm.collectionVariables.set('jwt_token', response.access_token);",
                                        "}"
                                    ]
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Workflows",
                "item": [
                    {
                        "name": "List Workflows",
                        "request": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/workflows?page=1&size=20",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "workflows"],
                                "query": [
                                    {"key": "page", "value": "1"},
                                    {"key": "size", "value": "20"}
                                ]
                            }
                        }
                    },
                    {
                        "name": "Create Workflow",
                        "request": {
                            "method": "POST",
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "body": {
                                "mode": "raw",
                                "raw": '{\n  "name": "Example Workflow",\n  "description": "A sample workflow",\n  "workflow_data": {\n    "nodes": [],\n    "connections": []\n  }\n}'
                            },
                            "url": {
                                "raw": "{{base_url}}/api/v1/workflows",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "workflows"]
                            }
                        }
                    },
                    {
                        "name": "Execute Workflow",
                        "request": {
                            "method": "POST",
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "body": {
                                "mode": "raw",
                                "raw": '{\n  "input_data": {\n    "topic": "Artificial Intelligence"\n  },\n  "async": true\n}'
                            },
                            "url": {
                                "raw": "{{base_url}}/api/v1/workflows/{{workflow_id}}/execute",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "workflows", "{{workflow_id}}", "execute"]
                            }
                        }
                    }
                ]
            },
            {
                "name": "AI Services",
                "item": [
                    {
                        "name": "Chat Completion",
                        "request": {
                            "method": "POST",
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "body": {
                                "mode": "raw",
                                "raw": '{\n  "model": "gpt-4",\n  "messages": [\n    {\n      "role": "user",\n      "content": "Hello, how are you?"\n    }\n  ],\n  "max_tokens": 150\n}'
                            },
                            "url": {
                                "raw": "{{base_url}}/api/v1/ai/chat",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "ai", "chat"]
                            }
                        }
                    },
                    {
                        "name": "Generate Image",
                        "request": {
                            "method": "POST",
                            "header": [
                                {
                                    "key": "Content-Type",
                                    "value": "application/json"
                                }
                            ],
                            "body": {
                                "mode": "raw",
                                "raw": '{\n  "model": "dall-e-3",\n  "prompt": "A beautiful sunset over mountains",\n  "size": "1024x1024"\n}'
                            },
                            "url": {
                                "raw": "{{base_url}}/api/v1/ai/image/generate",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "ai", "image", "generate"]
                            }
                        }
                    }
                ]
            },
            {
                "name": "Files",
                "item": [
                    {
                        "name": "Upload File",
                        "request": {
                            "method": "POST",
                            "header": [],
                            "body": {
                                "mode": "formdata",
                                "formdata": [
                                    {
                                        "key": "file",
                                        "type": "file",
                                        "src": []
                                    },
                                    {
                                        "key": "description",
                                        "value": "Test file upload",
                                        "type": "text"
                                    }
                                ]
                            },
                            "url": {
                                "raw": "{{base_url}}/api/v1/files/upload",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "files", "upload"]
                            }
                        }
                    },
                    {
                        "name": "List Files",
                        "request": {
                            "method": "GET",
                            "header": [],
                            "url": {
                                "raw": "{{base_url}}/api/v1/files",
                                "host": ["{{base_url}}"],
                                "path": ["api", "v1", "files"]
                            }
                        }
                    }
                ]
            }
        ]
    }
    
    return collection

@router.get("/curl-examples")
async def get_curl_examples() -> Dict[str, Any]:
    """Get cURL command examples for API testing"""
    
    examples = {
        "authentication": {
            "register": """curl -X POST "https://api.flowsyai.com/api/v1/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "full_name": "John Doe"
  }'""",
            "login": """curl -X POST "https://api.flowsyai.com/api/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'"""
        },
        "workflows": {
            "list": """curl -X GET "https://api.flowsyai.com/api/v1/workflows" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" """,
            "create": """curl -X POST "https://api.flowsyai.com/api/v1/workflows" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Example Workflow",
    "description": "A sample workflow",
    "workflow_data": {
      "nodes": [],
      "connections": []
    }
  }'""",
            "execute": """curl -X POST "https://api.flowsyai.com/api/v1/workflows/WORKFLOW_ID/execute" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input_data": {
      "topic": "Artificial Intelligence"
    },
    "async": true
  }'"""
        },
        "ai_services": {
            "chat": """curl -X POST "https://api.flowsyai.com/api/v1/ai/chat" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "max_tokens": 150
  }'""",
            "image_generation": """curl -X POST "https://api.flowsyai.com/api/v1/ai/image/generate" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "dall-e-3",
    "prompt": "A beautiful sunset over mountains",
    "size": "1024x1024"
  }'"""
        },
        "files": {
            "upload": """curl -X POST "https://api.flowsyai.com/api/v1/files/upload" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -F "file=@/path/to/your/file.pdf" \\
  -F "description=Test file upload" """,
            "list": """curl -X GET "https://api.flowsyai.com/api/v1/files" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" """
        }
    }
    
    return {
        "examples": examples,
        "description": "cURL command examples for testing API endpoints"
    }

@router.get("/sdk-examples")
async def get_sdk_examples() -> Dict[str, Any]:
    """Get SDK usage examples"""
    
    examples = {
        "python": {
            "installation": "pip install flowsyai-python",
            "basic_usage": """
from flowsyai import FlowsyAI

# Initialize client
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

# Get results
result = client.executions.get(execution.id)
print(result.output_data)
            """,
            "async_usage": """
import asyncio
from flowsyai import AsyncFlowsyAI

async def main():
    client = AsyncFlowsyAI(api_key="your_api_key")
    
    workflow = await client.workflows.create({
        "name": "Async Workflow",
        "workflow_data": {...}
    })
    
    execution = await client.workflows.execute(workflow.id, {
        "input_data": {"topic": "AI"}
    })
    
    await client.close()

asyncio.run(main())
            """
        },
        "javascript": {
            "installation": "npm install flowsyai-js",
            "basic_usage": """
import { FlowsyAI } from 'flowsyai-js';

// Initialize client
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

// Get results
const result = await client.executions.get(execution.id);
console.log(result.outputData);
            """,
            "react_usage": """
import React, { useState, useEffect } from 'react';
import { FlowsyAI } from 'flowsyai-js';

function WorkflowComponent() {
  const [client] = useState(() => new FlowsyAI({ apiKey: 'your_api_key' }));
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    async function loadWorkflows() {
      const result = await client.workflows.list();
      setWorkflows(result.items);
    }
    loadWorkflows();
  }, [client]);

  return (
    <div>
      {workflows.map(workflow => (
        <div key={workflow.id}>{workflow.name}</div>
      ))}
    </div>
  );
}
            """
        }
    }
    
    return {
        "examples": examples,
        "description": "SDK usage examples for different programming languages"
    }
