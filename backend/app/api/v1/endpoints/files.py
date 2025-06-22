"""
File upload and processing endpoints for FlowsyAI Backend
Handles file uploads, processing, and management
"""

import os
import uuid
import mimetypes
from typing import List, Optional
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.core.logging import get_logger
from app.models.user import User
from app.models.file import FileModel
from app.services.file_processor import FileProcessor
from app.tasks.file_tasks import process_file_task

logger = get_logger(__name__)

router = APIRouter()

# File upload configuration
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {
    'text': ['.txt', '.md', '.csv', '.json', '.xml', '.yaml', '.yml'],
    'document': ['.pdf', '.docx', '.doc', '.rtf', '.odt'],
    'image': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'],
    'audio': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
    'video': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
    'data': ['.xlsx', '.xls', '.ods', '.parquet', '.feather'],
    'code': ['.py', '.js', '.ts', '.html', '.css', '.sql', '.r', '.ipynb']
}

def get_file_category(filename: str) -> str:
    """Determine file category based on extension"""
    ext = Path(filename).suffix.lower()
    for category, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return category
    return 'other'

def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    # Check file size
    if hasattr(file, 'size') and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Check file extension
    ext = Path(file.filename).suffix.lower()
    all_extensions = []
    for extensions in ALLOWED_EXTENSIONS.values():
        all_extensions.extend(extensions)
    
    if ext not in all_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed extensions: {', '.join(all_extensions)}"
        )

@router.post("/upload")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    description: Optional[str] = Form(None),
    process_immediately: bool = Form(False),
    workflow_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a file"""
    try:
        # Validate file
        validate_file(file)
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_ext = Path(file.filename).suffix
        stored_filename = f"{file_id}{file_ext}"
        file_path = UPLOAD_DIR / stored_filename
        
        # Save file to disk
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Get file info
        file_size = len(content)
        mime_type = mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'
        category = get_file_category(file.filename)
        
        # Create database record
        file_record = FileModel(
            id=file_id,
            original_filename=file.filename,
            stored_filename=stored_filename,
            file_path=str(file_path),
            file_size=file_size,
            mime_type=mime_type,
            category=category,
            description=description,
            owner_id=current_user.id,
            workflow_id=workflow_id,
            status='uploaded'
        )
        
        db.add(file_record)
        await db.commit()
        await db.refresh(file_record)
        
        # Process file if requested
        if process_immediately:
            background_tasks.add_task(
                process_file_task.delay,
                file_id,
                current_user.id
            )
            file_record.status = 'processing'
            await db.commit()
        
        logger.info(f"File uploaded: {file.filename} -> {stored_filename}")
        
        return {
            "id": file_id,
            "filename": file.filename,
            "size": file_size,
            "category": category,
            "mime_type": mime_type,
            "status": file_record.status,
            "upload_url": f"/api/v1/files/{file_id}"
        }
        
    except Exception as e:
        logger.error(f"File upload failed: {e}")
        raise HTTPException(status_code=500, detail="File upload failed")

@router.post("/upload-multiple")
async def upload_multiple_files(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    description: Optional[str] = Form(None),
    process_immediately: bool = Form(False),
    workflow_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload multiple files"""
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed")
    
    uploaded_files = []
    
    for file in files:
        try:
            # Validate file
            validate_file(file)
            
            # Generate unique filename
            file_id = str(uuid.uuid4())
            file_ext = Path(file.filename).suffix
            stored_filename = f"{file_id}{file_ext}"
            file_path = UPLOAD_DIR / stored_filename
            
            # Save file to disk
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            
            # Get file info
            file_size = len(content)
            mime_type = mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'
            category = get_file_category(file.filename)
            
            # Create database record
            file_record = FileModel(
                id=file_id,
                original_filename=file.filename,
                stored_filename=stored_filename,
                file_path=str(file_path),
                file_size=file_size,
                mime_type=mime_type,
                category=category,
                description=description,
                owner_id=current_user.id,
                workflow_id=workflow_id,
                status='uploaded'
            )
            
            db.add(file_record)
            
            # Process file if requested
            if process_immediately:
                background_tasks.add_task(
                    process_file_task.delay,
                    file_id,
                    current_user.id
                )
                file_record.status = 'processing'
            
            uploaded_files.append({
                "id": file_id,
                "filename": file.filename,
                "size": file_size,
                "category": category,
                "mime_type": mime_type,
                "status": file_record.status
            })
            
        except Exception as e:
            logger.error(f"Failed to upload {file.filename}: {e}")
            uploaded_files.append({
                "filename": file.filename,
                "error": str(e),
                "status": "failed"
            })
    
    await db.commit()
    
    return {
        "uploaded_count": len([f for f in uploaded_files if "error" not in f]),
        "failed_count": len([f for f in uploaded_files if "error" in f]),
        "files": uploaded_files
    }

@router.get("/")
async def list_files(
    category: Optional[str] = None,
    workflow_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List user's files"""
    from sqlalchemy import select
    
    query = select(FileModel).where(FileModel.owner_id == current_user.id)
    
    if category:
        query = query.where(FileModel.category == category)
    if workflow_id:
        query = query.where(FileModel.workflow_id == workflow_id)
    if status:
        query = query.where(FileModel.status == status)
    
    query = query.offset(offset).limit(limit).order_by(FileModel.created_at.desc())
    
    result = await db.execute(query)
    files = result.scalars().all()
    
    return {
        "files": [
            {
                "id": file.id,
                "filename": file.original_filename,
                "size": file.file_size,
                "category": file.category,
                "mime_type": file.mime_type,
                "status": file.status,
                "description": file.description,
                "workflow_id": file.workflow_id,
                "created_at": file.created_at,
                "processed_at": file.processed_at,
                "metadata": file.metadata
            }
            for file in files
        ],
        "total": len(files),
        "limit": limit,
        "offset": offset
    }

@router.get("/{file_id}")
async def get_file_info(
    file_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get file information"""
    from sqlalchemy import select
    
    query = select(FileModel).where(
        FileModel.id == file_id,
        FileModel.owner_id == current_user.id
    )
    result = await db.execute(query)
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {
        "id": file.id,
        "filename": file.original_filename,
        "size": file.file_size,
        "category": file.category,
        "mime_type": file.mime_type,
        "status": file.status,
        "description": file.description,
        "workflow_id": file.workflow_id,
        "created_at": file.created_at,
        "processed_at": file.processed_at,
        "metadata": file.metadata,
        "processing_result": file.processing_result
    }

@router.get("/{file_id}/download")
async def download_file(
    file_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Download file"""
    from sqlalchemy import select
    
    query = select(FileModel).where(
        FileModel.id == file_id,
        FileModel.owner_id == current_user.id
    )
    result = await db.execute(query)
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = Path(file.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=file_path,
        filename=file.original_filename,
        media_type=file.mime_type
    )

@router.post("/{file_id}/process")
async def process_file(
    file_id: str,
    background_tasks: BackgroundTasks,
    processing_options: dict = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process file"""
    from sqlalchemy import select
    
    query = select(FileModel).where(
        FileModel.id == file_id,
        FileModel.owner_id == current_user.id
    )
    result = await db.execute(query)
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    if file.status == 'processing':
        raise HTTPException(status_code=400, detail="File is already being processed")
    
    # Update status
    file.status = 'processing'
    await db.commit()
    
    # Start processing task
    background_tasks.add_task(
        process_file_task.delay,
        file_id,
        current_user.id,
        processing_options or {}
    )
    
    return {
        "message": "File processing started",
        "file_id": file_id,
        "status": "processing"
    }

@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete file"""
    from sqlalchemy import select
    
    query = select(FileModel).where(
        FileModel.id == file_id,
        FileModel.owner_id == current_user.id
    )
    result = await db.execute(query)
    file = result.scalar_one_or_none()
    
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete file from disk
    file_path = Path(file.file_path)
    if file_path.exists():
        file_path.unlink()
    
    # Delete from database
    await db.delete(file)
    await db.commit()
    
    logger.info(f"File deleted: {file.original_filename}")
    
    return {"message": "File deleted successfully"}

@router.get("/categories/")
async def get_file_categories():
    """Get available file categories"""
    return {
        "categories": list(ALLOWED_EXTENSIONS.keys()),
        "extensions": ALLOWED_EXTENSIONS
    }
