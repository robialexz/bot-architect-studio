"""
Environment setup script for FlowsyAI Backend
Generates environment files and validates configuration
"""

import os
import secrets
import string
from pathlib import Path
from typing import Dict, Any

def generate_secret_key(length: int = 64) -> str:
    """Generate a secure secret key"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_password(length: int = 32) -> str:
    """Generate a secure password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_env_file(env_type: str, config: Dict[str, Any]) -> None:
    """Create environment file"""
    env_file = Path(f".env.{env_type}")
    
    with open(env_file, 'w') as f:
        f.write(f"# FlowsyAI Backend {env_type.title()} Environment\n")
        f.write(f"# Generated automatically - DO NOT COMMIT TO VERSION CONTROL\n\n")
        
        for section, variables in config.items():
            f.write(f"# {section}\n")
            for key, value in variables.items():
                f.write(f"{key}={value}\n")
            f.write("\n")
    
    print(f"✅ Created {env_file}")

def get_development_config() -> Dict[str, Dict[str, str]]:
    """Get development environment configuration"""
    return {
        "Application": {
            "ENVIRONMENT": "development",
            "DEBUG": "true",
            "APP_NAME": "FlowsyAI Backend",
            "APP_VERSION": "1.0.0"
        },
        "Security": {
            "SECRET_KEY": generate_secret_key(),
            "ACCESS_TOKEN_EXPIRE_MINUTES": "11520",
            "ALGORITHM": "HS256"
        },
        "Database": {
            "DATABASE_URL": "postgresql+asyncpg://flowsyai:password@localhost:5432/flowsyai_dev",
            "DATABASE_POOL_SIZE": "10",
            "DATABASE_MAX_OVERFLOW": "20"
        },
        "Redis": {
            "REDIS_URL": "redis://localhost:6379/0",
            "REDIS_MAX_CONNECTIONS": "10"
        },
        "Celery": {
            "CELERY_BROKER_URL": "redis://localhost:6379/1",
            "CELERY_RESULT_BACKEND": "redis://localhost:6379/2"
        },
        "AI Services": {
            "OPENAI_API_KEY": "",
            "ANTHROPIC_API_KEY": "",
            "GOOGLE_API_KEY": ""
        },
        "CORS": {
            "ALLOWED_ORIGINS": '["http://localhost:3000", "http://localhost:8080"]'
        },
        "Logging": {
            "LOG_LEVEL": "DEBUG",
            "LOG_FORMAT": "detailed"
        }
    }

def get_production_config() -> Dict[str, Dict[str, str]]:
    """Get production environment configuration"""
    return {
        "Application": {
            "ENVIRONMENT": "production",
            "DEBUG": "false",
            "APP_NAME": "FlowsyAI Backend",
            "APP_VERSION": "1.0.0"
        },
        "Security": {
            "SECRET_KEY": generate_secret_key(),
            "ACCESS_TOKEN_EXPIRE_MINUTES": "11520",
            "ALGORITHM": "HS256"
        },
        "Database": {
            "DATABASE_URL": f"postgresql+asyncpg://flowsyai:{generate_password()}@localhost:5432/flowsyai_prod",
            "DATABASE_POOL_SIZE": "20",
            "DATABASE_MAX_OVERFLOW": "30",
            "DATABASE_POOL_TIMEOUT": "30",
            "DATABASE_POOL_RECYCLE": "3600"
        },
        "Redis": {
            "REDIS_URL": "redis://localhost:6379/0",
            "REDIS_PASSWORD": generate_password(16),
            "REDIS_MAX_CONNECTIONS": "20"
        },
        "Celery": {
            "CELERY_BROKER_URL": "redis://localhost:6379/1",
            "CELERY_RESULT_BACKEND": "redis://localhost:6379/2"
        },
        "AI Services": {
            "OPENAI_API_KEY": "your-openai-api-key",
            "ANTHROPIC_API_KEY": "your-anthropic-api-key",
            "GOOGLE_API_KEY": "your-google-api-key"
        },
        "Rate Limiting": {
            "RATE_LIMIT_PER_MINUTE": "100",
            "RATE_LIMIT_PER_HOUR": "1000",
            "RATE_LIMIT_PER_DAY": "10000"
        },
        "CORS": {
            "ALLOWED_ORIGINS": '["https://flowsyai.com", "https://www.flowsyai.com"]'
        },
        "Logging": {
            "LOG_LEVEL": "INFO",
            "LOG_FORMAT": "json",
            "LOG_FILE": "/var/log/flowsyai/backend.log"
        },
        "Monitoring": {
            "SENTRY_DSN": "your-sentry-dsn",
            "ENABLE_METRICS": "true"
        },
        "Email": {
            "SMTP_HOST": "smtp.gmail.com",
            "SMTP_PORT": "587",
            "SMTP_USER": "noreply@flowsyai.com",
            "SMTP_PASSWORD": "your-email-password",
            "FROM_EMAIL": "noreply@flowsyai.com"
        }
    }

def get_testing_config() -> Dict[str, Dict[str, str]]:
    """Get testing environment configuration"""
    return {
        "Application": {
            "ENVIRONMENT": "testing",
            "DEBUG": "true",
            "APP_NAME": "FlowsyAI Backend Test",
            "APP_VERSION": "1.0.0"
        },
        "Security": {
            "SECRET_KEY": "test-secret-key-not-secure",
            "ACCESS_TOKEN_EXPIRE_MINUTES": "60",
            "ALGORITHM": "HS256"
        },
        "Database": {
            "DATABASE_URL": "postgresql+asyncpg://flowsyai:password@localhost:5432/flowsyai_test",
            "DATABASE_POOL_SIZE": "5",
            "DATABASE_MAX_OVERFLOW": "10"
        },
        "Redis": {
            "REDIS_URL": "redis://localhost:6379/15",
            "REDIS_MAX_CONNECTIONS": "5"
        },
        "Celery": {
            "CELERY_BROKER_URL": "redis://localhost:6379/14",
            "CELERY_RESULT_BACKEND": "redis://localhost:6379/13"
        },
        "AI Services": {
            "OPENAI_API_KEY": "test-key",
            "ANTHROPIC_API_KEY": "test-key",
            "GOOGLE_API_KEY": "test-key"
        },
        "CORS": {
            "ALLOWED_ORIGINS": '["http://localhost:3000", "http://localhost:8080"]'
        },
        "Logging": {
            "LOG_LEVEL": "DEBUG",
            "LOG_FORMAT": "detailed"
        }
    }

def validate_environment() -> bool:
    """Validate current environment configuration"""
    required_vars = [
        "SECRET_KEY",
        "DATABASE_URL",
        "REDIS_URL",
        "CELERY_BROKER_URL"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
        return False
    
    print("✅ Environment validation passed")
    return True

def main():
    """Main setup function"""
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python setup_env.py <environment>")
        print("Environments: development, production, testing, all")
        sys.exit(1)
    
    env_type = sys.argv[1].lower()
    
    if env_type == "all":
        environments = ["development", "production", "testing"]
    else:
        environments = [env_type]
    
    for env in environments:
        if env == "development":
            config = get_development_config()
        elif env == "production":
            config = get_production_config()
        elif env == "testing":
            config = get_testing_config()
        else:
            print(f"❌ Unknown environment: {env}")
            continue
        
        create_env_file(env, config)
    
    print("\n📝 Next steps:")
    print("1. Review and update the generated .env files")
    print("2. Add your real API keys for AI services")
    print("3. Update database credentials for production")
    print("4. Configure monitoring and logging endpoints")
    print("5. DO NOT commit .env files to version control")

if __name__ == "__main__":
    main()
