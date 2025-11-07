# Setup Guide

This guide will help you set up the Live Commerce platform for local development.

## Prerequisites

### Required Software
- **Docker Desktop** (recommended) or Docker + Docker Compose
- **Python 3.11+** (for backend development)
- **Flutter 3.16+** (for frontend development)
- **Git**
- **MySQL 8.0+** (if not using Docker)
- **Redis 7.0+** (if not using Docker)
- **RabbitMQ 3.12+** (if not using Docker)

### Optional Tools
- **MySQL Workbench** - Database management
- **Postman** or **Insomnia** - API testing
- **VSCode** or **IntelliJ IDEA** - Code editor
- **Android Studio** - Android development
- **Xcode** - iOS development (macOS only)

## Option 1: Docker Setup (Recommended)

### 1. Clone Repository
```bash
git clone <repository-url>
cd live_commerce
```

### 2. Configure Environment Variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Initialize Database
```bash
# Run migrations
docker-compose exec api alembic upgrade head

# Seed data (optional)
docker-compose exec api python scripts/seed_data.py
```

### 5. Verify Services
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- RabbitMQ: http://localhost:15672 (guest/guest)
- Flower: http://localhost:5555
- MySQL: localhost:3306
- Redis: localhost:6379

## Option 2: Manual Setup

### Backend Setup

#### 1. Install Python Dependencies
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements/dev.txt
```

#### 2. Setup MySQL Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE live_commerce;
CREATE USER 'livecommerce'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON live_commerce.* TO 'livecommerce'@'localhost';
FLUSH PRIVILEGES;
exit;
```

#### 3. Setup Redis
```bash
# Install Redis (macOS)
brew install redis
brew services start redis

# Install Redis (Ubuntu)
sudo apt install redis-server
sudo systemctl start redis
```

#### 4. Setup RabbitMQ
```bash
# Install RabbitMQ (macOS)
brew install rabbitmq
brew services start rabbitmq

# Install RabbitMQ (Ubuntu)
sudo apt install rabbitmq-server
sudo systemctl start rabbitmq-server

# Enable management plugin
rabbitmq-plugins enable rabbitmq_management
```

#### 5. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

#### 6. Run Database Migrations
```bash
alembic upgrade head
```

#### 7. Start Backend Server
```bash
uvicorn app.main:app --reload
```

#### 8. Start Celery Worker (in another terminal)
```bash
celery -A app.tasks.celery_app worker --loglevel=info
```

#### 9. Start Celery Beat (in another terminal)
```bash
celery -A app.tasks.celery_app beat --loglevel=info
```

### Frontend Setup

#### 1. Install Flutter
Follow the official Flutter installation guide:
https://docs.flutter.dev/get-started/install

#### 2. Verify Installation
```bash
flutter doctor
```

#### 3. Install Dependencies
```bash
cd frontend
flutter pub get
```

#### 4. Configure Environment
```bash
cp .env.example .env
# Edit .env with your API URL
```

#### 5. Run Application

**Web:**
```bash
flutter run -d chrome
```

**iOS (macOS only):**
```bash
flutter run -d ios
```

**Android:**
```bash
flutter run -d android
```

### Nginx Setup (for RTMP streaming)

#### 1. Install Nginx with RTMP module

**macOS:**
```bash
brew tap denji/nginx
brew install nginx-full --with-rtmp-module
```

**Ubuntu:**
```bash
sudo apt install nginx libnginx-mod-rtmp
```

#### 2. Configure Nginx
```bash
# Copy configuration
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Start Nginx
sudo nginx
```

## Social Authentication Setup

### 1. LINE Login
1. Visit https://developers.line.biz/
2. Create a channel
3. Get Channel ID and Channel Secret
4. Add to backend/.env

### 2. Facebook Login
1. Visit https://developers.facebook.com/
2. Create an app
3. Get App ID and App Secret
4. Add to backend/.env and frontend/.env

### 3. Google Sign-In
1. Visit https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Get Client ID and Client Secret
4. Add to backend/.env and frontend/.env

### 4. Apple Sign In
1. Visit https://developer.apple.com/
2. Create Service ID
3. Configure Sign In with Apple
4. Add credentials to backend/.env

See [SOCIAL_AUTH.md](SOCIAL_AUTH.md) for detailed instructions.

## Payment Gateway Setup

### Taiwan - ECPay
1. Register at https://www.ecpay.com.tw/
2. Get Merchant ID and API keys
3. Add to backend/.env

### Thailand - Omise
1. Register at https://www.omise.co/
2. Get API keys
3. Add to backend/.env

## Troubleshooting

### Backend Issues

**MySQL connection error:**
- Check MySQL is running: `mysql.server status`
- Verify credentials in .env

**Redis connection error:**
- Check Redis is running: `redis-cli ping`

**RabbitMQ connection error:**
- Check RabbitMQ is running
- Verify management UI at http://localhost:15672

**Import errors:**
- Ensure virtual environment is activated
- Run `pip install -r requirements/dev.txt`

### Frontend Issues

**Flutter not found:**
- Add Flutter to PATH
- Run `flutter doctor`

**Package errors:**
- Run `flutter clean`
- Run `flutter pub get`

**Platform-specific build errors:**
- iOS: Open Xcode, check signing
- Android: Check Android SDK installation

### Docker Issues

**Port conflicts:**
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

**Disk space:**
```bash
# Clean up Docker
docker system prune -a
```

## Next Steps

1. Read [API.md](API.md) for API documentation
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Need Help?

- Check existing GitHub issues
- Create a new issue with detailed information
- Include error logs and system information
