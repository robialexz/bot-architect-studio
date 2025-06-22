"""
File model for FlowsyAI Backend
Handles file storage and metadata
"""

from datetime import datetime
from typing import Optional, Dict, Any

from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.core.database import Base

class FileModel(Base):
    """File model for storing uploaded files and their metadata"""
    
    __tablename__ = "files"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # File information
    original_filename = Column(String, nullable=False, index=True)
    stored_filename = Column(String, nullable=False, unique=True)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)  # text, image, document, etc.
    
    # File metadata
    description = Column(Text)
    metadata = Column(JSON, default=dict)  # Additional file metadata
    
    # Processing information
    status = Column(String, default='uploaded', index=True)  # uploaded, processing, processed, failed
    processing_result = Column(JSON, default=dict)  # Results from file processing
    processed_at = Column(DateTime)
    
    # Relationships
    owner_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    workflow_id = Column(String, ForeignKey("workflows.id"), nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Soft delete
    is_deleted = Column(Boolean, default=False, index=True)
    deleted_at = Column(DateTime)
    
    # Relationships
    owner = relationship("User", back_populates="files")
    workflow = relationship("Workflow", back_populates="files")
    
    def __repr__(self):
        return f"<FileModel(id={self.id}, filename={self.original_filename}, status={self.status})>"
    
    @property
    def is_processed(self) -> bool:
        """Check if file has been processed"""
        return self.status == 'processed'
    
    @property
    def is_processing(self) -> bool:
        """Check if file is currently being processed"""
        return self.status == 'processing'
    
    @property
    def has_failed(self) -> bool:
        """Check if file processing failed"""
        return self.status == 'failed'
    
    def get_file_info(self) -> Dict[str, Any]:
        """Get file information as dictionary"""
        return {
            'id': self.id,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'category': self.category,
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'metadata': self.metadata,
            'processing_result': self.processing_result
        }
    
    def update_processing_status(self, status: str, result: Optional[Dict[str, Any]] = None):
        """Update processing status and result"""
        self.status = status
        if result:
            self.processing_result = result
        if status == 'processed':
            self.processed_at = datetime.utcnow()
    
    def add_metadata(self, key: str, value: Any):
        """Add metadata to file"""
        if not self.metadata:
            self.metadata = {}
        self.metadata[key] = value
    
    def get_metadata(self, key: str, default: Any = None) -> Any:
        """Get metadata value"""
        if not self.metadata:
            return default
        return self.metadata.get(key, default)


class FileProcessingJob(Base):
    """Model for tracking file processing jobs"""
    
    __tablename__ = "file_processing_jobs"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Job information
    file_id = Column(String, ForeignKey("files.id"), nullable=False, index=True)
    job_type = Column(String, nullable=False)  # extract_text, analyze_image, etc.
    status = Column(String, default='pending', index=True)  # pending, running, completed, failed
    
    # Processing details
    parameters = Column(JSON, default=dict)  # Processing parameters
    result = Column(JSON, default=dict)  # Processing result
    error_message = Column(Text)  # Error message if failed
    
    # Progress tracking
    progress_percentage = Column(Integer, default=0)
    current_step = Column(String)
    total_steps = Column(Integer)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    
    # Relationships
    file = relationship("FileModel", backref="processing_jobs")
    
    def __repr__(self):
        return f"<FileProcessingJob(id={self.id}, file_id={self.file_id}, status={self.status})>"
    
    def update_progress(self, percentage: int, current_step: str = None):
        """Update job progress"""
        self.progress_percentage = min(100, max(0, percentage))
        if current_step:
            self.current_step = current_step
    
    def mark_started(self):
        """Mark job as started"""
        self.status = 'running'
        self.started_at = datetime.utcnow()
    
    def mark_completed(self, result: Dict[str, Any]):
        """Mark job as completed"""
        self.status = 'completed'
        self.result = result
        self.completed_at = datetime.utcnow()
        self.progress_percentage = 100
    
    def mark_failed(self, error_message: str):
        """Mark job as failed"""
        self.status = 'failed'
        self.error_message = error_message
        self.completed_at = datetime.utcnow()


class FileShare(Base):
    """Model for file sharing"""
    
    __tablename__ = "file_shares"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Share information
    file_id = Column(String, ForeignKey("files.id"), nullable=False, index=True)
    shared_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    shared_with_id = Column(String, ForeignKey("users.id"), nullable=True)  # Null for public shares
    
    # Share settings
    permission = Column(String, default='view')  # view, download, edit
    is_public = Column(Boolean, default=False)
    share_token = Column(String, unique=True, index=True)  # For public shares
    
    # Expiration
    expires_at = Column(DateTime)
    
    # Access tracking
    access_count = Column(Integer, default=0)
    last_accessed_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    file = relationship("FileModel", backref="shares")
    shared_by = relationship("User", foreign_keys=[shared_by_id])
    shared_with = relationship("User", foreign_keys=[shared_with_id])
    
    def __repr__(self):
        return f"<FileShare(id={self.id}, file_id={self.file_id}, permission={self.permission})>"
    
    @property
    def is_expired(self) -> bool:
        """Check if share has expired"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at
    
    def record_access(self):
        """Record file access"""
        self.access_count += 1
        self.last_accessed_at = datetime.utcnow()
    
    def generate_share_token(self) -> str:
        """Generate unique share token"""
        import secrets
        self.share_token = secrets.token_urlsafe(32)
        return self.share_token
