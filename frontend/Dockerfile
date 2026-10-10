# =============================================================================
# Supermarche Frontend Web App - Multi-stage Dockerfile
# =============================================================================

# --- Base Stage ---
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# --- Dependencies Stage ---
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# --- Development Stage ---
FROM base AS development
ENV NODE_ENV=development
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- Builder Stage ---
FROM base AS builder
COPY package*.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
RUN npm run build

# --- Production Stage (Nginx Web Server) ---
FROM nginx:alpine AS production
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
# Nginx SPA Routing Fallback
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
