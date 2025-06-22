"""
Celery tasks for file processing in FlowsyAI Backend
Handles asynchronous file processing operations
"""

import asyncio
from datetime import datetime
from typing import Dict, Any, Optional

from celery import current_task
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.celery import celery_app
from app.core.database import AsyncSessionLocal
from app.core.logging import get_logger
from app.models.file import FileModel, FileProcessingJob
from app.services.file_processor import FileProcessor

logger = get_logger(__name__)

@celery_app.task(bind=True, name="process_file")
def process_file_task(self, file_id: str, user_id: str, options: Dict[str, Any] = None):
    """Process uploaded file asynchronously"""
    try:
        # Run async function in sync context
        return asyncio.run(_process_file_async(self, file_id, user_id, options or {}))
    except Exception as e:
        logger.error(f"File processing task failed for file {file_id}: {e}")
        # Update file status to failed
        asyncio.run(_update_file_status(file_id, 'failed', {'error': str(e)}))
        raise

async def _process_file_async(task, file_id: str, user_id: str, options: Dict[str, Any]):
    """Async file processing implementation"""
    async with AsyncSessionLocal() as db:
        try:
            # Get file record
            from sqlalchemy import select
            query = select(FileModel).where(FileModel.id == file_id)
            result = await db.execute(query)
            file_record = result.scalar_one_or_none()
            
            if not file_record:
                raise ValueError(f"File not found: {file_id}")
            
            # Create processing job
            job = FileProcessingJob(
                file_id=file_id,
                job_type='general_processing',
                status='running',
                parameters=options
            )
            job.mark_started()
            db.add(job)
            await db.commit()
            
            # Update task progress
            task.update_state(
                state='PROGRESS',
                meta={'current': 10, 'total': 100, 'status': 'Starting file processing...'}
            )
            
            # Initialize file processor
            processor = FileProcessor()
            
            # Update progress
            task.update_state(
                state='PROGRESS',
                meta={'current': 30, 'total': 100, 'status': 'Analyzing file...'}
            )
            
            # Process the file
            processing_result = await processor.process_file(
                file_record.file_path,
                file_record.category,
                options
            )
            
            # Update progress
            task.update_state(
                state='PROGRESS',
                meta={'current': 80, 'total': 100, 'status': 'Finalizing results...'}
            )
            
            # Update file record
            if processing_result.get('success', False):
                file_record.update_processing_status('processed', processing_result)
                job.mark_completed(processing_result)
                logger.info(f"File processed successfully: {file_id}")
            else:
                file_record.update_processing_status('failed', processing_result)
                job.mark_failed(processing_result.get('error', 'Unknown error'))
                logger.error(f"File processing failed: {file_id}")
            
            await db.commit()
            
            # Final progress update
            task.update_state(
                state='SUCCESS',
                meta={'current': 100, 'total': 100, 'status': 'Processing complete'}
            )
            
            return {
                'file_id': file_id,
                'status': file_record.status,
                'result': processing_result
            }
            
        except Exception as e:
            logger.error(f"File processing failed for {file_id}: {e}")
            
            # Update file status to failed
            if 'file_record' in locals():
                file_record.update_processing_status('failed', {'error': str(e)})
                await db.commit()
            
            # Update job status
            if 'job' in locals():
                job.mark_failed(str(e))
                await db.commit()
            
            raise

async def _update_file_status(file_id: str, status: str, result: Dict[str, Any]):
    """Update file processing status"""
    async with AsyncSessionLocal() as db:
        try:
            from sqlalchemy import select
            query = select(FileModel).where(FileModel.id == file_id)
            result_obj = await db.execute(query)
            file_record = result_obj.scalar_one_or_none()
            
            if file_record:
                file_record.update_processing_status(status, result)
                await db.commit()
                
        except Exception as e:
            logger.error(f"Failed to update file status: {e}")

@celery_app.task(name="batch_process_files")
def batch_process_files_task(file_ids: list, user_id: str, options: Dict[str, Any] = None):
    """Process multiple files in batch"""
    try:
        return asyncio.run(_batch_process_files_async(file_ids, user_id, options or {}))
    except Exception as e:
        logger.error(f"Batch file processing failed: {e}")
        raise

async def _batch_process_files_async(file_ids: list, user_id: str, options: Dict[str, Any]):
    """Async batch file processing implementation"""
    results = []
    
    for i, file_id in enumerate(file_ids):
        try:
            # Update overall progress
            current_task.update_state(
                state='PROGRESS',
                meta={
                    'current': i,
                    'total': len(file_ids),
                    'status': f'Processing file {i+1} of {len(file_ids)}'
                }
            )
            
            # Process individual file
            result = await _process_file_async(current_task, file_id, user_id, options)
            results.append(result)
            
        except Exception as e:
            logger.error(f"Failed to process file {file_id} in batch: {e}")
            results.append({
                'file_id': file_id,
                'status': 'failed',
                'error': str(e)
            })
    
    return {
        'processed_count': len([r for r in results if r.get('status') == 'processed']),
        'failed_count': len([r for r in results if r.get('status') == 'failed']),
        'results': results
    }

@celery_app.task(name="extract_file_content")
def extract_file_content_task(file_id: str, extraction_type: str = 'text'):
    """Extract specific content from file"""
    try:
        return asyncio.run(_extract_file_content_async(file_id, extraction_type))
    except Exception as e:
        logger.error(f"Content extraction failed for file {file_id}: {e}")
        raise

async def _extract_file_content_async(file_id: str, extraction_type: str):
    """Async content extraction implementation"""
    async with AsyncSessionLocal() as db:
        try:
            # Get file record
            from sqlalchemy import select
            query = select(FileModel).where(FileModel.id == file_id)
            result = await db.execute(query)
            file_record = result.scalar_one_or_none()
            
            if not file_record:
                raise ValueError(f"File not found: {file_id}")
            
            processor = FileProcessor()
            
            # Extract content based on type
            if extraction_type == 'text':
                result = await processor._process_text_file(file_record.file_path, {})
            elif extraction_type == 'metadata':
                result = await processor.process_file(
                    file_record.file_path,
                    file_record.category,
                    {'extract_metadata_only': True}
                )
            else:
                raise ValueError(f"Unsupported extraction type: {extraction_type}")
            
            # Update file metadata
            if result.get('success'):
                file_record.add_metadata(f'{extraction_type}_extraction', result)
                await db.commit()
            
            return result
            
        except Exception as e:
            logger.error(f"Content extraction failed: {e}")
            raise

@celery_app.task(name="generate_file_preview")
def generate_file_preview_task(file_id: str, preview_type: str = 'thumbnail'):
    """Generate preview for file"""
    try:
        return asyncio.run(_generate_file_preview_async(file_id, preview_type))
    except Exception as e:
        logger.error(f"Preview generation failed for file {file_id}: {e}")
        raise

async def _generate_file_preview_async(file_id: str, preview_type: str):
    """Async preview generation implementation"""
    async with AsyncSessionLocal() as db:
        try:
            # Get file record
            from sqlalchemy import select
            query = select(FileModel).where(FileModel.id == file_id)
            result = await db.execute(query)
            file_record = result.scalar_one_or_none()
            
            if not file_record:
                raise ValueError(f"File not found: {file_id}")
            
            processor = FileProcessor()
            
            if file_record.category == 'image' and preview_type == 'thumbnail':
                thumbnail_path = await processor._generate_thumbnail(file_record.file_path)
                if thumbnail_path:
                    file_record.add_metadata('thumbnail_path', thumbnail_path)
                    await db.commit()
                    return {'success': True, 'thumbnail_path': thumbnail_path}
            
            return {'success': False, 'error': 'Preview type not supported for this file'}
            
        except Exception as e:
            logger.error(f"Preview generation failed: {e}")
            raise

@celery_app.task(name="cleanup_old_files")
def cleanup_old_files_task(days_old: int = 30):
    """Clean up old processed files"""
    try:
        return asyncio.run(_cleanup_old_files_async(days_old))
    except Exception as e:
        logger.error(f"File cleanup failed: {e}")
        raise

async def _cleanup_old_files_async(days_old: int):
    """Async file cleanup implementation"""
    async with AsyncSessionLocal() as db:
        try:
            from sqlalchemy import select, and_
            from datetime import timedelta
            
            cutoff_date = datetime.utcnow() - timedelta(days=days_old)
            
            # Find old files
            query = select(FileModel).where(
                and_(
                    FileModel.created_at < cutoff_date,
                    FileModel.is_deleted == False
                )
            )
            result = await db.execute(query)
            old_files = result.scalars().all()
            
            cleaned_count = 0
            for file_record in old_files:
                try:
                    # Mark as deleted (soft delete)
                    file_record.is_deleted = True
                    file_record.deleted_at = datetime.utcnow()
                    cleaned_count += 1
                    
                except Exception as e:
                    logger.error(f"Failed to clean up file {file_record.id}: {e}")
            
            await db.commit()
            
            logger.info(f"Cleaned up {cleaned_count} old files")
            return {'cleaned_count': cleaned_count}
            
        except Exception as e:
            logger.error(f"File cleanup failed: {e}")
            raise

@celery_app.task(name="analyze_file_content")
def analyze_file_content_task(file_id: str, analysis_type: str = 'basic'):
    """Analyze file content with AI"""
    try:
        return asyncio.run(_analyze_file_content_async(file_id, analysis_type))
    except Exception as e:
        logger.error(f"File analysis failed for file {file_id}: {e}")
        raise

async def _analyze_file_content_async(file_id: str, analysis_type: str):
    """Async file content analysis implementation"""
    async with AsyncSessionLocal() as db:
        try:
            # Get file record
            from sqlalchemy import select
            query = select(FileModel).where(FileModel.id == file_id)
            result = await db.execute(query)
            file_record = result.scalar_one_or_none()
            
            if not file_record:
                raise ValueError(f"File not found: {file_id}")
            
            # Basic analysis using file processor
            processor = FileProcessor()
            analysis_result = await processor.process_file(
                file_record.file_path,
                file_record.category,
                {'analysis_type': analysis_type}
            )
            
            # For advanced AI analysis, you would integrate with AI services here
            # This is a placeholder for AI-powered content analysis
            
            # Update file metadata with analysis
            if analysis_result.get('success'):
                file_record.add_metadata(f'{analysis_type}_analysis', analysis_result)
                await db.commit()
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"File analysis failed: {e}")
            raise
