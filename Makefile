.PHONY: help build up down restart logs clean test backend-test frontend-test migrate seed

# Default target
help:
	@echo "Live Commerce - Make Commands"
	@echo ""
	@echo "Development:"
	@echo "  make build         - Build all Docker containers"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo "  make logs          - View logs"
	@echo "  make clean         - Clean up containers and volumes"
	@echo ""
	@echo "Database:"
	@echo "  make migrate       - Run database migrations"
	@echo "  make seed          - Seed database with sample data"
	@echo ""
	@echo "Testing:"
	@echo "  make test          - Run all tests"
	@echo "  make backend-test  - Run backend tests"
	@echo "  make frontend-test - Run frontend tests"
	@echo ""
	@echo "Other:"
	@echo "  make shell         - Open backend shell"
	@echo "  make db-shell      - Open MySQL shell"

# Docker commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

# Database commands
migrate:
	docker-compose exec api alembic upgrade head

seed:
	docker-compose exec api python scripts/seed_data.py

db-shell:
	docker-compose exec mysql mysql -u root -p

# Testing commands
test: backend-test frontend-test

backend-test:
	docker-compose exec api pytest

frontend-test:
	cd frontend && flutter test

# Development commands
shell:
	docker-compose exec api /bin/bash

# Backend dev (without Docker)
backend-dev:
	cd backend && uvicorn app.main:app --reload

# Frontend dev
frontend-dev:
	cd frontend && flutter run -d chrome

# Celery commands
celery-worker:
	cd backend && celery -A app.tasks.celery_app worker --loglevel=info

celery-beat:
	cd backend && celery -A app.tasks.celery_app beat --loglevel=info

celery-flower:
	cd backend && celery -A app.tasks.celery_app flower --port=5555
