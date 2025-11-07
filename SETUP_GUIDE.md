# Development Environment Setup Guide

Complete setup instructions for macOS (MacBook Pro) and Ubuntu 22.04.

---

## Prerequisites

### System Requirements
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 20GB free minimum
- **CPU**: 4+ cores recommended

---

## Setup for macOS (MacBook Pro)

### 1. Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Docker Desktop

**Option A: Download from website**
1. Download: https://www.docker.com/products/docker-desktop/
2. Install Docker Desktop.dmg
3. Start Docker Desktop
4. Wait for "Docker Desktop is running" indicator

**Option B: Using Homebrew**
```bash
brew install --cask docker
# Then open Docker Desktop from Applications
```

**Verify installation:**
```bash
docker --version
docker compose version
```

### 3. Install Miniconda (Python Package Manager)

```bash
# Download Miniconda installer
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh

# Install
bash Miniconda3-latest-MacOSX-arm64.sh

# Restart terminal, then verify
conda --version
```

**Alternative: Install Python via Homebrew**
```bash
brew install python@3.11
```

### 4. Clone Repository

```bash
cd ~/Documents/dev
git clone <your-repo-url> live_commerce
cd live_commerce
```

### 5. Create Conda Environment

```bash
# Create environment with Python 3.11
conda create -n livec python=3.11 -y

# Activate environment
conda activate livec

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

### 6. Configure Environment Variables

```bash
# Create .env from template
cp backend/.env.example backend/.env

# Edit .env with your credentials
nano backend/.env
# or
code backend/.env  # if using VS Code
```

**Required changes in .env:**
```bash
# Add your Cloudflare credentials
CLOUDFLARE_ACCOUNT_ID=0255752a1330b55dad31441eb3626295
CLOUDFLARE_STREAM_API_TOKEN=iHCD7pgd-wsNKuZO-XT-iS2iaO4MD1NqXdJ8y91L
CLOUDFLARE_STREAM_CUSTOMER_CODE=<get-from-cloudflare-dashboard>

# Generate a secure secret key
SECRET_KEY=<generate-random-string-32-chars>
```

### 7. Start Docker Services

```bash
# From project root
cd ~/Documents/dev/live_commerce

# Start all containers (first time will build images)
docker compose up -d

# Wait 1-2 minutes for build, then verify
docker compose ps
```

**Expected output:**
```
NAME                          STATUS
live_commerce_api             Up
live_commerce_celery_beat     Up
live_commerce_celery_worker   Up
live_commerce_flower          Up
live_commerce_mysql           Up (healthy)
live_commerce_nginx           Up
live_commerce_rabbitmq        Up (healthy)
live_commerce_redis           Up (healthy)
```

### 8. Verify Services

```bash
# Check API health
curl http://localhost:8011/docs  # Should return FastAPI docs

# Check Nginx
curl http://localhost:8084  # Should proxy to API

# Check RabbitMQ Management UI
open http://localhost:15672  # Login: guest/guest

# Check Flower (Celery monitoring)
open http://localhost:5555
```

### 9. macOS-Specific Notes

**Docker Resources:**
- Open Docker Desktop → Settings → Resources
- Recommended: 4 CPUs, 8GB RAM, 1GB Swap

**Port Conflicts:**
- Default ports: 3306 (MySQL), 6379 (Redis), 5672 (RabbitMQ)
- Custom ports: 8011 (API), 8084 (Nginx)
- If conflicts occur, modify `docker-compose.yml` port mappings

---

## Setup for Ubuntu 22.04

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Docker Engine

```bash
# Remove old versions (if any)
sudo apt remove docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (no sudo required)
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker --version
docker compose version
```

**Start Docker service:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### 3. Install Build Dependencies

```bash
sudo apt install -y \
    build-essential \
    pkg-config \
    libmysqlclient-dev \
    python3-dev \
    git \
    curl \
    wget
```

### 4. Install Miniconda

```bash
# Download Miniconda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Install
bash Miniconda3-latest-Linux-x86_64.sh

# Restart terminal, then verify
conda --version
```

**Alternative: Install Python from apt**
```bash
sudo apt install -y python3.11 python3.11-venv python3-pip
```

### 5. Clone Repository

```bash
cd ~
git clone <your-repo-url> live_commerce
cd live_commerce
```

### 6. Create Conda Environment

```bash
# Create environment
conda create -n livec python=3.11 -y

# Activate
conda activate livec

# Install dependencies
cd backend
pip install -r requirements.txt
```

### 7. Configure Environment Variables

```bash
# Create .env from template
cp backend/.env.example backend/.env

# Edit with nano or vim
nano backend/.env
```

**Required changes in .env:**
```bash
# Add your Cloudflare credentials
CLOUDFLARE_ACCOUNT_ID=0255752a1330b55dad31441eb3626295
CLOUDFLARE_STREAM_API_TOKEN=iHCD7pgd-wsNKuZO-XT-iS2iaO4MD1NqXdJ8y91L
CLOUDFLARE_STREAM_CUSTOMER_CODE=<get-from-cloudflare-dashboard>

# Generate secure secret key
SECRET_KEY=<generate-random-string-32-chars>
```

### 8. Start Docker Services

```bash
# From project root
cd ~/live_commerce

# Start containers (first time builds images)
docker compose up -d

# Wait 1-2 minutes, then verify
docker compose ps
```

### 9. Verify Services

```bash
# Check API
curl http://localhost:8011/docs

# Check Nginx
curl http://localhost:8084

# Check RabbitMQ (open browser)
xdg-open http://localhost:15672  # Login: guest/guest

# Check Flower
xdg-open http://localhost:5555
```

### 10. Ubuntu-Specific Notes

**Firewall (if enabled):**
```bash
# Allow Docker ports
sudo ufw allow 3306/tcp  # MySQL
sudo ufw allow 6379/tcp  # Redis
sudo ufw allow 5672/tcp  # RabbitMQ
sudo ufw allow 8011/tcp  # API
sudo ufw allow 8084/tcp  # Nginx
```

**Systemd service for Docker:**
```bash
# Enable Docker to start on boot
sudo systemctl enable docker

# Check status
sudo systemctl status docker
```

---

## Common Commands

### Docker Management

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f api

# Restart a service
docker compose restart api

# Rebuild containers after code changes
docker compose up -d --build

# Stop and remove all containers + volumes (WARNING: DATA LOSS)
docker compose down -v
```

### Conda Environment

```bash
# Activate environment
conda activate livec

# Deactivate
conda deactivate

# List environments
conda env list

# Update dependencies
cd backend
pip install -r requirements.txt --upgrade
```

### Database Management

```bash
# Access MySQL shell
docker compose exec mysql mysql -uroot -ppassword live_commerce

# Access Redis CLI
docker compose exec redis redis-cli

# View RabbitMQ queues
docker compose exec rabbitmq rabbitmqctl list_queues
```

---

## Troubleshooting

### Docker Issues

**"Cannot connect to Docker daemon"**
```bash
# macOS: Ensure Docker Desktop is running
# Ubuntu: Start Docker service
sudo systemctl start docker
```

**Port already in use**
```bash
# Find process using port
lsof -i :8011  # macOS
sudo netstat -tulpn | grep :8011  # Ubuntu

# Kill process or change port in docker-compose.yml
```

**Out of disk space**
```bash
# Remove unused images/containers
docker system prune -a

# Remove volumes (WARNING: deletes data)
docker volume prune
```

### Python Issues

**"command not found: conda"**
```bash
# Re-run conda init
conda init bash  # or zsh for macOS
# Restart terminal
```

**Package installation fails**
```bash
# Update pip
pip install --upgrade pip

# Install with verbose output
pip install -r requirements.txt -v
```

### Network Issues

**Cannot access services on localhost**
```bash
# Check if containers are running
docker compose ps

# Check container logs
docker compose logs api

# Verify port mappings
docker compose port api 8000
```

---

## Next Steps

After successful setup:

1. **Read** [START_HERE.md](START_HERE.md) for Day 1 tasks
2. **Follow** [PHASE1_SPRINT_PLAN.md](PHASE1_SPRINT_PLAN.md) for 7-day plan
3. **Implement** Cloudflare Stream integration (see [docs/CLOUDFLARE_SETUP.md](docs/CLOUDFLARE_SETUP.md))
4. **Test** API endpoints at http://localhost:8011/docs

---

## Platform Comparison Summary

| Aspect | macOS | Ubuntu 22.04 |
|--------|-------|--------------|
| Docker | Docker Desktop (GUI) | Docker Engine (CLI) |
| Docker Storage | `~/Library/Containers/...` | `/var/lib/docker/` |
| Python Install | Homebrew/Conda | apt/Conda |
| Package Manager | Homebrew | apt |
| Shell | zsh (default) | bash (default) |
| Sudo Required | No (Docker Desktop) | Yes (initial setup) |
| GUI Tools | Available | Limited (server) |

---

**Last Updated**: 2025-11-06
