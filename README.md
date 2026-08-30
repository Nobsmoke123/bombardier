# Job Tracker

Personal job application tracking platform (ATS MVP).

## Stack

- **Web:** Next.js 16, Tailwind CSS, TanStack Query
- **API:** NestJS, Prisma, JWT
- **Data:** Neon PostgreSQL (local Postgres via Docker)
- **Jobs:** BullMQ + Redis for CSV company imports
- **Storage:** Cloudflare R2 via presigned URLs (files never pass through the API)

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

JWT is issued by the API and stored in an **HTTP-only cookie**. The browser never writes the token to `localStorage`.

## Storage

The API never receives file bytes. The browser:

1. Calls `POST /storage/presign` for a short-lived PUT URL
2. Uploads the PDF or CSV **directly to Cloudflare R2**
3. Asks the API to persist metadata (`POST /resumes` or `POST /companies/import`)
4. Calls `GET /storage/view?key=...` for a 15-minute signed GET URL

CSV company imports enqueue a BullMQ job. Redis must be running (`docker compose up -d`). Expected columns: `name` (or `company` / `company_name`), optional `website` and `industry`.

Object keys only:

```text
users/{userId}/resumes/{uuid}.pdf
users/{userId}/imports/{uuid}.csv
```

Configure the R2 bucket CORS so the web origin can `PUT` and `GET`:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```
