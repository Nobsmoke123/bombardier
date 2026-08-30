# Job Tracker

Personal job application tracking platform (ATS MVP).

## Stack

- **Web:** Next.js 16, Tailwind CSS, TanStack Query
- **API:** NestJS, Prisma, JWT
- **Data:** Neon PostgreSQL (local Postgres via Docker)
- **Jobs:** BullMQ + Redis (later milestone)
- **Storage:** Cloudflare R2 via presigned URLs (later milestone)

## Prerequisites

- Node 20+
- pnpm 11+
- Docker Desktop running (local Postgres and Redis)

## Setup

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

docker compose up -d
pnpm install
pnpm db:migrate
pnpm dev
```

- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:3001](http://localhost:3001)

## Auth

JWT is issued by the API and stored in an **HTTP-only cookie**. The browser never writes the token to `localStorage`. Files are never uploaded through the API — later milestones use Cloudflare R2 presigned URLs.
