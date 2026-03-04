# PoupaJuntos

Plataforma de **educação financeira colaborativa** onde grupos economizam juntos para metas comuns — viagens, casamentos, reformas — e têm cada aporte validado automaticamente por IA via leitura de comprovantes bancários.

---

## O que o app faz

- **Grupos de poupança:** crie um grupo com meta e prazo, convide membros via link único.
- **Aportes com IA:** envie o comprovante bancário (PIX/TED/DOC) e o Gemini Vision extrai valor, data e validade automaticamente.
- **Trust Score:** cada grupo tem um índice de confiança baseado no percentual de aportes validados.
- **Feed em tempo real:** atualizações de status via WebSocket assim que a IA processa o comprovante.
- **Learn Hub:** artigos de educação financeira, filtro por categoria e quiz diário rotativo.
- **Streak de aportes:** contador de dias consecutivos para incentivar o hábito.

---

## Stack

| Camada   | Tecnologia                                                                 |
| -------- | -------------------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS v4, Shadcn UI, Framer Motion           |
| Backend  | NestJS 11, TypeORM, PostgreSQL 16                                          |
| Auth     | Clerk                                                                      |
| Storage  | Cloudflare R2 (prod) / LocalStack S3 (dev)                                 |
| Fila     | AWS SQS                                                                    |
| IA       | Google Gemini API (Vision)                                                 |
| Infra    | Docker, Turborepo v2, pnpm workspaces                                      |

---

## Estrutura do monorepo

```
poupa-juntos/
├── apps/
│   ├── web/          # Next.js 16 — frontend mobile-first
│   └── api/          # NestJS 11 — API REST + WebSocket
├── packages/
│   ├── shared-types/ # DTOs e enums compartilhados entre web e api
│   ├── ui/           # Componentes Shadcn reutilizáveis
│   ├── eslint-config/
│   └── typescript-config/
├── docker-compose.yml      # Dev (PostgreSQL + LocalStack)
├── docker-compose.prod.yml # Prod (PostgreSQL + API)
└── turbo.json
```

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- pnpm 9+
- Docker

### 1. Suba a infraestrutura

```bash
docker compose up -d
```

Isso inicia PostgreSQL 16 e LocalStack (S3 + SQS emulados).

### 2. Configure as variáveis de ambiente

```bash
# API
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env.local
```

Preencha as chaves do Clerk e do Gemini nos arquivos gerados.

### 3. Execute as migrations

```bash
pnpm --filter api migration:run
```

### 4. Inicie o monorepo

```bash
pnpm dev
```

| Serviço  | URL                            |
| -------- | ------------------------------ |
| Frontend | http://localhost:3000          |
| API      | http://localhost:3001          |
| Swagger  | http://localhost:3001/api/docs |

---

## Variáveis de ambiente — resumo

### `apps/api/.env`

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/poupa_juntos
CLERK_SECRET_KEY=sk_test_...

# Storage (LocalStack dev)
R2_ACCESS_KEY_ID=test
R2_SECRET_ACCESS_KEY=test
S3_ENDPOINT=http://localhost:4566
S3_BUCKET=poupa-juntos-receipts

# Fila (LocalStack dev)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_REGION=us-east-1
SQS_ENDPOINT=http://localhost:4566
SQS_QUEUE_URL=http://localhost:4566/000000000000/poupa-juntos-contributions

GEMINI_API_KEY=...
PORT=3001
```

### `apps/web/.env.local`

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Fluxo de validação de aporte

```
Usuário envia comprovante
       ↓
API: upload para S3/R2
       ↓
Transação ACID:
  - Salva Contribution (PENDING)
  - Incrementa saldo pendente do grupo
  - Publica mensagem no SQS
       ↓
Worker consome SQS
  - Chama Gemini Vision
  - Extrai valor, data e tipo de operação
       ↓
  VALIDATED → confirma saldo no grupo
  REJECTED  → reverte saldo pendente
       ↓
WebSocket notifica o frontend em tempo real
```

---

## API — endpoints principais

| Método | Rota                            | Descrição                    |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/health`                       | Health check (DB + SQS)      |
| POST   | `/groups`                       | Criar grupo                  |
| GET    | `/groups`                       | Listar grupos do usuário     |
| PATCH  | `/groups/:id`                   | Atualizar grupo (meta/prazo) |
| POST   | `/groups/join/:inviteHash`      | Entrar em grupo via convite  |
| POST   | `/contributions`                | Enviar aporte (multipart)    |
| GET    | `/contributions/group/:groupId` | Listar aportes do grupo      |
| DELETE | `/contributions/:id`            | Remover aporte               |

Documentação completa: `http://localhost:3001/api/docs`

---

## Comandos úteis

```bash
# Build de todos os pacotes
pnpm build

# Checar tipos TypeScript
pnpm check-types

# Lint geral
pnpm lint

# Gerar nova migration (após alterar entidades)
pnpm --filter api migration:generate -- src/migrations/NomeDaMigration

# Rodar migrations
pnpm --filter api migration:run

# Reverter última migration
pnpm --filter api migration:revert
```

---

## Deploy

A stack de produção usa:

- **VPS** — NestJS API + PostgreSQL via `docker-compose.prod.yml`
- **Cloudflare R2** — armazenamento de comprovantes (variáveis `R2_*`)
- **AWS SQS** — fila de validação (região `sa-east-1`)
- **Vercel** — frontend Next.js (root directory: `apps/web`)
- **Nginx Proxy Manager** — HTTPS + WebSocket para a API

Consulte [DEPLOY_PLAN.md](./DEPLOY_PLAN.md) para o passo a passo completo.

---

## Design system

- **Fonte:** Sora
- **Cores:** `coral` #FF7E7E · `lavender` #A78BFA · `teal` #2DD4BF · `brand-bg` #F8F7FF
- **Mobile-first:** bottom navigation fixa, layout `max-w-md` centralizado em desktop
- **Tema dark:** tela de envio de comprovante com glassmorphism e scanner animado
