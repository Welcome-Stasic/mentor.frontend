# ============================================
# STAGE 1: SECURE BASE IMAGE
# ============================================

FROM node:20-alpine AS base

# Устанавливаем минимальные необходимые пакеты
RUN apk add --no-cache \
    libc6-compat \
    tini \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# ============================================
# STAGE 2: SECURE DEPENDENCIES INSTALLATION
# ============================================
FROM base AS deps
WORKDIR /app

# Копируем ТОЛЬКО файлы зависимостей
COPY package.json package-lock.json ./

# Устанавливаем с максимальной защитой
RUN npm ci \
    --ignore-scripts \
    --no-audit \
    --no-fund \
    --omit=dev \
    --loglevel=error \
    && npm cache clean --force

# ============================================
# STAGE 3: SECURE BUILD WITH DEV DEPENDENCIES
# ============================================
FROM base AS build_deps
WORKDIR /app

# Для сборки нужны dev зависимости
COPY package.json package-lock.json ./
RUN npm ci \
    --ignore-scripts \
    --no-audit \
    --no-fund \
    --loglevel=error \
    && npm cache clean --force

FROM base AS builder
WORKDIR /app
COPY --from=build_deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Безопасная сборка
RUN npm run build -- --no-lint

# ============================================
# STAGE 4: PRODUCTION RUNNER (MAXIMUM SECURITY)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# SECURITY HARDENING
RUN apk add --no-cache \
    libc6-compat \
    tini \
    shadow \
    && rm -rf /var/cache/apk/*

# Создаем безопасного пользователя (используем busybox-совместимый синтаксис)
# В Alpine Linux usermod находится в пакете shadow
RUN addgroup -g 10001 -S appgroup \
    && adduser -S appuser -u 10001 -G appgroup -H -D \
    && passwd -l appuser 2>/dev/null || true \
    && usermod -s /sbin/nologin appuser \
    # Защита файловой системы
    && chmod 755 /tmp \
    && chmod +t /tmp

# Безопасные переменные окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_NO_WARNINGS=1
ENV NODE_OPTIONS="--max-http-header-size=16384 --disable-proto=throw"

# Копируем только необходимое
# Сначала копируем как root, затем меняем владельца
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /app/node_modules ./node_modules

# Устанавливаем правильные права и владельца
RUN chown -R appuser:appgroup /app \
    # Делаем всё read-only кроме необходимых директорий
    && chmod -R 555 /app \
    # Создаем безопасные директории для записи
    && mkdir -p /app/tmp /app/logs \
    && chown appuser:appgroup /app/tmp /app/logs \
    && chmod 755 /app/tmp /app/logs \
    # Разрешаем чтение node_modules, public и .next/static
    && find /app/node_modules -type f -exec chmod 444 {} \; 2>/dev/null || true \
    && find /app/public -type f -exec chmod 444 {} \; 2>/dev/null || true \
    && find /app/.next/static -type f -exec chmod 444 {} \; 2>/dev/null || true \
    # Разрешаем выполнение server.js
    && chmod 555 /app/server.js 2>/dev/null || true \
    # Разрешаем навигацию по директориям
    && find /app -type d -exec chmod 555 {} \; 2>/dev/null || true \
    && chmod 755 /app/tmp /app/logs

# SECURE MOUNTS
VOLUME ["/app/logs"]
VOLUME ["/app/tmp"]

# Переключаем пользователя
USER appuser

EXPOSE 3000

# Запуск через tini для корректной обработки сигналов
ENTRYPOINT ["/sbin/tini", "--"]

# Безопасный запуск
CMD ["node", "--enable-source-maps", "server.js"]