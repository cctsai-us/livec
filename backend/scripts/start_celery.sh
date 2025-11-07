#!/bin/bash
# Start Celery worker

celery -A app.tasks.celery_app worker --loglevel=info
