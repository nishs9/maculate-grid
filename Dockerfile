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

# Create a debug script
RUN echo "#!/bin/sh\necho 'Starting server with verbose logging'\necho 'Environment variables:'\nenv\necho 'Network interfaces:'\nip addr\necho 'Testing port availability:'\nnc -zv localhost 8080 || echo 'Port 8080 not in use'\necho 'Starting Next.js with debugging...'\nNODE_OPTIONS='--inspect' node --trace-warnings server.js" > /app/start.sh && chmod +x /app/start.sh

# Start Next.js with verbose debugging
CMD ["/app/start.sh"] 