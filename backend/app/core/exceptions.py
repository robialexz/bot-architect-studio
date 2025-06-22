"""
Custom exceptions and error handlers for FlowsyAI Backend
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from typing import Union

logger = logging.getLogger(__name__)


class FlowsyAIException(Exception):
    """Base exception for FlowsyAI"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class WorkflowNotFoundException(FlowsyAIException):
    """Workflow not found exception"""
    def __init__(self, workflow_id: str):
        super().__init__(f"Workflow with ID {workflow_id} not found", 404)


class WorkflowExecutionException(FlowsyAIException):
    """Workflow execution exception"""
    def __init__(self, message: str):
        super().__init__(f"Workflow execution failed: {message}", 500)


class AIServiceException(FlowsyAIException):
    """AI service exception"""
    def __init__(self, service: str, message: str):
        super().__init__(f"AI service {service} error: {message}", 503)


class AuthenticationException(FlowsyAIException):
    """Authentication exception"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, 401)


class AuthorizationException(FlowsyAIException):
    """Authorization exception"""
    def __init__(self, message: str = "Access denied"):
        super().__init__(message, 403)


class RateLimitException(FlowsyAIException):
    """Rate limit exception"""
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, 429)


async def flowsyai_exception_handler(request: Request, exc: FlowsyAIException):
    """Handle FlowsyAI custom exceptions"""
    logger.error(f"FlowsyAI Exception: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "type": exc.__class__.__name__
        }
    )


async def http_exception_handler(request: Request, exc: Union[HTTPException, StarletteHTTPException]):
    """Handle HTTP exceptions"""
    logger.warning(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "type": "HTTPException"
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation exceptions"""
    logger.warning(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "error": True,
            "message": "Validation error",
            "details": exc.errors(),
            "type": "ValidationError"
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "type": "InternalServerError"
        }
    )


def setup_exception_handlers(app: FastAPI):
    """Setup exception handlers for the FastAPI app"""
    app.add_exception_handler(FlowsyAIException, flowsyai_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
