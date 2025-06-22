"""
Dependencies for FastAPI endpoints
Authentication, database session, and other common dependencies
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.core.exceptions import AuthenticationException, AuthorizationException

# Security scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current authenticated user
    """
    try:
        # Verify token
        payload = verify_token(credentials.credentials)
        user_id: int = payload.get("sub")
        
        if user_id is None:
            raise AuthenticationException("Invalid token payload")
        
        # Get user from database
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if user is None:
            raise AuthenticationException("User not found")
        
        if not user.is_active:
            raise AuthenticationException("User account is disabled")
        
        return user
        
    except Exception as e:
        if isinstance(e, (AuthenticationException, AuthorizationException)):
            raise e
        raise AuthenticationException("Could not validate credentials")


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current active user
    """
    if not current_user.is_active:
        raise AuthenticationException("User account is disabled")
    return current_user


async def get_current_verified_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Get current verified user
    """
    if not current_user.is_verified:
        raise AuthenticationException("Email not verified")
    return current_user


async def get_current_superuser(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Get current superuser
    """
    if not current_user.is_superuser:
        raise AuthorizationException("Not enough permissions")
    return current_user


async def get_current_premium_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Get current premium user
    """
    if not current_user.is_premium:
        raise AuthorizationException("Premium subscription required")
    return current_user


def get_optional_current_user():
    """
    Get optional current user (for public endpoints that can work with or without auth)
    """
    async def _get_optional_current_user(
        credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
        db: AsyncSession = Depends(get_db)
    ) -> Optional[User]:
        if not credentials:
            return None
        
        try:
            payload = verify_token(credentials.credentials)
            user_id: int = payload.get("sub")
            
            if user_id is None:
                return None
            
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            
            if user and user.is_active:
                return user
            
        except Exception:
            pass
        
        return None
    
    return _get_optional_current_user
