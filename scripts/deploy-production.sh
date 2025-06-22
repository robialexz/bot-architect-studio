#!/bin/bash

# FlowsyAI Production Deployment Script
# Deploys the complete FlowsyAI platform to production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="www.flowsyai.com"
BACKEND_PORT="8000"
FRONTEND_PORT="3000"
POSTGRES_PORT="5432"
REDIS_PORT="6379"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists python3; then
        print_error "Python 3 is not installed. Please install Python 3 first."
        exit 1
    fi
    
    print_success "All prerequisites are installed."
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env.production" ]; then
        print_status "Creating production environment file..."
        cat > .env.production << EOF
# FlowsyAI Production Environment

# Application
NODE_ENV=production
ENVIRONMENT=production
DEBUG=false
APP_VERSION=1.0.0

# Domain and URLs
DOMAIN=${DOMAIN}
FRONTEND_URL=https://${DOMAIN}
BACKEND_URL=https://api.${DOMAIN}
API_BASE_URL=https://api.${DOMAIN}

# Database
DATABASE_URL=postgresql://flowsyai:$(openssl rand -base64 32)@postgres:${POSTGRES_PORT}/flowsyai
POSTGRES_DB=flowsyai
POSTGRES_USER=flowsyai
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Redis
REDIS_URL=redis://redis:${REDIS_PORT}/0
REDIS_PASSWORD=$(openssl rand -base64 32)

# JWT
JWT_SECRET=$(openssl rand -base64 64)
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=INFO

# Security
CORS_ORIGINS=https://${DOMAIN},https://api.${DOMAIN}
ALLOWED_HOSTS=${DOMAIN},api.${DOMAIN}

# File Storage
MAX_FILE_SIZE=52428800
UPLOAD_PATH=/app/uploads

# Rate Limiting
RATE_LIMIT_PER_MINUTE=100
RATE_LIMIT_PER_HOUR=1000
RATE_LIMIT_PER_DAY=10000
EOF
        print_success "Environment file created. Please update API keys and credentials."
        print_warning "Edit .env.production to add your API keys and credentials before continuing."
        read -p "Press Enter when you've updated the environment file..."
    fi
    
    # Load environment variables
    export $(cat .env.production | grep -v '^#' | xargs)
    print_success "Environment variables loaded."
}

# Build frontend
build_frontend() {
    print_status "Building frontend for production..."
    
    cd frontend || exit 1
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm ci --production
    
    # Build for production
    print_status "Building React application..."
    npm run build
    
    # Optimize build
    print_status "Optimizing build..."
    if command_exists gzip; then
        find build/static -name "*.js" -exec gzip -k {} \;
        find build/static -name "*.css" -exec gzip -k {} \;
    fi
    
    cd ..
    print_success "Frontend build completed."
}

# Build backend
build_backend() {
    print_status "Building backend for production..."
    
    cd backend || exit 1
    
    # Create virtual environment
    print_status "Setting up Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Run database migrations
    print_status "Running database migrations..."
    alembic upgrade head
    
    cd ..
    print_success "Backend build completed."
}

# Setup SSL certificates
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    if [ ! -d "ssl" ]; then
        mkdir ssl
    fi
    
    # Check if certificates exist
    if [ ! -f "ssl/${DOMAIN}.crt" ] || [ ! -f "ssl/${DOMAIN}.key" ]; then
        print_warning "SSL certificates not found."
        print_status "You can either:"
        print_status "1. Use Let's Encrypt (recommended for production)"
        print_status "2. Use self-signed certificates (for testing)"
        
        read -p "Use Let's Encrypt? (y/n): " use_letsencrypt
        
        if [ "$use_letsencrypt" = "y" ]; then
            if command_exists certbot; then
                print_status "Generating Let's Encrypt certificates..."
                certbot certonly --standalone -d ${DOMAIN} -d api.${DOMAIN}
                cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ssl/${DOMAIN}.crt
                cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ssl/${DOMAIN}.key
            else
                print_error "Certbot is not installed. Please install certbot first."
                exit 1
            fi
        else
            print_status "Generating self-signed certificates..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ssl/${DOMAIN}.key \
                -out ssl/${DOMAIN}.crt \
                -subj "/C=US/ST=State/L=City/O=Organization/CN=${DOMAIN}"
        fi
    fi
    
    print_success "SSL certificates are ready."
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.production.yml down || true
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose -f docker-compose.production.yml up -d --build
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    print_status "Checking service health..."
    
    # Check backend health
    if curl -f http://localhost:${BACKEND_PORT}/health >/dev/null 2>&1; then
        print_success "Backend is healthy."
    else
        print_error "Backend health check failed."
        docker-compose -f docker-compose.production.yml logs backend
        exit 1
    fi
    
    # Check database connection
    if docker-compose -f docker-compose.production.yml exec -T postgres pg_isready >/dev/null 2>&1; then
        print_success "Database is ready."
    else
        print_error "Database connection failed."
        exit 1
    fi
    
    # Check Redis connection
    if docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_success "Redis is ready."
    else
        print_error "Redis connection failed."
        exit 1
    fi
    
    print_success "All services are healthy."
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Create monitoring directory
    mkdir -p monitoring
    
    # Setup Prometheus configuration
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'flowsyai-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:9187']
      
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:9121']
EOF
    
    # Setup Grafana dashboards
    mkdir -p monitoring/grafana/dashboards
    
    print_success "Monitoring setup completed."
}

# Setup backup
setup_backup() {
    print_status "Setting up backup system..."
    
    # Create backup script
    cat > scripts/backup.sh << 'EOF'
#!/bin/bash

# FlowsyAI Backup Script

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup database
docker-compose exec -T postgres pg_dump -U flowsyai flowsyai > ${BACKUP_DIR}/database_${DATE}.sql

# Backup uploads
tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz uploads/

# Backup configuration
tar -czf ${BACKUP_DIR}/config_${DATE}.tar.gz .env.production ssl/

# Clean old backups (keep last 7 days)
find ${BACKUP_DIR} -name "*.sql" -mtime +7 -delete
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: ${DATE}"
EOF
    
    chmod +x scripts/backup.sh
    
    # Setup cron job for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/scripts/backup.sh") | crontab -
    
    print_success "Backup system configured."
}

# Main deployment function
main() {
    print_status "Starting FlowsyAI production deployment..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_warning "Running as root. Consider using a non-root user for security."
    fi
    
    # Run deployment steps
    check_prerequisites
    setup_environment
    build_frontend
    build_backend
    setup_ssl
    deploy_docker
    setup_monitoring
    setup_backup
    
    print_success "🎉 FlowsyAI has been successfully deployed to production!"
    print_status "Access your application at: https://${DOMAIN}"
    print_status "API documentation: https://api.${DOMAIN}/docs"
    print_status "Monitoring: https://${DOMAIN}/monitoring"
    
    print_status "Next steps:"
    print_status "1. Configure your domain DNS to point to this server"
    print_status "2. Update API keys in .env.production"
    print_status "3. Test all functionality"
    print_status "4. Setup monitoring alerts"
    print_status "5. Configure backup retention policy"
    
    print_warning "Remember to:"
    print_warning "- Regularly update SSL certificates"
    print_warning "- Monitor system resources"
    print_warning "- Keep backups secure"
    print_warning "- Update dependencies regularly"
}

# Run main function
main "$@"
