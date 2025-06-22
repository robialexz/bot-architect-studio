"""
Deployment script for FlowsyAI Backend
Handles deployment to different environments
"""

import os
import subprocess
import sys
import time
from pathlib import Path
from typing import List, Dict, Any

class DeploymentManager:
    """Manages deployment process"""
    
    def __init__(self, environment: str):
        self.environment = environment
        self.project_root = Path(__file__).parent.parent
        self.deployment_config = self._get_deployment_config()
    
    def _get_deployment_config(self) -> Dict[str, Any]:
        """Get deployment configuration for environment"""
        configs = {
            "development": {
                "docker_compose_file": "docker-compose.yml",
                "env_file": ".env.development",
                "services": ["postgres", "redis", "backend"],
                "health_checks": True,
                "backup_db": False
            },
            "staging": {
                "docker_compose_file": "docker-compose.staging.yml",
                "env_file": ".env.staging",
                "services": ["postgres", "redis", "backend", "celery-worker", "celery-flower"],
                "health_checks": True,
                "backup_db": True
            },
            "production": {
                "docker_compose_file": "docker-compose.production.yml",
                "env_file": ".env.production",
                "services": ["postgres", "redis", "backend", "celery-worker", "celery-flower"],
                "health_checks": True,
                "backup_db": True,
                "zero_downtime": True
            }
        }
        return configs.get(self.environment, configs["development"])
    
    def run_command(self, command: str, check: bool = True) -> subprocess.CompletedProcess:
        """Run shell command"""
        print(f"🔧 Running: {command}")
        result = subprocess.run(
            command,
            shell=True,
            cwd=self.project_root,
            capture_output=True,
            text=True
        )
        
        if check and result.returncode != 0:
            print(f"❌ Command failed: {result.stderr}")
            sys.exit(1)
        
        if result.stdout:
            print(result.stdout)
        
        return result
    
    def check_prerequisites(self) -> bool:
        """Check deployment prerequisites"""
        print("🔍 Checking prerequisites...")
        
        # Check Docker
        try:
            self.run_command("docker --version")
            self.run_command("docker-compose --version")
        except:
            print("❌ Docker or Docker Compose not found")
            return False
        
        # Check environment file
        env_file = self.project_root / self.deployment_config["env_file"]
        if not env_file.exists():
            print(f"❌ Environment file not found: {env_file}")
            return False
        
        # Check docker-compose file
        compose_file = self.project_root / self.deployment_config["docker_compose_file"]
        if not compose_file.exists():
            print(f"❌ Docker compose file not found: {compose_file}")
            return False
        
        print("✅ Prerequisites check passed")
        return True
    
    def backup_database(self) -> bool:
        """Backup database before deployment"""
        if not self.deployment_config.get("backup_db", False):
            return True
        
        print("💾 Creating database backup...")
        
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        backup_file = f"backup_{self.environment}_{timestamp}.sql"
        
        # Create backup directory
        backup_dir = self.project_root / "backups"
        backup_dir.mkdir(exist_ok=True)
        
        backup_path = backup_dir / backup_file
        
        # Run backup command
        backup_command = f"""
        docker-compose -f {self.deployment_config['docker_compose_file']} \
        exec -T postgres pg_dump -U flowsyai flowsyai > {backup_path}
        """
        
        result = self.run_command(backup_command, check=False)
        
        if result.returncode == 0:
            print(f"✅ Database backup created: {backup_path}")
            return True
        else:
            print(f"⚠️ Database backup failed, continuing anyway...")
            return False
    
    def build_images(self) -> bool:
        """Build Docker images"""
        print("🏗️ Building Docker images...")
        
        build_command = f"""
        docker-compose -f {self.deployment_config['docker_compose_file']} \
        --env-file {self.deployment_config['env_file']} \
        build --no-cache
        """
        
        self.run_command(build_command)
        print("✅ Docker images built successfully")
        return True
    
    def run_migrations(self) -> bool:
        """Run database migrations"""
        print("🗃️ Running database migrations...")
        
        # Start only database services first
        db_command = f"""
        docker-compose -f {self.deployment_config['docker_compose_file']} \
        --env-file {self.deployment_config['env_file']} \
        up -d postgres redis
        """
        
        self.run_command(db_command)
        
        # Wait for database to be ready
        print("⏳ Waiting for database to be ready...")
        time.sleep(10)
        
        # Run migrations
        migration_command = f"""
        docker-compose -f {self.deployment_config['docker_compose_file']} \
        --env-file {self.deployment_config['env_file']} \
        run --rm backend python scripts/migrate.py upgrade
        """
        
        self.run_command(migration_command)
        print("✅ Database migrations completed")
        return True
    
    def deploy_services(self) -> bool:
        """Deploy all services"""
        print("🚀 Deploying services...")
        
        if self.deployment_config.get("zero_downtime", False):
            return self._zero_downtime_deploy()
        else:
            return self._standard_deploy()
    
    def _standard_deploy(self) -> bool:
        """Standard deployment"""
        deploy_command = f"""
        docker-compose -f {self.deployment_config['docker_compose_file']} \
        --env-file {self.deployment_config['env_file']} \
        up -d {' '.join(self.deployment_config['services'])}
        """
        
        self.run_command(deploy_command)
        print("✅ Services deployed successfully")
        return True
    
    def _zero_downtime_deploy(self) -> bool:
        """Zero-downtime deployment"""
        print("🔄 Performing zero-downtime deployment...")
        
        # Scale up new instances
        scale_command = f"""
        docker-compose -f {self.deployment_config['docker_compose_file']} \
        --env-file {self.deployment_config['env_file']} \
        up -d --scale backend=2
        """
        
        self.run_command(scale_command)
        
        # Wait for new instances to be healthy
        time.sleep(30)
        
        # Scale down to single instance
        scale_down_command = f"""
        docker-compose -f {self.deployment_config['docker_compose_file']} \
        --env-file {self.deployment_config['env_file']} \
        up -d --scale backend=1
        """
        
        self.run_command(scale_down_command)
        print("✅ Zero-downtime deployment completed")
        return True
    
    def health_check(self) -> bool:
        """Perform health checks"""
        if not self.deployment_config.get("health_checks", False):
            return True
        
        print("🏥 Performing health checks...")
        
        # Wait for services to start
        time.sleep(15)
        
        # Check backend health
        health_command = "curl -f http://localhost:8000/health"
        result = self.run_command(health_command, check=False)
        
        if result.returncode == 0:
            print("✅ Backend health check passed")
            return True
        else:
            print("❌ Backend health check failed")
            return False
    
    def cleanup(self) -> bool:
        """Cleanup old images and containers"""
        print("🧹 Cleaning up...")
        
        # Remove unused images
        cleanup_command = "docker image prune -f"
        self.run_command(cleanup_command, check=False)
        
        # Remove unused volumes
        volume_cleanup = "docker volume prune -f"
        self.run_command(volume_cleanup, check=False)
        
        print("✅ Cleanup completed")
        return True
    
    def deploy(self) -> bool:
        """Main deployment function"""
        print(f"🚀 Starting deployment to {self.environment}")
        
        try:
            # Check prerequisites
            if not self.check_prerequisites():
                return False
            
            # Backup database
            self.backup_database()
            
            # Build images
            if not self.build_images():
                return False
            
            # Run migrations
            if not self.run_migrations():
                return False
            
            # Deploy services
            if not self.deploy_services():
                return False
            
            # Health checks
            if not self.health_check():
                print("⚠️ Health checks failed, but deployment continued")
            
            # Cleanup
            self.cleanup()
            
            print(f"🎉 Deployment to {self.environment} completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Deployment failed: {e}")
            return False

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python deploy.py <environment>")
        print("Environments: development, staging, production")
        sys.exit(1)
    
    environment = sys.argv[1].lower()
    
    if environment not in ["development", "staging", "production"]:
        print(f"❌ Invalid environment: {environment}")
        sys.exit(1)
    
    # Confirmation for production
    if environment == "production":
        confirm = input("⚠️ You are deploying to PRODUCTION. Continue? (yes/no): ")
        if confirm.lower() != "yes":
            print("Deployment cancelled")
            sys.exit(0)
    
    deployment_manager = DeploymentManager(environment)
    success = deployment_manager.deploy()
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()
