# ============================================
# Base Stage: Use a Lightweight Node.js Image
# ============================================

# Используем официальный Alpine образ Node.js
ARG NODE_VERSION=22.14.0-alpine
FROM node:${NODE_VERSION} AS base

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем только файлы, связанные с пакетами, для кэширования Docker
COPY package.json pnpm-lock.yaml ./

# Устанавливаем переменные окружения для сборки
ENV NODE_ENV=production

# Устанавливаем зависимости через pnpm (а не npm ci)
RUN pnpm install --prod --frozen-lockfile

# ============================================
# Stage 2: Build the Next.js Application
# ============================================

# Используем базовый образ для сборки приложения
FROM base AS builder

# Копируем весь исходный код приложения в контейнер
COPY . .

# Собираем приложение в standalone режиме (результат в `.next/standalone`)
RUN pnpm run build

# ============================================
# Stage 3: Create Production Image
# ============================================

# Используем ту же версию Node.js для финального production контейнера
FROM node:${NODE_VERSION} AS runner

# Устанавливаем pnpm в runner stage тоже
RUN npm install -g pnpm

# Создаем пользователя и группы с явными UID/GID для лучшей совместимости
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Устанавливаем порт для Next.js standalone сервера
ENV PORT=3000

# Отключаем телеметрию Next.js во время выполнения
ENV NEXT_TELEMETRY_DISABLE=1

# Устанавливаем рабочую директорию
WORKDIR /app

# Создаем директорию для кэша и устанавливаем правильные права
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next

# Копируем только необходимые файлы из builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Используем пользователя nextjs вместо node (у него могут быть конфликты)
USER nextjs

# Открываем порт 3000 для HTTP-трафика
EXPOSE 3000

# Запускаем приложение через standalone сервер
ENTRYPOINT ["node", "server.js"]