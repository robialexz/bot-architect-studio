# FlowsyAI Backend

Robust Python backend for FlowsyAI workflow automation platform built with FastAPI, SQLAlchemy, and Celery.

## 🚀 Features

- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - Async ORM with PostgreSQL support
- **Celery** - Distributed task queue for async processing
- **Redis** - Caching and message broker
- **JWT Authentication** - Secure user authentication
- **AI Orchestration** - Multi-provider AI service integration
- **Workflow Engine** - Async workflow execution
- **Rate Limiting** - Built-in API rate limiting
- **Docker Support** - Full containerization

## 📋 Requirements

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### Local Development

1. **Clone and setup**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup**:
```bash
# Start PostgreSQL and Redis
# Update DATABASE_URL in .env
```

4. **Run the application**:
```bash
# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start Celery worker (in another terminal)
celery -A app.core.celery worker --loglevel=info

# Start Celery Flower (optional monitoring)
celery -A app.core.celery flower --port=5555
```

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 📚 API Documentation

Once running, visit:
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Celery Flower**: http://localhost:5555

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/v1/endpoints/     # API endpoints
│   ├── core/                 # Core configuration
│   ├── models/               # Database models
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   └── tasks/                # Celery tasks
├── main.py                   # FastAPI application
├── requirements.txt          # Dependencies
└── docker-compose.yml       # Docker setup
```

## 🔧 Configuration

Key environment variables:

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost/flowsyai

# Redis
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1

# Security
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_API_KEY=your-google-key
```

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_workflows.py
```

## 📊 Monitoring

- **Health Check**: http://localhost:8000/health
- **Celery Monitoring**: http://localhost:5555
- **Logs**: Structured logging with different levels

## 🔄 Workflow Execution

The backend supports async workflow execution:

1. **Create Workflow** via API
2. **Submit for Execution** - queued in Celery
3. **Process Steps** - AI calls, data transformation
4. **Return Results** - real-time status updates

## 🤖 AI Integration

Supports multiple AI providers:
- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic** (Claude)
- **Google** (Gemini)

Features:
- Rate limiting
- Batch processing
- Error handling
- Cost tracking

## 🚀 Deployment

### Production Setup

1. **Environment**:
```bash
ENVIRONMENT=production
DEBUG=false
```

2. **Database**:
```bash
# Use managed PostgreSQL service
DATABASE_URL=postgresql+asyncpg://...
```

3. **Scaling**:
```bash
# Multiple workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Celery workers
celery -A app.core.celery worker --concurrency=4
```

## 📈 Performance

- **Async Processing** - Non-blocking I/O operations
- **Connection Pooling** - Efficient database connections
- **Caching** - Redis for frequently accessed data
- **Rate Limiting** - Prevent API abuse
- **Batch Processing** - Efficient AI service calls

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **CORS Protection** - Configurable origins
- **Rate Limiting** - Per-user and global limits
- **Input Validation** - Pydantic schema validation

## 🤝 Integration with Frontend

The backend provides REST APIs that integrate with the React frontend:

```typescript
// Frontend API client example
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Create workflow
const workflow = await api.post('/workflows', workflowData);

// Execute workflow
const execution = await api.post(`/workflows/${id}/execute`, inputData);
```

## 📝 Development Notes

- **Code Style**: Black, isort, flake8
- **Type Hints**: Full type annotation
- **Async/Await**: Async-first architecture
- **Error Handling**: Comprehensive exception handling
- **Logging**: Structured logging with context

## 🆘 Troubleshooting

Common issues:

1. **Database Connection**: Check DATABASE_URL and PostgreSQL status
2. **Redis Connection**: Verify Redis is running and accessible
3. **Celery Tasks**: Check worker logs and broker connection
4. **AI API Keys**: Ensure valid API keys in environment

## 📞 Support

For issues and questions:
- Check logs: `docker-compose logs backend`
- Monitor tasks: http://localhost:5555
- API docs: http://localhost:8000/docs
