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
    && npm cache clean --force \
    # Удаляем потенциально опасные файлы
    && find /app/node_modules -name "*.sh" -type f -delete \
    && find /app/node_modules -name "*.exe" -type f -delete \
    && find /app/node_modules -name "*.bin" -type f -exec chmod -x {} \;

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

# SECURITY HARDENING - УПРОЩАЕМ, чтобы избежать конфликтов
RUN apk add --no-cache \
    libc6-compat \
    tini \
    && rm -rf /var/cache/apk/*

# Создаем безопасного пользователя (В ОДИН ЗАХОД)
RUN addgroup -g 10001 -S appgroup \
    && adduser -S appuser -u 10001 -G appgroup \
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

# Копируем только необходимое с правильными правами
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
    # Разрешаем чтение node_modules и public
    && chmod -R 444 /app/node_modules \
    && chmod -R 444 /app/public \
    # Разрешаем выполнение server.js
    && chmod 555 /app/server.js \
    # .next/static для чтения
    && chmod -R 444 /app/.next/static

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