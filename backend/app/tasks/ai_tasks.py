"""
AI processing tasks for Celery
Async AI service calls and batch processing
"""

import asyncio
from typing import List, Dict, Any

from app.core.celery import celery_app
from app.services.ai_orchestrator import AIOrchestrator, AIRequest, AIProvider
from app.core.logging import get_logger

logger = get_logger(__name__)


@celery_app.task(name="process_ai_batch")
def process_ai_batch_task(requests_data: List[Dict[str, Any]]):
    """Process batch AI requests asynchronously"""
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        result = loop.run_until_complete(_process_ai_batch_async(requests_data))
        return result
    finally:
        loop.close()


async def _process_ai_batch_async(requests_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Async batch AI processing"""
    
    # Convert to AIRequest objects
    requests = []
    for req_data in requests_data:
        request = AIRequest(
            provider=AIProvider(req_data.get("provider", "openai")),
            model=req_data.get("model", "gpt-3.5-turbo"),
            prompt=req_data.get("prompt", ""),
            max_tokens=req_data.get("max_tokens", 1000),
            temperature=req_data.get("temperature", 0.7),
            user_id=req_data.get("user_id"),
            metadata=req_data.get("metadata", {})
        )
        requests.append(request)
    
    # Process batch
    async with AIOrchestrator() as orchestrator:
        responses = await orchestrator.batch_process(requests)
    
    # Convert responses to serializable format
    results = []
    for response in responses:
        results.append({
            "success": response.success,
            "content": response.content,
            "error": response.error,
            "provider": response.provider.value if response.provider else None,
            "model": response.model,
            "tokens_used": response.tokens_used,
            "processing_time": response.processing_time,
            "metadata": response.metadata or {}
        })
    
    return results


@celery_app.task(name="process_single_ai_request")
def process_single_ai_request_task(request_data: Dict[str, Any]):
    """Process single AI request asynchronously"""
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        result = loop.run_until_complete(_process_single_ai_request_async(request_data))
        return result
    finally:
        loop.close()


async def _process_single_ai_request_async(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """Async single AI request processing"""
    
    request = AIRequest(
        provider=AIProvider(request_data.get("provider", "openai")),
        model=request_data.get("model", "gpt-3.5-turbo"),
        prompt=request_data.get("prompt", ""),
        max_tokens=request_data.get("max_tokens", 1000),
        temperature=request_data.get("temperature", 0.7),
        user_id=request_data.get("user_id"),
        metadata=request_data.get("metadata", {})
    )
    
    async with AIOrchestrator() as orchestrator:
        response = await orchestrator.process_request(request)
    
    return {
        "success": response.success,
        "content": response.content,
        "error": response.error,
        "provider": response.provider.value if response.provider else None,
        "model": response.model,
        "tokens_used": response.tokens_used,
        "processing_time": response.processing_time,
        "metadata": response.metadata or {}
    }
