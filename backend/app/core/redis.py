"""
Redis configuration and utilities for FlowsyAI Backend
Handles caching, session storage, and Celery broker
"""

import json
import pickle
from typing import Any, Optional, Union, Dict, List
from datetime import timedelta

import redis.asyncio as redis
from redis.asyncio import Redis
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class RedisManager:
    """Redis connection and operation manager"""
    
    def __init__(self):
        self.redis_client: Optional[Redis] = None
        self.cache_client: Optional[Redis] = None
        self.session_client: Optional[Redis] = None
        
    async def initialize(self):
        """Initialize Redis connections"""
        try:
            # Main Redis client
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                max_connections=settings.REDIS_MAX_CONNECTIONS,
                retry_on_timeout=True,
                socket_keepalive=True,
                socket_keepalive_options={},
            )
            
            # Cache client (database 0)
            self.cache_client = redis.from_url(
                settings.REDIS_URL.replace('/0', '/0'),
                encoding="utf-8",
                decode_responses=True,
                max_connections=10,
            )
            
            # Session client (database 3)
            self.session_client = redis.from_url(
                settings.REDIS_URL.replace('/0', '/3'),
                encoding="utf-8",
                decode_responses=True,
                max_connections=10,
            )
            
            # Test connections
            await self.redis_client.ping()
            await self.cache_client.ping()
            await self.session_client.ping()
            
            logger.info("Redis connections initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Redis: {e}")
            raise
    
    async def close(self):
        """Close Redis connections"""
        try:
            if self.redis_client:
                await self.redis_client.close()
            if self.cache_client:
                await self.cache_client.close()
            if self.session_client:
                await self.session_client.close()
            logger.info("Redis connections closed")
        except Exception as e:
            logger.error(f"Error closing Redis connections: {e}")
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Redis health"""
        try:
            # Test main client
            main_ping = await self.redis_client.ping()
            
            # Test cache client
            cache_ping = await self.cache_client.ping()
            
            # Test session client
            session_ping = await self.session_client.ping()
            
            # Get info
            info = await self.redis_client.info()
            
            return {
                "status": "healthy",
                "main_client": main_ping,
                "cache_client": cache_ping,
                "session_client": session_ping,
                "version": info.get("redis_version"),
                "connected_clients": info.get("connected_clients"),
                "used_memory": info.get("used_memory_human"),
                "uptime": info.get("uptime_in_seconds"),
            }
        except Exception as e:
            logger.error(f"Redis health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e)
            }


class CacheManager:
    """Redis cache operations manager"""
    
    def __init__(self, redis_manager: RedisManager):
        self.redis_manager = redis_manager
    
    @property
    def client(self) -> Redis:
        """Get cache client"""
        return self.redis_manager.cache_client
    
    async def get(self, key: str, default: Any = None) -> Any:
        """Get value from cache"""
        try:
            value = await self.client.get(key)
            if value is None:
                return default
            
            # Try to deserialize JSON first, then pickle
            try:
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                try:
                    return pickle.loads(value.encode('latin1'))
                except:
                    return value
                    
        except Exception as e:
            logger.error(f"Cache get error for key {key}: {e}")
            return default
    
    async def set(
        self, 
        key: str, 
        value: Any, 
        ttl: Optional[Union[int, timedelta]] = None
    ) -> bool:
        """Set value in cache"""
        try:
            # Serialize value
            if isinstance(value, (dict, list, tuple)):
                serialized_value = json.dumps(value)
            elif isinstance(value, (str, int, float, bool)):
                serialized_value = value
            else:
                serialized_value = pickle.dumps(value).decode('latin1')
            
            # Set with TTL
            if ttl:
                if isinstance(ttl, timedelta):
                    ttl = int(ttl.total_seconds())
                await self.client.setex(key, ttl, serialized_value)
            else:
                await self.client.set(key, serialized_value)
            
            return True
            
        except Exception as e:
            logger.error(f"Cache set error for key {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            result = await self.client.delete(key)
            return result > 0
        except Exception as e:
            logger.error(f"Cache delete error for key {key}: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        try:
            return await self.client.exists(key) > 0
        except Exception as e:
            logger.error(f"Cache exists error for key {key}: {e}")
            return False
    
    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment counter in cache"""
        try:
            return await self.client.incrby(key, amount)
        except Exception as e:
            logger.error(f"Cache increment error for key {key}: {e}")
            return None
    
    async def expire(self, key: str, ttl: Union[int, timedelta]) -> bool:
        """Set expiration for key"""
        try:
            if isinstance(ttl, timedelta):
                ttl = int(ttl.total_seconds())
            return await self.client.expire(key, ttl)
        except Exception as e:
            logger.error(f"Cache expire error for key {key}: {e}")
            return False
    
    async def get_many(self, keys: List[str]) -> Dict[str, Any]:
        """Get multiple values from cache"""
        try:
            values = await self.client.mget(keys)
            result = {}
            
            for key, value in zip(keys, values):
                if value is not None:
                    try:
                        result[key] = json.loads(value)
                    except (json.JSONDecodeError, TypeError):
                        try:
                            result[key] = pickle.loads(value.encode('latin1'))
                        except:
                            result[key] = value
            
            return result
            
        except Exception as e:
            logger.error(f"Cache get_many error: {e}")
            return {}
    
    async def set_many(
        self, 
        mapping: Dict[str, Any], 
        ttl: Optional[Union[int, timedelta]] = None
    ) -> bool:
        """Set multiple values in cache"""
        try:
            # Serialize all values
            serialized_mapping = {}
            for key, value in mapping.items():
                if isinstance(value, (dict, list, tuple)):
                    serialized_mapping[key] = json.dumps(value)
                elif isinstance(value, (str, int, float, bool)):
                    serialized_mapping[key] = value
                else:
                    serialized_mapping[key] = pickle.dumps(value).decode('latin1')
            
            # Set all values
            await self.client.mset(serialized_mapping)
            
            # Set TTL if specified
            if ttl:
                if isinstance(ttl, timedelta):
                    ttl = int(ttl.total_seconds())
                
                pipe = self.client.pipeline()
                for key in mapping.keys():
                    pipe.expire(key, ttl)
                await pipe.execute()
            
            return True
            
        except Exception as e:
            logger.error(f"Cache set_many error: {e}")
            return False
    
    async def clear_pattern(self, pattern: str) -> int:
        """Clear keys matching pattern"""
        try:
            keys = []
            async for key in self.client.scan_iter(match=pattern):
                keys.append(key)
            
            if keys:
                return await self.client.delete(*keys)
            return 0
            
        except Exception as e:
            logger.error(f"Cache clear_pattern error for pattern {pattern}: {e}")
            return 0
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            info = await self.client.info()
            return {
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
                "used_memory": info.get("used_memory_human"),
                "connected_clients": info.get("connected_clients"),
                "total_commands_processed": info.get("total_commands_processed"),
            }
        except Exception as e:
            logger.error(f"Cache stats error: {e}")
            return {}


class SessionManager:
    """Redis session operations manager"""
    
    def __init__(self, redis_manager: RedisManager):
        self.redis_manager = redis_manager
        self.default_ttl = 3600  # 1 hour
    
    @property
    def client(self) -> Redis:
        """Get session client"""
        return self.redis_manager.session_client
    
    async def create_session(self, session_id: str, data: Dict[str, Any], ttl: Optional[int] = None) -> bool:
        """Create a new session"""
        try:
            session_key = f"session:{session_id}"
            session_data = json.dumps(data)
            
            ttl = ttl or self.default_ttl
            await self.client.setex(session_key, ttl, session_data)
            
            return True
        except Exception as e:
            logger.error(f"Session create error: {e}")
            return False
    
    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data"""
        try:
            session_key = f"session:{session_id}"
            data = await self.client.get(session_key)
            
            if data:
                return json.loads(data)
            return None
            
        except Exception as e:
            logger.error(f"Session get error: {e}")
            return None
    
    async def update_session(self, session_id: str, data: Dict[str, Any]) -> bool:
        """Update session data"""
        try:
            session_key = f"session:{session_id}"
            
            # Get current TTL
            ttl = await self.client.ttl(session_key)
            if ttl <= 0:
                ttl = self.default_ttl
            
            session_data = json.dumps(data)
            await self.client.setex(session_key, ttl, session_data)
            
            return True
        except Exception as e:
            logger.error(f"Session update error: {e}")
            return False
    
    async def delete_session(self, session_id: str) -> bool:
        """Delete session"""
        try:
            session_key = f"session:{session_id}"
            result = await self.client.delete(session_key)
            return result > 0
        except Exception as e:
            logger.error(f"Session delete error: {e}")
            return False
    
    async def extend_session(self, session_id: str, ttl: Optional[int] = None) -> bool:
        """Extend session TTL"""
        try:
            session_key = f"session:{session_id}"
            ttl = ttl or self.default_ttl
            return await self.client.expire(session_key, ttl)
        except Exception as e:
            logger.error(f"Session extend error: {e}")
            return False


# Global instances
redis_manager = RedisManager()
cache_manager = CacheManager(redis_manager)
session_manager = SessionManager(redis_manager)


# Utility functions
async def get_cache() -> CacheManager:
    """Get cache manager instance"""
    return cache_manager


async def get_session_manager() -> SessionManager:
    """Get session manager instance"""
    return session_manager


async def init_redis():
    """Initialize Redis connections"""
    await redis_manager.initialize()


async def close_redis():
    """Close Redis connections"""
    await redis_manager.close()
