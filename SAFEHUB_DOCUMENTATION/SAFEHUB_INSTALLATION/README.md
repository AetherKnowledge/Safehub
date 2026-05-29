# SafeHub Installation

This folder contains copyable Docker deployment bundles for SafeHub.

Choose one:

- `local-supabase`: runs SafeHub, Redis, and a self-hosted Supabase stack in one Docker Compose project.
- `external-supabase`: runs only SafeHub and Redis, then connects to Supabase Cloud or another external Supabase instance.

## Prerequisite: Docker

Install Docker before using either bundle.

- Windows: install Docker Desktop, start it, and wait until it says Docker is running.
- Linux: install Docker Engine and the Docker Compose plugin.

Check that Docker works:

```bash
docker --version
docker compose version
```

## Local Supabase

Use this option when you want everything hosted together.

```bash
cd SAFEHUB_DOCUMENTATION/SAFEHUB_INSTALLATION/local-supabase
cp .env.example .env
docker compose up -d
```

Open:

- SafeHub: `http://localhost:3000`
- Supabase Studio / Kong: `http://localhost:10000`
- Postgres from host: `localhost:10432`
- Redis from host: `localhost:11379`

Before production, edit `.env` and replace the placeholder secrets, passwords, URLs, and keys.

## External Supabase

Use this option when Supabase is already hosted elsewhere.

```bash
cd SAFEHUB_DOCUMENTATION/SAFEHUB_INSTALLATION/external-supabase
cp .env.example .env
docker compose up -d
```

Set these values in `.env` from your Supabase project:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

## Startup Behavior

The SafeHub container runs database setup automatically on startup:

```bash
pnpm prisma migrate deploy
pnpm prisma db seed
```

The seed is guarded by `public."AppSeedState"`, so it only runs once unless the database is reset or that seed state is changed.

Default seeded admin account:

```text
Email: admin@admin.com
Password: admin
```

## Automatic Image Updates

Both install bundles include Watchtower. It checks for image updates every 300 seconds and removes old images after updating.

Watchtower is scoped and label-limited:

- `local-supabase` uses the `safehub-local` Watchtower scope.
- `external-supabase` uses the `safehub-external` Watchtower scope.

Only containers labeled inside the selected Compose file are updated. Other Docker containers on the same machine are ignored.

## Runtime Data

For the local Supabase bundle, Docker runtime data is written under:

- `local-supabase/volumes/db/data`
- `local-supabase/volumes/redis`
- `local-supabase/volumes/storage`

These paths are ignored by git.
