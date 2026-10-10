# Supermarche E-Commerce Platform

Modern full-stack web application for the Supermarche platform.

- **Frontend**: React 19, TypeScript, Vite, HeroUI / MUI, Emotion, Socket.IO Client, i18next
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), Redis, Socket.IO, Helmet, Zod

---

## 🚀 Quick Start with Docker

### Local Development (with hot-reloading)
```bash
# 1. Setup environment variables
cp .env.example .env

# 2. Start all services (Frontend, Backend, Redis)
docker compose up --build
```
- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:3001`

### Production Testing
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
- Frontend (Nginx): `http://localhost:80`
- Backend API: `http://localhost:3000`

---

## 📖 Deployment & CI/CD Guide

For full instructions on setting up **GitHub Secrets**, **GitHub Variables**, and automated CI/CD deployment via **GitHub Actions**, please see [DOCKER_DEPLOYMENT_GUIDE.md](DOCKER_DEPLOYMENT_GUIDE.md).