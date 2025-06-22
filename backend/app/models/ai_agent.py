"""
AI Agent model for FlowsyAI Backend
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from app.core.database import Base


class AIAgentType(PyEnum):
    """AI Agent type enumeration"""
    ASSISTANT = "assistant"
    ANALYZER = "analyzer"
    GENERATOR = "generator"
    PROCESSOR = "processor"
    CUSTOM = "custom"


class AIAgentStatus(PyEnum):
    """AI Agent status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRAINING = "training"
    ERROR = "error"


class AIAgent(Base):
    """AI Agent model"""
    
    __tablename__ = "ai_agents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Agent configuration
    agent_type = Column(Enum(AIAgentType), nullable=False)
    model_name = Column(String(100), nullable=False)  # gpt-4, claude-3, gemini-pro, etc.
    
    # Agent settings
    system_prompt = Column(Text, nullable=True)
    temperature = Column(String(10), default="0.7", nullable=False)
    max_tokens = Column(Integer, default=1000, nullable=False)
    
    # Advanced configuration
    configuration = Column(JSON, nullable=True, default=dict)  # Custom settings
    capabilities = Column(JSON, nullable=True, default=list)  # List of capabilities
    
    # Status and performance
    status = Column(Enum(AIAgentStatus), default=AIAgentStatus.ACTIVE, nullable=False)
    
    # Usage metrics
    usage_count = Column(Integer, default=0, nullable=False)
    success_count = Column(Integer, default=0, nullable=False)
    failure_count = Column(Integer, default=0, nullable=False)
    total_tokens_used = Column(Integer, default=0, nullable=False)
    avg_response_time = Column(Integer, default=0, nullable=False)  # in milliseconds
    
    # Sharing and visibility
    is_public = Column(Boolean, default=False, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    clone_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    
    # Foreign keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="ai_agents")
    interactions = relationship("AIAgentInteraction", back_populates="agent", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<AIAgent(id={self.id}, name='{self.name}', type='{self.agent_type.value}')>"
    
    @property
    def success_rate(self) -> float:
        """Calculate agent success rate"""
        if self.usage_count == 0:
            return 0.0
        return (self.success_count / self.usage_count) * 100
    
    @property
    def avg_tokens_per_interaction(self) -> float:
        """Calculate average tokens per interaction"""
        if self.usage_count == 0:
            return 0.0
        return self.total_tokens_used / self.usage_count


class AIAgentInteraction(Base):
    """AI Agent interaction model"""
    
    __tablename__ = "ai_agent_interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Interaction data
    input_text = Column(Text, nullable=False)
    output_text = Column(Text, nullable=True)
    
    # Metadata
    tokens_used = Column(Integer, default=0, nullable=False)
    response_time = Column(Integer, nullable=True)  # in milliseconds
    status = Column(String(50), nullable=False, default="pending")  # pending, completed, failed
    error_message = Column(Text, nullable=True)
    
    # Context
    context_data = Column(JSON, nullable=True)
    session_id = Column(String(255), nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Foreign keys
    agent_id = Column(Integer, ForeignKey("ai_agents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    agent = relationship("AIAgent", back_populates="interactions")
    user = relationship("User")
    
    def __repr__(self):
        return f"<AIAgentInteraction(id={self.id}, agent_id={self.agent_id}, status='{self.status}')>"
