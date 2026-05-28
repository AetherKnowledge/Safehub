# SafeHub

SafeHub is a counseling and student-support system for La Consolacion University Philippines. It includes appointment booking, counseling workflows, posts and announcements, role-based dashboards, video-call support, notifications, Supabase storage, Redis-backed realtime features, and optional AI / n8n automation.

## What SafeHub Does

SafeHub centralizes the day-to-day work of a school guidance and counseling office. Instead of handling appointments, forms, announcements, session notes, and student follow-ups across separate tools, the system gives students, counselors, and administrators a shared place to manage the counseling process.

Students can sign in, request counseling appointments, answer intake forms, join online counseling sessions, read announcements, submit mood check-ins, and use the chatbot when immediate human support is not available. The goal is to make support easier to reach while still keeping counselor-led care at the center of the workflow.

Counselors can manage their availability, review appointment requests, accept or reject bookings, view student-submitted information, conduct online sessions, and keep track of counseling-related activity. Admin users can manage users, publish posts and announcements, maintain support resources, and oversee the system.

The app is built around role-based access:

- `Student`: books appointments, joins sessions, uses chat support, views posts, and submits forms.
- `Counselor`: manages counseling availability, appointments, student requests, and sessions.
- `Admin`: manages users, content, system data, and counseling office resources.

## Core Workflows

- Appointment booking: students submit appointment requests with counseling intake details and preferred schedule.
- Counseling management: counselors review requests, manage sessions, and coordinate with students.
- Online counseling: WebRTC support allows remote counseling sessions from inside the app.
- Announcements and posts: admins and counselors can publish updates for students.
- Chatbot support: optional n8n / AI integration can answer support prompts when no counselor is available.
- File and image storage: Supabase Storage is used for uploaded assets and managed content.
- Notifications: Redis and app-side realtime behavior support faster updates across the system.

## Architecture Overview

SafeHub is a Next.js application backed by PostgreSQL through Prisma. It can run with a self-hosted Supabase stack using `installations/local-supabase`, or it can connect to an externally hosted Supabase project such as Supabase Cloud using `installations/external-supabase`.

In the full local Docker setup, Supabase services, Redis, and SafeHub share one Docker network. The SafeHub container connects to Postgres through the internal `db` service name and Redis through the internal `redis` service name. On startup, the app applies Prisma migrations and runs the seed once, using `public."AppSeedState"` to avoid reseeding on every boot.

## Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS, DaisyUI
- Prisma 7 with PostgreSQL
- Supabase Auth, Postgres, Storage, Realtime, Studio, Kong, and Edge Functions
- NextAuth
- Redis
- WebRTC / optional TURN credentials
- Optional n8n and OpenAI integrations

## Requirements

- Node.js 24 or newer
- pnpm 10
- Docker Desktop, if using Docker
- Git

Enable pnpm with Corepack if needed:

```bash
corepack enable
corepack prepare pnpm@10.12.4 --activate
```

## Environment Setup

For local development with `pnpm dev`, create your root environment file:

```bash
cp .env.example .env
```

The root `.env.example` is intentionally small and only contains the values needed by the SafeHub app when it runs on your host machine. Docker deployment examples live inside the `installations/` folders.

The `installations/external-supabase` and `installations/local-supabase` folders are designed to be copied as standalone deployment bundles. Copy the folder you need, create its `.env` from the local `.env.example`, then run `docker compose up -d` from inside that folder.

Important values:

- `DATABASE_URL`: PostgreSQL connection used by Prisma.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase API URL used by the browser and server.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key.
- `SUPABASE_JWT_SECRET`: JWT secret matching the Supabase project.
- `REDIS_URL` / `REDIS_PORT`: Redis connection.
- `NEXT_PUBLIC_SHOW_CLIENT_LOGS`: set to `true` only when you want browser console logs enabled.

## Option 1: Full Local Docker Stack

This runs SafeHub, Redis, and a self-hosted Supabase stack in one Docker network. Use this when you want the whole system locally or on a single server.

```bash
cd installations/local-supabase
cp .env.example .env
```

Edit `.env`, replace the placeholder secrets, then start the stack:

```bash
docker compose up -d
```

Useful URLs:

- SafeHub: `http://localhost:3000`
- Supabase Studio / Kong: `http://localhost:10000`
- Postgres from host: `localhost:10432`
- Redis from host: `localhost:11379`

The SafeHub container automatically runs:

```bash
pnpm prisma migrate deploy
pnpm prisma db seed
```

Seeding is guarded by the database table `public."AppSeedState"`, so the seed runs only once unless you reset that state or recreate the database volume.

Default seeded admin account:

```text
Email: admin@admin.com
Password: admin
```

Stop the stack:

```bash
docker compose down
```

Delete local database/storage data:

```bash
docker compose down -v
```

## Option 2: Docker App With External Supabase

Use this when Supabase is hosted somewhere else, such as Supabase Cloud or another server. This compose file runs only SafeHub and Redis.

```bash
cd installations/external-supabase
cp .env.example .env
```

Edit `.env` with your external Supabase values:

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
```

For Supabase Cloud, use a direct or pooler Postgres connection string for `DATABASE_URL`. Add SSL options if your provider requires them.

Run:

```bash
docker compose up -d
```

SafeHub still runs Prisma migrations and the seed on startup against the configured external database.

## Option 3: Local Development Without Docker App Container

You can still use Docker for the database/Supabase services and run Next.js on your host.

Start the local infrastructure:

```bash
cd installations/local-supabase
cp .env.example .env
docker compose up -d db kong auth rest realtime storage imgproxy meta functions analytics vector supavisor studio redis
```

In the root project folder, use a host-reachable database URL in `.env`:

```env
DATABASE_URL=postgresql://postgres:safehub_local_postgres_password@localhost:10432/postgres
REDIS_URL=127.0.0.1
REDIS_PORT=11379
NEXT_PUBLIC_SUPABASE_URL=http://localhost:10000
```

Install dependencies and prepare the database:

```bash
cd ../..
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
pnpm dev
```

Open `http://localhost:3000`.

## Docker Files

- `installations/local-supabase/docker-compose.yml`: full local SafeHub + Supabase + Redis stack.
- `installations/local-supabase/.env.example`: env template for the full self-hosted stack.
- `installations/external-supabase/docker-compose.yml`: SafeHub + Redis only, for external Supabase.
- `installations/external-supabase/.env.example`: env template for Supabase Cloud or another external Supabase.
- `Dockerfile`: builds the SafeHub app image.
- `installations/local-supabase/volumes/api/kong.yml`: Kong routes for the self-hosted Supabase API.
- `installations/local-supabase/volumes/api/render-kong.sh`: renders Kong secrets safely without breaking YAML quoting.
- `installations/local-supabase/volumes/functions/main/index.ts`: minimal Edge Functions entrypoint required by the self-hosted stack.

## Notes

- Runtime data is ignored under `installations/local-supabase/volumes/db/data`, `installations/local-supabase/volumes/redis`, and `installations/local-supabase/volumes/storage`.
- The committed files under `installations/local-supabase/volumes/api`, `installations/local-supabase/volumes/db`, `installations/local-supabase/volumes/functions`, `installations/local-supabase/volumes/logs`, and `installations/local-supabase/volumes/pooler` are required for the self-hosted Supabase compose stack.
- Production deployments should use strong generated secrets, real SMTP settings, configured Google OAuth credentials, and HTTPS public URLs.
