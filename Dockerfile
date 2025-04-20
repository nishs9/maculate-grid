FROM node:18.17.1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat sqlite
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Build with debugging
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# Enable verbose logging for Next.js
ENV DEBUG "*"

# Copy everything needed for the standalone build
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/nfl_stats.db ./

# Proper node_modules for production (this is critical)
COPY --from=builder /app/node_modules ./node_modules

# Copy output from standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install debugging tools
RUN apk add --no-cache curl iputils

# Match the port Next.js is actually using (from logs)
EXPOSE 8080

# Make sure Railway and Next.js use the same port
ENV PORT 8080

# Create a simple debug wrapper
RUN echo '#!/bin/sh' > debug.sh && \
    echo 'echo "==== DEBUG INFO ====="' >> debug.sh && \
    echo 'echo "Listing files in current directory:"' >> debug.sh && \
    echo 'ls -la' >> debug.sh && \
    echo 'echo "Checking node_modules:"' >> debug.sh && \
    echo 'ls -la node_modules/react node_modules/next || echo "Missing modules"' >> debug.sh && \
    echo 'echo "Starting server..."' >> debug.sh && \
    echo 'node server.js' >> debug.sh && \
    chmod +x debug.sh

# Start Next.js with the custom script
CMD ["sh", "./debug.sh"] 