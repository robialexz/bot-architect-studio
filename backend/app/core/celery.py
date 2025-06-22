"""
Celery configuration for FlowsyAI Backend
Task queue setup for async processing
"""

from celery import Celery
from app.core.config import settings

# Create Celery instance
celery_app = Celery(
    "flowsyai",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.workflow_tasks",
        "app.tasks.ai_tasks",
        "app.tasks.notification_tasks"
    ]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
    result_expires=3600,  # 1 hour
    task_routes={
        "app.tasks.workflow_tasks.*": {"queue": "workflows"},
        "app.tasks.ai_tasks.*": {"queue": "ai_processing"},
        "app.tasks.notification_tasks.*": {"queue": "notifications"},
    },
    task_default_queue="default",
    task_default_exchange="default",
    task_default_routing_key="default",
)

# Task retry configuration
celery_app.conf.task_annotations = {
    "*": {
        "rate_limit": "100/m",
        "retry_kwargs": {"max_retries": 3, "countdown": 60},
    },
    "app.tasks.ai_tasks.*": {
        "rate_limit": "50/m",  # Lower rate limit for AI tasks
        "retry_kwargs": {"max_retries": 2, "countdown": 120},
    },
}

if __name__ == "__main__":
    celery_app.start()
