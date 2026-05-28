# SafeHub Install: Local Supabase

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

This bundle includes Watchtower. It checks for updates every 300 seconds and only updates containers labeled with the `safehub-local` scope from this Compose file.

## Offline Demo Bundle

To prepare this folder for a machine with no internet or slow internet, run this on a machine that already has internet:

```bat
create-offline-image-bundle.bat
```

That creates:

```text
safehub-local-supabase-images.tar
safehub-local-supabase-images.txt
```

Copy this whole folder, including the `.tar`, to the offline machine. On the offline machine, run:

```bat
load-offline-image-bundle.bat
```

The load script imports the Docker images and starts the stack with `docker compose up -d`.

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
