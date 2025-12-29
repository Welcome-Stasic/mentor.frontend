# ============================================
# Base Stage: Use Alpine with proper dependencies
# ============================================

ARG NODE_VERSION=22.14.0-alpine
FROM node:${NODE_VERSION} AS base

# Устанавливаем системные зависимости
RUN apk add --no-cache \
    libc6-compat \
    && rm -rf /var/cache/apk/*

# Устанавливаем pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN pnpm install --prod --frozen-lockfile

# ============================================
# Builder Stage
# ============================================

FROM base AS builder

# Устанавливаем зависимости для сборки (только временно)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Копируем исходный код
COPY . .

# Собираем приложение с явными флагами
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# ============================================
# Production Stage
# ============================================

FROM node:${NODE_VERSION} AS runner

# Устанавливаем только необходимые библиотеки
RUN apk add --no-cache libc6-compat

# Создаем пользователя
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

WORKDIR /app

# Создаем директории для кэша
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next

# Копируем собранное приложение
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]