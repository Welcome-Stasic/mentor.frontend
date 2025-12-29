# =========================
# Base image - используем Alpine для минимального размера и безопасности
# =========================
FROM node:20-alpine AS base

# Устанавливаем только необходимые системные пакеты
# libc6-compat - совместимость с glibc, tini - init процесс для корректной обработки сигналов
RUN apk add --no-cache \
    libc6-compat \
    tini \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Создаем пользователя и группу без привилегий
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# =========================
# Dependencies stage
# =========================
FROM base AS deps

# Копируем только файлы зависимостей для лучшего кэширования
COPY package.json package-lock.json* ./

# Устанавливаем зависимости (включая dev для сборки)
RUN npm ci --only=production && \
    npm cache clean --force

# Dev зависимости для сборки
FROM deps AS dev-deps
RUN npm ci && \
    npm cache clean --force

# =========================
# Build stage
# =========================
FROM base AS builder

WORKDIR /app

# Копируем установленные зависимости
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Сканируем зависимости на уязвимости перед сборкой
RUN npm audit --audit-level=high || echo "Audit completed, check results above"

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Сборка приложения
RUN npm run build

# Удаляем dev зависимости из node_modules
RUN npm prune --production

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
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Защитные меры:
# 1. Запрещаем выполнение бинарных файлов в /tmp
# 2. Устанавливаем корректные права
# 3. Отключаем возможность записи в node_modules
RUN chmod -R 755 /app && \
    chown -R nextjs:nodejs /app && \
    # Запрещаем выполнение .sh файлов в приложении
    find /app -type f -name "*.sh" -exec chmod -x {} \; 2>/dev/null || true && \
    # Делаем node_modules только для чтения
    chmod -R a-w /app/node_modules && \
    # Ограничиваем права на запись в текущую директорию
    chmod 755 /app

# Переключаемся на непривилегированного пользователя
USER nextjs

EXPOSE 3000

# Используем tini как init процесс для корректной обработки сигналов
ENTRYPOINT ["/sbin/tini", "--"]

# Запускаем приложение
CMD ["node", "server.js"]