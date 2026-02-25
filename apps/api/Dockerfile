# Build stage — contexto deve ser a raiz do monorepo
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar manifestos para instalar dependências com cache de camadas
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN pnpm install --frozen-lockfile

# Copiar o código-fonte
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

# Build da API
WORKDIR /app/apps/api
RUN pnpm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main"]
