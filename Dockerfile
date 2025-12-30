# ============================================
# STAGE 1: SECURE BASE IMAGE
# ============================================

FROM node:20-alpine AS base

# Устанавливаем минимальные необходимые пакеты
RUN apk add --no-cache \
    libc6-compat \
    tini \
    && rm -rf /var/cache/apk/* \
    # Блокируем установку опасных утилит
    && apk del --purge curl wget bash 2>/dev/null || true

WORKDIR /app

# Создаем пользователя на раннем этапе
RUN addgroup -g 10001 -S appgroup && \
    adduser -S appuser -u 10001 -G appgroup && \
    # Запрещаем логин и shell
    passwd -l appuser && \
    usermod -s /sbin/nologin appuser

# ============================================
# STAGE 2: SECURE DEPENDENCIES INSTALLATION
# ============================================
FROM base AS deps
WORKDIR /app

# Копируем ТОЛЬКО файлы зависимостей (без .npmrc - может содержать токены!)
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

# SECURITY HARDENING
RUN apk add --no-cache \
    libc6-compat \
    tini \
    && rm -rf /var/cache/apk/* \
    # Удаляем всё лишнее
    && apk del --purge curl wget bash 2>/dev/null || true \
    # Создаем безопасного пользователя
    && addgroup -g 10001 -S appgroup \
    && adduser -S appuser -u 10001 -G appgroup \
    && passwd -l appuser \
    && usermod -s /sbin/nologin appuser \
    # Защита файловой системы
    && chmod 755 /tmp \
    && chmod +t /tmp \
    # Mount /proc with hidepid
    && echo "proc /proc proc defaults,hidepid=2 0 0" >> /etc/fstab

# Безопасные переменные окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_NO_WARNINGS=1
ENV NODE_OPTIONS="--max-http-header-size=16384 --disable-proto=throw"

# Копируем только необходимое с правильными правами
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules

# SECURITY LOCKDOWN
RUN \
    # Делаем всё read-only кроме /tmp
    chmod -R 555 /app \
    && chmod -R 755 /tmp \
    # node_modules только для чтения
    && chmod -R 555 /app/node_modules \
    # Запрещаем выполнение скриптов
    && find /app -name "*.sh" -type f -exec chmod -x {} \; 2>/dev/null || true \
    && find /app -name "*.js" -path "*/node_modules/*" -exec chmod 444 {} \; 2>/dev/null || true \
    # Создаем безопасные директории
    && mkdir -p /app/tmp /app/logs \
    && chown appuser:appgroup /app/tmp /app/logs \
    && chmod 700 /app/tmp /app/logs \
    # Удаляем опасные бинарные файлы
    && find /app -type f \( -name "*.bin" -o -name "*.exe" -o -name "*.so*" \) -delete 2>/dev/null || true

# SECURE MOUNTS (должно быть в docker run)
VOLUME ["/app/logs"]
VOLUME ["/app/tmp"]

# Переключаем пользователя
USER appuser

EXPOSE 3000

# Запуск через tini для корректной обработки сигналов
ENTRYPOINT ["/sbin/tini", "--"]

# Безопасный запуск
CMD ["node", "--enable-source-maps", "server.js"]