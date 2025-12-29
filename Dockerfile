# =========================
# Base image - используем Alpine для минимального размера и безопасности
# =========================
FROM node:20-alpine AS base

# Устанавливаем только необходимые системные пакеты
RUN apk add --no-cache \
    libc6-compat \
    tini \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Создаем пользователя и группу без привилегий
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# =========================
# Dependencies stage - PRODUCTION зависимости
# =========================
FROM base AS deps

# Копируем только файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем ТОЛЬКО production зависимости для финального образа
RUN npm ci --omit=dev && \
    npm cache clean --force

# =========================
# Dependencies stage - ALL зависимости для сборки
# =========================
FROM base AS builder-deps

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем ВСЕ зависимости (включая dev) для сборки
RUN npm ci && \
    npm cache clean --force

# =========================
# Build stage
# =========================
FROM base AS builder

WORKDIR /app

# Копируем установленные зависимости (все)
COPY --from=builder-deps /app/node_modules ./node_modules
COPY . .

# Сканируем зависимости на уязвимости
RUN npm audit --audit-level=high || echo "Audit completed, continuing build..."

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Сборка приложения
RUN npm run build

# =========================
# Production runner (минимальный образ)
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Безопасные переменные окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Устанавливаем только libc6-compat и tini (NO curl, NO bash, NO wget!)
RUN apk add --no-cache libc6-compat tini && \
    rm -rf /var/cache/apk/* && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Копируем только необходимое для production
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Защитные меры
RUN chmod -R 755 /app && \
    chown -R nextjs:nodejs /app && \
    # Запрещаем выполнение .sh файлов в приложении
    find /app -type f -name "*.sh" -exec chmod -x {} \; 2>/dev/null || true && \
    # Делаем node_modules только для чтения
    chmod -R 555 /app/node_modules && \
    # Ограничиваем права на запись в текущую директорию
    chmod 755 /app

# Переключаемся на непривилегированного пользователя
USER nextjs

EXPOSE 3000

# Используем tini как init процесс
ENTRYPOINT ["/sbin/tini", "--"]

# Запускаем приложение
CMD ["node", "server.js"]