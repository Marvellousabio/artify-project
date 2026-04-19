# ArtifyPro - Production Infrastructure

A comprehensive design tool with real-time collaboration, AI-powered features, and modern code export capabilities.

## 🏗️ Architecture

### Monorepo Structure
```
artifypro-monorepo/
├── apps/
│   ├── web/          # Next.js frontend (port 3000)
│   ├── api/          # Node.js Express API (port 4000)
│   ├── ai-service/   # Python FastAPI service (port 8000)
│   └── collab/       # Yjs WebSocket server (port 1234)
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── constraints/  # Design constraints & utilities
│   └── ui/           # Shared React component library
└── docker-compose.yml # Local development setup
```

### Services Overview

- **Web**: Next.js application with Clerk authentication
- **API**: Express.js backend with Prisma ORM
- **AI Service**: FastAPI service for image generation and embeddings
- **Collaboration**: Yjs WebSocket server for real-time editing
- **Database**: PostgreSQL with Prisma schema
- **Cache**: Redis for session management and caching
- **Vector DB**: Pinecone for design similarity search
- **Storage**: AWS S3 + CloudFront for asset management

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### 1. Clone and Install
```bash
git clone <repository-url>
cd artifypro-monorepo

# Install dependencies
npm install

# Install Python dependencies for AI service
cd apps/ai-service
pip install poetry
poetry install
cd ../..
```

### 2. Environment Setup
```bash
cp .env.example .env

# Edit .env with your API keys and configuration
# Required: ANTHROPIC_API_KEY, OPENAI_API_KEY, PINECONE_API_KEY, etc.
```

### 3. Database Setup
```bash
# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# Run Prisma migrations
cd apps/api
npx prisma generate
npx prisma db push
```

### 4. Start Development Environment
```bash
# Start all services with hot reload
docker-compose up

# Or run individually:
npm run dev:web     # Frontend
npm run dev:api     # API
npm run dev:collab  # Collaboration
# In apps/ai-service: poetry run uvicorn src.main:app --reload
```

Visit `http://localhost:3000` to access the application.

## 📋 Environment Variables

### Required
```env
# Database
DATABASE_URL="postgresql://artify:artify_password@localhost:5432/artify"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# AI Services
ANTHROPIC_API_KEY="sk-ant-api03-..."
STABILITY_API_KEY="sk-..."
OPENAI_API_KEY="sk-..."

# Vector Database
PINECONE_API_KEY="..."
PINECONE_INDEX="artify-designs"

# AWS
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET="artify-assets"
CLOUDFRONT_URL="https://..."
```

## 🐳 Docker Development

### Local Development with Docker Compose
```bash
# Start all services
docker-compose up

# Start specific services
docker-compose up web api postgres

# Rebuild and restart
docker-compose up --build
```

### Service Ports
- Web: http://localhost:3000
- API: http://localhost:4000
- AI Service: http://localhost:8000
- Collaboration: ws://localhost:1234
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production` in all environments
- [ ] Configure production database URLs
- [ ] Set up AWS credentials and S3 bucket
- [ ] Configure Pinecone index and API keys
- [ ] Set up Clerk authentication for production
- [ ] Configure CloudFront distribution
- [ ] Set up monitoring and logging

### AWS ECS Deployment
```bash
# Build and push images
npm run docker:build
npm run docker:push

# Deploy via AWS CLI or Console
aws ecs update-service --cluster artify-cluster --service artify-api-service --force-new-deployment
```

### Vercel Deployment (Web)
```bash
cd apps/web
vercel --prod
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Type checking
npm run typecheck

# Linting
npm run lint

# Testing
npm run test

# Build all apps
npm run build

# Clean all builds
npm run clean
```

## 📊 Database Schema

The application uses Prisma ORM with PostgreSQL. Key entities:

- **Users**: Authentication and profile data
- **Teams**: Multi-user collaboration
- **Documents**: Design files with version history
- **DocumentSnapshots**: Yjs binary snapshots
- **Assets**: File uploads and media
- **DesignTokens**: Reusable design tokens
- **ComponentLibrary**: Shared component library

## 🔍 Monitoring & Logging

### Health Checks
- `/health` endpoint on all services
- Database connection monitoring
- External API health checks

### Logging
- Structured JSON logging
- Error tracking with Sentry
- Performance monitoring with DataDog

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.