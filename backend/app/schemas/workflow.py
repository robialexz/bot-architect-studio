"""
Workflow schemas for FlowsyAI Backend
Pydantic models for workflow request/response validation
"""

from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class WorkflowStatus(str, Enum):
    """Workflow status enumeration"""
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class WorkflowVisibility(str, Enum):
    """Workflow visibility enumeration"""
    PRIVATE = "private"
    PUBLIC = "public"
    SHARED = "shared"


class WorkflowCreate(BaseModel):
    """Workflow creation schema"""
    name: str
    description: Optional[str] = None
    workflow_data: Dict[str, Any] = {}
    tags: List[str] = []
    category: Optional[str] = None
    visibility: WorkflowVisibility = WorkflowVisibility.PRIVATE
    
    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('Workflow name must be at least 3 characters long')
        return v.strip()


class WorkflowUpdate(BaseModel):
    """Workflow update schema"""
    name: Optional[str] = None
    description: Optional[str] = None
    workflow_data: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    status: Optional[WorkflowStatus] = None
    visibility: Optional[WorkflowVisibility] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v and len(v.strip()) < 3:
            raise ValueError('Workflow name must be at least 3 characters long')
        return v.strip() if v else v


class WorkflowResponse(BaseModel):
    """Workflow response schema"""
    id: int
    name: str
    description: Optional[str]
    workflow_data: Dict[str, Any]
    version: str
    status: WorkflowStatus
    visibility: WorkflowVisibility
    tags: List[str]
    category: Optional[str]
    
    # Performance metrics
    execution_count: int
    success_count: int
    failure_count: int
    avg_execution_time: int
    success_rate: float
    
    # Resource usage
    tokens_used: int
    api_calls_made: int
    
    # Sharing metrics
    is_template: bool
    is_featured: bool
    clone_count: int
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    last_executed_at: Optional[datetime]
    
    # Owner info
    owner_id: int
    
    class Config:
        from_attributes = True


class WorkflowListResponse(BaseModel):
    """Workflow list response schema"""
    id: int
    name: str
    description: Optional[str]
    status: WorkflowStatus
    visibility: WorkflowVisibility
    tags: List[str]
    category: Optional[str]
    execution_count: int
    success_rate: float
    created_at: datetime
    updated_at: datetime
    owner_id: int
    
    class Config:
        from_attributes = True


class WorkflowExecutionCreate(BaseModel):
    """Workflow execution creation schema"""
    input_data: Optional[Dict[str, Any]] = None
    trigger_type: str = "manual"
    trigger_data: Optional[Dict[str, Any]] = None


class WorkflowExecutionResponse(BaseModel):
    """Workflow execution response schema"""
    id: int
    status: str
    input_data: Optional[Dict[str, Any]]
    output_data: Optional[Dict[str, Any]]
    error_message: Optional[str]
    execution_time: Optional[int]
    tokens_used: int
    api_calls_made: int
    trigger_type: Optional[str]
    trigger_data: Optional[Dict[str, Any]]
    started_at: datetime
    completed_at: Optional[datetime]
    workflow_id: int
    user_id: int
    
    class Config:
        from_attributes = True


class WorkflowSearchParams(BaseModel):
    """Workflow search parameters"""
    query: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[WorkflowStatus] = None
    visibility: Optional[WorkflowVisibility] = None
    is_template: Optional[bool] = None
    owner_id: Optional[int] = None
    limit: int = 20
    offset: int = 0
    
    @validator('limit')
    def validate_limit(cls, v):
        if v > 100:
            raise ValueError('Limit cannot exceed 100')
        return v
