"""
Database initialization script for FlowsyAI Backend
Creates tables and initial data
"""

import asyncio
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import engine, AsyncSessionLocal, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.workflow import Workflow
from app.models.ai_agent import AIAgent
from app.core.logging import get_logger

logger = get_logger(__name__)


async def create_tables():
    """Create all database tables"""
    try:
        async with engine.begin() as conn:
            # Drop all tables (for development)
            await conn.run_sync(Base.metadata.drop_all)
            logger.info("Dropped all existing tables")
            
            # Create all tables
            await conn.run_sync(Base.metadata.create_all)
            logger.info("Created all database tables")
            
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")
        raise


async def create_initial_data():
    """Create initial data for development"""
    try:
        async with AsyncSessionLocal() as db:
            # Create admin user
            admin_user = User(
                email="admin@flowsyai.com",
                username="admin",
                full_name="FlowsyAI Administrator",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_verified=True,
                subscription_tier="enterprise"
            )
            db.add(admin_user)
            
            # Create demo user
            demo_user = User(
                email="demo@flowsyai.com",
                username="demo",
                full_name="Demo User",
                hashed_password=get_password_hash("demo123"),
                is_active=True,
                is_verified=True,
                subscription_tier="premium"
            )
            db.add(demo_user)
            
            await db.commit()
            await db.refresh(admin_user)
            await db.refresh(demo_user)
            
            logger.info(f"Created admin user: {admin_user.email}")
            logger.info(f"Created demo user: {demo_user.email}")
            
            # Create sample workflow
            sample_workflow = Workflow(
                name="Sample AI Workflow",
                description="A sample workflow demonstrating AI processing capabilities",
                workflow_data={
                    "nodes": [
                        {
                            "id": "input",
                            "type": "input",
                            "position": {"x": 100, "y": 100},
                            "data": {"label": "Input"}
                        },
                        {
                            "id": "gpt4",
                            "type": "ai_model",
                            "position": {"x": 300, "y": 100},
                            "data": {"label": "GPT-4", "model": "gpt-4"}
                        },
                        {
                            "id": "output",
                            "type": "output",
                            "position": {"x": 500, "y": 100},
                            "data": {"label": "Output"}
                        }
                    ],
                    "connections": [
                        {"source": "input", "target": "gpt4"},
                        {"source": "gpt4", "target": "output"}
                    ]
                },
                tags=["sample", "ai", "demo"],
                category="Demo",
                owner_id=demo_user.id,
                is_template=True,
                is_featured=True
            )
            db.add(sample_workflow)
            
            # Create sample AI agents
            gpt4_agent = AIAgent(
                name="GPT-4 Assistant",
                description="Advanced AI assistant powered by GPT-4",
                agent_type="text_generation",
                configuration={
                    "provider": "openai",
                    "model": "gpt-4",
                    "max_tokens": 2000,
                    "temperature": 0.7
                },
                owner_id=admin_user.id,
                is_public=True
            )
            db.add(gpt4_agent)
            
            claude_agent = AIAgent(
                name="Claude Analyst",
                description="Analytical AI assistant powered by Claude",
                agent_type="analysis",
                configuration={
                    "provider": "anthropic",
                    "model": "claude-3-sonnet-20240229",
                    "max_tokens": 1500,
                    "temperature": 0.3
                },
                owner_id=admin_user.id,
                is_public=True
            )
            db.add(claude_agent)
            
            await db.commit()
            
            logger.info("Created sample workflow and AI agents")
            
    except Exception as e:
        logger.error(f"Failed to create initial data: {e}")
        raise


async def main():
    """Main initialization function"""
    logger.info("Starting database initialization...")
    
    try:
        # Create tables
        await create_tables()
        
        # Create initial data
        await create_initial_data()
        
        logger.info("Database initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        sys.exit(1)
    
    finally:
        # Close the engine
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
