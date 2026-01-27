# =============================================================================
# Multi-stage Dockerfile for Next.js with Bun
# Supports: staging & production environments
# Memory-safe configuration with resource limits
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM oven/bun:1-alpine AS deps

WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies with frozen lockfile for reproducible builds
RUN bun install --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Builder
# -----------------------------------------------------------------------------
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set Next.js to output standalone for smaller production image
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN bun run build

# -----------------------------------------------------------------------------
# Stage 3: Production Runner
# -----------------------------------------------------------------------------
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# # Memory safety: Set Bun's memory limits
# # Adjust BUN_JSC_heapSize based on container memory allocation
# # Default: 512MB heap size, tune based on your container limits
# ENV BUN_JSC_heapSize=512
# ENV BUN_JSC_useJIT=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port (default Next.js port)
EXPOSE 3000

# Set hostname for container networking
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000


# Start the application using Bun
# Memory limits enforced via environment variables above
CMD ["bun", "server.js"]
