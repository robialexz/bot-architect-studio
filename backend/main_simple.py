"""
FlowsyAI Backend - Simplified Version for Testing
Basic FastAPI application without database dependencies
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="FlowsyAI Backend API",
    description="Robust backend API for FlowsyAI workflow automation platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080",
        "https://flowsyai.com",
        "https://www.flowsyai.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class WorkflowCreate(BaseModel):
    name: str
    description: Optional[str] = None
    workflow_data: Dict[str, Any] = {}

class WorkflowResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    workflow_data: Dict[str, Any]
    status: str = "active"

class AIRequest(BaseModel):
    provider: str = "openai"
    model: str = "gpt-3.5-turbo"
    prompt: str
    max_tokens: int = 1000

class AIResponse(BaseModel):
    success: bool
    content: Optional[str] = None
    error: Optional[str] = None
    tokens_used: int = 0

# In-memory storage for demo
workflows_db = {}
workflow_counter = 0

@app.get("/")
async def root():
    """Root endpoint - Health check"""
    return {
        "message": "FlowsyAI Backend API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": "development",
        "database": "in-memory"
    }

@app.post("/api/v1/workflows", response_model=WorkflowResponse)
async def create_workflow(workflow: WorkflowCreate):
    """Create a new workflow"""
    global workflow_counter
    workflow_counter += 1
    
    new_workflow = WorkflowResponse(
        id=workflow_counter,
        name=workflow.name,
        description=workflow.description,
        workflow_data=workflow.workflow_data
    )
    
    workflows_db[workflow_counter] = new_workflow
    
    logger.info(f"Workflow created: {workflow.name}")
    return new_workflow

@app.get("/api/v1/workflows", response_model=List[WorkflowResponse])
async def list_workflows():
    """List all workflows"""
    return list(workflows_db.values())

@app.get("/api/v1/workflows/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: int):
    """Get workflow by ID"""
    if workflow_id not in workflows_db:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return workflows_db[workflow_id]

@app.post("/api/v1/ai/process", response_model=AIResponse)
async def process_ai_request(request: AIRequest):
    """Process AI request - mock implementation"""
    
    # Mock AI processing
    mock_response = f"Mock AI response from {request.provider} {request.model} for prompt: {request.prompt[:50]}..."
    
    logger.info(f"AI request processed: {request.provider} - {request.model}")
    
    return AIResponse(
        success=True,
        content=mock_response,
        tokens_used=len(mock_response.split()) * 2
    )

@app.get("/api/v1/ai/models")
async def list_ai_models():
    """List available AI models"""
    return {
        "models": [
            {"id": "gpt-4", "name": "GPT-4", "provider": "OpenAI"},
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "provider": "OpenAI"},
            {"id": "claude-3", "name": "Claude 3", "provider": "Anthropic"},
            {"id": "gemini-pro", "name": "Gemini Pro", "provider": "Google"}
        ]
    }

@app.post("/api/v1/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: int, input_data: Dict[str, Any] = {}):
    """Execute workflow - mock implementation"""
    
    if workflow_id not in workflows_db:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow = workflows_db[workflow_id]
    
    # Mock execution
    result = {
        "execution_id": f"exec_{workflow_id}_{len(input_data)}",
        "workflow_id": workflow_id,
        "status": "completed",
        "input_data": input_data,
        "output_data": {
            "result": f"Mock execution result for workflow: {workflow.name}",
            "processed_steps": len(workflow.workflow_data.get("steps", [])),
            "execution_time": 1.5
        }
    }
    
    logger.info(f"Workflow executed: {workflow.name}")
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
