"""
Logging configuration for FlowsyAI Backend
"""

import logging
import sys
from typing import Dict, Any
from app.core.config import settings


class ColoredFormatter(logging.Formatter):
    """Colored log formatter for development"""
    
    COLORS = {
        'DEBUG': '\033[36m',     # Cyan
        'INFO': '\033[32m',      # Green
        'WARNING': '\033[33m',   # Yellow
        'ERROR': '\033[31m',     # Red
        'CRITICAL': '\033[35m',  # Magenta
    }
    RESET = '\033[0m'
    
    def format(self, record):
        if settings.ENVIRONMENT == "development":
            color = self.COLORS.get(record.levelname, self.RESET)
            record.levelname = f"{color}{record.levelname}{self.RESET}"
            record.name = f"\033[34m{record.name}{self.RESET}"  # Blue
        return super().format(record)


def setup_logging():
    """Setup application logging"""
    
    # Create formatter
    if settings.ENVIRONMENT == "development":
        formatter = ColoredFormatter(
            fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            datefmt="%H:%M:%S"
        )
    else:
        formatter = logging.Formatter(settings.LOG_FORMAT)
    
    # Setup root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    # Set specific logger levels
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DEBUG else logging.WARNING
    )
    
    # Application loggers
    logging.getLogger("app").setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)


class ContextLogger:
    """Logger with request context"""

    def __init__(self, logger: logging.Logger):
        self.logger = logger
        self.context = {}

    def set_context(self, **kwargs):
        """Set logging context"""
        self.context.update(kwargs)

    def clear_context(self):
        """Clear logging context"""
        self.context.clear()

    def _log(self, level: int, message: str, *args, **kwargs):
        """Log with context"""
        extra = kwargs.get('extra', {})
        extra.update(self.context)
        kwargs['extra'] = extra
        self.logger.log(level, message, *args, **kwargs)

    def debug(self, message: str, *args, **kwargs):
        self._log(logging.DEBUG, message, *args, **kwargs)

    def info(self, message: str, *args, **kwargs):
        self._log(logging.INFO, message, *args, **kwargs)

    def warning(self, message: str, *args, **kwargs):
        self._log(logging.WARNING, message, *args, **kwargs)

    def error(self, message: str, *args, **kwargs):
        self._log(logging.ERROR, message, *args, **kwargs)

    def critical(self, message: str, *args, **kwargs):
        self._log(logging.CRITICAL, message, *args, **kwargs)


def get_logger(name: str) -> ContextLogger:
    """Get context-aware logger instance"""
    return ContextLogger(logging.getLogger(f"app.{name}"))


def get_request_logger(request_id: str, user_id: str = None) -> ContextLogger:
    """Get logger with request context"""
    logger = get_logger("request")
    context = {"request_id": request_id}
    if user_id:
        context["user_id"] = user_id
    logger.set_context(**context)
    return logger
