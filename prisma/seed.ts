import { hash } from "bcrypt";
import { config } from "dotenv";
import { Client } from "pg";

config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();

  const hashedPassword = await hash("admin", 10);
  const now = new Date();

  await client.query(
    `
    INSERT INTO "User" (id, email, name, password, type, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (email) DO NOTHING
    `,
    ["1", "admin@admin.com", "Admin", hashedPassword, "Admin", now, now]
  );

  await client.query(
    `
    INSERT INTO "Admin" (adminId)
    VALUES ($1)
    `,
    ["1"]
  );

  console.log("✅ Admin user created (if not already exists)");

  await client.end();
}

main().catch((err) => {
  console.error("❌ Error during seeding:", err);
  client.end();
});
