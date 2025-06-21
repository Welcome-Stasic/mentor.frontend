# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 3000
# CMD ["npm", "start"]

# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Устанавливаем зависимости только при необходимости
FROM base AS deps
# Подробнее про необходимость установки libc6-compat: https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Устанавливаем зависимости на основе предпочитаемого пакетного менеджера
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lock-файл не найден." && exit 1; \
  fi

# Пересобираем исходный код только при необходимости
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js собирает полностью анонимную телеметрию об использовании.
# Подробнее: https://nextjs.org/telemetry
# Раскомментируйте следующую строку, если хотите отключить телеметрию во время сборки.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lock-файл не найден." && exit 1; \
  fi

# Продакшн-образ: копируем только необходимые файлы и запускаем Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Раскомментируйте строку ниже, если хотите отключить телеметрию во время выполнения.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Автоматически используем output-tracing для уменьшения размера образа
# Подробнее: https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js создается во время сборки (next build) при использовании standalone-режима
# Подробнее: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
