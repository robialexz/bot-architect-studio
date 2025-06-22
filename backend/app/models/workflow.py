"""
Workflow model for FlowsyAI Backend
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from app.core.database import Base


class WorkflowStatus(PyEnum):
    """Workflow status enumeration"""
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class WorkflowVisibility(PyEnum):
    """Workflow visibility enumeration"""
    PRIVATE = "private"
    PUBLIC = "public"
    SHARED = "shared"


class Workflow(Base):
    """Workflow model"""
    
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Workflow configuration
    workflow_data = Column(JSON, nullable=False, default=dict)  # Stores the workflow graph/nodes
    version = Column(String(20), default="1.0.0", nullable=False)
    
    # Status and visibility
    status = Column(Enum(WorkflowStatus), default=WorkflowStatus.DRAFT, nullable=False)
    visibility = Column(Enum(WorkflowVisibility), default=WorkflowVisibility.PRIVATE, nullable=False)
    
    # Metadata
    tags = Column(JSON, nullable=True, default=list)  # List of tags
    category = Column(String(100), nullable=True)
    
    # Performance metrics
    execution_count = Column(Integer, default=0, nullable=False)
    success_count = Column(Integer, default=0, nullable=False)
    failure_count = Column(Integer, default=0, nullable=False)
    avg_execution_time = Column(Integer, default=0, nullable=False)  # in milliseconds
    
    # Resource usage
    tokens_used = Column(Integer, default=0, nullable=False)
    api_calls_made = Column(Integer, default=0, nullable=False)
    
    # Sharing and collaboration
    is_template = Column(Boolean, default=False, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    clone_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_executed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="workflows")
    executions = relationship("WorkflowExecution", back_populates="workflow", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Workflow(id={self.id}, name='{self.name}', status='{self.status.value}')>"
    
    @property
    def success_rate(self) -> float:
        """Calculate workflow success rate"""
        if self.execution_count == 0:
            return 0.0
        return (self.success_count / self.execution_count) * 100
    
    @property
    def is_public(self) -> bool:
        """Check if workflow is public"""
        return self.visibility == WorkflowVisibility.PUBLIC


class WorkflowExecution(Base):
    """Workflow execution model"""
    
    __tablename__ = "workflow_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Execution details
    status = Column(String(50), nullable=False, default="pending")  # pending, running, completed, failed
    input_data = Column(JSON, nullable=True)
    output_data = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Performance metrics
    execution_time = Column(Integer, nullable=True)  # in milliseconds
    tokens_used = Column(Integer, default=0, nullable=False)
    api_calls_made = Column(Integer, default=0, nullable=False)
    
    # Execution context
    trigger_type = Column(String(50), nullable=True)  # manual, scheduled, webhook, api
    trigger_data = Column(JSON, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Foreign keys
    workflow_id = Column(Integer, ForeignKey("workflows.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    workflow = relationship("Workflow", back_populates="executions")
    user = relationship("User")
    
    def __repr__(self):
        return f"<WorkflowExecution(id={self.id}, workflow_id={self.workflow_id}, status='{self.status}')>"
