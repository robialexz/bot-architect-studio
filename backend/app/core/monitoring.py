"""
Monitoring and metrics collection for FlowsyAI Backend
Integrates with Prometheus, Grafana, and other monitoring tools
"""

import time
import psutil
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from fastapi import Request, Response
from fastapi.responses import PlainTextResponse

from app.core.logging import get_logger

logger = get_logger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Number of active connections'
)

DATABASE_CONNECTIONS = Gauge(
    'database_connections_active',
    'Number of active database connections'
)

CELERY_TASKS = Counter(
    'celery_tasks_total',
    'Total Celery tasks',
    ['task_name', 'status']
)

AI_REQUESTS = Counter(
    'ai_requests_total',
    'Total AI requests',
    ['provider', 'model', 'status']
)

AI_REQUEST_DURATION = Histogram(
    'ai_request_duration_seconds',
    'AI request duration in seconds',
    ['provider', 'model']
)

SYSTEM_CPU_USAGE = Gauge(
    'system_cpu_usage_percent',
    'System CPU usage percentage'
)

SYSTEM_MEMORY_USAGE = Gauge(
    'system_memory_usage_bytes',
    'System memory usage in bytes'
)

SYSTEM_DISK_USAGE = Gauge(
    'system_disk_usage_bytes',
    'System disk usage in bytes'
)

@dataclass
class SystemMetrics:
    """System metrics data class"""
    cpu_percent: float
    memory_used: int
    memory_total: int
    memory_percent: float
    disk_used: int
    disk_total: int
    disk_percent: float
    network_sent: int
    network_recv: int
    timestamp: datetime

@dataclass
class ApplicationMetrics:
    """Application metrics data class"""
    total_requests: int
    active_connections: int
    database_connections: int
    celery_tasks_pending: int
    celery_tasks_active: int
    ai_requests_today: int
    error_rate: float
    avg_response_time: float
    timestamp: datetime

class MetricsCollector:
    """Collects and manages application metrics"""
    
    def __init__(self):
        self.start_time = time.time()
        self.request_times = []
        self.error_count = 0
        self.total_requests = 0
        
    def collect_system_metrics(self) -> SystemMetrics:
        """Collect system-level metrics"""
        try:
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # Memory usage
            memory = psutil.virtual_memory()
            
            # Disk usage
            disk = psutil.disk_usage('/')
            
            # Network usage
            network = psutil.net_io_counters()
            
            # Update Prometheus metrics
            SYSTEM_CPU_USAGE.set(cpu_percent)
            SYSTEM_MEMORY_USAGE.set(memory.used)
            SYSTEM_DISK_USAGE.set(disk.used)
            
            return SystemMetrics(
                cpu_percent=cpu_percent,
                memory_used=memory.used,
                memory_total=memory.total,
                memory_percent=memory.percent,
                disk_used=disk.used,
                disk_total=disk.total,
                disk_percent=disk.percent,
                network_sent=network.bytes_sent,
                network_recv=network.bytes_recv,
                timestamp=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Failed to collect system metrics: {e}")
            return None
    
    def collect_application_metrics(self) -> ApplicationMetrics:
        """Collect application-level metrics"""
        try:
            # Calculate error rate
            error_rate = (self.error_count / max(self.total_requests, 1)) * 100
            
            # Calculate average response time
            avg_response_time = sum(self.request_times) / max(len(self.request_times), 1)
            
            return ApplicationMetrics(
                total_requests=self.total_requests,
                active_connections=0,  # Would be updated by connection tracking
                database_connections=0,  # Would be updated by database pool
                celery_tasks_pending=0,  # Would be updated by Celery monitoring
                celery_tasks_active=0,
                ai_requests_today=0,  # Would be updated by AI service tracking
                error_rate=error_rate,
                avg_response_time=avg_response_time,
                timestamp=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Failed to collect application metrics: {e}")
            return None
    
    def record_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Record HTTP request metrics"""
        try:
            # Update counters
            REQUEST_COUNT.labels(method=method, endpoint=endpoint, status_code=status_code).inc()
            REQUEST_DURATION.labels(method=method, endpoint=endpoint).observe(duration)
            
            # Track for internal calculations
            self.total_requests += 1
            self.request_times.append(duration)
            
            # Keep only last 1000 request times for memory efficiency
            if len(self.request_times) > 1000:
                self.request_times = self.request_times[-1000:]
            
            # Track errors
            if status_code >= 400:
                self.error_count += 1
                
        except Exception as e:
            logger.error(f"Failed to record request metrics: {e}")
    
    def record_ai_request(self, provider: str, model: str, status: str, duration: float):
        """Record AI request metrics"""
        try:
            AI_REQUESTS.labels(provider=provider, model=model, status=status).inc()
            AI_REQUEST_DURATION.labels(provider=provider, model=model).observe(duration)
        except Exception as e:
            logger.error(f"Failed to record AI request metrics: {e}")
    
    def record_celery_task(self, task_name: str, status: str):
        """Record Celery task metrics"""
        try:
            CELERY_TASKS.labels(task_name=task_name, status=status).inc()
        except Exception as e:
            logger.error(f"Failed to record Celery task metrics: {e}")
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get application health status"""
        try:
            system_metrics = self.collect_system_metrics()
            app_metrics = self.collect_application_metrics()
            
            # Determine health status
            health_status = "healthy"
            issues = []
            
            if system_metrics:
                if system_metrics.cpu_percent > 90:
                    health_status = "degraded"
                    issues.append("High CPU usage")
                
                if system_metrics.memory_percent > 90:
                    health_status = "degraded"
                    issues.append("High memory usage")
                
                if system_metrics.disk_percent > 90:
                    health_status = "degraded"
                    issues.append("High disk usage")
            
            if app_metrics:
                if app_metrics.error_rate > 10:
                    health_status = "degraded"
                    issues.append("High error rate")
                
                if app_metrics.avg_response_time > 5:
                    health_status = "degraded"
                    issues.append("Slow response times")
            
            return {
                "status": health_status,
                "timestamp": datetime.utcnow().isoformat(),
                "uptime_seconds": time.time() - self.start_time,
                "issues": issues,
                "system_metrics": asdict(system_metrics) if system_metrics else None,
                "application_metrics": asdict(app_metrics) if app_metrics else None
            }
            
        except Exception as e:
            logger.error(f"Failed to get health status: {e}")
            return {
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e)
            }

# Global metrics collector instance
metrics_collector = MetricsCollector()

class MetricsMiddleware:
    """Middleware for collecting HTTP request metrics"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        start_time = time.time()
        
        async def send_wrapper(message):
            if message["type"] == "http.response.start":
                # Record metrics when response starts
                duration = time.time() - start_time
                method = scope["method"]
                path = scope["path"]
                status_code = message["status"]
                
                metrics_collector.record_request(method, path, status_code, duration)
            
            await send(message)
        
        await self.app(scope, receive, send_wrapper)

def get_prometheus_metrics() -> PlainTextResponse:
    """Get Prometheus metrics endpoint"""
    return PlainTextResponse(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

async def get_health_check() -> Dict[str, Any]:
    """Health check endpoint"""
    return metrics_collector.get_health_status()

async def get_metrics_summary() -> Dict[str, Any]:
    """Get metrics summary"""
    try:
        system_metrics = metrics_collector.collect_system_metrics()
        app_metrics = metrics_collector.collect_application_metrics()
        
        return {
            "system": asdict(system_metrics) if system_metrics else None,
            "application": asdict(app_metrics) if app_metrics else None,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Failed to get metrics summary: {e}")
        return {"error": str(e)}

# Utility functions for external use
def record_ai_request(provider: str, model: str, status: str, duration: float):
    """Record AI request metrics (external interface)"""
    metrics_collector.record_ai_request(provider, model, status, duration)

def record_celery_task(task_name: str, status: str):
    """Record Celery task metrics (external interface)"""
    metrics_collector.record_celery_task(task_name, status)

def get_metrics_collector() -> MetricsCollector:
    """Get metrics collector instance"""
    return metrics_collector
