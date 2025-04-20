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

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# Enable verbose logging for Node.js and Next.js
ENV DEBUG "*"
ENV NODE_DEBUG "*"
ENV NEXT_DEBUG "*"
ENV NEXT_LOGGING_FILE "true" 

# Copy necessary files
COPY --from=builder /app/next.config.js ./
#COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/nfl_stats.db ./

# Copy output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Install debugging tools
RUN apk add --no-cache curl netcat-openbsd

# Match the port Next.js is actually using (from logs)
EXPOSE 8080

# Make sure Railway and Next.js use the same port
ENV PORT 8080

# Create start-debug.sh directly in the image
RUN echo '#!/bin/sh' > start-debug.sh && \
    echo 'echo "====== ENVIRONMENT VARIABLES ======"' >> start-debug.sh && \
    echo 'env | sort' >> start-debug.sh && \
    echo 'echo "====== FILE LISTING ======"' >> start-debug.sh && \
    echo 'ls -la' >> start-debug.sh && \
    echo 'echo "====== NETWORK INFO ======"' >> start-debug.sh && \
    echo 'ip addr || echo "ip command not found"' >> start-debug.sh && \
    echo 'echo "====== PORT CHECK ======"' >> start-debug.sh && \
    echo 'netstat -tulpn || echo "netstat command not found"' >> start-debug.sh && \
    echo 'echo "====== STARTING SERVER ======"' >> start-debug.sh && \
    echo 'exec node --trace-warnings server.js' >> start-debug.sh && \
    chmod +x start-debug.sh

# Start with debugging
CMD ["sh", "./start-debug.sh"] 