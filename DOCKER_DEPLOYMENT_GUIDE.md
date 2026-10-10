# Supermarche Landing - Docker & GitHub Actions Deployment Guide

This guide details how to run the Supermarche platform locally using Docker, build and test production containers, configure GitHub Secrets/Variables, and deploy automatically using GitHub Actions.

---

## 🏗️ Architecture Overview

The repository consists of two main services containerized via multi-stage Dockerfiles:

```
bb-landing/
├── backend/                  # Express + TypeScript + MongoDB + Redis API
│   ├── Dockerfile            # Multi-stage: development, builder, production
│   ├── .dockerignore         # Ignores node_modules, .env, dist, logs
│   └── .env.example          # Backend environment variables reference
├── frontend/                 # React + Vite + TypeScript SPA
│   ├── Dockerfile            # Multi-stage: development, builder, production (Nginx)
│   ├── nginx.conf            # Nginx SPA config, gzip, caching & security headers
│   ├── .dockerignore         # Ignores node_modules, .env, dist, logs
│   └── .env.example          # Frontend environment variables reference
├── docker-compose.yml        # Development environment (with hot reload & db)
├── docker-compose.prod.yml   # Production environment (optimized builds & healthchecks)
├── .dockerignore             # Root level docker ignore
├── .gitignore                # Root level git ignore
├── .env.example              # Consolidated master environment template
└── .github/workflows/
    ├── ci.yml                # CI pipeline (lint, build & docker verification)
    └── deploy.yml            # CD pipeline (deploy to server with GitHub Secrets)
```

---

## 🚀 1. Local Development (Docker Compose)

The development environment mounts source files for instant hot-reloading in both backend (`ts-node-dev`) and frontend (`vite`), along with containerized Redis. The database connects directly to your MongoDB Atlas instance configured in `.env`.

### Step 1: Copy environment file
```bash
cp .env.example .env
```

### Step 2: Start development containers
```bash
docker compose up --build
```

### Service Access:
- **Frontend SPA**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **Redis**: `localhost:6379`

### Stop development containers:
```bash
docker compose down
```

---

## 🏭 2. Local Production Testing

To test production containers locally (Nginx serving frontend bundle, production Node.js running compiled dist):

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Access:
- **Frontend (Nginx)**: `http://localhost:80`
- **Backend API**: `http://localhost:3000`

### Stop production containers:
```bash
docker compose -f docker-compose.prod.yml down
```

---

## 🔐 3. GitHub Secrets & Variables Configuration

When deploying via GitHub Actions, sensitive credentials must be stored securely in **GitHub Repository Secrets**, and non-sensitive settings in **GitHub Variables**.

### How to add Secrets and Variables:
1. Go to your GitHub Repository: **Settings** -> **Secrets and variables** -> **Actions**

### A. Repository Secrets (`Secrets` Tab):

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `SSH_HOST` | Remote server IP / Domain | `198.51.100.1` |
| `SSH_USER` | SSH username on server | `ubuntu` or `root` |
| `SSH_PRIVATE_KEY` | Private SSH key (PEM / OpenSSH format) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SSH_PORT` | *(Optional)* SSH Port (Default: 22) | `22` |
| `DEPLOY_PATH` | Directory where app lives on server | `/var/www/bb-landing` |
| `MONGODB_URI` | Production MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/supermarche` |
| `JWT_SECRET` | Secret for signing JWTs (>= 32 chars) | `your-secure-production-jwt-secret-key-32-chars` |
| `SMTP_USER` | SMTP username for email delivery | `apikey` |
| `SMTP_PASS` | SMTP password for email delivery | `your-smtp-password` |
| `REDIS_URL` | Redis connection URL | `redis://redis:6379` |

### B. Repository Variables (`Variables` Tab):

| Variable Name | Description | Default / Example Value |
| :--- | :--- | :--- |
| `FRONTEND_PORT` | Host port for frontend | `80` |
| `BACKEND_PORT` | Host port for backend | `3000` |
| `CORS_ORIGIN` | Allowed origin for frontend API calls | `https://supermarche.com` |
| `VITE_API_BASE_URL` | Frontend API URL built into React SPA | `https://supermarche.com/api/v1` |
| `VITE_SOCKET_URL` | Frontend Socket.IO live support URL | `https://supermarche.com` |
| `EMAIL_FROM` | From header for outgoing emails | `Supermarche Support <no-reply@supermarche.com>` |
| `SMTP_HOST` | SMTP server host | `smtp.sendgrid.net` |
| `SMTP_PORT` | SMTP server port | `587` |
| `JWT_EXPIRES_IN`| JWT expiration duration | `7d` |

---

## 🤖 4. How GitHub Actions CI/CD Works

1. **Continuous Integration (`.github/workflows/ci.yml`)**:
   - Triggers on every push and pull request to `main`, `master`, and `develop`.
   - Compiles TypeScript and builds backend.
   - Generates sitemaps and compiles frontend.
   - Tests Docker build of both containers without pushing.

2. **Automated Deployment (`.github/workflows/deploy.yml`)**:
   - Triggers automatically when code is pushed to `main` (or manually via **Actions** -> **Run workflow**).
   - Connects securely to your remote VPS via SSH.
   - Ensures latest code is synced.
   - Dynamically writes `.env` file from GitHub Secrets and Variables with `chmod 600` permissions.
   - Runs `docker compose -f docker-compose.prod.yml up -d --build --remove-orphans`.
   - Automatically cleans up old dangling images.

---

## 🛡️ 5. Security Highlights

- **Multi-Stage Builds**: Development tools, compilers, and test packages are excluded from final production images.
- **Non-Root User**: Backend production image runs as user `node` rather than `root`.
- **Nginx Hardening**: Nginx handles SPA routing, gzip compression, asset caching, and security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- **Secret Isolation**: Sensitive keys (`.env`) are ignored via `.dockerignore` and `.gitignore` so they are never committed to git or baked into Docker layers.
