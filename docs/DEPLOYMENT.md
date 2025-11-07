# Deployment Guide

This guide covers deploying the Live Commerce platform to production environments.

## Prerequisites

- Docker & Docker Compose installed on server
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Cloud storage account (AWS S3, GCP Cloud Storage)
- Email service account (SendGrid, AWS SES)
- SMS service account (Twilio)
- Payment gateway accounts (ECPay, Omise)
- Social auth credentials

## Production Environment Setup

### 1. Server Requirements

**Minimum Specifications:**
- CPU: 4 cores
- RAM: 16GB
- Storage: 100GB SSD
- Bandwidth: 100 Mbps

**Recommended Specifications:**
- CPU: 8+ cores
- RAM: 32GB
- Storage: 500GB SSD
- Bandwidth: 1 Gbps

### 2. Operating System

Recommended: Ubuntu 22.04 LTS

### 3. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Deployment Steps

### 1. Clone Repository

```bash
cd /var/www
git clone <repository-url> live_commerce
cd live_commerce
```

### 2. Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env

# Frontend
cp frontend/.env.example frontend/.env
nano frontend/.env
```

**Important environment variables:**

```bash
# Backend .env
DEBUG=False
SECRET_KEY=<generate-strong-random-key>
MYSQL_PASSWORD=<strong-password>
REDIS_HOST=redis
RABBITMQ_PASSWORD=<strong-password>

# Social Auth
LINE_CHANNEL_ID=<your-line-channel-id>
LINE_CHANNEL_SECRET=<your-line-secret>
FACEBOOK_APP_ID=<your-facebook-app-id>
# ... (add all credentials)

# Email
SENDGRID_API_KEY=<your-sendgrid-key>

# SMS
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-token>

# Storage
S3_BUCKET_NAME=<your-bucket>
S3_ACCESS_KEY=<your-access-key>
S3_SECRET_KEY=<your-secret-key>
```

### 3. SSL Certificate Setup

Using Let's Encrypt (Certbot):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 4. Configure Nginx

Update [nginx/nginx.conf](../nginx/nginx.conf) with your domain:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of configuration
}
```

### 5. Build and Start Services

```bash
# Production build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify services are running
docker-compose ps
```

### 6. Initialize Database

```bash
# Run migrations
docker-compose exec api alembic upgrade head

# Seed initial data (if needed)
docker-compose exec api python scripts/seed_data.py
```

### 7. Verify Deployment

Check all services:
```bash
# Check logs
docker-compose logs -f

# Test API
curl https://yourdomain.com/api/v1/health

# Test database connection
docker-compose exec api python -c "from app.db.session import get_db; print('DB OK')"

# Test Redis
docker-compose exec redis redis-cli ping

# Test RabbitMQ
docker-compose exec rabbitmq rabbitmq-diagnostics ping
```

## Mobile App Deployment

### iOS Deployment

1. **Configure Xcode Project**
```bash
cd frontend/ios
open Runner.xcworkspace
```

2. **Update Bundle Identifier**
3. **Configure Signing**
4. **Update Info.plist** with production URLs
5. **Build Archive**
6. **Upload to App Store Connect**

### Android Deployment

1. **Update build.gradle** with production configs
2. **Generate signing key:**
```bash
keytool -genkey -v -keystore ~/release-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias release
```

3. **Configure signing in android/app/build.gradle**
4. **Build release APK/AAB:**
```bash
cd frontend
flutter build appbundle --release
```

5. **Upload to Google Play Console**

### Web Deployment

Built automatically by Docker. Served by Nginx.

## Database Backup

### Automated Backups

Create backup script:

```bash
#!/bin/bash
# /var/scripts/backup_mysql.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
mkdir -p $BACKUP_DIR

docker-compose exec -T mysql mysqldump \
  -u root -p$MYSQL_ROOT_PASSWORD \
  live_commerce > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql s3://your-bucket/backups/
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /var/scripts/backup_mysql.sh
```

## Monitoring Setup

### Application Monitoring

**Using Sentry for Error Tracking:**

```python
# backend/app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
)
```

### Infrastructure Monitoring

Install monitoring tools:

```bash
# Prometheus + Grafana
docker-compose -f docker-compose.monitoring.yml up -d
```

## Scaling

### Horizontal Scaling

**Add more API servers:**

```yaml
# docker-compose.prod.yml
api:
  deploy:
    replicas: 3
```

**Add load balancer:**

Use Nginx or cloud load balancer (AWS ALB, GCP Load Balancer)

**Scale Celery workers:**

```yaml
celery_worker:
  deploy:
    replicas: 5
```

### Database Scaling

**MySQL Read Replicas:**

```yaml
mysql_replica:
  image: mysql:8.0
  command: --server-id=2 --log-bin=mysql-bin
  # Configure replication
```

**Redis Cluster:**

Use Redis Sentinel or cluster mode for high availability.

## Security Checklist

- [ ] All services behind firewall
- [ ] SSL/TLS certificates installed
- [ ] Strong passwords for all services
- [ ] SSH key-based authentication only
- [ ] Fail2ban installed and configured
- [ ] Regular security updates
- [ ] Database backups tested
- [ ] Environment variables secured
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation everywhere
- [ ] Secrets not in git repository

## Performance Tuning

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_streams_status ON streams(status);

-- Analyze tables
ANALYZE TABLE products;
ANALYZE TABLE orders;
```

### Redis Tuning

```bash
# /etc/redis/redis.conf
maxmemory 4gb
maxmemory-policy allkeys-lru
```

### Nginx Tuning

```nginx
worker_processes auto;
worker_connections 2048;

# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g;
```

## Troubleshooting

### Common Issues

**Service won't start:**
```bash
# Check logs
docker-compose logs <service-name>

# Check resource usage
docker stats

# Restart service
docker-compose restart <service-name>
```

**Database connection errors:**
```bash
# Check MySQL is accessible
docker-compose exec mysql mysql -u root -p

# Verify credentials in .env
```

**High memory usage:**
```bash
# Identify culprit
docker stats

# Restart specific service
docker-compose restart <service-name>
```

### Log Files

- Application logs: `/var/log/live_commerce/`
- Nginx logs: `/var/log/nginx/`
- MySQL logs: `/var/lib/mysql/`
- Docker logs: `docker-compose logs`

## Rollback Procedure

```bash
# Stop current deployment
docker-compose down

# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild and restart
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# If database migration needed
docker-compose exec api alembic downgrade -1
```

## Continuous Deployment

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/live_commerce
            git pull
            docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## Cost Optimization

### Cloud Provider Options

**AWS:**
- EC2 for compute
- RDS for MySQL
- ElastiCache for Redis
- S3 for storage
- CloudFront for CDN

**GCP:**
- Compute Engine
- Cloud SQL
- Memorystore
- Cloud Storage
- Cloud CDN

**Digital Ocean:**
- Droplets
- Managed Databases
- Spaces (storage)

**Estimated Monthly Costs:**
- Small scale (< 1000 users): $100-300
- Medium scale (< 10k users): $500-1500
- Large scale (< 100k users): $2000-5000+

## Support

For deployment issues:
- Check logs first
- Review documentation
- Open GitHub issue with details
