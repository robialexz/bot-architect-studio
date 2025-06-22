"""
API Documentation configuration for FlowsyAI Backend
Configures Swagger UI and OpenAPI documentation
"""

from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

def custom_openapi(app: FastAPI):
    """Generate custom OpenAPI schema"""
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="FlowsyAI Backend API",
        version="1.0.0",
        description="""
        ## FlowsyAI Backend API Documentation
        
        Welcome to the FlowsyAI Backend API! This is a comprehensive AI workflow automation platform 
        that allows you to create, manage, and execute complex AI workflows.
        
        ### Features
        
        - **Workflow Management**: Create, update, delete, and execute AI workflows
        - **AI Services Integration**: Support for OpenAI, Anthropic, Google AI, and more
        - **File Processing**: Upload and process various file types
        - **Real-time Execution**: WebSocket support for real-time workflow execution
        - **User Management**: Complete authentication and authorization system
        - **Analytics**: Comprehensive usage analytics and reporting
        
        ### Authentication
        
        This API uses JWT (JSON Web Tokens) for authentication. Include the token in the 
        Authorization header as `Bearer <token>`.
        
        ### Rate Limiting
        
        API requests are rate limited to prevent abuse:
        - 100 requests per minute per user
        - 1000 requests per hour per user
        - 10000 requests per day per user
        
        ### Error Handling
        
        The API uses standard HTTP status codes and returns detailed error messages in JSON format:
        
        ```json
        {
            "detail": "Error description",
            "error_code": "SPECIFIC_ERROR_CODE",
            "timestamp": "2024-01-22T10:30:00Z"
        }
        ```
        
        ### Webhooks
        
        FlowsyAI supports webhooks for real-time notifications about workflow execution,
        file processing, and other events.
        
        ### SDKs and Libraries
        
        - Python SDK: `pip install flowsyai-python`
        - JavaScript SDK: `npm install flowsyai-js`
        - REST API: Direct HTTP calls
        
        ### Support
        
        - Documentation: https://docs.flowsyai.com
        - Support: support@flowsyai.com
        - Community: https://community.flowsyai.com
        """,
        routes=app.routes,
        servers=[
            {"url": "https://api.flowsyai.com", "description": "Production server"},
            {"url": "https://staging-api.flowsyai.com", "description": "Staging server"},
            {"url": "http://localhost:8000", "description": "Development server"}
        ],
        contact={
            "name": "FlowsyAI Support",
            "url": "https://flowsyai.com/support",
            "email": "support@flowsyai.com"
        },
        license_info={
            "name": "MIT License",
            "url": "https://opensource.org/licenses/MIT"
        }
    )
    
    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token obtained from /auth/login endpoint"
        },
        "ApiKeyAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
            "description": "API key for service-to-service authentication"
        }
    }
    
    # Add global security
    openapi_schema["security"] = [
        {"BearerAuth": []},
        {"ApiKeyAuth": []}
    ]
    
    # Add custom tags
    openapi_schema["tags"] = [
        {
            "name": "Authentication",
            "description": "User authentication and authorization endpoints"
        },
        {
            "name": "Workflows",
            "description": "Workflow management and execution endpoints"
        },
        {
            "name": "AI Services",
            "description": "AI model integration and processing endpoints"
        },
        {
            "name": "Files",
            "description": "File upload, processing, and management endpoints"
        },
        {
            "name": "Users",
            "description": "User profile and settings management endpoints"
        },
        {
            "name": "Analytics",
            "description": "Usage analytics and reporting endpoints"
        },
        {
            "name": "Webhooks",
            "description": "Webhook configuration and management endpoints"
        },
        {
            "name": "System",
            "description": "System health and monitoring endpoints"
        }
    ]
    
    # Add example responses
    openapi_schema["components"]["examples"] = {
        "WorkflowExample": {
            "summary": "Example workflow",
            "value": {
                "id": "wf_123456789",
                "name": "Content Generation Workflow",
                "description": "Generate blog posts using AI",
                "workflow_data": {
                    "nodes": [
                        {
                            "id": "input_1",
                            "type": "input",
                            "data": {"label": "Topic Input"}
                        },
                        {
                            "id": "ai_1",
                            "type": "ai_model",
                            "data": {
                                "label": "GPT-4",
                                "model": "gpt-4",
                                "prompt": "Write a blog post about: {input}"
                            }
                        },
                        {
                            "id": "output_1",
                            "type": "output",
                            "data": {"label": "Generated Content"}
                        }
                    ],
                    "connections": [
                        {"source": "input_1", "target": "ai_1"},
                        {"source": "ai_1", "target": "output_1"}
                    ]
                },
                "is_active": True,
                "created_at": "2024-01-22T10:30:00Z",
                "updated_at": "2024-01-22T10:30:00Z"
            }
        },
        "ExecutionExample": {
            "summary": "Example workflow execution",
            "value": {
                "id": "exec_123456789",
                "workflow_id": "wf_123456789",
                "status": "completed",
                "input_data": {"topic": "Artificial Intelligence"},
                "output_data": {
                    "generated_content": "# The Future of Artificial Intelligence\n\nArtificial Intelligence (AI) is rapidly transforming..."
                },
                "execution_time": 15.5,
                "started_at": "2024-01-22T10:30:00Z",
                "completed_at": "2024-01-22T10:30:15Z"
            }
        },
        "ErrorExample": {
            "summary": "Example error response",
            "value": {
                "detail": "Workflow not found",
                "error_code": "WORKFLOW_NOT_FOUND",
                "timestamp": "2024-01-22T10:30:00Z"
            }
        }
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

def setup_docs(app: FastAPI):
    """Setup API documentation"""
    
    @app.get("/docs", include_in_schema=False)
    async def custom_swagger_ui_html():
        """Custom Swagger UI with FlowsyAI branding"""
        return get_swagger_ui_html(
            openapi_url=app.openapi_url,
            title=f"{app.title} - Interactive API Documentation",
            swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
            swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
            swagger_ui_parameters={
                "deepLinking": True,
                "displayRequestDuration": True,
                "docExpansion": "none",
                "operationsSorter": "alpha",
                "filter": True,
                "showExtensions": True,
                "showCommonExtensions": True,
                "tryItOutEnabled": True
            }
        )
    
    # Set custom OpenAPI schema
    app.openapi = lambda: custom_openapi(app)

# API Examples for different endpoints
API_EXAMPLES = {
    "auth_login": {
        "request": {
            "email": "user@example.com",
            "password": "securepassword123"
        },
        "response": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "bearer",
            "expires_in": 3600,
            "user": {
                "id": "user_123456789",
                "email": "user@example.com",
                "full_name": "John Doe",
                "is_active": True
            }
        }
    },
    "workflow_create": {
        "request": {
            "name": "Image Analysis Workflow",
            "description": "Analyze uploaded images using AI",
            "workflow_data": {
                "nodes": [
                    {
                        "id": "upload_1",
                        "type": "file_input",
                        "data": {"label": "Image Upload", "accept": "image/*"}
                    },
                    {
                        "id": "vision_1",
                        "type": "ai_vision",
                        "data": {
                            "label": "Image Analysis",
                            "model": "gpt-4-vision",
                            "prompt": "Analyze this image and describe what you see"
                        }
                    },
                    {
                        "id": "output_1",
                        "type": "output",
                        "data": {"label": "Analysis Result"}
                    }
                ],
                "connections": [
                    {"source": "upload_1", "target": "vision_1"},
                    {"source": "vision_1", "target": "output_1"}
                ]
            },
            "category": "image_processing",
            "tags": ["ai", "vision", "analysis"]
        },
        "response": {
            "id": "wf_987654321",
            "name": "Image Analysis Workflow",
            "description": "Analyze uploaded images using AI",
            "workflow_data": "...",
            "category": "image_processing",
            "tags": ["ai", "vision", "analysis"],
            "is_active": True,
            "created_at": "2024-01-22T10:30:00Z",
            "updated_at": "2024-01-22T10:30:00Z"
        }
    },
    "file_upload": {
        "request": "multipart/form-data with file and metadata",
        "response": {
            "id": "file_123456789",
            "filename": "document.pdf",
            "size": 1048576,
            "category": "document",
            "mime_type": "application/pdf",
            "status": "uploaded",
            "upload_url": "/api/v1/files/file_123456789"
        }
    },
    "ai_request": {
        "request": {
            "model": "gpt-4",
            "messages": [
                {
                    "role": "user",
                    "content": "Explain quantum computing in simple terms"
                }
            ],
            "max_tokens": 500,
            "temperature": 0.7
        },
        "response": {
            "id": "req_123456789",
            "model": "gpt-4",
            "choices": [
                {
                    "message": {
                        "role": "assistant",
                        "content": "Quantum computing is a revolutionary approach to computation..."
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 15,
                "completion_tokens": 120,
                "total_tokens": 135
            },
            "created": 1705920600
        }
    }
}

# Response schemas for documentation
RESPONSE_SCHEMAS = {
    "SuccessResponse": {
        "type": "object",
        "properties": {
            "success": {"type": "boolean", "example": True},
            "message": {"type": "string", "example": "Operation completed successfully"},
            "data": {"type": "object"}
        }
    },
    "ErrorResponse": {
        "type": "object",
        "properties": {
            "detail": {"type": "string", "example": "Error description"},
            "error_code": {"type": "string", "example": "ERROR_CODE"},
            "timestamp": {"type": "string", "format": "date-time"}
        }
    },
    "PaginatedResponse": {
        "type": "object",
        "properties": {
            "items": {"type": "array"},
            "total": {"type": "integer", "example": 100},
            "page": {"type": "integer", "example": 1},
            "size": {"type": "integer", "example": 20},
            "pages": {"type": "integer", "example": 5}
        }
    }
}
