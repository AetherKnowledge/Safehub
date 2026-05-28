# SafeHub Install: Without External Supabase

Use this folder when you want Docker Compose to run SafeHub, Redis, and the full self-hosted Supabase stack together.

## Setup

```bash
cp .env.example .env
```

Edit `.env` and replace the placeholder secrets. For Supabase self-hosting, `JWT_SECRET`, `ANON_KEY`, `SERVICE_ROLE_KEY`, and the matching SafeHub `SUPABASE_*` values must belong together.

Start:

```bash
docker compose up -d
```

Open:

- SafeHub: `http://localhost:3000`
- Supabase Studio / Kong: `http://localhost:10000`

Stop:

```bash
docker compose down
```

Delete runtime data:

```bash
docker compose down -v
```

Runtime data is written under `volumes/db/data`, `volumes/redis`, and `volumes/storage`.
