"""
Database migration script for FlowsyAI Backend
Handles database schema migrations
"""

import asyncio
import subprocess
import sys
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.logging import get_logger

logger = get_logger(__name__)


def run_alembic_command(command: str) -> bool:
    """Run an Alembic command"""
    try:
        logger.info(f"Running: alembic {command}")
        result = subprocess.run(
            f"alembic {command}",
            shell=True,
            cwd=backend_dir,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            logger.info(f"Command succeeded: {result.stdout}")
            return True
        else:
            logger.error(f"Command failed: {result.stderr}")
            return False
            
    except Exception as e:
        logger.error(f"Failed to run alembic command: {e}")
        return False


def create_migration(message: str) -> bool:
    """Create a new migration"""
    return run_alembic_command(f'revision --autogenerate -m "{message}"')


def upgrade_database(revision: str = "head") -> bool:
    """Upgrade database to a specific revision"""
    return run_alembic_command(f"upgrade {revision}")


def downgrade_database(revision: str) -> bool:
    """Downgrade database to a specific revision"""
    return run_alembic_command(f"downgrade {revision}")


def show_current_revision() -> bool:
    """Show current database revision"""
    return run_alembic_command("current")


def show_migration_history() -> bool:
    """Show migration history"""
    return run_alembic_command("history")


def main():
    """Main migration function"""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python migrate.py create <message>  - Create new migration")
        print("  python migrate.py upgrade [revision] - Upgrade database")
        print("  python migrate.py downgrade <revision> - Downgrade database")
        print("  python migrate.py current - Show current revision")
        print("  python migrate.py history - Show migration history")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "create":
        if len(sys.argv) < 3:
            print("Error: Migration message required")
            sys.exit(1)
        message = " ".join(sys.argv[2:])
        success = create_migration(message)
        
    elif command == "upgrade":
        revision = sys.argv[2] if len(sys.argv) > 2 else "head"
        success = upgrade_database(revision)
        
    elif command == "downgrade":
        if len(sys.argv) < 3:
            print("Error: Target revision required")
            sys.exit(1)
        revision = sys.argv[2]
        success = downgrade_database(revision)
        
    elif command == "current":
        success = show_current_revision()
        
    elif command == "history":
        success = show_migration_history()
        
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
    
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()
