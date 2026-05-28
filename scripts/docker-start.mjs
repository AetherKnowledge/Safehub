import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { Client } from "pg";

const MIGRATION_RETRIES = Number(process.env.PRISMA_MIGRATE_RETRIES ?? 30);
const MIGRATION_RETRY_DELAY_MS = Number(
  process.env.PRISMA_MIGRATE_RETRY_DELAY_MS ?? 2000
);

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

async function runCommandWithRetries(command, args) {
  for (let attempt = 1; attempt <= MIGRATION_RETRIES; attempt += 1) {
    try {
      runCommand(command, args);
      return;
    } catch (error) {
      if (attempt === MIGRATION_RETRIES) {
        throw error;
      }

      console.warn(
        `[docker-start] ${command} ${args.join(
          " "
        )} failed, retrying (${attempt}/${MIGRATION_RETRIES})...`
      );
      await delay(MIGRATION_RETRY_DELAY_MS);
    }
  }
}

async function seedOnce() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required before running database seed");
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query("SELECT pg_advisory_lock($1::bigint)", [8675309]);

    await client.query(`
      CREATE TABLE IF NOT EXISTS public."AppSeedState" (
        key text PRIMARY KEY,
        "hasSeeded" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );
    `);

    const seedState = await client.query(
      `SELECT "hasSeeded" FROM public."AppSeedState" WHERE key = $1`,
      ["default"]
    );

    if (seedState.rows[0]?.hasSeeded) {
      console.log("[docker-start] Database already seeded, skipping seed.");
      return;
    }

    console.log("[docker-start] Database has not been seeded, running seed.");
    runCommand("pnpm", ["prisma", "db", "seed"]);

    await client.query(
      `
      INSERT INTO public."AppSeedState" (key, "hasSeeded", "updatedAt")
      VALUES ($1, true, now())
      ON CONFLICT (key)
      DO UPDATE SET "hasSeeded" = EXCLUDED."hasSeeded", "updatedAt" = now();
      `,
      ["default"]
    );
  } finally {
    await client.query("SELECT pg_advisory_unlock($1::bigint)", [8675309]);
    await client.end();
  }
}

async function main() {
  console.log("[docker-start] Applying Prisma migrations.");
  await runCommandWithRetries("pnpm", ["prisma", "migrate", "deploy"]);

  await seedOnce();

  console.log("[docker-start] Starting Next.js.");
  const app = spawn("pnpm", ["start"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => app.kill(signal));
  }

  app.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error("[docker-start] Startup failed:", error);
  process.exit(1);
});
