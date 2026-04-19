# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/collab/package.json ./apps/collab/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the collab service
RUN npm run build --workspace=apps/collab

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built application
COPY --from=builder /app/apps/collab/dist ./dist
COPY --from=builder /app/apps/collab/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 collabuser

USER collabuser

EXPOSE 1234

CMD ["npm", "start"]