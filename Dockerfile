# =========================
# Base image
# =========================
FROM node:20.15.1-slim AS base

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    libc6 \
    bash \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Включаем corepack и pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# =========================
# Dependencies stage
# =========================
FROM base AS deps

COPY package.json pnpm-lock.yaml .npmrc* ./
RUN pnpm install --frozen-lockfile

# =========================
# Build stage
# =========================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# =========================
# Production runner
# =========================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Создаём пользователя
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Копируем standalone output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]