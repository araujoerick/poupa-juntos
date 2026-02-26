# Build stage — contexto deve ser a raiz do monorepo
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN pnpm install --frozen-lockfile

COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN pnpm run build

# Usar pnpm deploy para criar bundle sem symlinks
WORKDIR /app
RUN pnpm --filter api deploy --prod /app/deploy

# Copiar o dist compilado para dentro do deploy
RUN cp -r /app/apps/api/dist /app/deploy/dist

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/deploy .

EXPOSE 3001
CMD ["node", "dist/main"]
