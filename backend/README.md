# Supermarche Landing Page CMS & Admin API

Enterprise RESTful API and WebSocket backend for the **Supermarche** service delivery platform's landing website and administration portal.

---

## 📖 Quick Conceptual Architecture Guide (Why & How We Built It)

If you are a developer new to this codebase, here is the plain-English explanation of the core concepts:

### 1. Self-Referencing Category Hierarchy (The Tree Concept)
- **Why**: We eliminated the old, confusing `CategoryLabel` idea.
- **How**: Categories use **1 single model** (`Category`) with a `parent` field pointing to another Category's `_id`.
  - **Main Hub Category**: Has `parent: null` (e.g. *"Home & Essential Services"*).
  - **Sub-Category**: Has `parent: ObjectId(...)` (e.g. *"Cooking Gas"* pointing to *"Home & Essential Services"*).

### 2. Automatic Multilingual Localization (`?lang=fr`)
- **Why**: Avoid duplicating database rows for French and English.
- **How**: Documents store a `translations` object (e.g. `translations: { fr: { name: "Gaz de Cuisine" } }`). When any public request passes `?lang=fr`, our backend helper `localizeArray()` automatically replaces the English text with French before sending JSON to the frontend.

### 3. Direct String Permission Access Control (RBAC)
- **Why**: Rigid roles like "Manager" or "Editor" don't fit every employee.
- **How**: Each user account holds an explicit array of permission strings (e.g. `permissions: ["support:chat", "applications:read"]`). Middleware checks `requirePermission("support:chat")` before granting access to endpoints.

### 4. High-Performance Redis Page Caching
- **Why**: Prevents thousands of landing page visitors from slowing down MongoDB.
- **How**: Landing page section layout is cached in Redis memory. When an admin edits a section in the CMS, the backend instantly invalidates the Redis cache key (`redis.del('page:slug:home')`).

### 5. Support Chat Archiving & Automatic Disk/DB Cleanup
- **Why**: Old support chat messages and uploaded image attachments waste server hard drive space and MongoDB RAM over time.
- **How**: When an agent resolves a chat (`POST /chats/:session_id/resolve`), the backend:
  1. Compiles the conversation history into 1 single plain-text string (`transcript_summary`).
  2. Deletes uploaded image files from server disk (`public/uploads/...`).
  3. Purges individual message rows from MongoDB (`SupportMessage.deleteMany`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18+` or `v20+`
- **MongoDB**: `v6.0+` (Local or MongoDB Atlas)
- **Redis**: `v7.0+` (Local or Managed Redis)
- **Docker** (Optional, recommended for local dev environment)

### Installation & Execution

1. **Install Dependencies**:
   ```bash
   cd landing/backend
   npm install
   ```

2. **Environment Configuration (`.env`)**:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/supermarche_lp
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=super_secret_jwt_key_supermarche_2026
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Seed Initial Database**:
   Seeds top-level categories, sub-categories, services, and the root super admin (`admin@example.com` / `SuperAdminPass123!`):
   ```bash
   npm run seed
   ```

4. **Run Server**:
   ```bash
   # Using Docker:
   docker compose up --build

   # Or locally:
   npm run dev
   ```

Server running on: **`http://localhost:3000`**

---

## 📚 API References

- **Comprehensive Developer Manual & Specs**: [supermarche_api_documentation.md](file:///C:/Users/NT%20Store/.gemini/antigravity-ide/brain/bd8bc0f3-f0bd-4b7a-8026-dc0bfca43186/supermarche_api_documentation.md)
- **OpenAPI Specification**: [`openapi.yaml`](file:///C:/Users/NT%20Store/OneDrive/Desktop/ICP/landing/backend/openapi.yaml)
