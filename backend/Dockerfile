# Multi-stage Dockerfile for NestJS backend with git submodules
# This Dockerfile is specifically designed for Railway deployment with git submodules

# Stage 1: Build stage
FROM node:22-alpine AS builder

# Install git (required for submodules)
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy the entire repository (including .git for submodules)
COPY ../ ./

# Initialize git submodules
RUN git config --global --add safe.directory /app && \
    git submodule update --init --recursive

# Change to backend directory
WORKDIR /app/backend

# Install dependencies
RUN npm ci --only=production=false

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM node:22-alpine AS production

# Install only libatomic (required for some dependencies)
RUN apk add --no-cache libatomic

WORKDIR /app

# Copy package files
COPY --from=builder /app/backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/backend/dist ./dist

# Copy any necessary static files or configs
COPY --from=builder /app/backend/.env* ./ 2>/dev/null || true

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start:prod"]
