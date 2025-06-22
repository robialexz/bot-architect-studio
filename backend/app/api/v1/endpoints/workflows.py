"""
Workflow endpoints for FlowsyAI Backend
CRUD operations and workflow management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_active_user, get_optional_current_user
from app.models.user import User
from app.models.workflow import Workflow, WorkflowExecution, WorkflowStatus, WorkflowVisibility
from app.schemas.workflow import (
    WorkflowCreate,
    WorkflowUpdate,
    WorkflowResponse,
    WorkflowListResponse,
    WorkflowExecutionCreate,
    WorkflowExecutionResponse,
    WorkflowSearchParams
)
from app.core.exceptions import WorkflowNotFoundException, AuthorizationException
from app.core.logging import get_logger

logger = get_logger(__name__)
router = APIRouter()


@router.post("/", response_model=WorkflowResponse, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    workflow_data: WorkflowCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new workflow"""
    
    # Create workflow
    db_workflow = Workflow(
        name=workflow_data.name,
        description=workflow_data.description,
        workflow_data=workflow_data.workflow_data,
        tags=workflow_data.tags,
        category=workflow_data.category,
        visibility=workflow_data.visibility,
        owner_id=current_user.id
    )
    
    db.add(db_workflow)
    await db.commit()
    await db.refresh(db_workflow)
    
    # Update user workflow count
    current_user.workflows_count += 1
    await db.commit()
    
    logger.info(f"Workflow created: {db_workflow.name} by user {current_user.email}")
    
    return WorkflowResponse.model_validate(db_workflow)


@router.get("/", response_model=List[WorkflowListResponse])
async def list_workflows(
    query: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[WorkflowStatus] = Query(None, description="Filter by status"),
    visibility: Optional[WorkflowVisibility] = Query(None, description="Filter by visibility"),
    is_template: Optional[bool] = Query(None, description="Filter templates"),
    limit: int = Query(20, le=100, description="Number of workflows to return"),
    offset: int = Query(0, ge=0, description="Number of workflows to skip"),
    current_user: Optional[User] = Depends(get_optional_current_user()),
    db: AsyncSession = Depends(get_db)
):
    """List workflows with filtering and search"""
    
    # Build query
    query_stmt = select(Workflow)
    
    # Apply filters
    filters = []
    
    # Visibility filter - show public workflows and user's own workflows
    if current_user:
        visibility_filter = or_(
            Workflow.visibility == WorkflowVisibility.PUBLIC,
            Workflow.owner_id == current_user.id
        )
    else:
        visibility_filter = Workflow.visibility == WorkflowVisibility.PUBLIC
    
    filters.append(visibility_filter)
    
    # Search query
    if query:
        search_filter = or_(
            Workflow.name.ilike(f"%{query}%"),
            Workflow.description.ilike(f"%{query}%")
        )
        filters.append(search_filter)
    
    # Category filter
    if category:
        filters.append(Workflow.category == category)
    
    # Status filter
    if status:
        filters.append(Workflow.status == status)
    
    # Visibility filter (additional)
    if visibility:
        filters.append(Workflow.visibility == visibility)
    
    # Template filter
    if is_template is not None:
        filters.append(Workflow.is_template == is_template)
    
    # Apply all filters
    if filters:
        query_stmt = query_stmt.where(and_(*filters))
    
    # Order by updated_at desc
    query_stmt = query_stmt.order_by(Workflow.updated_at.desc())
    
    # Apply pagination
    query_stmt = query_stmt.offset(offset).limit(limit)
    
    # Execute query
    result = await db.execute(query_stmt)
    workflows = result.scalars().all()
    
    return [WorkflowListResponse.model_validate(workflow) for workflow in workflows]


@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user()),
    db: AsyncSession = Depends(get_db)
):
    """Get workflow by ID"""

    result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
    workflow = result.scalar_one_or_none()

    if not workflow:
        raise WorkflowNotFoundException(str(workflow_id))

    # Check access permissions
    if workflow.visibility == WorkflowVisibility.PRIVATE:
        if not current_user or workflow.owner_id != current_user.id:
            raise AuthorizationException("Access denied to private workflow")

    return WorkflowResponse.model_validate(workflow)


@router.put("/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: int,
    workflow_update: WorkflowUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update workflow"""

    result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
    workflow = result.scalar_one_or_none()

    if not workflow:
        raise WorkflowNotFoundException(str(workflow_id))

    # Check ownership
    if workflow.owner_id != current_user.id:
        raise AuthorizationException("You can only update your own workflows")

    # Update fields
    update_data = workflow_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(workflow, field, value)

    await db.commit()
    await db.refresh(workflow)

    logger.info(f"Workflow updated: {workflow.name} by user {current_user.email}")

    return WorkflowResponse.model_validate(workflow)


@router.delete("/{workflow_id}")
async def delete_workflow(
    workflow_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete workflow"""

    result = await db.execute(select(Workflow).where(Workflow.id == workflow_id))
    workflow = result.scalar_one_or_none()

    if not workflow:
        raise WorkflowNotFoundException(str(workflow_id))

    # Check ownership
    if workflow.owner_id != current_user.id:
        raise AuthorizationException("You can only delete your own workflows")

    await db.delete(workflow)
    await db.commit()

    # Update user workflow count
    current_user.workflows_count = max(0, current_user.workflows_count - 1)
    await db.commit()

    logger.info(f"Workflow deleted: {workflow.name} by user {current_user.email}")

    return {"message": "Workflow deleted successfully"}
