# Используем фиксированную версию node 20 alpine
FROM node:20.12.2-alpine AS base

# Добавляем libc6-compat (нужно для node alpine)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Устанавливаем зависимости (только если используем pnpm)
FROM base AS deps

COPY package.json pnpm-lock.yaml .npmrc* ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Копируем исходники и собираем проект
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js (по желанию)
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Финальный продакшн-образ
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Создаем непользовательскую группу и пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# Копируем только необходимые артефакты из сборочного образа
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]