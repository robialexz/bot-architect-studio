"""
WebSocket Manager for FlowsyAI Backend
Real-time communication for workflow execution and updates
"""

import asyncio
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

import socketio
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.core.database import AsyncSessionLocal
from app.models.user import User

logger = get_logger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=settings.ALLOWED_ORIGINS,
    logger=True,
    engineio_logger=True
)

# Socket.IO ASGI app
socket_app = socketio.ASGIApp(sio)

# Connection management
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, Any]] = {}
        self.user_sessions: Dict[int, List[str]] = {}
    
    async def connect(self, sid: str, user_id: int, user_data: Dict[str, Any]):
        """Register a new connection"""
        self.active_connections[sid] = {
            'user_id': user_id,
            'user_data': user_data,
            'connected_at': datetime.utcnow(),
            'last_activity': datetime.utcnow()
        }
        
        # Track user sessions
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = []
        self.user_sessions[user_id].append(sid)
        
        logger.info(f"WebSocket connected: {sid} for user {user_id}")
    
    async def disconnect(self, sid: str):
        """Remove a connection"""
        if sid in self.active_connections:
            user_id = self.active_connections[sid]['user_id']
            del self.active_connections[sid]
            
            # Remove from user sessions
            if user_id in self.user_sessions:
                self.user_sessions[user_id] = [s for s in self.user_sessions[user_id] if s != sid]
                if not self.user_sessions[user_id]:
                    del self.user_sessions[user_id]
            
            logger.info(f"WebSocket disconnected: {sid} for user {user_id}")
    
    async def send_to_user(self, user_id: int, event: str, data: Any):
        """Send message to all sessions of a specific user"""
        if user_id in self.user_sessions:
            for sid in self.user_sessions[user_id]:
                try:
                    await sio.emit(event, data, room=sid)
                except Exception as e:
                    logger.error(f"Failed to send message to {sid}: {e}")
    
    async def send_to_session(self, sid: str, event: str, data: Any):
        """Send message to a specific session"""
        try:
            await sio.emit(event, data, room=sid)
        except Exception as e:
            logger.error(f"Failed to send message to {sid}: {e}")
    
    async def broadcast(self, event: str, data: Any):
        """Broadcast message to all connected clients"""
        try:
            await sio.emit(event, data)
        except Exception as e:
            logger.error(f"Failed to broadcast message: {e}")
    
    def get_user_connections(self, user_id: int) -> List[str]:
        """Get all connection IDs for a user"""
        return self.user_sessions.get(user_id, [])
    
    def get_connection_info(self, sid: str) -> Optional[Dict[str, Any]]:
        """Get connection information"""
        return self.active_connections.get(sid)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        return {
            'total_connections': len(self.active_connections),
            'unique_users': len(self.user_sessions),
            'connections_per_user': {
                user_id: len(sessions) 
                for user_id, sessions in self.user_sessions.items()
            }
        }

# Global connection manager
connection_manager = ConnectionManager()

# Socket.IO event handlers
@sio.event
async def connect(sid, environ, auth):
    """Handle client connection"""
    try:
        # Extract authentication token from auth data
        token = auth.get('token') if auth else None
        if not token:
            logger.warning(f"WebSocket connection rejected: No token provided for {sid}")
            return False
        
        # Validate token and get user (simplified for now)
        # In production, you'd validate the JWT token here
        user_data = {
            'id': 1,  # Mock user ID
            'email': 'demo@flowsyai.com',
            'name': 'Demo User'
        }
        
        await connection_manager.connect(sid, user_data['id'], user_data)
        
        # Send welcome message
        await sio.emit('connected', {
            'message': 'Connected to FlowsyAI',
            'user': user_data,
            'timestamp': datetime.utcnow().isoformat()
        }, room=sid)
        
        return True
        
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
        return False

@sio.event
async def disconnect(sid):
    """Handle client disconnection"""
    await connection_manager.disconnect(sid)

@sio.event
async def join_workflow(sid, data):
    """Join a workflow room for updates"""
    try:
        workflow_id = data.get('workflow_id')
        if not workflow_id:
            await sio.emit('error', {'message': 'Workflow ID required'}, room=sid)
            return
        
        # Join workflow-specific room
        await sio.enter_room(sid, f'workflow_{workflow_id}')
        
        await sio.emit('joined_workflow', {
            'workflow_id': workflow_id,
            'message': f'Joined workflow {workflow_id} updates'
        }, room=sid)
        
        logger.info(f"Client {sid} joined workflow {workflow_id}")
        
    except Exception as e:
        logger.error(f"Error joining workflow: {e}")
        await sio.emit('error', {'message': 'Failed to join workflow'}, room=sid)

@sio.event
async def leave_workflow(sid, data):
    """Leave a workflow room"""
    try:
        workflow_id = data.get('workflow_id')
        if not workflow_id:
            return
        
        await sio.leave_room(sid, f'workflow_{workflow_id}')
        
        await sio.emit('left_workflow', {
            'workflow_id': workflow_id,
            'message': f'Left workflow {workflow_id} updates'
        }, room=sid)
        
        logger.info(f"Client {sid} left workflow {workflow_id}")
        
    except Exception as e:
        logger.error(f"Error leaving workflow: {e}")

@sio.event
async def ping(sid, data):
    """Handle ping for connection health check"""
    await sio.emit('pong', {
        'timestamp': datetime.utcnow().isoformat(),
        'data': data
    }, room=sid)

# Workflow execution event emitters
async def emit_workflow_started(workflow_id: int, execution_id: int, user_id: int):
    """Emit workflow started event"""
    data = {
        'workflow_id': workflow_id,
        'execution_id': execution_id,
        'status': 'started',
        'timestamp': datetime.utcnow().isoformat()
    }
    
    # Send to user
    await connection_manager.send_to_user(user_id, 'workflow_started', data)
    
    # Send to workflow room
    await sio.emit('workflow_started', data, room=f'workflow_{workflow_id}')

async def emit_workflow_progress(workflow_id: int, execution_id: int, progress: Dict[str, Any]):
    """Emit workflow progress update"""
    data = {
        'workflow_id': workflow_id,
        'execution_id': execution_id,
        'progress': progress,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    await sio.emit('workflow_progress', data, room=f'workflow_{workflow_id}')

async def emit_workflow_completed(workflow_id: int, execution_id: int, result: Dict[str, Any]):
    """Emit workflow completed event"""
    data = {
        'workflow_id': workflow_id,
        'execution_id': execution_id,
        'status': 'completed',
        'result': result,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    await sio.emit('workflow_completed', data, room=f'workflow_{workflow_id}')

async def emit_workflow_failed(workflow_id: int, execution_id: int, error: str):
    """Emit workflow failed event"""
    data = {
        'workflow_id': workflow_id,
        'execution_id': execution_id,
        'status': 'failed',
        'error': error,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    await sio.emit('workflow_failed', data, room=f'workflow_{workflow_id}')

# Utility functions
def mount_websocket(app: FastAPI):
    """Mount WebSocket on FastAPI app"""
    app.mount('/ws', socket_app)
    logger.info("WebSocket mounted on /ws")

def get_connection_manager() -> ConnectionManager:
    """Get the global connection manager"""
    return connection_manager
