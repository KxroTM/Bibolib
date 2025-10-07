## Optimized development Dockerfile (multi-stage) to speed up startup inside Docker
## Stage 1: install dependencies with cache leveraging package manifests only
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

## Stage 2: runtime dev container
FROM node:20-alpine
WORKDIR /app

# Avoid unnecessary polling on Docker Desktop if not needed; CRA will bind to 0.0.0.0
ENV CHOKIDAR_USEPOLLING=false \
    WATCHPACK_POLLING=false \
    HOST=0.0.0.0

# Copy node_modules from deps layer (will be isolated by anonymous volume in compose)
COPY --from=deps /app/node_modules ./node_modules

# Copy application sources
COPY . .

EXPOSE 3000
CMD ["npm","start"]
