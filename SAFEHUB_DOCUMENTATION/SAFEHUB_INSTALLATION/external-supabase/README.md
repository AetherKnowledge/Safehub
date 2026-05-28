# SafeHub Install: External Supabase

Use this folder when Supabase is already hosted elsewhere, such as Supabase Cloud or another server. This Compose file runs only SafeHub and Redis.

## Setup

```bash
cp .env.example .env
```

Edit `.env` and set your external Supabase values:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

Start:

```bash
docker compose up -d
```

This bundle includes Watchtower. It checks for updates every 300 seconds and only updates containers labeled with the `safehub-external` scope from this Compose file.

Open:

- SafeHub: `http://localhost:3000`

Stop:

```bash
docker compose down
```
