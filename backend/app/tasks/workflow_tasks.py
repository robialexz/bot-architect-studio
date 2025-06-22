"""
Workflow processing tasks for Celery
Async workflow execution and management
"""

import asyncio
import json
from typing import Dict, Any, Optional
from datetime import datetime

from celery import current_task
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.celery import celery_app
from app.core.database import AsyncSessionLocal
from app.models.workflow import Workflow, WorkflowExecution
from app.models.user import User
from app.services.ai_orchestrator import AIOrchestrator, AIRequest, AIProvider
from app.core.logging import get_logger
from app.core.websocket import (
    emit_workflow_started,
    emit_workflow_progress,
    emit_workflow_completed,
    emit_workflow_failed
)

logger = get_logger(__name__)


@celery_app.task(bind=True, name="execute_workflow")
def execute_workflow_task(self, workflow_id: int, user_id: int, input_data: Optional[Dict[str, Any]] = None):
    """Execute workflow asynchronously"""
    
    # Update task state
    self.update_state(
        state="PROGRESS",
        meta={"current": 0, "total": 100, "status": "Starting workflow execution"}
    )
    
    # Run async workflow execution
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        result = loop.run_until_complete(
            _execute_workflow_async(workflow_id, user_id, input_data, self)
        )
        return result
    finally:
        loop.close()


async def _execute_workflow_async(
    workflow_id: int, 
    user_id: int, 
    input_data: Optional[Dict[str, Any]], 
    task_instance
) -> Dict[str, Any]:
    """Async workflow execution logic"""
    
    async with AsyncSessionLocal() as db:
        try:
            # Get workflow
            result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
            workflow = result.scalar_one_or_none()
            
            if not workflow:
                raise Exception(f"Workflow {workflow_id} not found")
            
            # Create execution record
            execution = WorkflowExecution(
                workflow_id=workflow_id,
                user_id=user_id,
                input_data=input_data or {},
                status="running",
                trigger_type="api"
            )
            
            db.add(execution)
            await db.commit()
            await db.refresh(execution)

            # Emit workflow started event
            await emit_workflow_started(workflow_id, execution.id, user_id)

            # Update task progress
            task_instance.update_state(
                state="PROGRESS",
                meta={"current": 25, "total": 100, "status": "Processing workflow steps"}
            )
            
            # Execute workflow steps
            output_data = await _process_workflow_steps(
                workflow.workflow_data, 
                input_data or {}, 
                task_instance
            )
            
            # Update execution with results
            execution.status = "completed"
            execution.output_data = output_data
            execution.completed_at = datetime.utcnow()
            
            # Update workflow metrics
            workflow.execution_count += 1
            workflow.success_count += 1
            workflow.last_executed_at = datetime.utcnow()
            
            await db.commit()

            # Emit workflow completed event
            await emit_workflow_completed(workflow_id, execution.id, {
                "execution_id": execution.id,
                "status": "completed",
                "output_data": output_data
            })

            logger.info(f"Workflow {workflow_id} executed successfully")

            return {
                "execution_id": execution.id,
                "status": "completed",
                "output_data": output_data
            }
            
        except Exception as e:
            # Update execution with error
            if 'execution' in locals():
                execution.status = "failed"
                execution.error_message = str(e)
                execution.completed_at = datetime.utcnow()
                
                # Update workflow metrics
                workflow.execution_count += 1
                workflow.failure_count += 1
                
                await db.commit()

                # Emit workflow failed event
                await emit_workflow_failed(workflow_id, execution.id, str(e))

            logger.error(f"Workflow {workflow_id} execution failed: {str(e)}")
            raise


async def _process_workflow_steps(
    workflow_data: Dict[str, Any], 
    input_data: Dict[str, Any], 
    task_instance
) -> Dict[str, Any]:
    """Process individual workflow steps"""
    
    steps = workflow_data.get("steps", [])
    current_data = input_data.copy()
    
    async with AIOrchestrator() as orchestrator:
        for i, step in enumerate(steps):
            # Update progress
            progress = 25 + (i / len(steps)) * 50  # 25-75% range
            progress_data = {
                "current": int(progress),
                "total": 100,
                "status": f"Processing step {i+1}/{len(steps)}: {step.get('name', 'Unknown')}",
                "step": i + 1,
                "total_steps": len(steps),
                "step_name": step.get('name', 'Unknown'),
                "step_type": step.get('type', 'unknown')
            }

            task_instance.update_state(
                state="PROGRESS",
                meta=progress_data
            )

            # Emit progress via WebSocket
            await emit_workflow_progress(
                workflow_data.get('workflow_id', 0),
                workflow_data.get('execution_id', 0),
                progress_data
            )
            
            # Process step based on type
            step_type = step.get("type", "unknown")
            
            if step_type == "ai_processing":
                current_data = await _process_ai_step(step, current_data, orchestrator)
            elif step_type == "data_transformation":
                current_data = await _process_data_step(step, current_data)
            elif step_type == "condition":
                current_data = await _process_condition_step(step, current_data)
            else:
                logger.warning(f"Unknown step type: {step_type}")
    
    # Final progress update
    task_instance.update_state(
        state="PROGRESS",
        meta={"current": 90, "total": 100, "status": "Finalizing results"}
    )
    
    return current_data


async def _process_ai_step(
    step: Dict[str, Any], 
    data: Dict[str, Any], 
    orchestrator: AIOrchestrator
) -> Dict[str, Any]:
    """Process AI step"""
    
    config = step.get("config", {})
    prompt = config.get("prompt", "").format(**data)
    
    request = AIRequest(
        provider=AIProvider(config.get("provider", "openai")),
        model=config.get("model", "gpt-3.5-turbo"),
        prompt=prompt,
        max_tokens=config.get("max_tokens", 1000),
        temperature=config.get("temperature", 0.7)
    )
    
    response = await orchestrator.process_request(request)
    
    if response.success:
        data[step.get("output_key", "ai_response")] = response.content
    else:
        raise Exception(f"AI step failed: {response.error}")
    
    return data


async def _process_data_step(step: Dict[str, Any], data: Dict[str, Any]) -> Dict[str, Any]:
    """Process data transformation step"""
    
    # Simple data transformation logic
    config = step.get("config", {})
    operation = config.get("operation", "passthrough")
    
    if operation == "extract":
        key = config.get("key")
        if key and key in data:
            data["extracted_value"] = data[key]
    elif operation == "format":
        template = config.get("template", "{}")
        data["formatted_output"] = template.format(**data)
    
    return data


async def _process_condition_step(step: Dict[str, Any], data: Dict[str, Any]) -> Dict[str, Any]:
    """Process conditional step"""
    
    config = step.get("config", {})
    condition = config.get("condition", "true")
    
    # Simple condition evaluation (in production, use safer evaluation)
    try:
        if eval(condition, {"__builtins__": {}}, data):
            data["condition_result"] = True
        else:
            data["condition_result"] = False
    except:
        data["condition_result"] = False
    
    return data


@celery_app.task(name="cleanup_old_executions")
def cleanup_old_executions():
    """Cleanup old workflow executions"""
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        loop.run_until_complete(_cleanup_old_executions_async())
    finally:
        loop.close()


async def _cleanup_old_executions_async():
    """Async cleanup logic"""
    
    async with AsyncSessionLocal() as db:
        # Delete executions older than 30 days
        from datetime import timedelta
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        
        # Implementation would go here
        logger.info("Cleanup task executed")
