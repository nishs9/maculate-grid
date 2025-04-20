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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Install curl for healthcheck
RUN apk add --no-cache curl

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/nfl_stats.db ./

USER nextjs

# Ensure port is exposed correctly - Next.js is using 8080
EXPOSE 8080

# Railway configuration - PORT is what Railway uses to route traffic
ENV PORT 8080
# Next.js specific variables
ENV NODE_ENV production
ENV HOSTNAME "0.0.0.0"
# Tell Railway to connect to port 8080
ENV RAILWAY_DOCKERFILE_PORT 8080

# Add healthcheck to help Railway detect when the server is ready
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start the server explicitly binding to 0.0.0.0
CMD ["node", "server.js"] 