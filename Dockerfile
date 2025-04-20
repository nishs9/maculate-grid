FROM node:18.17.1-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Set production environment
ENV NODE_ENV production
ENV PORT 8080

# Expose the port
EXPOSE 8080

# Start the application
CMD ["npm", "start", "--", "-p", "8080"] 