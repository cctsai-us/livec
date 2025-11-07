# Live Commerce Platform

A comprehensive live streaming and ecommerce platform targeting Taiwan and Thailand markets, built with FastAPI (Python), Flutter, MySQL, Redis, and RabbitMQ.

## Features

- **Live Streaming**: Real-time video streaming with RTMP/HLS support
- **Social Authentication**: LINE, Facebook, Google, Apple, Instagram, Kapook
- **Multi-platform**: iOS, Android, Web (H5), Desktop
- **Real-time Chat**: WebSocket-based chat during live streams
- **Product Catalog**: Full ecommerce functionality
- **Order Management**: Complete order processing system
- **Payment Integration**: ECPay (Taiwan), Omise (Thailand), LINE Pay
- **Localization**: Support for Thai, Traditional Chinese, and English

## Tech Stack

See [tech_stack.md](tech_stack.md) for detailed technology stack information.

### Backend
- Python 3.11+
- FastAPI
- MySQL 8.0+
- Redis 7.0+
- RabbitMQ 3.12+
- Celery

### Frontend
- Flutter 3.16+
- Dart 3.2+

### Infrastructure
- Docker & Docker Compose
- Nginx (reverse proxy + RTMP streaming)

## Project Structure

```
live_commerce/
├── backend/          # FastAPI backend
├── frontend/         # Flutter app
├── nginx/            # Nginx configuration
├── docker/           # Docker configurations
├── docs/             # Documentation
└── tech_stack.md     # Technology stack details
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+ (for local development)
- Flutter 3.16+ (for mobile development)

### Using Docker Compose (Recommended)

1. Clone the repository
2. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. Start all services:
   ```bash
   docker-compose up -d
   ```

4. Access services:
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - RabbitMQ Management: http://localhost:15672
   - Flower (Celery): http://localhost:5555
   - HLS Streaming: http://localhost:8080/hls

### Manual Setup

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements/dev.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
flutter pub get
flutter run
```

### Database Migrations

```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Documentation

- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Social Authentication Setup](docs/SOCIAL_AUTH.md)
- [Message Queue](docs/MESSAGE_QUEUE.md)

## Environment Variables

See `.env.example` files in `backend/` and `frontend/` directories.

## Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=app tests/
```

### Frontend Tests
```bash
cd frontend
flutter test
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.
