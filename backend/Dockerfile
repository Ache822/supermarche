# =============================================================================
# Supermarche Backend API - Multi-stage Dockerfile
# =============================================================================

# --- Base Stage ---
FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache curl tzdata

# --- Dependencies Stage ---
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# --- Development Stage ---
FROM base AS development
ENV NODE_ENV=development
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Builder Stage ---
FROM base AS builder
COPY package*.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN npx tsc -p tsconfig.json

# --- Production Stage ---
FROM base AS production
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force
COPY --from=builder /usr/src/app/dist ./dist
COPY openapi.yaml ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
